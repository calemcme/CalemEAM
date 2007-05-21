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
 * CalemModelItem is the data model for a form.
 * It listens for events from UI and cache store.
 */
function CalemDataModelItem(id, model) {
	if (arguments.length==0) return;
	CalemModel.call(this, true);
	
	this._id=id;
	this._model=model;
	//Get a reference to tableDd.
	this._tableDd=model.getRegistry().getTableDd(id);
	//Listeners from UI controls
	this._uiBrokerListener = new AjxListener(this, this.onUiEvent);
	
	//reference count - model item can be shared by multiple controllers.
	this._refCount=1;
} 

CalemDataModelItem.prototype = new CalemModel;
CalemDataModelItem.prototype.constructor = CalemDataModelItem;



CalemDataModelItem.prototype.toString = 
function() {
	return "CalemModelItem";
}

//Public APIs
CalemDataModelItem.prototype.addRefCount=
function() {
	this._refCount++;
}

CalemDataModelItem.prototype.decRefCount=
function() {
	this._refCount--;
}

CalemDataModelItem.prototype.getTableDd =
function() {
	return this._tableDd;
}

CalemDataModelItem.prototype.getId =
function() {
	return this._id;
}

CalemDataModelItem.prototype.getTableName =
function() {
	return this._tableDd.getTableName();
}

CalemDataModelItem.prototype.getTableQuery =
function() {
	if (!this._tableQuery) this.setTableQuery();
	return this._tableQuery;
}

CalemDataModelItem.prototype.setTableQuery =
function(tblQuery) {
	if (!tblQuery) {
		tblQuery=this._getDefaultQuery(); 
	}
	//Initialize query at two levels (form and item)
	tblQuery = this._initQueryByModelItem(tblQuery);
	this._tableQuery = this._model.getController().initQueryByForm(tblQuery);
}

CalemDataModelItem.prototype._getDefaultQuery =
function(tblQuery) {
	return this._tableDd.buildGetAllQuery();
}

CalemDataModelItem.prototype._initQueryByModelItem =
function(tblQuery) {
	return tblQuery;
}

CalemDataModelItem.prototype.getRecordList =
function() {
	return this._recList;
}

/**
 * Events handling
 */
CalemDataModelItem.prototype.onUiEvent =
function(ev) {
	this.notifyListeners(ev.getType(), ev);
} 

/**
 * Publish events
 */
CalemDataModelItem.prototype.publishEvents =
function(eventList, obj) {
	for (var i=0; i< eventList.length; i++) {
		obj.addListener(eventList[i], this._uiBrokerListener);
	}
} 

/**
 * unpublish events - give model a change to remove events registered.
 */
CalemDataModelItem.prototype.unpublishEvents =
function(eventList, obj) {
	for (var i=0; i< eventList.length; i++) {
		obj.removeListener(eventList[i], this._uiBrokerListener);
	}
} 

/**
 * Add listener
 */
CalemDataModelItem.prototype.addDataChangeListener =
function(listener) {
	this.addListener(CalemEvent.DATA_CHANGE, listener);
} 

CalemDataModelItem.prototype.removeDataChangeListener =
function(listener) {
	this.removeListener(CalemEvent.DATA_CHANGE, listener);
} 

/**
 * Current record moved or changed
 */
CalemDataModelItem.prototype.addRecMoveListener =
function(listener) {
	this.addListener(CalemEvent.RECORD_MOVED, listener);
} 

CalemDataModelItem.prototype.removeRecMoveListener =
function(listener) {
	this.removeListener(CalemEvent.RECORD_MOVED, listener);
} 

CalemDataModelItem.prototype.addRecChangeListener =
function(listener) {
	this.addListener(CalemEvent.RECORD_CHANGED, listener);
} 

CalemDataModelItem.prototype.removeRecChangeListener =
function(listener) {
	this.removeListener(CalemEvent.RECORD_CHANGED, listener);
} 

/**
 * It's already handled by sub-classes.
 */
CalemDataModelItem.prototype.onLoadResult =
function(recList) {
	if (!recList) {//Empty result.
		recList=this._createEmptyRecList();
	}
	this._recList=this._createRecList(recList); 
	if (recList.getTotal() > 0) {
		this._currentRec = recList.getRecord(0);
		this._recPos=0;
	} else {
		this._setCurrentRecNull();
	}	
	
	if (CalemDebug.isDebug()) CalemDebug.debug("modelItem got onLoadResult: id="+this.getId()+", size="+this._recList.getTotal());
	//Notify data change event - in the case of refresh or detail grid, the size is not synced.
	var evt=new CalemDataChangeEvent(this._recList.getTotal());
	this.notifyListeners(CalemEvent.DATA_CHANGE, evt);
}

