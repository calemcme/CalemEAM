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
 * CalemDataModelItemDb 
 * Plays the role of local data cache.
 */
function CalemDataModelItemDb(id, model) {
	if (arguments.length==0) return;
	CalemDataModelItem.call(this, id, model);
	this._moveNextCallback=new AjxCallback(this, this.onMoveNextCallback);
	this._movePrevCallback=new AjxCallback(this, this.onMovePrevCallback);
	this._deleteMoveNextCallback=new AjxCallback(this, this.onDeleteMoveNextCallback)
} 

CalemDataModelItemDb.prototype = new CalemDataModelItem;
CalemDataModelItemDb.prototype.constructor = CalemDataModelItemDb;

CalemDataModelItemDb.prototype.toString = 
function() {
	return "CalemDataModelItemDb";
}

//Public APIs

//Always have a range for the query to be ready.
CalemDataModelItemDb.prototype._initQueryByModelItem =
function(tblQuery) {
	var range=tblQuery.getRange();
	if (range==null) {
		var range=new CalemQueryRange(0);
		tblQuery.setRange(range);
	}
	return tblQuery;
}

CalemDataModelItemDb.prototype.addCacheListener =
function() {//not applicable
} 

//Adjust recPos
CalemDataModelItemDb.prototype._setRecPos =
function() {
	if (this._recList.getTotal()==0) {
		this._setCurrentRecNull();
	} else {
		if (!this._recPos) {
			this._recPos=0;
		} else if (this._recPos >= this._recList.getTotal()) {
			this._recPos= this._recList.getTotal() -1;
		}
		this._currentRec= this._recList.getRecord(this._recPos);
	}
}
/**
 * Data events handling
 */
CalemDataModelItemDb.prototype._onDataChanged =
function() {
	this._setRecPos();
	//Notify UI controls
	var evt=new CalemDataChangeEvent(this._recList.getTotal());
	this.notifyListeners(CalemEvent.DATA_CHANGE, evt);
	
	this._reportPosition();
}

//Current rec deleted
CalemDataModelItemDb.prototype._onCurrentRecMoved =
function() {
	this._setRecPos();
	this._reportRecMoved();
}

/**
 * Three data events: insert, delete, update
 */
CalemDataModelItemDb.prototype.onDataInserted =
function(recRaw) {
	var recAvailable=(this._recList.getTotal()==0);
	this._recList.addRaw(recRaw);
	if (recAvailable) {
		this._onRecAvailable();
	}
	//Update current position
	this._onDataChanged();
} 

//Deletion could cause a move operation.
CalemDataModelItemDb.prototype.onDataDeleted =
function(id) {
	this._recList.deleteRecord(id);
	//to handle current rec deleted.
	if (this._currentRec && this._currentRec.id==id) {
		var pos=Math.max(this._recPos-1, 0);
		this._recList.moveNext(pos, this._deleteMoveNextCallback);
	} else {
		this._onDataChanged();
	}
}  

CalemDataModelItemDb.prototype.onDeleteMoveNextCallback =
function() {
	this._onCurrentRecMoved();
	this._onDataChanged();
} 

CalemDataModelItemDb.prototype.onDataUpdated =
function(rec) {
	this._recList.update(rec);
	if (this._currentRec && this._currentRec.id == rec.id) {
		this._currentRec=rec; //Overwrite rec first.
      if (CalemDebug.isDebug()) CalemDebug.debug("Current record is changed, to report, id="+this.getId());
      this._reportRecChanged(rec);
	}
	this._onDataChanged();
}

/**
 * DB record navigation
 */
CalemDataModelItemDb.prototype.moveNext =
function() {
	this._recList.moveNext(this._recPos, this._moveNextCallback);
} 

CalemDataModelItemDb.prototype.onMoveNextCallback =
function() {
	if (this._recPos+1 < this._recList.getTotal()) {
		this._recPos++;
		this._currentRec=this._recList.getRecord(this._recPos);	
		this._reportRecMoved();
	}
	this._reportPosition();
} 

CalemDataModelItemDb.prototype.movePrev =
function() {
	this._recList.movePrev(this._recPos, this._movePrevCallback);
} 


CalemDataModelItemDb.prototype.onMovePrevCallback =
function() {
	if (this._recPos - 1 >= 0) {
		this._recPos--;
		this._currentRec=this._recList.getRecord(this._recPos);
		this._reportRecMoved();	
	}
	this._reportPosition();
}   

/**
 * Data refresh handling
 */   
CalemDataModelItemDb.prototype._onDataRefresh =
function() {
	//force to start from 0.
	if (this._tableQuery) {
		var range=new CalemQueryRange(0);
		this._tableQuery.setRange(range);
	}
	//Force a cache reset
	if (this._recList) this._recList._clearCache();
} 

/**
 * shutdown 
 * Remove the cache listener.
 */
CalemDataModelItemDb.prototype._shutdown =
function() {
	//Inherit the cleanup above.
	if (!CalemDataModelItem.prototype._shutdown.call(this)) return false;
	//Remove cache listener
	this._model.getCache().removeChangeListener(this._id, this._cacheListener);
} 

CalemDataModelItemDb.prototype._createEmptyRecList =
function() {
	var recList=new CalemResultRecordList(this._id);
	return this._createRecList(recList);	
}

CalemDataModelItemDb.prototype._createRecList =
function(recList) {
	return eval(['new ', CalemConf['db_query']['db_recList_impl'], '(recList)'].join(''));	
}

