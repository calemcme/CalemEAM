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
 * CalemCachedItem wraps a CalemRecordList and provide services and access control over the data
 * cached for a table. For instance the sort order cannot be altered for this cached table.
 * 
 * Time management: localDeleted and updated time are used for stale management; server deleted and updated 
 * time are used for query management. 
 * 
 * @param tblQuery - the query that fetches the data.
 * @param result - the raw result list
 * @param cache - the cache object.
 * 
 */
function CalemCachedItem(tblQuery, rawResult, cache) {
	if (arguments.length==0) return;
	CalemModel.call(this, true);
	this._id=rawResult.table;
	this._recList=CalemCacheRecordList.createByRawResult(tblQuery, rawResult);
	this._setUpdatedTime(rawResult.localTime, rawResult.serverTime);
	this._setDeletedTime(rawResult.localTime, rawResult.serverTime);
	this._cache=cache;
	//Add item to cache.
	cache.put(this);
} 

CalemCachedItem.prototype = new CalemModel;
CalemCachedItem.prototype.constructor=CalemCachedItem;

CalemCachedItem.prototype.toString = function() {return 'CalemCachedItem';}

CalemCachedItem.prototype.getId =
function() {
	return this._id;
}

//Time management
CalemCachedItem.prototype._setUpdatedTime =
function(localTime, serverTime) {
	this._lastLocalUpdatedTime = CalemTextUtil.parseServerDateTime(localTime);
	this._lastServerUpdatedTime = serverTime;
}

CalemCachedItem.prototype._setDeletedTime =
function(localTime, serverTime) {
	this._lastLocalDeletedTime = CalemTextUtil.parseServerDateTime(localTime);
	this._lastServerDeletedTime = serverTime;
}

/**
 * Management APIs
 */
CalemCachedItem.prototype.addStaledQueries =
function(dbQuery, forceReload) {
	if (!forceReload && !this.isStaled()) return;
	//Add both deleted and updated queries
	var deletedQuery=new CalemQueryDeleted(this._id, this._id, this._lastServerDeletedTime);
	dbQuery.add(deletedQuery);
	//Updated query
	var updatedQuery=this._recList.getTableDd().buildGetAllQuery();
	updatedQuery.addStaleTime(this._lastServerUpdatedTime);
	dbQuery.add(updatedQuery);
}

CalemCachedItem.prototype.isStaled =
function() {
	var dt=new Date();
	return (dt - this._lastLocalDeletedTime >= this._cache.getStaleMax() || dt - this._lastLocalUpdatedTime >= this._cache.getStaleMax());
}

/**
 * Incremental updates - the updates include both deleted and updated.
 * @param rawResults is an array of deleted/updated/inserted from database.
 * @events - events are fired after updates.
 */
CalemCachedItem.prototype.onServerUpdates =
function(rawResults) {
	//Think about providing ids changed, deleted and added?
	var event=new CalemCacheChangeEvent(this._id);
	for (var i=0; i< rawResults.length; i++) {
		var rawResult=rawResults[i];
		if (rawResult.type==CalemTableQuery.DELETED) { //Handle deleted. 
	      this._setDeletedTime(rawResult.localTime, rawResult.serverTime);
			if (rawResult.data) this._recList.deleteRecords(rawResult.data, event);
		} else { //Handle updated
		   this._setUpdatedTime(rawResult.localTime, rawResult.serverTime);
			if (rawResult.data) this._updateByRawResult(rawResult, event);
		}
	}
	//To send out change events.
	if (event.size() > 0) { //do we need sort first?
		var action=new AjxTimedAction(this, this._notifyChangeEvent, event);
		AjxTimedAction.scheduleAction(action, this._cache.getProcessDelay());
	}
} 

/**
 * Update recordList based on rawResult
 */
CalemCachedItem.prototype._updateByRawResult =
function(rawResult, event) {
	var updatedRecList=CalemCacheRecordList.createByRawResult(null, rawResult);
	this._recList.updateByRecList(updatedRecList, event);
}

/**
 * Local query on the cached record list
 */
CalemCachedItem.prototype.bulkFetchByQuery =
function(tblQuery) {
	var result;
	if (tblQuery.hasWhereExpr()) { //To perform query for each record.
		result=this._recList.query(tblQuery);
	} else { //Let's clone it.
		result=this._recList.clone(tblQuery);
	}
	//Do not handle sort in this case.
	return result;
}

/**
 * Cache item query
 */
CalemCachedItem.prototype.findRecordById=
function(valId) {
	return this._recList.findRecordById(valId);
} 

CalemCachedItem.prototype.findRecordByValue=
function(field, value) {
	return this._recList.findRecordByValue(field, value);
} 

/**
 * Events for other parties.
 */
CalemCachedItem.prototype.addChangeListener = 
function(listener) {
	this.addListener(CalemEvent.CACHE_CHANGE, listener);
}

CalemCachedItem.prototype.removeChangeListener = 
function(listener) {
	this.removeListener(CalemEvent.CACHE_CHANGE, listener);    	
} 

/**
 * Notify change event
 */
CalemCachedItem.prototype._notifyChangeEvent =
function(event) {
	this.notifyListeners(CalemEvent.CACHE_CHANGE, event);
}

/**
 * A record is inserted.
 */
