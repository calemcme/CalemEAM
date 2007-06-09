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
 * CalemWoFormEdit
 */
function CalemWoFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemWoFormEdit.prototype = new CalemFormEdit;
CalemWoFormEdit.prototype.constructor = CalemWoFormEdit;

CalemWoFormEdit.prototype.toString = function() { return "CalemWoFormEdit";}

CalemWoFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	this._setFieldsReadOnly(['asset_id', 'pm_id']);
}

CalemWoFormEdit.prototype._onSave =
function(evt) {
	var rows=this._prepareDataEdit();
	var baseRow=rows['row_0'].base;
	//Check for status change
	if (!baseRow.update['status_id']) { //No status change
		this._onSaveCall(rows); //done.
	} else {//Collect status note change
	   var rec=this._dataModel.getCurrentRecord();
		var row=new Object();
		row['wo_id']=rec.id;
		row['to_status_id']=baseRow.update['status_id'];
		row['from_status_id']=baseRow.current['status_id'];
		this._openEmbedForm('CalemWoStatusLogNoteFormNew', {row: row, parentRows: rows});
	}
} 

CalemWoFormEdit.prototype.onWoStatusLogNoteCollected =
function(table, statusRowInsert, woRowUpdate) {
	var rows={UpdateData: woRowUpdate, InsertData: statusRowInsert};
	CalemSoapUtil._onSoapCall('ModifyDataTran', rows, this._soapEditTranSaveCallback);
}
