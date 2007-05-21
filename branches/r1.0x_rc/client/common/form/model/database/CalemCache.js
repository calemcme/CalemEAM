/*
 * The contents of this file are subject to the CalemEAM Public License Version
 * 1.0 ("License"); You may not use this file except in compliance with the
 * License. You may obtain a copy of the License at http://www.calemeam.com/license
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.  See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is: CalemEAM Open Source
 *
 * The Initial Developer of the Original Code is CalemEAM Inc.
 * Portions created by CalemEAM are Copyright (C) 2007 CalemEAM Inc.;
 * All Rights Reserved.
 
 * Contributor(s): 
 */
 
 
/**
 * Constructor
 */
function CalemCache() {
	this._staleMax=CalemConf['registry_cache']['staleMax'];
	this._processDelay=CalemConf['registry_cache']['processDelay'];
	this._cache=new Object(); //This is the global cache.
} 

CalemCache.prototype.toString = 
function() {
	return "CalemCache";
}

CalemCache.prototype.getStaleMax =
function() {
	return this._staleMax;
}

CalemCache.prototype.getProcessDelay =
function() {
	return this._processDelay;
}

/**
 * Force fetching tables in the list.
 */
CalemCache.prototype.forceUpdate =
function(tables) {
	
}

/**
 * Bulk load counts bypass cached items
 */
CalemCache.prototype.bulkLoadCountBypassCache =
function(dbQuery, callback) {
	this._db.getCountBulk(dbQuery, new AjxCallback(this, this.onBulkLoadCountResponse, callback));
} 

CalemCache.prototype.onBulkLoadCountResponse =
function(callback, resp) {
	var resultList=resp.getResponse().BulkFetchResponse;
	callback.run(resultList);
}

/**
 * Bulk data load.
 * @param dbQuery - list of queries to load data
 * @callback callback to report when data is ready
 * Each type of table is handled differently: 
 * <ul>
 * <li>DB based table will be a pass-through query plus dependent cached tables
 * <li>Cached tables will use on-demand update based on cache stale times
 * <li>For cached data query will be performed locally
 * <li>Results are packaged and sent back
 * </ul>  
 */
CalemCache.prototype.bulkLoad =
function(dbQuery, callback, forceReload, resultCallback) {
	if (!resultCallback) resultCallback=new AjxCallback(this, this._sendBulkLoadResults);
	var action=new AjxTimedAction(this, this._processBulkLoad, {dbQuery: dbQuery, resultCallback: resultCallback, callback: callback, forceReload: forceReload})
	AjxTimedAction.scheduleAction(action, this._processDelay); //This should be a very short delay to make it async.
}

/**
 * Just load cache
 */
CalemCache.prototype.bulkLoadCache =
function(dbQuery, callback, forceReload) {
	this.bulkLoad(dbQuery, callback, forceReload, callback);
}

/**
 * Populating cache for a table based on dependency.
 */
CalemCache.prototype.bulkLoadCacheForTable =
function(table, callback, forceReload, includeTable) {
	var tableDd=this._registry.getTableDd(table);
	var dbQuery=new CalemDbQuery(); //This is the query list to send across the soap wire.
	this._prepareSoapForTable(tableDd.buildGetAllQuery(), dbQuery, forceReload);
	if (!includeTable) dbQuery.remove(table); //Remove this table.	
	this.bulkLoadCache(dbQuery, callback, forceReload);	
}

/**
 * Let's figure out if we need make a soap call first.
 */
CalemCache.prototype._processBulkLoad =
function(params) {
	//Build query result based on table cache types
	var dbQuery=params.dbQuery;
	var soapQuery=new CalemDbQuery(); //This is the query list to send across the soap wire.
	var map=dbQuery.getQueryMap();
	for (var i in map) {
		var tblQuery=map[i];
		this._prepareSoapForTable(tblQuery, soapQuery, params.forceReload);		
	}
	params.soapQuery=soapQuery;
	if (soapQuery.size() > 0) { //Let's do a soap call with a call back defined.
		var soapCallback=new AjxCallback(this, this.onSoapResponse, params);
		this._db.getDataBulk(soapQuery, soapCallback);
	} else {
		params.resultCallback.run(params);
	}	
}

