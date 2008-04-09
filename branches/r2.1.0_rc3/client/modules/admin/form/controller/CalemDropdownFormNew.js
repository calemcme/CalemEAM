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
 * CalemDropdownFormNew
 */
function CalemDropdownFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
}

CalemDropdownFormNew.prototype = new CalemFormNew;
CalemDropdownFormNew.prototype.constructor = CalemDropdownFormNew;

CalemDropdownFormNew.prototype.toString = function() { return "CalemDropdownFormNew";}

//Get tableId from data.
CalemDropdownFormNew.prototype._createDataModel =
function(data) {	
	this._tableId=data.tableId;
	this._tableDd= CalemContext.getInstance().getRegistry().getTableDd(this._tableId);
	this._tableDd.createVtDropdownDd(CalemConst._VT_DROPDOWN_USE);
	CalemFormNew.prototype._createDataModel.call(this);
}

/**
 * Business APIs
 */
CalemDropdownFormNew.prototype._verifyInputBo =
function() {
	var row=this._getInputDataRow();
	return CalemDropdownBo.getInstance()._verifyInputBo(row, this);
}

CalemDropdownFormNew.prototype.getTableDd =
function() {
	return this._tableDd;
}

//Do not cache this form
CalemDropdownFormNew.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

//Save custom field
CalemDropdownFormNew.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	var locale=CalemContext.getInstance().getUserInfo().locale;
	row['locale']=CalemViewUtil.getLocaleServer(locale);
	row['tableId']=this._tableId;
	var entry={entry_0 : row};
	CalemSoapUtil._onSoapCall('AddDropdown', entry, new AjxCallback(this, this._onSoapAddResponse, row));
}

//Process response from server.
CalemDropdownFormNew.prototype._onSoapAddResponse =
function(row, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		this._tableDd.addDropdown(row);
		CalemMsg._addCustomMsg(row['id'], row['label']);
		this._closeAndResumeParentForm(new CalemReRenderAction());
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

/**
 * Modifying customInfo for form editing.
 */
CalemDropdownFormNew.prototype.getCustomInfo =
function() {	
	var viewInfo=this.getViewInfo();
	var tbDd=this._modelItem.getTableDd();
	return CalemViewCustomInfo.createCustomLayout(viewInfo, tbDd, tbDd.getFieldList(), ['fixed']);
}

 
