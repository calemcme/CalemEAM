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
 * CalemRecordList is the base record list class.
 * The two immdiate subclasses are CalemDbRecordList which is backed by database
 * and CalemCacheRecordList which is backed by the local cache.
 * 
 */
function CalemRecordList(id) {
	if (arguments.length==0) return;
	this._id=id;
	this._recList=new Array();
	this._recMap=new Object();
	//Prepare some info here.
	this._reg=CalemContext.getInstance().getRegistry();
	this._tableDd=this._reg.getTableDd(this._id);
	this._cache=this._reg.getCache();
	this._recConf=CalemConf['db_recordList'];	
} 

CalemRecordList.prototype.toString = 
function() {
	return "CalemRecordList";
}

/** API function */
CalemRecordList.prototype.getId =
function() {
	return this._id;
}

CalemRecordList.prototype.getTableDd =
function() {
	return this._tableDd;
}

CalemRecordList.prototype.getCache =
function() {
	return this._cache;
}

CalemRecordList.prototype.getRecord =
function(no) {
	if (no > this._recList.length) return null;
	else return this._recList[no];
}

CalemRecordList.prototype.findRecordById =
function(valId) {
	return this._recMap[valId];
}

//A potential concurrency issue if we allow timed update of records.
CalemRecordList.prototype.findRecordByValue =
function(fld, value) {
	//This is a linear scan
	var rtn=null;
	for (var i=0; i< this._recList.length; i++) {
		var rec=this._recList[i];
		if (rec.getField(fld).getValue()==value) {
			rtn=rec;
			break;
		}
	}
	return rtn;
}

CalemRecordList.prototype._setQuery =
function(tblQuery) {
	this._tblQuery=tblQuery;
	this._orderBy= (this._tblQuery ? this._tblQuery.getOrderBy() : null);
}

CalemRecordList.prototype.getQuery =
function() {
	return this._tblQuery;
}

/**
 * Service functions
 */
CalemRecordList.prototype.populateList =
function(tblQuery, fields, rawList) {
	this._setQuery(tblQuery);
	if (!fields) fields=this._tableDd.getFieldListForQuery();
	this._fldMap=new CalemFieldMap(fields);
	//Load the data synchronously.
	if (rawList) {
		if (CalemDebug.isPerf()) CalemDebug.perf("populating "+this._id+", size="+ rawList.length);
		for (var i=0; i< rawList.length; i++) {
			var rec=new CalemRecord(this, this._fldMap, rawList[i]);
			this._recList[i]=rec;
			this._recMap[rec.id]=rec;
		}
		if (CalemDebug.isPerf()) CalemDebug.perf("DONE populating "+this._id+", size="+ rawList.length);
	}
}

CalemRecordList.prototype.getTotal =
function() {
	return this._recList.length;
}

CalemRecordList.prototype.getSize =
function() {
	return this._recList.length;
}

CalemRecordList.prototype.getOrderByField =
function() {
	var rtn= this._orderBy ? this._orderBy.getField() : null;
	return rtn;
}

CalemRecordList.prototype.getOrderBy =
function() {
	return this._orderBy;
}

CalemRecordList.prototype.sort =
function(ob, callback, start) {
	//Optimize out if the same sort is applied - be careful about newly added records.
	if (!ob || (this._orderBy && this._orderBy.equals(ob)) ) { 
		if (callback) callback.run();
		return;
	}
	this._orderBy=ob;
	this._sort(callback, start);
}

CalemRecordList.prototype._sort =
function(callback, start) {
	if (callback) {
		var sortAction = new AjxTimedAction(this, this._sortRecordList, callback);
		AjxTimedAction.scheduleAction(sortAction, this._recConf['sortDelay']);
	} else {
		this._sortRecordList();
	}
}

