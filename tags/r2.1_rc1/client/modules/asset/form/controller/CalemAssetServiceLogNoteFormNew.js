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
 * CalemAssetServiceLogNoteFormNew
 */
function CalemAssetServiceLogNoteFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
}

CalemAssetServiceLogNoteFormNew._svcFlds=['to_status_id', 'from_status_id', 'changed_by_id', 'to_location_id', 'from_location_id',
	                                       'to_owner_id', 'from_owner_id', 'to_parent_id', 'from_parent_id', 'asset_id'];;

CalemAssetServiceLogNoteFormNew.prototype = new CalemFormNew;
CalemAssetServiceLogNoteFormNew.prototype.constructor = CalemAssetServiceLogNoteFormNew;

CalemAssetServiceLogNoteFormNew.prototype.toString = function() { return "CalemAssetServiceLogNoteFormNew";}
 
/**
 * Initialize data for the transaction
 */
CalemAssetServiceLogNoteFormNew.prototype._createDataModel =
function(data) {
	CalemFormNew.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemAssetServiceLogNoteFormNew.prototype._instantiate =
function(data) {
	this._parentRows=data.parentRows;
	this._row=data.row;
}

CalemAssetServiceLogNoteFormNew.prototype._loadData =
function() {
	this._dataModel.createNewRecord();
	var rec=this._dataModel.getCurrentRecord();
	this._row['changed_by_id']=CalemContext.getInstance().getUserId();
	//Fill-in the records
	for (var i=0; i< CalemAssetServiceLogNoteFormNew._svcFlds.length; i++) {
		var fld=CalemAssetServiceLogNoteFormNew._svcFlds[i];
		rec.getField(fld).setRawValue(this._row[fld]);
	}
	this.onDataLoaded(); //Mimic a callback so form opening can continue.
} 

CalemAssetServiceLogNoteFormNew.prototype._render =
function() {
	CalemFormNew.prototype._render.call(this);
	this._setFieldsReadOnly(['to_status_id', 'from_status_id', 'changed_by_id', 'to_location_id', 'from_location_id',
	                         'to_owner_id', 'from_owner_id', 'to_parent_id', 'from_parent_id']);
}

//save handling.
CalemAssetServiceLogNoteFormNew.prototype._onSave = 
function() {
	var rows=this._prepareDataNew();
	this._closeAndResumeParentForm(new CalemAssetServiceLogNoteCollected('asset', rows, this._parentRows));
}

CalemAssetServiceLogNoteFormNew.prototype._getInputDataRow =
function() {
	var row=CalemFormNew.prototype._getInputDataRow.call(this);
	//check for additional info
	//Fill-in the records
	for (var i=0; i< CalemAssetServiceLogNoteFormNew._svcFlds.length; i++) {
		var fld=CalemAssetServiceLogNoteFormNew._svcFlds[i];
		if (!row[fld]) row[fld]=this._row[fld];
	}
	return row;
}
//Do not cache this form
CalemAssetServiceLogNoteFormNew.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}
 