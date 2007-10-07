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
 * CalemInReceiveSelectFormEdit
 */
function CalemInReceiveSelectFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemInReceiveSelectFormEdit.prototype = new CalemFormEdit;
CalemInReceiveSelectFormEdit.prototype.constructor = CalemInReceiveSelectFormEdit;

CalemInReceiveSelectFormEdit.prototype.toString = function() { return "CalemInReceiveSelectFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemInReceiveSelectFormEdit.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInReceiveSelectFormEdit.prototype._instantiate =
function(data) {
	//Creating a record for display
	this._inRec=data.rec;
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	//refill last tran data
	if (this._inputRow) {
		rec.getField('receive_type_id').setRawValue(this._inputRow['receive_type_id']);
	} else {
		rec.getField('receive_type_id').setRawValue('irf_po');
	}
	this._saved=false;
}

//Using save function to do transaction
CalemInReceiveSelectFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	this._inputRow=row;
	var fmId= (row['receive_type_id']=='irf_po') ? 'CalemInReceivePoFormEdit' : 'CalemInReceiveOtherFormEdit';
	this._saved=true;
	var ebInfo=new CalemEmbedInfo(this._parent, fmId, {inRec: this._inRec, type: row['receive_type_id']});
	this._embedForm(ebInfo);
}

//Need to check for changes.
CalemInReceiveSelectFormEdit.prototype._onCancel =
function() {
	var action= this._saved ? (new CalemReloadDataAction('in_stock')) : null;
	this._closeAndResumeParentForm(action);
}  

CalemInReceiveSelectFormEdit.prototype.onInReceiveDoneAction =
function() {
	this._closeAndResumeParentForm(new CalemReloadDataAction('in_stock'));
}


