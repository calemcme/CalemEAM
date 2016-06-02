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
 * CalemAssetFormEdit
 */
function CalemAssetFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemAssetFormEdit.prototype = new CalemFormEdit;
CalemAssetFormEdit.prototype.constructor = CalemAssetFormEdit;

CalemAssetFormEdit.prototype.toString = function() { return "CalemAssetFormEdit";}

/**
 * Service tracking
 */
CalemAssetFormEdit.prototype._onSave =
function(evt) {
	var rows=this._prepareDataEdit();
	var baseRow=rows['row_0'].base;
	if (CalemAssetBo.getInstance().getServiceChange(baseRow.update)) {
		var rec=this._dataModel.getCurrentRecord();
		var row=new Object();
		row['asset_id']=rec.id;
		row['to_status_id']=baseRow.update['status_id'] || baseRow.current['status_id'];
		row['from_status_id']=baseRow.current['status_id'];
		row['to_location_id']=baseRow.update['location_id'] || baseRow.current['location_id'];
		row['from_location_id']=baseRow.current['location_id'];
		row['to_parent_id']=baseRow.update['parent_id'] || baseRow.current['parent_id'];
		row['from_parent_id']=baseRow.current['parent_id'];
		row['to_owner_id']=baseRow.update['owner_id'] || baseRow.current['owner_id'];
		row['from_owner_id']=baseRow.current['owner_id'];
		this.collectStatusChangeNote({row: row, parentRows: rows});
	} else {
		this._onSaveCall(rows); //done.
	}
} 

CalemAssetFormEdit.prototype.collectStatusChangeNote =
function(param) {
	this._openEmbedForm('CalemAssetServiceLogNoteFormNew', param);
}

CalemAssetFormEdit.prototype.onAssetServiceLogNoteCollected =
function(table, statusRowInsert, reqRowUpdate) {
	var rows={UpdateData: reqRowUpdate, InsertData: statusRowInsert};
	CalemSoapUtil._onSoapCall('ModifyDataTran', rows, this._soapEditTranSaveCallback);
}
 
