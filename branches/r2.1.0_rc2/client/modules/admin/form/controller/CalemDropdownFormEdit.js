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
 * CalemDropdownFormEdit
 */
function CalemDropdownFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemDropdownFormEdit.prototype = new CalemFormEdit;
CalemDropdownFormEdit.prototype.constructor = CalemDropdownFormEdit;

CalemDropdownFormEdit.prototype.toString = function() { return "CalemDropdownFormEdit";}

//Get tableId from data.
CalemDropdownFormEdit.prototype._createDataModel =
function(data) {	
	var reg=CalemContext.getInstance().getRegistry();
	this._tableId=data.tableId;
	this._tableDd = reg.getTableDd(this._tableId);
	this._id=data.id;
	this._tableDd.createVtDropdownDd(CalemConst._VT_DROPDOWN_USE);
	this._rec=this._createVtDropdownRec(data.id);
	CalemFormEdit.prototype._createDataModel.call(this, {item: this._rec});
}

CalemDropdownFormEdit.prototype.getTableDd =
function(id) {
	return this._tableDd;
}

CalemDropdownFormEdit.prototype._createVtDropdownRec =
function(id) {
	var dn=this._tableDd.getDropdownMap();
	var row={};
	CalemViewUtil.addObject(dn[id], row);
	row['id']=id;
	row['label']=CalemMsg.getMsg(id);
	var reg=CalemContext.getInstance().getRegistry();
	var fldList=reg.getTableDd(CalemConst._VT_DROPDOWN_USE).getFieldList();
	var recVal=[];
	for (var i=0; i< fldList.length; i++) recVal.push(row[fldList[i]]);
	//Creating a record: id, type, reqd, length, labe lookup
	var ci=new CalemLocalCachedItem(reg.getCache(), CalemConst._VT_DROPDOWN_USE, [recVal]);
	var rec=ci.getRecordList().getRecord(0);
	return rec;	
}

// set fields being disabled
CalemDropdownFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	var dn=this._tableDd.getOobDropdownMap();
	if (dn[this._id] && dn[this._id]['fixed']) {
		this._view.setFieldReadOnly('id');
	}
	//Do not allow fixed to change
		this._view.setFieldReadOnly('fixed');
	}

CalemDropdownFormEdit.prototype._verifyInputBo =
function() {
	var row=this._getInputDataRow();
	return CalemDropdownBo.getInstance()._verifyEditBo(row, this._id, this);
}

//Do not cache this form
CalemDropdownFormEdit.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

//Do field name change (id and oldId to decide if just name is changed).
CalemDropdownFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	row['oldId'] =this._id;
	row['tableId']=this._tableId;
	var locale=CalemContext.getInstance().getUserInfo().locale;
	row['locale']=CalemViewUtil.getLocaleServer(locale);
	var entry={entry_0 : row};	                  
	CalemSoapUtil._onSoapCall('ModifyDropdown', entry, new AjxCallback(this, this._onSoapModifyResponse, row));
}

//Process response from server.
CalemDropdownFormEdit.prototype._onSoapModifyResponse =
function(row, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		this._tableDd.modifyDropdown(row, this._id);
		CalemMsg._addCustomMsg(row['id'], row['label']);
		
		this._closeAndResumeParentForm(new CalemReRenderAction());
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
} 

/**
 * Modifying customInfo for form editing.
 */
CalemDropdownFormEdit.prototype.getCustomInfo =
function() {	
	var viewInfo=this.getViewInfo();
	var tbDd=this._modelItem.getTableDd();
	return CalemViewCustomInfo.createCustomLayout(viewInfo, tbDd, tbDd.getFieldList());
}
