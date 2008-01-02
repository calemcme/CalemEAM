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
 * CalemFieldNameFormEdit
 */
function CalemFieldNameFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
	//Disabled fields
	this._roFields=['field_type', 'required', 'field_length', 'lookup'];
}

CalemFieldNameFormEdit.prototype = new CalemFormEdit;
CalemFieldNameFormEdit.prototype.constructor = CalemFieldNameFormEdit;

CalemFieldNameFormEdit.prototype.toString = function() { return "CalemFieldNameFormEdit";}

//Get tableId from data.
CalemFieldNameFormEdit.prototype._createDataModel =
function(data) {	
	var reg=CalemContext.getInstance().getRegistry();
	this._tableId=data.tableId;
	this._fieldTableDd = reg.getTableDd(this._tableId);
	this._rec=data.rec;
	CalemFormEdit.prototype._createDataModel.call(this, {item: this._rec});
}

// set fields being disabled
CalemFieldNameFormEdit.prototype._render =
function(skipRo) {
	CalemFormEdit.prototype._render.call(this);
	if (!skipRo) this._setFieldsReadOnly(this._roFields);
}

CalemFieldNameFormEdit.prototype.getFieldTableDd =
function() {
	return this._fieldTableDd;
}

//Do not cache this form
CalemFieldNameFormEdit.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

/**
 * Business APIs
 */
CalemFieldNameFormEdit.prototype._verifyInputBo =
function() {
	var row=this._getInputDataRow();
	return CalemFieldBo.getInstance()._verifyNameEdit(row, this._rec.id, this);
}

//Do field name change (id and oldId to decide if just name is changed).
CalemFieldNameFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow(); 
	row['field_type']=CalemViewUtil.getVtFieldTypeById(row['field_type']);
	//Change locale/length
	var lc=CalemContext.getInstance().getUserInfo().locale;
	lc=CalemViewUtil.getLocaleServer(lc);
	var col={col_0 : {id: row['id'], 
				         oldId: this._rec.id,
							tableId: this._fieldTableDd.getCustomTableName(),
	                  type: row['field_type'],
	                  length: row['field_length'],
	                  required: row['required'],
	                  label: row['field_label'],
	                  locale: lc }};	                  
	CalemSoapUtil._onSoapCall('ModifyFieldName', col, new AjxCallback(this, this._onSoapModifyFieldResponse, row));
}

//Process response from server.
CalemFieldNameFormEdit.prototype._onSoapModifyFieldResponse =
function(row, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		//Check id changes
		if (row['id']!=this._rec.id) {
			var field=CalemFieldBo.getInstance().getFieldByRow(row);
			this._fieldTableDd._replaceCustomField(this._rec.id, row['id'], field);
		}
		CalemMsg._addCustomMsg(row['id'], row['field_label']);
		
		this._closeAndResumeParentForm(new CalemReRenderAction());
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
} 
