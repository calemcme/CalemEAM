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
 * CalemBudgetStatusLogNoteFormNew
 */
function CalemBudgetStatusLogNoteFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
}

CalemBudgetStatusLogNoteFormNew.prototype = new CalemFormNew;
CalemBudgetStatusLogNoteFormNew.prototype.constructor = CalemBudgetStatusLogNoteFormNew;

CalemBudgetStatusLogNoteFormNew.prototype.toString = function() { return "CalemBudgetStatusLogNoteFormNew";}
 
/**
 * Initialize data for the transaction
 */
CalemBudgetStatusLogNoteFormNew.prototype._createDataModel =
function(data) {
	CalemFormNew.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemBudgetStatusLogNoteFormNew.prototype._instantiate =
function(data) {
	this._parentRows=data.parentRows;
	this._row=data.row;
}

CalemBudgetStatusLogNoteFormNew.prototype._loadData =
function() {
	this._dataModel.createNewRecord();
	var rec=this._dataModel.getCurrentRecord();
	rec.getField('changed_by_id').setRawValue(CalemContext.getInstance().getUserId());
	rec.getField('to_state_id').setRawValue(this._row['to_state_id']);
	rec.getField('from_state_id').setRawValue(this._row['from_state_id']);
	this.onDataLoaded(); //Mimic a callback so form opening can continue.
} 

CalemBudgetStatusLogNoteFormNew.prototype._render =
function() {
	CalemFormNew.prototype._render.call(this);
	this._setFieldsReadOnly(['to_state_id', 'from_state_id', 'changed_by_id']);
}

//save handling.
CalemBudgetStatusLogNoteFormNew.prototype._onSave = 
function() {
	var rows=this._prepareDataNew();
	this._closeAndResumeParentForm(new CalemBudgetStatusLogNoteCollected('budget', rows, this._parentRows));
}

CalemBudgetStatusLogNoteFormNew.prototype._getInputDataRow =
function() {
	var row=CalemFormNew.prototype._getInputDataRow.call(this);
	//add in more info
	row['budget_id']=this._row['budget_id'];
	return row;
}
//D not cache this form
CalemBudgetStatusLogNoteFormNew.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}
 