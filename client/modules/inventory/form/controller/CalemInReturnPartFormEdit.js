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
 * CalemInReturnPartFormEdit
 */
function CalemInReturnPartFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
	//callback
	this._inTranCb = new AjxCallback(this, this.onInTranCallback);
}

CalemInReturnPartFormEdit.prototype = new CalemFormEdit;
CalemInReturnPartFormEdit.prototype.constructor = CalemInReturnPartFormEdit;

CalemInReturnPartFormEdit.prototype.toString = function() { return "CalemInReturnPartFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemInReturnPartFormEdit.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInReturnPartFormEdit.prototype._instantiate =
function(data) {
	this._tranRow=data.tranRow;
	this._tranRec=data.tranRec;

	//Set up the record to collect qty to return.
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	rec.getField('qty_checked_out').setRawValue(this._tranRec.getField('qty_available').getRawValue());
	rec.getField('location_id').setRawValue(this._tranRec.getField('location_id').getRawValue());
	rec.getField('note').setRawValue(this._tranRec.getField('note').getRawValue());
	//init valid range
	this._initValidRange();
	//Force a repaint.
	this.onRecChanged();
}

CalemInReturnPartFormEdit.prototype._initValidRange =
function() {
	//Enforce qty to check out
	var min=CalemConf['in_tran_conf']['minCheckout'];
	var max=this._tranRec.getField('qty_available').getRawValue();
	this.setValidRange('qty_to_return', min, max);
} 

CalemInReturnPartFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	this._setFieldsReadOnly(['qty_checked_out', 'location_id', 'note']);
	this._initValidRange();
}

//Using save function to do transaction
CalemInReturnPartFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	var tran=new Object();
	tran['checkout_tran_id']=this._tranRec.id;
	tran['qty']=row['qty_to_return'];
	tran['location_id']=row['location_id'];
	tran['note']=this._tranRow['note'];
	tran['tran_time']=this._tranRow['tran_time'];
	tran['tran_user_id']=this._tranRow['tran_user_id'];
	tran['store_user_id']=this._tranRow['store_user_id'];
	rows={in_0: tran};
	CalemSoapUtil._onSoapCall('InTranReturn', rows, this._inTranCb, null, rows);
}

/**
 * Process soap response from server
 */
CalemInReturnPartFormEdit.prototype.onInTranCallback =
function(resp, rows) {
	//This is single record so let's process it.
	var tranResp=resp[0];
	if (tranResp.status == CalemForm.SOAP_SUCC) { //Update local copy.
		this._closeAndResumeParentForm(new CalemReloadDataAction('in_tran')); //Need to rerender form.
	} else { //Need to display error.
		this._showSoapError(tranResp);
	}	
}


