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
 * CalemFormNew
 * This is the new record form
 * 
 */
function CalemFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemForm.call(this, parent, formId, data);
	//Supporting Save and Cancel
	this._saveListener=new AjxListener(this, this.onSave);
	this._cancelListener=new AjxListener(this, this.onCancel);
	this._validationCallback=new AjxCallback(this, this.onDataValidationEvent);
	this._closePromptCallback=new AjxCallback(this, this.onClosePrompt);
	this._soapNewSaveCallback=new AjxCallback(this, this.onSoapNewSaveCallback);
}

CalemFormNew.prototype = new CalemForm;
CalemFormNew.prototype.constructor = CalemFormNew;

CalemFormNew.prototype.toString = function() { return "CalemFormNew"; }

// default is CalemView
CalemFormNew.prototype.createView =
function() {
	CalemForm.prototype.createView.call(this);
	this._view.setScrollStyle(Dwt.SCROLL);
}

CalemFormNew.prototype._loadData =
function() {
	//Create new record
	this._dataModel.createNewRecord();
	this.onDataLoaded(); //Mimic a callback so form opening can continue.
} 

//Event handlers
CalemFormNew.prototype.getSaveListener =
function() {
	return this._saveListener;
} 

CalemFormNew.prototype.getCancelListener =
function() {
	return this._cancelListener;
} 

CalemFormNew.prototype.onCancel =
function() {
	this._onCancel();
} 

//Default implementation
CalemFormNew.prototype._onCancel =
function() {
	this._closeAndResumeParentForm(); //Since it's cached.
}  

//Default implementation
CalemFormNew.prototype.onClosePrompt =
function(selection) {
	if (selection) {//Continue closing the form.
		this._closeAndResumeParentForm();
	}
}

/**
 * Can this form be closed?
 * callback with true allows close, false will not.
 */
CalemFormNew.prototype._canClose =
function(callback) {
	if (this._isViewInputValid()) {
		CalemQuestionDialog.showIt(CalemMsg.getMsg('form_close_title'), CalemMsg.getMsg('form_close_prompt'), callback);
	} else {
		callback.run(true);
	}
}

//Find renders
CalemFormNew.prototype.getRender =
function(info) {
	var render;
	if (!(render=CalemConf['view_engine']['viewEditRender'][info.getClassName()])) {
		render=CalemForm.prototype.getRender.call(this, info);
	} 
	return render;
}

CalemFormNew.prototype.getFieldRender =
function(normType) {
	var render;
	if (!(render=CalemConf['view_engine']['viewEditRender']['FieldRenders'][normType])) {
		render=CalemForm.prototype.getFieldRender.call(this, normType);
	} 
	return render;
}

/**
 * Data validation callback
 */
CalemFormNew.prototype.getValidationCallback =
function() {
	return this._validationCallback;
} 

//Async call here - to workaround FF focus issue.
CalemFormNew.prototype.onDataValidationEvent =
function(field, isValid, value) {
	var action=new AjxTimedAction(this, this._onDataValidationEvent, {field: field, isValid: isValid, value: value});
	AjxTimedAction.scheduleAction(action, CalemConf['view_engine']['validationDelay']);
}

CalemFormNew.prototype._onDataValidationEvent =
function(param) {
	var field=param.field;
	var isValid=param.isValid;
	var value=param.value;
	
	var valid=isValid;
	if (isValid) {
		valid=this._isViewInputValid(field.getFieldInfo().fld, isValid);
	}
	var errorMsg;
	//Try business logic.
	if (valid) {
		try {
			valid=this._verifyInputBo();
		} catch (ex) {
			if (CalemDebug.isInfo()) CalemDebug.info("Got form verifyInput exception "+ ex);
			valid=false;
			if (typeof ex == "string")
				errorMsg = ex;
		}
	}
	//Generate events and show error msg if any.
	return this._generateEvent(valid, errorMsg);
}