//Sort handling.
CalemDataModelItem.prototype.sortList =
function(ob, callback, start) {
	this._recList.sort(ob, callback, start);
} 

//Record change
CalemDataModelItem.prototype._reportRecChanged =
function(rec) {
	var ev=new CalemRecChangeEvent(rec);
	this.notifyListeners(ev.getType(), ev);
}

//Current rec deleted
CalemDataModelItem.prototype._reportRecMoved =
function() {
	var ev= new CalemRecMoveEvent(this._id);
	this.notifyListeners(ev.getType(), ev);
}

//This is a transition from no records to new records.
CalemDataModelItem.prototype._onRecAvailable =
function() {
	this._recPos=0;
	this._currentRec=this._recList.getRecord(0);
	this._reportRecMoved();
}

CalemDataModelItem.prototype._setCurrentRecNull =
function() {
	this._currentRec=null;
	this._recPos=null;	
}

CalemDataModelItem.prototype.isSameOrderBy =
function(ob) {
	if (!this._recList) return true; //Do not order
	if (!this._recList.getOrderBy()) return false; //No order by do let's do it.
	return ob.equals(this._recList.getOrderBy());
}

/**
 * Inserting a new empty record
 */
CalemDataModelItem.prototype.createNewRecord =
function() {
	this._recList=this._createEmptyRecList();
	var recDefault=this._tableDd.getDefaultRecord();
	this._currentRec=new CalemRecord(this._recList, recDefault.fldList, recDefault.recDefault);
}

CalemDataModelItem.prototype.getCurrentRecord =
function() {
	return this._currentRec;
}

CalemDataModelItem.prototype.setCurrentRecord =
function(rec) {
	this._currentRec = rec;
	this._updatePosition();
	this._reportPosition();
}

CalemDataModelItem.prototype._updatePosition =
function() {
	var pos=-1;
	for (var i=0; i< this._recList.getSize(); i++) {
		if (this._currentRec==this._recList.getRecord(i)) {
			pos=i;
			break;
		}
	}
	if (pos >= 0) {
		this._recPos=pos;
	}
}

CalemDataModelItem.prototype.getRecPos =
function() {
	return this._recPos;
}

/**
 * Create an empty record list if there's no one yet.
 * Note: init as a none-cache recList assuming ordering is not performed here (in read view).
 */
CalemDataModelItem.prototype.initCurrentRecord =
function(rec) {
	if (!this._recList) {
		this._recList=this._createEmptyRecList();
		this._recList.add(rec);
	} 
	//Set current record
	this.setCurrentRecord(rec);
}

/**
 * Record position event
 */
CalemDataModelItem.prototype._reportPosition =
function() {
	if (this._recList.getTotal()==0) {
		var ev=new CalemRecordPosEvent(CalemEvent.RECORD_POS_INVALID);
		this.notifyListeners(CalemEvent.RECORD_POS_INVALID, ev);
	} else {
		//Record is valid.
		var ev=new CalemRecordPosEvent(CalemEvent.RECORD_POS_VALID);
		ev.add(this._currentRec);
		this.notifyListeners(CalemEvent.RECORD_POS_VALID, ev);
		//Creating a new event
		ev=new CalemRecordPosEvent(CalemEvent.RECORD_POS_FIRST_LAST);
		ev.add(this._currentRec);	
		if (this._recList.getTotal()==1) { //First and last are the same
			//First and last are the same.
			this.notifyListeners(CalemEvent.RECORD_POS_FIRST_LAST, ev);	
		} else if (this._recPos==0){ //first
	   	ev.setType(CalemEvent.RECORD_POS_FIRST);
			this.notifyListeners(CalemEvent.RECORD_POS_FIRST, ev);
		} else if (this._recList.atLast(this._recPos)) {//last
			ev.setType(CalemEvent.RECORD_POS_LAST);
			this.notifyListeners(CalemEvent.RECORD_POS_LAST, ev);
		} else {//mid
			ev.setType(CalemEvent.RECORD_POS_MID);
			this.notifyListeners(CalemEvent.RECORD_POS_MID, ev);
		}
	}
} 

/**
 * Remove all listeners.
 */
CalemDataModelItem.prototype._shutdown =
function() {
	this.decRefCount();
	if (this._refCount>0) return false;
	if (CalemDebug.isDebug()) CalemDebug.debug("Shutting down modelItem: "+this._id);
	return true;
} 

