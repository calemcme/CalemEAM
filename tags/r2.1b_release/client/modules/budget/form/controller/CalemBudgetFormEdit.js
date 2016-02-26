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
 * CalemBudgetFormEdit
 */
function CalemBudgetFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemBudgetFormEdit.prototype = new CalemFormEdit;
CalemBudgetFormEdit.prototype.constructor = CalemBudgetFormEdit;

CalemBudgetFormEdit.prototype.toString = function() { return "CalemBudgetFormEdit";}

CalemBudgetFormEdit.prototype._verifyInputBo =
function() {
	return CalemBudgetTitleBo.getInstance()._verifyDates(this._view);
}

CalemBudgetFormEdit.prototype._onSave =
function(evt) {
	var rows=this._prepareDataEdit();
	var baseRow=rows['row_0'].base;
   //Check for status change or state change
	if (!baseRow.update['state_id']) { //No status/state change
		this._onSaveCall(rows); //done.
	} else {//Collect status/state change note
	   var rec=this._dataModel.getCurrentRecord();
		var row=new Object();
		row['budget_id']=rec.id;
		row['to_state_id']=baseRow.update['state_id'] || baseRow.current['state_id'];
		row['from_state_id']=baseRow.current['state_id'];
		this.collectStatusChangeNote({row: row, parentRows: rows});
	}
} 

CalemBudgetFormEdit.prototype.collectStatusChangeNote =
function(param) {
	this._openEmbedForm('CalemBudgetStatusLogNoteFormNew', param);
}

CalemBudgetFormEdit.prototype.onBudgetStatusLogNoteCollected =
function(table, statusRowInsert, budgetRowUpdate) {
	var rows={UpdateData: budgetRowUpdate, InsertData: statusRowInsert};
	CalemSoapUtil._onSoapCall('ModifyDataTran', rows, this._soapEditTranSaveCallback);
}
