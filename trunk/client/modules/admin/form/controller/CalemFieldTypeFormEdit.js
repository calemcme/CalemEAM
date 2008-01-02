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
 * CalemFieldTypeFormEdit
 */
function CalemFieldTypeFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFieldNameFormEdit.call(this, parent, formId, data);
	this._roFields=['id', 'field_label'];
}

CalemFieldTypeFormEdit.prototype = new CalemFieldNameFormEdit;
CalemFieldTypeFormEdit.prototype.constructor = CalemFieldTypeFormEdit;

CalemFieldTypeFormEdit.prototype.toString = function() { return "CalemFieldTypeFormEdit";}

// must handle focus properly.
CalemFieldTypeFormEdit.prototype._render =
function() {
	CalemFieldNameFormEdit.prototype._render.call(this, true);
	this._view.setFocus('field_length');
	this._setFieldsReadOnly(this._roFields);
}

/**
 * Business APIs
 */
CalemFieldTypeFormEdit.prototype._verifyInputBo =
function() {
	var row=this._getInputDataRow();
	return CalemFieldBo.getInstance()._verifyFieldTypeChange(row, this);
}

//Do field name change (id and oldId to decide if just name is changed).
CalemFieldTypeFormEdit.prototype._onSave =
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
	CalemSoapUtil._onSoapCall('ModifyFieldType', col, new AjxCallback(this, this._onSoapFieldTypeResponse, row));
}

//Process response from server.
CalemFieldTypeFormEdit.prototype._onSoapFieldTypeResponse =
function(row, resp) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		var field=CalemFieldBo.getInstance().getFieldByRow(row);
		this._fieldTableDd._replaceCustomField(this._rec.id, row['id'], field);
		this._closeAndResumeParentForm();
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
} 
