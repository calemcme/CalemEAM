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
 * CalemBudgetTitleFormEdit
 */
function CalemBudgetTitleFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemBudgetTitleFormEdit.prototype = new CalemFormEdit;
CalemBudgetTitleFormEdit.prototype.constructor = CalemBudgetTitleFormEdit;

CalemBudgetTitleFormEdit.prototype.toString = function() { return "CalemBudgetTitleFormEdit";}

/**
 * Business APIs
 */
CalemBudgetTitleFormEdit.prototype._verifyInputBo =
function() {
   return CalemBudgetTitleBo.getInstance()._verifyDates(this._view);
}

/**
 * Deletion must be handled specially
 */
CalemBudgetTitleFormEdit.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=this._modelItem.getCurrentRecord();
	//fake an event for code-reuse
	var ev=new CalemSelectionEvent(true);
	ev.add(rec);
	var data={event: ev};
	CalemBudgetTitleBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {data: data}));
}

CalemBudgetTitleFormEdit.prototype.onDeleteBoCallback =
function(param, del) {
	if (del) CalemFormEdit.prototype.onDeleteWithData.call(this, param.data); //Continue on with default handling.
}
 
