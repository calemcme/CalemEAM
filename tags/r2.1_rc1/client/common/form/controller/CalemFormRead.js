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
 * CalemFormRead
 * This is the read only view.
 * 
 */
function CalemFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemForm.call(this, parent, formId, data);
	//Toolbar handlers - New, Edit, Delete, Prev, Next, Print, and custom menu items
	this._newListener=new AjxListener(this, this.onNew);
	this._editListener=new AjxListener(this, this.onEdit);
	//Delete handling
	this._deleteListener=new AjxListener(this, this.onDelete);
	this._soapDeleteCallback=new AjxCallback(this, this.onSoapDeleteCallback);
	//Prev/Next
	this._prevListener=new AjxListener(this, this.onPrev);
	this._nextListener=new AjxListener(this, this.onNext);
	//Print handler.
	this._printListener=new AjxListener(this, this.onPrint);	
	//Cancel
	this._cancelListener=new AjxListener(this, this.onCancel);
}

CalemFormRead.prototype = new CalemForm;
CalemFormRead.prototype.constructor = CalemFormRead;

CalemFormRead.prototype.toString = function() { return "CalemFormRead"; }

/**
 * Monitor some events
 */
CalemFormRead.prototype._createDataModel =
function(data) {	
	CalemForm.prototype._createDataModel.call(this, data);
   //rec change listener
	this._recChangeListener = new AjxListener(this, this.onRecChanged);
	this._modelItem.addRecChangeListener(this._recChangeListener);
	//Add a data change listener
	this._recMoveListener = new AjxListener(this, this.onRecMoved);
	this._modelItem.addRecMoveListener(this._recMoveListener);
}

// default is CalemView
CalemFormRead.prototype.createView =
function() {
	CalemForm.prototype.createView.call(this);
	this._view.setScrollStyle(Dwt.SCROLL);
}
	 
/**
 * Load data for read form.
 */
CalemFormRead.prototype._loadData =
function() {
	this._dataModel.load(this._dataLoadCallback);
}

/** RE load data ASAP */
CalemFormRead.prototype._onDataRefresh =
function() {
    this._reLoadData(true);
}

CalemFormRead.prototype._reLoadData =
function(forceReload) {
	this._dataModel.load(this._dataReLoadCallback, forceReload);
}


/**
 * Event listeners
 */
CalemFormRead.prototype.getNewListener =
function() {
	return this._newListener;
} 

CalemFormRead.prototype.onNew =
function(evt) {
	if (!this.canCreate()) return;
	//To embed new form.
   var ebInfo=new CalemEmbedInfo(this._parent, this._getFormNewId());
	this._embedForm(ebInfo);
} 

//Cancel listener
CalemFormRead.prototype.getCancelListener =
function() {
	return this._cancelListener;
} 

CalemFormRead.prototype.onCancel =
function() {
	this._onCancel();
} 

//Default implementation
CalemFormRead.prototype._onCancel =
function() {
	this._closeAndResumeParentForm(); //Since it's cached.
}  

/**
 * Open
 */
CalemFormRead.prototype.getEditListener =
function() {
	return this._editListener;
} 

CalemFormRead.prototype.onEdit =
function(evt) {
	if (!this.canEdit()) return;
	this._onEdit(evt);
} 


CalemFormRead.prototype._onEdit =
function(evt) {
	//Get the selection event
	var item=CalemEvent.getItem(evt);
	//Prepare data for master detail view.
	var data = {modelItem: this._modelItem, item: item};
    //To embed new form.
    var ebInfo=new CalemEmbedEditInfo(this._parent, this._getFormEditId(), data);
	this._embedForm(ebInfo);
} 

/**
 * Delete
 */
CalemFormRead.prototype.getDeleteListener =
function() {
	return this._deleteListener;
} 
//Report record move event
CalemFormRead.prototype._reportRecMoved =
function() {
	var ev=new CalemRecMoveEvent(this._dataModel.getId());
	this.onRecMoved(ev);
}

/**
 * Prev
 */
CalemFormRead.prototype.getPrevListener =
function() {
	return this._prevListener;
} 

CalemFormRead.prototype.onPrev =
function() {
	this._modelItem.movePrev();
}

/**
 * Next
 */
CalemFormRead.prototype.getNextListener =
function() {
	return this._nextListener;
}  

CalemFormRead.prototype.onNext =
function() {
	this._modelItem.moveNext();
} 

/**
 * Print
 */
CalemFormRead.prototype.getPrintListener =
function() {
	return this._printListener;
}

//Find read renders
CalemFormRead.prototype.getRender =
function(info) {
	var render;
	if (!(render=CalemConf['view_engine']['viewReadRender'][info.getClassName()])) {
		render=CalemForm.prototype.getRender.call(this, info);
	} 
	return render;
}

CalemFormRead.prototype.getFieldRender =
function(normType) {
	var render;
	if (!(render=CalemConf['view_engine']['viewReadRender']['FieldRenders'][normType])
	  &&!(render=CalemConf['view_engine']['viewReadRender']['FieldRenders']['default'])) {
		render=CalemForm.prototype.getFieldRender.call(this, normType);
	} 
	return render;
}

//Business logic for form read

//First time to trigger some events after form is rendered.
CalemFormRead.prototype._render =
function() {
	CalemForm.prototype._render.call(this);
	this._modelItem._reportPosition();
}

/**
 * Data move and change handling
 */
CalemFormRead.prototype.onRecChanged =
function(ev) {
	if (CalemDebug.isDebug()) CalemDebug.debug("recChange event for form: "+this.getId());
	this._onDataChanged(ev);
}

/**
 * On current record moved. Sources of this event:
 * <ul>
 * <li> Next/Prev toolbar button click
 * <li> Underlying data change caused record to change
 * </ul>
 */
CalemFormRead.prototype.onRecMoved =
function(ev) {
	if (CalemDebug.isDebug()) CalemDebug.debug("recMove event for form: "+this.getId());
	this._onDataChanged(ev);
}

/**
 * Record navigation event.
 */
CalemFormRead.prototype.addRecMoveListener =
function(listener) {
	this._modelItem.addRecMoveListener(listener);
} 

CalemFormRead.prototype.removeRecMoveListener =
function(listener) {
	this._modelItem.removeRecMoveListener(listener);
}  

CalemFormRead.prototype.addRecModifiedListener =
function(listener) {
	this.addListener(CalemEvent.PARENT_REC_MODIFIED, listener);
} 

CalemFormRead.prototype.removeRecModifiedListener =
function(listener) {
	this.removeListener(CalemEvent.PARENT_REC_MODIFIED, listener);
}  

//Form read shutdown handling
CalemFormRead.prototype._shutdown =
function() {	
	//remove read listeners
	this._modelItem.removeRecChangeListener(this._recChangeListener);
	this._modelItem.removeRecMoveListener(this._recMoveListener);
	CalemForm.prototype._shutdown.call(this);
} 

//Get form design
CalemFormRead.prototype.getDesign =
function() {
	return 'CalemFormRecordDesign';
}

//Soap call save is successful - close embed form now.
CalemFormRead.prototype._onSoapSaveSuccess =
function(action) {
	if (action) action.onAction(this);
}