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
 * CalemFieldFormNew
 */
function CalemFieldFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
}

CalemFieldFormNew.prototype = new CalemFormNew;
CalemFieldFormNew.prototype.constructor = CalemFieldFormNew;

CalemFieldFormNew.prototype.toString = function() { return "CalemFieldFormNew";}

//Get tableId from data.
CalemFieldFormNew.prototype._createDataModel =
function(data) {	
	this._tableId=data.tableId;
	this._fieldTableDd = CalemContext.getInstance().getRegistry().getTableDd(this._tableId);
	CalemFormNew.prototype._createDataModel.call(this);
}

/**
 * Business APIs
 */
CalemFieldFormNew.prototype._verifyInputBo =
function() {
	var row=this._getInputDataRow();
	return CalemFieldBo.getInstance()._verifyInputBo(row, this);
}

CalemFieldFormNew.prototype.getFieldTableDd =
function() {
	return this._fieldTableDd;
}

//Do not cache this form
CalemFieldFormNew.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

//Save custom field
CalemFieldFormNew.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow(); 
	row['field_type']=CalemViewUtil.getVtFieldTypeById(row['field_type']);
	//Change locale/length
	var lc=CalemContext.getInstance().getUserInfo().locale;
	lc=CalemViewUtil.getLocaleServer(lc);
	var col={col_0 : {id: row['id'], 
							tableId: this._fieldTableDd.getCustomTableName(),
	                  type: row['field_type'],
	                  length: row['field_length'],
	                  required: row['required'],
	                  label: row['field_label'],
	                  locale: lc }};
	CalemSoapUtil._onSoapCall('AddField', col, new AjxCallback(this, this._onSoapSaveFieldResponse, row));
}

//Process response from server.
CalemFieldFormNew.prototype._onSoapSaveFieldResponse =
function(row, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		//Modify local DD and close the form and cause parent form to refresh.
		var field= CalemFieldBo.getInstance().getFieldByRow(row);
		this._fieldTableDd._addCustomField(row['id'], field);
		
		CalemMsg._addCustomMsg(row['id'], row['field_label']);
		this._closeAndResumeParentForm(new CalemReRenderAction());
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}
 
