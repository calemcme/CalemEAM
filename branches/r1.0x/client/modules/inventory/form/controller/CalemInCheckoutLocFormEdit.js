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
 * CalemInCheckoutLocFormEdit
 */
function CalemInCheckoutLocFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
	//callback
	this._cacheLoadedCb=new AjxCallback(this, this.onCacheLoaded);
	this._inTranCb = new AjxCallback(this, this.onInTranCallback);
	this._cache=CalemContext.getInstance().getRegistry().getCache();
}

CalemInCheckoutLocFormEdit.prototype = new CalemFormEdit;
CalemInCheckoutLocFormEdit.prototype.constructor = CalemInCheckoutLocFormEdit;

CalemInCheckoutLocFormEdit.prototype.toString = function() { return "CalemInCheckoutLocFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemInCheckoutLocFormEdit.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInCheckoutLocFormEdit.prototype._instantiate =
function(data) {
	//Creating a record for display
	var stockRec=data.rec;
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	rec.getField('in_id').setRawValue(stockRec.getField('in_id').getRawValue());
	rec.getField('location_id').setRawValue(stockRec.getField('location_id').getRawValue());
	this._stockQty=  stockRec.getField('qty').getRawValue();
	rec.getField('stock_qty').setRawValue(this._stockQty);
	//Current time and users
	rec.getField('tran_time').setRawValue(CalemTextUtil.getCurrentGmt());
	rec.getField('store_user_id').setRawValue(CalemContext.getInstance().getUserId());
	//refill last tran data
	if (this._inputRow) {
		rec.getField('costcode_id').setRawValue(this._inputRow['costcode_id']);
		rec.getField('tran_user_id').setRawValue(this._inputRow['tran_user_id']);
		rec.getField('note').setRawValue(this._inputRow['note']);
	}
	//Resetting validRange
	this._initValidRange();
	//Force a repaint.
	this.onRecChanged();
}

CalemInCheckoutLocFormEdit.prototype._loadData =
function() {//Record should have been set already.
	this._cache.bulkLoadCacheForTable(this._modelItem.getId(), this._cacheLoadedCb);
} 

CalemInCheckoutLocFormEdit.prototype._initValidRange =
function() {
	//Enforce qty to check out
	var min=CalemConf['in_tran_conf']['minCheckout'];
	var max=null;
	if (!CalemConf['in_tran_conf']['allowNegativeStock']) {
		if (this._stockQty>0) max=this._stockQty;
	}
	this.setValidRange('qty', min, max);
} 

CalemInCheckoutLocFormEdit.prototype.onCacheLoaded =
function() {
	this.onDataLoaded();
} 

CalemInCheckoutLocFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	this._setFieldsReadOnly(['stock_qty']);
	//Valid range
	this._initValidRange();
}

//Lookup handling
CalemInCheckoutLocFormEdit.prototype.onLookupSelect =
function(fld, recLkup) {
	if (fld=='wo_id' || fld=='asset_id' || fld=='project_id' || fld=='user_id') {
		var costcodeId=recLkup.getField('costcode_id').getRawValue();
		var fv={id: costcodeId};
		if (costcodeId) {
			fv['value']=this._cache.findValueById({table: 'costcode', lkupField: 'costcode'}, costcodeId);
		} else {
			fv['value']='';
		}
		this.setFieldValue('costcode_id', fv);
	}
}

//Using save function to do transaction
CalemInCheckoutLocFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	var checkoutTo=row['checkout_to'];
	row['checkout_type_id']=checkoutTo.getCheckoutTypeId();
	row['checkout_to_id']=checkoutTo.getCheckoutToId();
	delete row['checkout_to'];
	var rec=this._modelItem.getCurrentRecord();
	row['in_id']=rec.getField('in_id').getRawValue();
	row['location_id']=rec.getField('location_id').getRawValue();
	this._inputRow=row;
	var rows={in_0: row};
	CalemSoapUtil._onSoapCall('InTranCheckout', rows, this._inTranCb, null, rows);
}

/**
 * Process soap response from server
 */
CalemInCheckoutLocFormEdit.prototype.onInTranCallback =
function(resp, rows) {
	//This is single record so let's process it.
	var tranResp=resp[0];
	if (tranResp.status == CalemForm.SOAP_SUCC) { //Update local copy.
		this._closeAndResumeParentForm(new CalemReloadDataAction('in_stock')); //Need to rerender form.
	} else { //Need to display error.
		this._showSoapError(tranResp);
	}	
}

//Need to check for changes.
CalemInCheckoutLocFormEdit.prototype._onCancel =
function() {
	this._closeAndResumeParentForm();
}  