CalemFormNew.prototype._generateEvent =
function(valid, errorMsg) {
	//Generate events and show error msg if any.
	if (valid) {
		var evt=new CalemDataValidEvent(true);
		this._modelItem.notifyListeners(evt.getType(), evt);
		this._formErrorRender.hide();
	} else {
		var evt=new CalemDataInvalidEvent(true);
		this._modelItem.notifyListeners(evt.getType(), evt);
		if (errorMsg) this._formErrorRender.setErrorMsg(errorMsg);
	}
	return valid;
}

//Collecting input
CalemFormNew.prototype._getInputDataRow =
function() {
	var row=new Object();
	var tableDd=this._modelItem.getTableDd();
	var fields=tableDd.getFields();
	for (var i in fields) {
		var val=this._view.getInsertFieldServerValue(i);
		if (val) row[i]=val;
	}
	return row;
}

/**
 * Save handling for formNew
 */
CalemFormNew.prototype.onSave =
function(evt) {
	this._onSave(evt);
} 

/**
 * Add custom fields handling.
 */
CalemFormNew.prototype._onSave =
function(evt) {
	var rows=this._prepareDataNew();
	CalemSoapUtil._onSoapCall('InsertData', rows, this._soapNewSaveCallback);
}

CalemFormNew.prototype._prepareDataNew =
function() {
	var row=this._getInputDataRow();
	//Collect parent link id for detail forms.
	this._dataModel.addParentRecId(row);
	//Now also create a query to get the inserted data back if successful for updating front end.
	var tableDd=this._modelItem.getTableDd();
	var tq=tableDd.buildGetOneQuery();
	//split into base and custom so custom fields can be handled properly.
	var rtn=CalemViewUtil.partitionData(tableDd, row);
	var cTable= (tableDd.getCustomFields() ? tableDd.getCustomTableName() : null);
	//Now let's make a soap call with busy signal
	var rows={row_0: { base: { table: tableDd.getTableName(), data: rtn.base},
	                   custom: {table: cTable, data: rtn.custom}, 
	                   sql: tq.getSql()}};
	return rows;	                   
} 

/**
 * Process soap response from server
 */
CalemFormNew.prototype.onSoapNewSaveCallback =
function(resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		//Report the data feedback.
		var action=this._onDataInserted(rowResp.feedback);
      //post-processing
      this._onNewSaved();
		//post processing.
		this._onSoapSaveSuccess(action);		
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

/**
 * Propagate new data
 */
CalemFormNew.prototype._onDataInserted =
function(feedback) {
	//Cache update or parent controller update.
	var tableDd = this._modelItem.getTableDd();
	if (tableDd.isCached()) {//Report to cache.
		this._dataModel.getCache().onDataInserted(feedback.table, feedback.data);
	} else { //Report to parent controller if any.
	   return this._getDataInsertedAction(feedback.table, feedback.data);
	}
} 

CalemFormNew.prototype._getDataInsertedAction =
function(table, data) {
	return new CalemNewDbRecRawAction(table, data);
}

//Soap call save is successful - close embed form now.
CalemFormNew.prototype._onSoapSaveSuccess =
function(action) {
	this._closeAndResumeParentForm(action);
}

CalemFormNew.prototype._onNewSaved =
function() {
	//To clean up the new form since it may be reused.
	this._onDataChanged();
	//Make sure disable save button
	var evt=new CalemDataInvalidEvent(true);
	this._modelItem.notifyListeners(evt.getType(), evt);
}

CalemFormNew.prototype.onRecChanged =
function(ev) {
	if (CalemDebug.isDebug()) CalemDebug.debug("recChange event for form: "+this.getId()+", ev="+ev);
	//Maybe we should prompt data change and close the form
	this._onDataChanged(ev);
}

//view is reset, so save command should not be enabled.
CalemFormNew.prototype._viewReset =
function(ev) {
	this._generateEvent(false);
}

/**
 * No need for new form to resume view which means to wipe out all the 
 * changes. Must use special functions to do so.
 */
CalemFormNew.prototype._resumeView =
function() {
	//Need to reset focus here.
	this._view.setFocus();
}

CalemFormNew.prototype.getDesign =
function() {
	return 'CalemFormRecordDesign';
}

