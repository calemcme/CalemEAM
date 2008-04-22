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
 * CalemWoFormRead
 */
function CalemWoFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormRead.call(this, parent, formId, data);
	this._reopenWo = new AjxListener(this, this.onReopenWo);
	this._soapSaveCb = new AjxCallback(this, this.onSoapSaveCb);
	this._woStatusLog=new AjxListener(this, this.onWoStatusLog);
}

CalemWoFormRead.prototype = new CalemFormRead;
CalemWoFormRead.prototype.constructor = CalemWoFormRead;

CalemWoFormRead.prototype.toString = function() { return "CalemWoFormRead";}

CalemWoFormRead.prototype._getFormNewId =
function() {
	return 'CalemWoReqFormNew';
} 

CalemWoFormRead.prototype._getFormEditId =
function() {
	return 'CalemWoFormEdit';
}

CalemWoFormRead.prototype.getReopenWo =
function(evt) {
	return this._reopenWo;
}

//get a change note
CalemWoFormRead.prototype.onReopenWo =
function(evt) {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //Not a valid record.
	if (rec.getField('status_id').getRawValue()!='wos_closed') {
		CalemInfoDialog.showIt(CalemMsg.getMsg('wo_reopen_wo'),CalemMsg.getMsg('wo_reopen_not_closed'));
		return;
	}
	
	var row=new Object();
	row['wo_id']=rec.id;
	row['to_status_id']='wos_reopen';
	row['from_status_id']=rec.getField('status_id').getRawValue();
	this._openEmbedForm('CalemWoStatusLogNoteFormNew', {row: row});
} 

CalemWoFormRead.prototype.onWoStatusLogNoteCollected =
function(table, statusRowInsert, woRowUpdate) {
	var woRows=this._getWoReopenRows();
	var rows={UpdateData: woRows, InsertData: statusRowInsert};
	CalemSoapUtil._onSoapCall('ModifyDataTran', rows, this._soapEditTranSaveCallback);
}

CalemWoFormRead.prototype._getWoReopenRows =
function() {
	var rec=this._dataModel.getCurrentRecord();
	//Now let's reopen it by a soap call.
	var tableDd=this._modelItem.getTableDd();
	//prepare current record
	var current=rec.getJsonObject();
	var cRtn=CalemViewUtil.partitionData(tableDd, current);
	//prepare status change
	var update={status_id: 'wos_reopen'};
	var uRtn=CalemViewUtil.partitionData(tableDd, update);
	//Now also create a query to get the inserted data back if successful for updating front end.
	var tq=tableDd.buildGetOneQuery();
	//Now let's make a soap call with busy signal
	var rows={row_0: {base: {table: tableDd.getTableName(), current: cRtn.base, update: uRtn.base},
	                  custom: {table: tableDd.getCustomTableName(), current: cRtn.custom, update: uRtn.custom},
	                  sql: tq.getSql()} };
	return rows;
}

CalemWoFormRead.prototype.onUpdateDbRecAction =
function(table, rec) {
	CalemFormRead.prototype.onUpdateDbRecAction.call(this, table, rec);
	var ev=new CalemParentRecModifiedEvent(this.getId(), rec);
	this.notifyListeners(ev.getType(), ev);
}

/**
 * Deletion must be handled specially
 */
CalemWoFormRead.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemWoBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

CalemWoFormRead.prototype.canEdit =
function() {
	return this._canModify();
}  

CalemWoFormRead.prototype._canModify =
function() {
	var rec=this._dataModel.getCurrentRecord();
	return CalemWoBo.getInstance().canModify(rec);
} 

/**
 * Status log
 */
CalemWoFormRead.prototype.getWoStatusLog =
function() {
	return this._woStatusLog;
} 

CalemWoFormRead.prototype.onWoStatusLog =
function() {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //not a valid record.
	
	var link=new CalemFieldMdInfo('wo_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemWoStatusLogFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}

//Report
CalemWoFormRead.prototype.getReportId =
function() {
	return 'CalemWoReportMdTab';
} 