CalemCachedItem.prototype.onDataInserted =
function(recRaw) {
	var rec=this._recList.addRaw(recRaw);
	var evt=new CalemCacheChangeEvent(this._id);
	evt.addInserted(rec);
	this._notifyChangeEvent(evt);
}

/**
 * A record is deleted.
 */
CalemCachedItem.prototype.onDataDeleted =
function(recId) {
	var rec=this._recList.deleteRecords([recId]);
	var evt=new CalemCacheChangeEvent(this._id);
	evt.addDeleted(recId);
	this._notifyChangeEvent(evt);
}

/**
 * A record is updated.
 */
CalemCachedItem.prototype.onDataUpdated =
function(recRaw) {
	var evt=new CalemCacheChangeEvent(this._id);
	var rec=this._recList.updateRaw(recRaw, evt);
	this._notifyChangeEvent(evt);
	return rec;
}

/**
 * For dropdown use
 */
CalemCachedItem.prototype.getRecordList =
function() {
	return this._recList;
} 

/**
 * Items preloaded to front end.
 */
function CalemLocalCachedItem(cache, id, data, fields) {
	if (arguments.length==0) return;
	var reg=CalemContext.getInstance().getRegistry();
	var tableDd=reg.getTableDd(id);
	if (!fields) {
		fields=tableDd.getFieldListForQuery();
	}
	var date = new Date();
	var serverDate=CalemTextUtil.localDateTimeToGmt(date);
	var rawResult={table: id, fields: fields,	data: data,
	               localTime: CalemTextUtil.formatServerDateTime(date),
	               serverTime: CalemTextUtil.formatServerDateTime(serverDate)};
	CalemCachedItem.call(this, tableDd.buildGetAllQuery(), rawResult, cache);	               
} 

CalemLocalCachedItem.prototype = new CalemCachedItem;
CalemLocalCachedItem.prototype.constructor = CalemLocalCachedItem;

CalemLocalCachedItem.prototype.isStaled = function() { return false; }

/**
 * Dropdown cached item.
 */
function CalemCachedDropdown(id, cache) {
	if (arguments.length==0) return;
	CalemLocalCachedItem.call(this, cache, id, CalemDropdown.get(id));	               
} 

CalemCachedDropdown.prototype = new CalemLocalCachedItem;
CalemCachedDropdown.prototype.constructor = CalemCachedDropdown;

/**
 * Cached table list factory.
 */
function CalemCachedTableListFactory() {               
} 

CalemCachedTableListFactory.create =
function(id) {
	var reg=CalemContext.getInstance().getRegistry();
	var tbList=reg.getCache().get(id);
	if (!tbList) {
		var dataList=new Array();
		var tableList=CalemData[id];
		for (var i=0; i< tableList.length; i++) {
			var tableDd=reg.getTableDd(tableList[i]);
			var tbName=CalemMsg.getMsg(tableList[i]);
			var modName=CalemMsg.getMsg(tableDd.getModule());
			dataList.push([tableList[i], tbName, modName]);
		}
		//Creating the cache item
		var ci=new CalemLocalCachedItem(reg.getCache(), id, dataList);
	}
}
	
/**
 * Cached Groups.
 */
function CalemCachedGroups(cache) {
	if (arguments.length==0) return;
	var id='acl_group';
	var aclGroup=CalemData[id]; //Cached data.
	CalemLocalCachedItem.call(this, cache, id, aclGroup.data);
	this._parentMap=aclGroup.parentMap;
	this._initLoaded();               
} 

CalemCachedGroups.prototype = new CalemLocalCachedItem;
CalemCachedGroups.prototype.constructor = CalemCachedGroups;

/**
 * Init custom info loaded for groups known at this time.
 */
CalemCachedGroups.prototype._initLoaded =
function() {
	this._customLoaded=new Object();
	var userInfo=CalemContext.getInstance().getUserInfo();
	this.setCustomLoaded([userInfo.gid], true);
}

CalemCachedGroups.prototype.setCustomLoaded =
function(gids, setParent) {
	for (var j=0; j < gids.length; j++) {
		gid=gids[j];
		this._customLoaded[gid]=1;
		if (setParent) {
			var parents=this._parentMap[gid];
			if (parents) {
				for (var i=0; i< parents.length; i++) this._customLoaded[parents[i]]=1;
			}
		}
	}
}

//Get list of groups to load custom info as required by gid.
CalemCachedGroups.prototype.getGroupsToLoad =
function(gid) {
	var ar=[gid];
	var parents=this._parentMap[gid];
	if (parents) {
		for (var i=0; i< parents.length; i++) {
			ar.push(parents[i]);
		}
	}
	var arLoad=[];
	for (var i=0; i< ar.length; i++) {
		if (!this._customLoaded[ar[i]]) arLoad.push(ar[i]);
	}
	return arLoad;
}

CalemCachedGroups.prototype.getParentMap =
function() {
	return this._parentMap;
}

CalemCachedGroups.prototype.findParents =
function(gid) {
	return this._parentMap[gid];
}

CalemCachedGroups.prototype.inGroupPath =
function(gid, testGid, inclusive) {
	if (inclusive && gid==testGid) return true;
	var list=this._parentMap[gid];
	for (var i=0; i< list.length; i++) {
		if (list[i]==testGid) return true;
	}
	return false;
}

