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
 * CalemLabelFormEdit
 */
function CalemLabelFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemLabelFormEdit.prototype = new CalemFormEdit;
CalemLabelFormEdit.prototype.constructor = CalemLabelFormEdit;

CalemLabelFormEdit.prototype.toString = function() { return "CalemLabelFormEdit";}

//Get tableId from data.
CalemLabelFormEdit.prototype._createDataModel =
function(data) {	
	this._item=data.item;
	this._reg=CalemContext.getInstance().getRegistry();
	this._tableId='vt_label';
	this._tableDd = this._reg.getTableDd(this._tableId);
	this._rec=this._createVtLabelRec();
	CalemFormEdit.prototype._createDataModel.call(this, {item: this._rec});
}

CalemLabelFormEdit.prototype.getTableDd =
function(id) {
	return this._tableDd;
}

CalemLabelFormEdit.prototype._createVtLabelRec =
function(id) {
	//Creating a record: id, label, locale
	var id=this._item.getLabelId();
	var recVal=[id, CalemMsg.getMsg(id), CalemViewUtil.getLocaleClient()];
	var ci=new CalemLocalCachedItem(this._reg.getCache(), 'vt_label', [recVal]);
	var rec=ci.getRecordList().getRecord(0);
	return rec;	
}

// set fields being disabled
CalemLabelFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	this._view.setFieldReadOnly('id');
}

//Do not cache this form
CalemLabelFormEdit.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

//Do field name change (id and oldId to decide if just name is changed).
CalemLabelFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	row['locale']=CalemViewUtil.getLocaleServer(row['locale']);
	var entry={entry_0 : row};	                  
	CalemSoapUtil._onSoapCall('EditLabel', entry, new AjxCallback(this, this._onSoapEditResponse, row));
}

//Process response from server.
CalemLabelFormEdit.prototype._onSoapEditResponse =
function(row, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		CalemMsg._addCustomMsg(row['id'], row['label']);
		this._item.onLabelChanged();
		this._closeAndResumeParentForm();
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
} 