CalemRecordList.prototype._sortRecordList =
function(callback) {
	//Show busy while sort is in progress.	
	var shell=CalemContext.getInstance().getShell();
	if (!this._noBusy && shell) {
		shell.setBusy(true, this._id, false, 0, null);
	}
	if (CalemDebug.isPerf()) CalemDebug.perf('sort - '+this._id);
	CalemRecord.setOrderBy(this._orderBy); //Use static field to store orderBy info.
	this._recList.sort(CalemRecord.sortCompare);
	if (!this._orderBy.isAscending()) this._recList.reverse();
	if (CalemDebug.isPerf()) CalemDebug.perf('sort - '+this._id+", completed, size="+this._recList.length);
	//callback check
	if (!this._noBusy && shell) {
		shell.setBusy(false, this._id);
	}
	if (callback) callback.run();
}

/**
 * Slice 
 */
CalemRecordList.prototype._sliceByVector =
function(start, count) {
	var ar=this.slice(start, count);
	return AjxVector.fromArray(ar);
} 

CalemRecordList.prototype.slice =
function(start, count) {
	var end = (start+count > this.getTotal()) ? this.getTotal() : (start+count);
	return this._recList.slice(start, end);
}

/**
 * Brutal force search for now.
 */
CalemRecordList.inList = function(id, ar) {
	var j=null;
	for (var i=0; i< ar.length; i++) {
		if (ar[i]==id) {
			j=i;
			break;
		}
	}
	if (j) ar.splice(j, 1); //Remove an entry to reduce query size.
	return (j!=null);
}

/**
 * Deletion - could use binary search if idList is large.
 */
CalemRecordList.prototype.deleteRecords =
function(idList, event) {
	var n=0;
	var indexes=new Array();
	var len=this._recList.length-1;
	if (CalemDebug.isPerf()) CalemDebug.perf("CalemRecordList delete: "+this._id+", count="+idList.length);
	for (var i=len; i>=0; i--) {
		var rec=this._recList[i];
		if (CalemRecordList.inList(rec.id, idList)) { //Now delete a record
			n++;
			this._recList.splice(i, 1); 
			delete this._recMap[rec.id];
			if (event) event.addDeleted(rec.id);
		}
	}
	if (CalemDebug.isPerf()) CalemDebug.perf("CalemRecordList delete: "+this._id+", count="+idList.length);
	return n;
}

CalemRecordList.prototype.getRecordMap =
function() {
	return this._recMap;
}

/**
 * Update by record list
 * @param updatedRecList - updates including modified and new records
 * @param event - event records what records are updated, what are inserted.
 */
CalemRecordList.prototype.updateByRecList =
function(updatedRecList, event) {
	var recMap=updatedRecList.getRecordMap();
	for (var i in recMap) {
		this.update(recMap[i], event);
	}
}

CalemRecordList.prototype.update =
function(rec, event) {
	if (this._recMap[rec.id]) { //Updated
		this._replace(rec);
		if (event) event.addUpdated(rec);
	} else { //New records
		this.add(rec);
		if (event) event.addInserted(rec);
	}
}

//@todo - add index for fast update.
CalemRecordList.prototype._replace =
function(rec) {
	this._recMap[rec.id]=rec;
	for (var i=0; i< this._recList.length; i++) {
		if (this._recList[i].id==rec.id) {
			this._recList[i]=rec;
			break;
		}
	}
}

CalemRecordList.prototype.updateOnly =
function(rec) {
	var rtn=false;
	if (this._recMap[rec.id]) { //Updated
		this._replace(rec);
		rtn=true;
	} 
	return rtn;
}

CalemRecordList.prototype.add =
function(rec) {
	//Check for duplication
	if (this._recMap[rec.id]) {
		this._recMap[rec.id]=rec;
	} else {
	   this._recList.push(rec);
		this._recMap[rec.id]=rec;	
	}
}

/**
 * add record in JSON object format (field: value)
 */
