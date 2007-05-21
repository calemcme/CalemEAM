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
 * CalemFormEdit
 * This is the record edit form.
 * 
 */
function CalemFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
	//Inherits from form new most of the listeners.
	this._deleteListener = new AjxListener(this, this.onDelete);
	this._soapEditSaveCallback=new AjxCallback(this, this.onSoapEditSaveCallback);
}

CalemFormEdit.prototype = new CalemFormNew;
CalemFormEdit.prototype.constructor = CalemFormEdit;

CalemFormEdit.prototype.toString = function() { return "CalemFormEdit"; }

/**
 * Monitor some events
 */
CalemFormEdit.prototype._createDataModel =
function(data) {	
	CalemFormNew.prototype._createDataModel.call(this, data);
   //rec change listener
	this._recChangeListener = new AjxListener(this, this.onRecChanged);
	this._modelItem.addRecChangeListener(this._recChangeListener);
}

/**
 * No need for edit form to resume view which means to wipe out all the 
 * changes.
 */
CalemFormEdit.prototype._resumeView =
function() {
	//Need to reset focus here.
	this._view.setFocus();
}

//view is reset, so save command should not be enabled.
CalemFormEdit.prototype._viewReset =
function(ev) {
	var rec=this._modelItem.getCurrentRecord();
	var ev=new CalemRecEditEvent(rec);
	ev.setType(CalemEvent.EDIT_NO_CHANGE); 
	this._modelItem.notifyListeners(ev.getType(), ev);
}

CalemFormEdit.prototype._loadData =
function() {//Record should have been set already.
	this.onDataLoaded(); //Mimic a callback so form opening can continue.
} 

//Event handlers
CalemFormEdit.prototype.getDeleteListener =
function() {
	return this._deleteListener;
} 

//post deletion processing.
CalemFormEdit.prototype._onSoapDeleteSuccess =
function() { //Close the embed form.
	this._closeAndResumeParentForm();	
}

//Need to check for changes.
CalemFormEdit.prototype._onCancel =
function() {
	//Prompt exit if it has value.
	if (this._getEditChanged()) {
		CalemQuestionDialog.showIt(CalemMsg.getMsg('form_close_title'), CalemMsg.getMsg('form_close_prompt'), this._closePromptCallback);
	} else this._closeAndResumeParentForm();
}  

/**
 * Can this form be closed?
 * callback with true allows close, false will not.
 */
CalemFormEdit.prototype._canClose =
function(callback) {
	if (this._getEditChanged()) {
		CalemQuestionDialog.showIt(CalemMsg.getMsg('form_close_title'), CalemMsg.getMsg('form_close_prompt'), callback);
	} else {
		callback.run(true);
	}
}

/**
 * Check for rec change if validation is good.
 */
CalemFormEdit.prototype.onDataValidationEvent =
function(field, isValid, value) {
	var action=new AjxTimedAction(this, this._onDataValidationEvent, {field: field, isValid: isValid, value: value});
	AjxTimedAction.scheduleAction(action, CalemConf['view_engine']['validationDelay']);
}

CalemFormEdit.prototype._onDataValidationEvent =
function(param) {
	var valid=CalemFormNew.prototype._onDataValidationEvent.call(this, param);
	var field=param.field; var isValid=param.isValid; var value=param.value; //Restore param.
	if (valid) {//Check for data change and generate proper events.
		var rec=this._modelItem.getCurrentRecord();
	   var ev=new CalemRecEditEvent(rec);
		if (!this._getEditChanged()) {
			ev.setType(CalemEvent.EDIT_NO_CHANGE);
		} 
		this._modelItem.notifyListeners(ev.getType(), ev);
	}
}

/**
 * Rec change detection.
 */
CalemFormEdit.prototype._getEditChanged =
function() {
	var rtn=false;
	var tableDd=this._modelItem.getTableDd();
	var fields=tableDd.getFields();
	for (var i in fields) {
		if (rtn=this._view.getFieldChanged(i)) break;
	}
	return rtn;
}

/**
 * Collect field changes.
 */
CalemFormEdit.prototype._collectEditChanged =
function() {
	var update = new Object();
	var tableDd=this._modelItem.getTableDd();
	var fields=tableDd.getFields();
	for (var i in fields) {
		if (rtn=this._view.getFieldChanged(i)) update[i]=this._view.getEditFieldServerValue(i);
	}
	return update;
}

//It's the current record
CalemFormEdit.prototype._onSave =
function(evt) {
	var rows=this._prepareDataEdit();
	this._onSaveCall(rows);
} 

CalemFormEdit.prototype._onSaveCall =
function(rows) {
	CalemSoapUtil._onSoapCall('UpdateData', rows, this._soapEditSaveCallback);
}

CalemFormEdit.prototype._prepareDataEdit =
function() {
	var tableDd=this._modelItem.getTableDd();
	//prepare current record
	var rec=this._modelItem.getCurrentRecord();
	var current=rec.getJsonObject();
	var cRtn=CalemViewUtil.partitionData(tableDd, current);
	//Collect updates
	var update=this._collectEditChanged();
	var uRtn=CalemViewUtil.partitionData(tableDd, update);
	//Now also create a query to get the inserted data back if successful for updating front end.
	var tq=tableDd.buildGetOneQuery();
	//Now let's make a soap call with busy signal
	var rows={row_0: {base: {table: tableDd.getTableName(), current: cRtn.base, update: uRtn.base},
	                  custom: {table: tableDd.getCustomTableName(), current: cRtn.custom, update: uRtn.custom},
	                  sql: tq.getSql()} };
	return rows;	                  
}

/**
 * Process soap response from server
 */
CalemFormEdit.prototype.onSoapEditSaveCallback =
function(resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		//Report the data feedback.
		var rtn=this._onDataUpdated(rowResp.feedback);
		//post processing.
		this._onSoapSaveSuccess(rtn.action);		
	} else if (rowResp.status == CalemForm.SOAP_UPDATE_CONFLICT) {//Update conflict
		//@todo - to provide conflict resolution as another configuration.
		//Conflict info callback
	   var conflictCallback=new AjxCallback(this, this.onConflictInfoCallback, rowResp);
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_save_title'), CalemMsg.getMsg('form_save_conflict'), conflictCallback);
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

