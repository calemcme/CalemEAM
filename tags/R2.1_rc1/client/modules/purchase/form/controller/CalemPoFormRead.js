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
 * CalemPoFormRead
 */
function CalemPoFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormRead.call(this, parent, formId, data);
	this._reopenPo = new AjxListener(this, this.onReopenPo);
	this._poStatusLog=new AjxListener(this, this.onPoStatusLog);
}

CalemPoFormRead.prototype = new CalemFormRead;
CalemPoFormRead.prototype.constructor = CalemPoFormRead;

CalemPoFormRead.prototype.toString = function() { return "CalemPoFormRead";}

/**
 * Business APIs
 */
CalemPoFormRead.prototype._getFormNewId =
function() {
	return 'CalemPoFormNew';
} 

CalemPoFormRead.prototype._getFormEditId =
function() {
	return 'CalemPoFormEdit';
}

/**
 * Deletion must be handled specially
 */
CalemPoFormRead.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemPoBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

//Reopen
CalemPoFormRead.prototype.getReopenPo =
function(evt) {
	return this._reopenPo;
}

//get a change note
CalemPoFormRead.prototype.onReopenPo =
function(evt) {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //Not a valid record.
	if (rec.getField('state_id').getRawValue()!='po_state_closed') {
		CalemInfoDialog.showIt(CalemMsg.getMsg('po_reopen_po'),CalemMsg.getMsg('po_reopen_not_closed'));
		return;
	}
	
	var row=new Object();
	row['po_id']=rec.id;
	row['to_state_id']='po_state_reopen';
	row['from_state_id']=rec.getField('state_id').getRawValue();
	row['to_status_id']=rec.getField('status_id').getRawValue();
	row['from_status_id']=row['to_status_id'];
	this._openEmbedForm('CalemPoStatusLogNoteFormNew', {row: row});
} 

//reopen
CalemPoFormRead.prototype.onPoStatusLogNoteCollected =
function(table, statusRowInsert, poRowUpdate) {
	var poRows=this._getPoReopenRows();
	var rows={UpdateData: poRows, InsertData: statusRowInsert};
	CalemSoapUtil._onSoapCall('ModifyDataTran', rows, this._soapEditTranSaveCallback);
}

CalemPoFormRead.prototype._getPoReopenRows =
function() {
	var rec=this._dataModel.getCurrentRecord();
	//Now let's reopen it by a soap call.
	var tableDd=this._modelItem.getTableDd();
	//prepare current record
	var current=rec.getJsonObject();
	var cRtn=CalemViewUtil.partitionData(tableDd, current);
	//prepare status change
	var update={state_id: 'po_state_reopen'};
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
CalemPoFormRead.prototype.getPoStatusLog =
function() {
	return this._poStatusLog;
} 

CalemPoFormRead.prototype.onPoStatusLog =
function() {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //not a valid record.
	
	var link=new CalemFieldMdInfo('po_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemPoStatusLogFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}

/**
 * Checking for closed state before editing.
 */
CalemPoFormRead.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemPoBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

CalemPoFormRead.prototype.canEdit =
function() {
	return this._canModify();
}  

CalemPoFormRead.prototype._canModify =
function() {
	var rec=this._dataModel.getCurrentRecord();
	return CalemPoBo.getInstance().canModify(rec);
}

//Cached change event
CalemPoFormRead.prototype.onRecChanged =
function(ev) {
	CalemFormRead.prototype.onRecChanged.call(this, ev);
	var rec=this._modelItem.getCurrentRecord();
	var ev=new CalemParentRecModifiedEvent(this.getId(), rec);
	this.notifyListeners(ev.getType(), ev);
}

//Report
CalemPoFormRead.prototype.getReportId =
function() {
	return 'CalemPoReportMdTab';
} 

