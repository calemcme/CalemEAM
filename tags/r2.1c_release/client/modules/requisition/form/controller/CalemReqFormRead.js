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
 * CalemReqFormRead
 */
function CalemReqFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormRead.call(this, parent, formId, data);
	this._reopenReq = new AjxListener(this, this.onReopenReq);
	this._reqStatusLog=new AjxListener(this, this.onReqStatusLog);
}

CalemReqFormRead.prototype = new CalemFormRead;
CalemReqFormRead.prototype.constructor = CalemReqFormRead;

CalemReqFormRead.prototype.toString = function() { return "CalemReqFormRead";}

/**
 * Business APIs
 */
CalemReqFormRead.prototype._getFormNewId =
function() {
	return 'CalemReqFormNew';
} 

CalemReqFormRead.prototype._getFormEditId =
function() {
	return 'CalemReqFormEdit';
}

/**
 * Deletion must be handled specially
 */
CalemReqFormRead.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemReqBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

//Reopen
CalemReqFormRead.prototype.getReopenReq =
function(evt) {
	return this._reopenReq;
}

//get a change note
CalemReqFormRead.prototype.onReopenReq =
function(evt) {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //Not a valid record.
	if (rec.getField('state_id').getRawValue()!='req_state_closed') {
		CalemInfoDialog.showIt(CalemMsg.getMsg('req_reopen_req'),CalemMsg.getMsg('req_reopen_not_closed'));
		return;
	}
	
	var row=new Object();
	row['req_id']=rec.id;
	row['to_state_id']='req_state_reopen';
	row['from_state_id']=rec.getField('state_id').getRawValue();
	row['to_status_id']=rec.getField('status_id').getRawValue();
	row['from_status_id']=row['to_status_id'];
	this._openEmbedForm('CalemReqStatusLogNoteFormNew', {row: row});
} 

//reopen
CalemReqFormRead.prototype.onReqStatusLogNoteCollected =
function(table, statusRowInsert, reqRowUpdate) {
	var reqRows=this._getReqReopenRows();
	var rows={UpdateData: reqRows, InsertData: statusRowInsert};
	CalemSoapUtil._onSoapCall('ModifyDataTran', rows, this._soapEditTranSaveCallback);
}

CalemReqFormRead.prototype._getReqReopenRows =
function() {
	var rec=this._dataModel.getCurrentRecord();
	//Now let's reopen it by a soap call.
	var tableDd=this._modelItem.getTableDd();
	//prepare current record
	var current=rec.getJsonObject();
	var cRtn=CalemViewUtil.partitionData(tableDd, current);
	//prepare status change
	var update={state_id: 'req_state_reopen'};
	var uRtn=CalemViewUtil.partitionData(tableDd, update);
	//Now also create a query to get the inserted data back if successful for updating front end.
	var tq=tableDd.buildGetOneQuery();
	//Now let's make a soap call with busy signal
	var rows={row_0: {base: {table: tableDd.getTableName(), current: cRtn.base, update: uRtn.base},
	                  custom: {table: tableDd.getCustomTableName(), current: cRtn.custom, update: uRtn.custom},
	                  sql: tq.getSql()} };
	return rows;
}

/**
 * Status log
 */
CalemReqFormRead.prototype.getReqStatusLog =
function() {
	return this._reqStatusLog;
} 

CalemReqFormRead.prototype.onReqStatusLog =
function() {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //not a valid record.
	
	var link=new CalemFieldMdInfo('req_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemReqStatusLogFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}

/**
 * Checking for closed state before editing.
 */
CalemReqFormRead.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemReqBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

CalemReqFormRead.prototype.canEdit =
function() {
	return this._canModify();
}  

CalemReqFormRead.prototype._canModify =
function() {
	var rec=this._dataModel.getCurrentRecord();
	return CalemReqBo.getInstance().canModify(rec);
}

//Cached change event
CalemReqFormRead.prototype.onRecChanged =
function(ev) {
	CalemFormRead.prototype.onRecChanged.call(this, ev);
	var rec=this._modelItem.getCurrentRecord();
	var ev=new CalemParentRecModifiedEvent(this.getId(), rec);
	this.notifyListeners(ev.getType(), ev);
}

//Report
CalemReqFormRead.prototype.getReportId =
function() {
	return 'CalemReqReportMdTab';
} 

