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
 * CalemDataModelItemCached is the data model that holds cached data.
 */
function CalemDataModelItemCached(id, model) {
	if (arguments.length==0) return;
	CalemDataModelItem.call(this, id, model);
	this._cacheListener=new AjxListener(this, this._onCacheChanged);
} 

CalemDataModelItemCached.prototype = new CalemDataModelItem;
CalemDataModelItemCached.prototype.constructor = CalemDataModelItemCached;



CalemDataModelItemCached.prototype.toString = 
function() {
	return "CalemDataModelItemCached";
}

//Public APIs

/**
 * Cache change listener
 */
CalemDataModelItemCached.prototype.addCacheListener =
function() {
	if (CalemDebug.isDebug()) CalemDebug.debug("Add cache listener for "+this._id+", refCount="+this._refCount+", query="+this._recList.getQuery());
	//Register for cache change event.
	//If query is null, indicating invalid recordset so let's not register for changes.
	if (this._refCount > 1 || !this._recList.getQuery()) return; //Already added.
	this._model.getCache().addChangeListener(this._id, this._cacheListener);
} 

//Adjust recPos
CalemDataModelItemCached.prototype._setRecPos =
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

//Current rec deleted
CalemDataModelItemCached.prototype._onCurrentRecDeleted =
function() {
	this._setRecPos();
	this._reportRecMoved();
}

/**
 * To generate current record change event if any.
 */
CalemDataModelItemCached.prototype._onDataChanged =
function() {
	this._setRecPos();
	this._reportPosition();
}
 
/**
 * Data change events
 */
CalemDataModelItemCached.prototype._onCacheChanged =
function(ev) {
	//Have to check against query first.
	if (!this._recList.getQuery()) return; //Not valid at this time.
	var sz=this._recList.getTotal();
	//Apply change changes locally.
	var n1=this._onCacheInserted(ev.getInserted());
	var n2=this._onCacheUpdated(ev.getUpdated());
	var n3=this._onCacheDeleted(ev.getDeleted());
	if (CalemDebug.isDebug()) CalemDebug.debug("<b>cacheChange applied: "+(n1+n2+n3)+"</b>, recList size="+this._recList.getTotal());
	if (n1+n2+n3 ==0) return; //Change not applicable.
	//If current recList is empty, new records arrived, must generate recMove event
	if (sz==0 && this._recList.getTotal()>0) {
		this._onRecAvailable();
	}
	//Notify UI controls
	var evt=new CalemDataChangeEvent(this._recList.getTotal());
	this.notifyListeners(CalemEvent.DATA_CHANGE, evt);
	//Update current position
	this._onDataChanged();
} 

/**
 * Cache data change handling
 */
CalemDataModelItemCached.prototype._onCacheInserted =
function(items) {
	var n=0;
	var qry=this._recList.getQuery();
	for (var i=0; i< items.size(); i++) {
		var rec=items.get(i);
		if (!qry.query(rec)) continue;
		this._recList.add(rec);
		n++;
	}
	return n;
}  

CalemDataModelItemCached.prototype._onCacheUpdated =
function(items) {
	if (CalemDebug.isDebug()) CalemDebug.debug("got cache updated : id="+this.getId()+", size="+items.size());
	var n=0;
	for (var i=0; i< items.size(); i++) {
		var rec=items.get(i);
		this._recList.update(rec);
		n++;
		//Report rec update event
		if (this._currentRec && this._currentRec.id == rec.id) {
			this._currentRec=rec; //Overwrite rec first.
            if (CalemDebug.isDebug()) CalemDebug.debug("Current record is changed, to report, id="+this.getId());
            this._reportRecChanged(rec);
		}
	}
	return n;
}  

CalemDataModelItemCached.prototype._onCacheDeleted =
function(items) {
	var recDel=false;
	var n=0;
	if (items.size() > 0 ) {
		var ids=items.getArray();
		if (this._currentRec) {
			for (var i=0; i< ids.length; i++) {
				if (this._currentRec.id == ids[i]) {
					recDel=true;
					break;
				}
			}
		}
		n=this._recList.deleteRecords(ids);
	}
	//To handle current rec deleted
	if (recDel) this._onCurrentRecDeleted();
	return n;
}

/**
 * shutdown 
 * Remove the cache listener.
 */
CalemDataModelItemCached.prototype._shutdown =
function() {
	//Inherit the cleanup above.
	if (!CalemDataModelItem.prototype._shutdown.call(this)) return false;
	//Remove cache listener
	this._model.getCache().removeChangeListener(this._id, this._cacheListener);
} 

/**
 * Cached record navigation
 */
CalemDataModelItemCached.prototype.moveNext =
function() {
	if (this._recPos+1 < this._recList.getTotal()) {
		this._recPos++;
		this._currentRec=this._recList.getRecord(this._recPos);	
		this._reportRecMoved();
	}
	this._reportPosition();
} 

CalemDataModelItemCached.prototype.movePrev =
function() {
	if (this._recPos - 1 >= 0) {
		this._recPos--;
		this._currentRec=this._recList.getRecord(this._recPos);
		this._reportRecMoved();	
	}
	this._reportPosition();
} 

CalemDataModelItemCached.prototype._createEmptyRecList =
function() {
	return new CalemCacheRecordList(this._id);	
}

CalemDataModelItemCached.prototype._createRecList =
function(recList) {
	return recList;
}