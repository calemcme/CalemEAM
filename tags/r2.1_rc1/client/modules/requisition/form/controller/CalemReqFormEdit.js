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
 * CalemReqFormEdit
 */
function CalemReqFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemReqFormEdit.prototype = new CalemFormEdit;
CalemReqFormEdit.prototype.constructor = CalemReqFormEdit;

CalemReqFormEdit.prototype.toString = function() { return "CalemReqFormEdit";}

CalemReqFormEdit.prototype._onSave =
function(evt) {
	var rows=this._prepareDataEdit();
	var baseRow=rows['row_0'].base;
	if (!CalemReqBo.getInstance().canSave(baseRow)) return;
   //Check for status change or state change
	if (!baseRow.update['status_id'] && !baseRow.update['state_id']) { //No status/state change
		this._onSaveCall(rows); //done.
	} else {//Collect status/state change note
	   var rec=this._dataModel.getCurrentRecord();
		var row=new Object();
		row['req_id']=rec.id;
		row['to_status_id']=baseRow.update['status_id'] || baseRow.current['status_id'];
		row['from_status_id']=baseRow.current['status_id'];
		row['to_state_id']=baseRow.update['state_id'] || baseRow.current['state_id'];
		row['from_state_id']=baseRow.current['state_id'];
		//Terminal state caused the state being closed.
		if (row['to_status_id']=='req_status_approved' || row['to_status_id']=='req_status_voided') {
			row['to_state_id']=='req_state_closed';
			rows['row_0'].base.update['state_id']='req_state_closed';
		}
		//Check for privilege first
		if (baseRow.update['status_id']) {
			var vParams={row_0: {req_id: rec.id, user_id: CalemContext.getInstance().getUserId(),
			         to_status_id: baseRow.update['status_id'],
			         from_status_id: baseRow.current['status_id']}};
			var cb=new AjxCallback(this, this.onVerifyReqStatusChangeCb, {row: row, parentRows: rows});
			CalemSoapUtil._onSoapCall('VerifyReqStatusChange', vParams, cb);
		} else {
			this.collectStatusChangeNote({row: row, parentRows: rows});
		}
	}
} 

CalemReqFormEdit.prototype.collectStatusChangeNote =
function(param) {
	this._openEmbedForm('CalemReqStatusLogNoteFormNew', param);
}

CalemReqFormEdit.prototype.onVerifyReqStatusChangeCb =
function(param, resp) {
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		this.collectStatusChangeNote(param);		
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

CalemReqFormEdit.prototype.onReqStatusLogNoteCollected =
function(table, statusRowInsert, reqRowUpdate) {
	var rows={UpdateData: reqRowUpdate, InsertData: statusRowInsert};
	CalemSoapUtil._onSoapCall('ModifyDataTran', rows, this._soapEditTranSaveCallback);
}