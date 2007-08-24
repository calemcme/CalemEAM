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
 * CalemRecordListDbCache
 * The cached DB list impl.
 */
function CalemRecordListDbCache(recList) {
	if (arguments.length==0) return;
	CalemRecordList.call(this, recList.getId());
	this._clearCache();
	this.aggregate(recList);
}

CalemRecordListDbCache.prototype = new CalemRecordList;
CalemRecordListDbCache.prototype.constructor = CalemRecordListDbCache;

CalemRecordListDbCache.prototype.aggregate =
function(recList) {
	//Refresh basic info about the current state.
	this._setQuery(recList.getQuery());
	this._total=recList._total ? recList._total : 0;
	if (!this._fldMap) this._fldMap=recList._fldMap;	
	//copy the recList to cached items.
	if (recList.getSize() > 0) {
		var start=this._tblQuery.getRange()._start;
		for (var i=0; i< recList.getSize(); i++) {
			this._cached[start]=CalemConst._CACHED;
			var rec=recList.getRecord(i);
			this._recList[start]=rec;
			this._recMap[rec.id]=rec;
			start++;
		}
	}
}

CalemRecordListDbCache.prototype._clearCache =
function() {
	this._cached=new Array();
	this._recList=new Array();
	this._recMap=new Object();
}

CalemRecordListDbCache.prototype.sort =
function(ob, callback, start) {
	if (this.getTotal() < CalemConfUtil.getBulkFetchSize()) { //So all the data is fetched.
		CalemRecordList.prototype.sort.call(this, ob, callback, start);
	} else {//perform sort at DB and redo the layout.
		this._clearCache();
		var range=new CalemQueryRange(start);
		this._tblQuery.setOrderBy(ob);
		var fetchCallback=new AjxCallback(this, this.onBulkFetchCallback, {callback: callback, count: 1, start: start});
		this._executeBulkFetch(range, fetchCallback);
	}
}

CalemRecordListDbCache.prototype.atLast =
function(recNo) {
	return (recNo == this._total -1);
}

/** 
 * Data changes
 */
CalemRecordListDbCache.prototype.add =
function(rec) {
	if (this._recMap[rec.id]) {
		this._replace(rec);
	} else {
		this._cached[this._recList.length]=CalemConst._CACHED; //Record it.
	   this._recList.push(rec);
		this._recMap[rec.id]=rec;	
	}
	this._total++;
}

//Must go through the whole list (m-31)
CalemRecordListDbCache.prototype._replace =
function(rec) {
	this._recMap[rec.id]=rec;
	for (var i=0; i< this._recList.length; i++) {
		if (this._recList[i].id==rec.id) {
			this._recList[i]=rec;
		}
	}
}

CalemRecordListDbCache.prototype.getTotal =
function(rec) {
	return this._total;
}

//In case deletion drops the record level to a point a fetch is necessary.
CalemRecordListDbCache.prototype.deleteRecord =
function(id) {
	for (var i=0; i< this._recList.length; i++) {
		if (this._recList[i].id==id) {
			this._recList.splice(i, 1);
			delete this._recMap[id];
			this._cached.splice(i, 1);
		}
	}
	this._total--;
}

//Dynamic scrolling is enabled here.
CalemRecordListDbCache.prototype.sliceByVector =
function(start, count, callback) {
	var fetch=false;
	for (var i=start; i< (start+count); i++) {
		if (!this._cached[i]==CalemConst._CACHED) {
			fetch=true;
			break;
		}
	}
	if (!fetch) {//stuff are in the cache.
		callback.run(this._sliceByVector(start, count));
	} else {//Let's prepare a query and get started.
		var range=new CalemQueryRange(start);
		var fetchCallback=new AjxCallback(this, this.onBulkFetchCallback, {callback: callback, count: count, start: start});
		this._executeBulkFetch(range, fetchCallback);
	}
} 

//query database
CalemRecordListDbCache.prototype._executeBulkFetch =
function(range, callback) {
	var dbQuery=new CalemDbQuery();
	this._tblQuery.setRange(range);
	dbQuery.add(this._tblQuery);
	this._cache.bulkLoad(dbQuery, callback);
}

CalemRecordListDbCache.prototype.onBulkFetchCallback =
function(param, resultList) {
	this.aggregate(resultList[this._id]); //Adding data to cache.
	param.callback.run(this._sliceByVector(param.start, param.count));
}

//Data move operation
CalemRecordListDbCache.prototype.moveNext =
function(recPos, callback) {
	var pos=Math.min(recPos+1, this._total);
	if (!this._cached[pos] && this._total>0) {
		var range=new CalemQueryRange(pos);
		var fetchCallback=new AjxCallback(this, this.onBulkFetchCallback, {callback: callback, count: 1, start: pos});
		this._executeBulkFetch(range, fetchCallback);
	} else {
		callback.run();
	}
}

//Data move operation
CalemRecordListDbCache.prototype.movePrev =
function(recPos, callback) {
	var pos=Math.max(recPos-1, 0);
	if (!this._cached[pos] && this._total>0) {
		pos=Math.max(0, pos-CalemConfUtil.getBulkFetchSize()); //Minimize fetch count.
		var range=new CalemQueryRange(pos);
		var fetchCallback=new AjxCallback(this, this.onBulkFetchCallback, {callback: callback, count: 1, start: pos});
		this._executeBulkFetch(range, fetchCallback);
	} else {
		callback.run();
	}
}

