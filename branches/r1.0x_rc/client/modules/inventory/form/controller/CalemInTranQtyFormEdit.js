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
 * CalemInTranQtyFormEdit
 */
function CalemInTranQtyFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
	//callback
	this._inTranCb = new AjxCallback(this, this.onInTranCallback);
	this._cached=true;
}

CalemInTranQtyFormEdit.prototype = new CalemFormEdit;
CalemInTranQtyFormEdit.prototype.constructor = CalemInTranQtyFormEdit;

CalemInTranQtyFormEdit.prototype.toString = function() { return "CalemInTranQtyFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemInTranQtyFormEdit.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInTranQtyFormEdit.prototype._instantiate =
function(data) {
	//Creating a record for display
	this._tranRow=data.tranRow;
	this._stockRec=data.stockRec;
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	rec.getField('location_id').setRawValue(this._stockRec.getField('location_id').getRawValue());
	rec.getField('qty_remaining').setRawValue(this._tranRow['qty_remaining']);
	this._moreInstantiate();
	//Resetting validRange
	this._initValidRange();
	//Force a repaint.
	this.onRecChanged();
}

CalemInTranQtyFormEdit.prototype._moreInstantiate = 
function() {
}

CalemInTranQtyFormEdit.prototype._initValidRange =
function() {
	//Enforce qty to check out
	var min=CalemConf['in_tran_conf']['minCheckout'];
	this.setValidRange('qty', min, this._tranRow['qty_remaining']);
}  

CalemInTranQtyFormEdit.prototype._initReadOnly =
function() {
	this._setFieldsReadOnly(['qty_remaining', 'location_id']);
} 

CalemInTranQtyFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	this._initReadOnly();
	//Valid range
	this._initValidRange();
}

//Using save function to do transaction
CalemInTranQtyFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	this._tranRow['qty']=row['qty'];
	this._tranRow['location_id']=row['location_id'];
	rows={in_0: this._tranRow};
	var soapCall=this._getSoapCall();
	CalemSoapUtil._onSoapCall(soapCall, rows, this._inTranCb, null, rows);
}

/**
 * Process soap response from server
 */
CalemInTranQtyFormEdit.prototype.onInTranCallback =
function(resp, rows) {
	//This is single record so let's process it.
	var tranResp=resp[0];
	if (tranResp.status == CalemForm.SOAP_SUCC) { //Update local copy.
		this._tranRow['qty_remaining'] -= Number(this._tranRow['qty']);
		if (this._tranRow['qty_remaining'] > 0) {
			this._closeAndResumeParentForm(new CalemReloadDataAction('in_stock')); //Need to rerender form.
		} else {
			this._cached=false;
			this._closeAndResumeParentForm(this._getDoneAction()); //Need to rerender form.
		}
		
	} else { //Need to display error.
		this._showSoapError(tranResp);
	}	
}

CalemInTranQtyFormEdit.prototype._getDoneAction =
function() {
	return new CalemInReceiveDoneAction();
} 

CalemInTranQtyFormEdit.prototype._getSoapCall =
function() {
	return 'InTranReceive';
} 

//Need to check for changes.
CalemInTranQtyFormEdit.prototype._onCancel =
function() {
	this._closeAndResumeParentForm();
}  

//Do not cache this form
CalemInTranQtyFormEdit.prototype.getCacheEmbedOnClose =
function() {
	return this._cached;
}



