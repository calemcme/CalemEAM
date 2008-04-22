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
 * CalemWoMeterFormList
 */
function CalemWoMeterFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	this._woMeterNew = new AjxListener(this, this.onWoMeterNew);
	this._woMeterAdd = new AjxListener(this, this.onWoMeterAdd);
	this._woMeterHistory = new AjxListener(this, this.onWoMeterHistory);
	this._soapSaveCb = new AjxCallback(this, this.onSoapSaveCb);
}

CalemWoMeterFormList.prototype = new CalemFormListDet;
CalemWoMeterFormList.prototype.constructor = CalemWoMeterFormList;

CalemWoMeterFormList.prototype.toString = function() { return "CalemWoMeterFormList";}

/**
 * Business APIs
 */
CalemWoMeterFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemWoMeterFormRead';
} 

CalemWoMeterFormList.prototype.getOpenWoMeterNew =
function(evt) {
	return this._woMeterNew;
} 

CalemWoMeterFormList.prototype.getOpenWoMeterAdd =
function(evt) {
	return this._woMeterAdd;
} 

CalemWoMeterFormList.prototype.getOpenWoMeterHistory =
function(evt) {
	return this._woMeterHistory;
} 

CalemWoMeterFormList.prototype.onWoMeterNew =
function(evt) {
	if (!this._canModify()) return;
	
	var rec=this._dataModel.getParentRec();
	this._openWoMeterForm('CalemAssetMeterSelectFormList', {parentRec: rec, table: 'wo_meter'});
} 

CalemWoMeterFormList.prototype.onWoMeterAdd =
function(evt) {
	if (!this._canModify()) return;
	
	var item=CalemEvent.getItem(evt);
	var row=new Object();
	row['wo_id']=item.getField('wo_id').getRawValue();
	row['meter_id']=item.getField('meter_id').getRawValue();
	this._openWoMeterForm('CalemWoMeterAddReadingFormNew', {parentRow: row});
} 

CalemWoMeterFormList.prototype.onWoMeterHistory =
function(evt) {
	var rec=this._dataModel.getParentRec();
	this._openWoMeterForm('CalemWoMeterReadingFormList', {woRec: rec});
} 

//Open form
CalemWoMeterFormList.prototype._openWoMeterForm =
function(fmId, data) {
	var ebInfo=new CalemEmbedInfo(this._parent, fmId, data);
	this._embedForm(ebInfo);
} 

//Save a meter record first.
CalemWoMeterFormList.prototype.onLookupSelectAction =
function(table, rec) {
	var row=new Object();
	var parentRec=this._dataModel.getParentRec();
	row['wo_id']=parentRec.id;
	row['meter_id']=rec.id;
	//Now also create a query to get the inserted data back if successful for updating front end.
	var tableDd=this._modelItem.getTableDd();
	var tq=tableDd.buildGetOneQuery();
	//split into base and custom so custom fields can be handled properly.
	var rtn=CalemViewUtil.partitionData(tableDd, row);
	var cTable= (tableDd.getCustomFields() ? tableDd.getCustomTableName() : null);
	//Now let's make a soap call with busy signal
	var rows={row_0: { base: { table: tableDd.getTableName(), data: rtn.base},
	                   custom: {table: cTable, data: rtn.custom}, 
	                   sql: tq.getSql()}};
	CalemSoapUtil._onSoapCall('InsertData', rows, this._soapSaveCb, null, row);
} 

CalemWoMeterFormList.prototype.onSoapSaveCb =
function(resp, row) {
	//This is single record so let's process it.
	var rowResp=resp[0];
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		//Continue on to add reading.
		this._openWoMeterForm('CalemWoMeterAddReadingFormNew', {parentRow: row});
	} else { //Need to display error.
		this._onSoapResponseException(rowResp);
	}
} 

CalemWoMeterFormList.prototype.canDelete =
function() {
	return this._canModify();
}  

CalemWoMeterFormList.prototype._canModify =
function() {
	var rec=this._dataModel.getParentRec();
	return CalemWoBo.getInstance().canModify(rec);
}  
		