/**
 * Let's update local cache based on soap results if any.
 * Memory cached data will be updated and events sent off.
 * Database cached data will be passed back directly without storing in cache.
 * The bulk query sets is of the format: 
 * [{table: table, type: type, serverTime: serverTime, localTime: localTime, 
 *   count: count, fields: fields, data: data}]
 */
CalemCache.prototype.onSoapResponse = 
function(params, resp) {
	var result;
	var cached;
	var resultList=resp.getResponse().BulkFetchResponse;
	var rawSet=new Object();
	var cachedUpdates=new Object();
	var soapQuery=params.soapQuery;
	for (var i=0; i< resultList.length; i++) {
		var result=resultList[i];
		var tblQuery=soapQuery.getQuery(result.table);
		var tableDd=this._registry.getTableDd(tblQuery.getId()); //support view
		if (!tableDd.isCached()) {
			rawSet[result.table]=result;
		} else if (cached=this.get(result.table)) {
			if (!cachedUpdates[result.table]) {
				cachedUpdates[result.table]=new Array();
			}
			cachedUpdates[result.table].push(result);
		} else {//Creating a cached item.
			cached=new CalemCachedItem(tblQuery, result, this);
		}
	}
	//Cache updates
	for (var i in cachedUpdates) {
		this.get(i).onServerUpdates(cachedUpdates[i]);
	}
	//Cached is updated so let's calculate results for repsonding back to callback
	params.resultCallback.run(params, rawSet);
}

/**
 * Make a callback to the caller with bulkLoad results
 * @params - includes original queries and callback
 * @resp - includes non-cached data fetched from database
 * 
 */
CalemCache.prototype._sendBulkLoadResults =
function(params, rawSet) {
	//Now let's prepare results based on original query list
	var dbQuery=params.dbQuery;
	var map=dbQuery.getQueryMap();
	var results={};
	for (var i in map) {
		var tblQuery=map[i];
		var tableName=tblQuery.getTableId();
		var tableDd=this._registry.getTableDd(tblQuery.getId());
		if (tableDd.isCached()) {
			var cached= this.get(tableName);
			results[tblQuery.getTableId()]=cached.bulkFetchByQuery(tblQuery);
		} else {
			results[tableName]=CalemResultRecordList.createByRawResult(tblQuery, rawSet[tableName]);
		} 	
	}
	//Now let's do a callback here.
	params.callback.run(results);	
}

/**
 * Find out Soap calls needed for a table.
 * <ul>
 * <li>Fetch query for the table
 * <li>Stale check
 * <li>Dependent tables stale check
 * </ul>
 * 
 */
CalemCache.prototype._prepareSoapForTable =
function(tblQuery, soapQuery, forceReload) {	
	var tableDd=this._registry.getTableDd(tblQuery.getId()); //To support view here.
	//For non-cached data let's go to DB without any work locally.
	var cached;
	if (tableDd.isDropdown()) { //Dropdown is preloaded already.		
		this._loadDropdown(tableDd.getTableName());
	} else if (tableDd.isMemoryCached()) {
		if (cached=this.get(tableDd.getTableName())) {
			cached.addStaledQueries(soapQuery, forceReload);
		} else { //Firsttime getting data for this table
			soapQuery.add(tableDd.buildGetAllQuery());
		}
	} else {
		soapQuery.add(tblQuery); //This is a pass-through query
	}
	//Dependency stale check
	var parents=tableDd.getCachedParentTableDds();
	for (var i=0; i< parents.length; i++) {
		var lkupDd=parents[i];
		if (cached=this.get(lkupDd.getTableName())) {
			cached.addStaledQueries(soapQuery);
		} else {			
			//Check for dropdowns
			if (lkupDd.isDropdown()) {//Check dropdown loading.
				this._loadDropdown(lkupDd.getTableName());
			} else {
				soapQuery.add(lkupDd.buildGetAllQuery());
			}
		}
	}	
} 

/**
 * Loading dropdown to cache
 */
CalemCache.prototype._loadDropdown =
function(id, forceLoad) {
	var dropdown=this.get(id);
	if (!dropdown || forceLoad) {
		dropdown=new CalemCachedDropdown(id, this);
	}
} 