CalemRecordList.prototype.addRaw =
function(recRaw, atPos) {
	//creating the record
	var rec=this._getRecByRaw(recRaw);
	this.add(rec);
	return rec;
}

/**
 * Update record in JSON object format (field: value)
 */
CalemRecordList.prototype.updateRaw =
function(recRaw, event) {
	//creating the record
	var rec=this._getRecByRaw(recRaw);
	this.update(rec, event);
	return rec;
}

CalemRecordList.prototype._getRecByRaw =
function(recRaw) {
	var recVal=[];
	for (var i in this._fldMap) {
		recVal.push(recRaw[i]);
	}
	var rec=new CalemRecord(this, this._fldMap, recVal);
	return rec;
}
 
/**
 * CalemCacheRecordList.
 * The record list is backed by local cache. 
 */
/**
 * Constructor
 */
function CalemCacheRecordList(id) {
	if (arguments.length==0) return;
	CalemRecordList.call(this, id);
} 

CalemCacheRecordList.prototype = new CalemRecordList;
CalemCacheRecordList.prototype.constructor = CalemCacheRecordList;

CalemCacheRecordList.prototype.toString = function() {return 'CalemCacheRecordList';}

//Factory method
CalemCacheRecordList.createByRawResult =
function(tblQuery, rawResult) {
	var recList=new CalemCacheRecordList(rawResult.table);
	recList.populateList(tblQuery, rawResult.fields, rawResult.data);
	return recList;
}

/**
 * Force a sort after db updates
 */
CalemCacheRecordList.prototype.forceSort =
function(callback) {
	this._sort(callback);
}

CalemCacheRecordList.prototype.setQuery =
function(tblQuery) {
	this._setQuery(tblQuery);
}

/**
 * Query the record list
 * Using default sort so do not sort here.
 */
CalemCacheRecordList.prototype.query =
function(tblQuery) {
	var result=new CalemCacheRecordList(this._id);
	result.setQuery(tblQuery);
	for (var i=0; i< this._recList.length; i++) {
		if (tblQuery.query(this._recList[i])) {
			result.add(this._recList[i]);
		}
	}
	return result;
}

/**
 * Clone the list
 */
CalemCacheRecordList.prototype.clone =
function(tblQuery) {
	var result=new CalemCacheRecordList(this._id);
	result.setQuery(tblQuery);
	result._recList=this.slice(0, this.getTotal());
	for (var i=0; i< this._recList.length; i++) {
		var rec=this._recList[i];
		result._recMap[rec.id]=rec;
	}
	return result;
}

CalemCacheRecordList.prototype.atLast =
function(recNo) {
	return (recNo == this.getTotal() -1);
}

CalemCacheRecordList.prototype.sliceByVector =
function(start, count, callback) {
	callback.run(this._sliceByVector(start, count));
} 

/**
 * CalemResultRecordList
 * This is the recordList for a query result.
 */
function CalemResultRecordList(id) {
	if (arguments.length==0) return;
	CalemRecordList.call(this, id);
}

CalemResultRecordList.prototype = new CalemRecordList;
CalemResultRecordList.prototype.constructor = CalemResultRecordList;

CalemResultRecordList.prototype.toString = function() {return 'CalemResultRecordList';}

//Factory method
CalemResultRecordList.createByRawResult =
function(tblQuery, rawResult) {
	var recList=new CalemResultRecordList(rawResult.table);
	recList.populateList(tblQuery, rawResult.fields, rawResult.data);
	recList.setTotal(rawResult.count);
	return recList;
} 

CalemResultRecordList.prototype.setTotal =
function(total) {
	if (total && typeof total == 'string') total=Number(total);
	this._total=total;
}

CalemResultRecordList.prototype.getTotal =
function() {
	return this._total;
} 

/**
 * Field list info
 */
function CalemFieldMap(fields) {
	if (arguments.length==0 || !fields) return null;
	for (var i=0; i< fields.length; i++) {
		this[fields[i]]=i;
	}
}