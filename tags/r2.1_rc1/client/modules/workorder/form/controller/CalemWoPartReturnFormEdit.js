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
 * CalemWoPartReturnFormEdit
 */
function CalemWoPartReturnFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemWoPartCheckoutFormEdit.call(this, parent, formId, data);
}

CalemWoPartReturnFormEdit.prototype = new CalemWoPartCheckoutFormEdit;
CalemWoPartReturnFormEdit.prototype.constructor = CalemWoPartReturnFormEdit;

CalemWoPartReturnFormEdit.prototype.toString = function() { return "CalemWoPartReturnFormEdit";}

CalemWoPartReturnFormEdit.prototype._initData =
function(data, rec) {
	CalemWoPartCheckoutFormEdit.prototype._initData.call(this, data, rec);
	this._wopRec=data.wopRec;
	rec.getField('in_id').setRawValue(this._wopRec.getField('in_id').getRawValue());
}

CalemWoPartReturnFormEdit.prototype._initReadOnly =
function() {
	this._setFieldsReadOnly(['in_id']);
}

//Overcome where there are no changes.
CalemWoPartReturnFormEdit.prototype._getEditChanged =
function() {
	return true;
}


CalemWoPartReturnFormEdit.prototype._onSave =
function(evt) {
	var row=this._setupInputRow(row);
	row['icg_id']='icg_part';
	//Next figure out location to check out from.
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemInReturnFormList', {tranRow: row});
	this._embedForm(ebInfo);
}

//Need to check for changes.
CalemWoPartReturnFormEdit.prototype._onCancel =
function() {
	this._closeAndResumeParentForm(new CalemReloadDataAction('wo_part'));
}