CalemCache.prototype.getDropdown =
function(id) {
	this._loadDropdown(id);
	return this.get(id);
} 

CalemCache.prototype.setDb =
function(db) {
	this._db=db;
}

CalemCache.prototype.setRegistry =
function(reg) {
	this._registry=reg;
}

CalemCache.prototype.put =
function(cached) {
	this._cache[cached.getId()]=cached;
}

CalemCache.prototype.get =
function(id) {
	return this._cache[id];
}

CalemCache.prototype.findRecordById=
function(id, recId) {
	var rtn=null;
	var cached;
	if (cached=this.get(id)) {
		rtn=cached.findRecordById(recId);
	}
	return rtn;
}

CalemCache.prototype.findValueById=
function(join, recId) {
	var rtn=null;
	var cached;
	if (cached=this.get(join.table)) {
		var rec=cached.findRecordById(recId);
		if (rec) rtn=rec.getField(join.lkupField).getValue();
	}
	return rtn;
}

CalemCache.prototype.findIdByJoinValue=
function(join, value) {
	var rtn=null;
	var cached;
	if (cached=this.get(join.table)) {
		var rec=cached.findRecordByValue(join.lkupField, value);
		if (rec) rtn=rec.id;
	}
	return rtn;
}

CalemCache.prototype.findIdByJoinValueNoCache=
function(join, value) {
	//To construct a query based on join info and send it to server.
	return null;
}

//Events
CalemCache.prototype.addChangeListener =
function(id, listener) {
	if (this.get(id)) this.get(id).addChangeListener(listener);
}

CalemCache.prototype.removeChangeListener =
function(id, listener) {
	if (this.get(id)) this.get(id).removeChangeListener(listener);
}

//Data events
CalemCache.prototype.onDataInserted =
function(id, rec) {
	this.get(id).onDataInserted(rec);
}

//Data events
CalemCache.prototype.onDataDeleted =
function(id, recId) {
	this.get(id).onDataDeleted(recId);
}

//Data events
CalemCache.prototype.onDataUpdated =
function(id, recId) {
	return this.get(id).onDataUpdated(recId);
}

/**
 * Lookup validation function
 * - single value validation
 * - multi-value validation
 */
CalemCache.prototype.validateLookupSingle =
function(tbId, fld, value, callback) {
	var cached=this.get(tbId);
	if (cached) {//This is cached item.
	   var id=null;
	   var valid=false;
		var rec=cached.findRecordByValue(fld, value);
		if (rec) {
			id=rec.id;
			valid=true;
		}
		callback.run(id, value, valid);
	} else {//This is to validate by a soap call to database.
		this.validateLookupMultiple(tbId, [{fld: fld, value: value}], value, callback);
	}
} 

CalemCache.prototype.validateLookupMultiple =
function(tbId, fldAr, value, callback) {
	//Build a query first.
	var lkupDd=this._registry.getTableDd(tbId);
	var tblQuery=lkupDd.buildGetAllQuery();
	var andExpr = new CalemExprAnd();
	for (var i=0; i< fldAr.length; i++) {
		var val=new CalemDbString(fldAr[i].value);
		var dbFld= new CalemDbField(tbId, fldAr[i].fld);
		var expr=new CalemDbExpr(dbFld, CalemDbExpr.EQ, val);
		andExpr.add(expr);
	}
	tblQuery.setWhere(tbId, andExpr);
	//Creating a db query
	this._validateLookupByDb(tbId, tblQuery, callback, value);
} 

CalemCache.prototype._validateLookupByDb =
function(tbId, tblQuery, callback, value) {
	var dbQry=new CalemDbQuery();
	dbQry.add(tblQuery);
	var lkupCallback=new AjxCallback(this, this.onBulkFetchLookupResponse, {callback: callback, value: value, table: tbId});
	this.bulkLoad(dbQry, lkupCallback);
}

//analyze result
CalemCache.prototype.onBulkFetchLookupResponse =
function(param, resultList) {
	var recList=resultList[param.table];
	if (recList.getTotal()>0) {//found it
		param.callback.run(recList.getRecord(0).id, param.value, true);
	} else {
		param.callback.run(null, param.value, false);
	}
}
