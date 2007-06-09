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
 * CalemBudgetFormRead
 */
function CalemBudgetFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormReadDet.call(this, parent, formId, data);
	//Update budget listener
	this._updateListener=new AjxListener(this, this.onBudgetUpdate);
	this._reopenBudget = new AjxListener(this, this.onReopenBudget);
	this._budgetStatusLog=new AjxListener(this, this.onBudgetStatusLog);
	//Update callback
	this._onBudgetUpdateCb=new AjxCallback(this, this.onBudgetUpdateCb);
}

CalemBudgetFormRead.prototype = new CalemFormReadDet;
CalemBudgetFormRead.prototype.constructor = CalemBudgetFormRead;

CalemBudgetFormRead.prototype.toString = function() { return "CalemBudgetFormRead";}

/**
 * Business APIs
 */
CalemBudgetFormRead.prototype._getFormNewId =
function() {
	return 'CalemBudgetFormNew';
} 

CalemBudgetFormRead.prototype._getFormEditId =
function() {
	return 'CalemBudgetFormEdit';
}

CalemBudgetFormRead.prototype.getBudgetUpdateListener =
function(evt) {
	return this._updateListener;
} 

CalemBudgetFormRead.prototype.onBudgetUpdate =
function(evt) {
	if (!this._canUpdate()) return;
	//Soap call to update budget
	var rec=this._dataModel.getCurrentRecord();
	var rows={row_0: {budget_id: rec.id}};
	CalemSoapUtil._onSoapCall('UpdateBudgetActual', rows, this._onBudgetUpdateCb);
} 

CalemBudgetFormRead.prototype.onBudgetUpdateCb =
function(resp) {
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		this._reLoadData(true);		
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
}

//Reopen
CalemBudgetFormRead.prototype.getReopenBudget =
function(evt) {
	return this._reopenBudget;
}

//get a change note
CalemBudgetFormRead.prototype.onReopenBudget =
function(evt) {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //Not a valid record.
	if (rec.getField('state_id').getRawValue()!='budget_state_closed') {
		CalemInfoDialog.showIt(CalemMsg.getMsg('budget_reopen_budget'),CalemMsg.getMsg('budget_reopen_not_closed'));
		return;
	}
	
	var row=new Object();
	row['budget_id']=rec.id;
	row['to_state_id']='budget_state_reopen';
	row['from_state_id']=rec.getField('state_id').getRawValue();
	this._openEmbedForm('CalemBudgetStatusLogNoteFormNew', {row: row});
} 

//reopen
CalemBudgetFormRead.prototype.onBudgetStatusLogNoteCollected =
function(table, statusRowInsert, budgetRowUpdate) {
	var budgetRows=this._getBudgetReopenRows();
	var rows={UpdateData: budgetRows, InsertData: statusRowInsert};
	CalemSoapUtil._onSoapCall('ModifyDataTran', rows, this._soapEditTranSaveCallback);
}

CalemBudgetFormRead.prototype._getBudgetReopenRows =
function() {
	var rec=this._dataModel.getCurrentRecord();
	//Now let's reopen it by a soap call.
	var tableDd=this._modelItem.getTableDd();
	//prepare current record
	var current=rec.getJsonObject();
	var cRtn=CalemViewUtil.partitionData(tableDd, current);
	//prepare status change
	var update={state_id: 'budget_state_reopen'};
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
CalemBudgetFormRead.prototype.getBudgetStatusLog =
function() {
	return this._budgetStatusLog;
} 

CalemBudgetFormRead.prototype.onBudgetStatusLog =
function() {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //not a valid record.
	
	var link=new CalemFieldMdInfo('budget_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemBudgetStatusLogFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}

/**
 * Checking for closed state before editing.
 */
CalemBudgetFormRead.prototype.canDelete =
function(evt) {
	return this._canModify();
}

CalemBudgetFormRead.prototype.canEdit =
function() {
	return this._canModify();
}  

CalemBudgetFormRead.prototype._canModify =
function() {
	var rec=this._dataModel.getCurrentRecord();
	return CalemBudgetBo.getInstance().canModify(rec);
}

CalemBudgetFormRead.prototype._canUpdate =
function() {
	var rec=this._dataModel.getCurrentRecord();
	return CalemBudgetBo.getInstance().canUpdate(rec);
}
