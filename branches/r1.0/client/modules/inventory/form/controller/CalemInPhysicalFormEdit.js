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
 * CalemInPhysicalFormEdit
 */
function CalemInPhysicalFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
	//callback
	this._cacheLoadedCb=new AjxCallback(this, this.onCacheLoaded);
	this._inTranCb = new AjxCallback(this, this.onInTranCallback);
	this._cache=CalemContext.getInstance().getRegistry().getCache();
}

CalemInPhysicalFormEdit.prototype = new CalemFormEdit;
CalemInPhysicalFormEdit.prototype.constructor = CalemInPhysicalFormEdit;

CalemInPhysicalFormEdit.prototype.toString = function() { return "CalemInPhysicalFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemInPhysicalFormEdit.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInPhysicalFormEdit.prototype._instantiate =
function(data) {
	//Creating a record for display
	var stockRec=data.rec;
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	rec.getField('in_id').setRawValue(stockRec.getField('in_id').getRawValue());
	rec.getField('location_id').setRawValue(stockRec.getField('location_id').getRawValue());
	rec.getField('stock_qty').setRawValue(stockRec.getField('qty').getRawValue());
	//Current time and users
	rec.getField('tran_time').setRawValue(CalemTextUtil.getCurrentGmt());
	rec.getField('store_user_id').setRawValue(CalemContext.getInstance().getUserId());
	//refill last tran data
	if (this._inputRow) {
		rec.getField('tran_user_id').setRawValue(this._inputRow['tran_user_id']);
		rec.getField('note').setRawValue(this._inputRow['note']);
	}
	//Force a repaint.
	this.onRecChanged();
}

CalemInPhysicalFormEdit.prototype._loadData =
function() {//Record should have been set already.
	this._cache.bulkLoadCacheForTable(this._modelItem.getId(), this._cacheLoadedCb);
}

CalemInPhysicalFormEdit.prototype.onCacheLoaded =
function() {
	this.onDataLoaded();
} 

CalemInPhysicalFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	this._setFieldsReadOnly(['stock_qty', 'location_id', ]);
}

//Using save function to do transaction
CalemInPhysicalFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	var rec=this._modelItem.getCurrentRecord();
	row['in_id']=rec.getField('in_id').getRawValue();
	this._inputRow=row;
	rows={in_0: row};
	CalemSoapUtil._onSoapCall('InTranPhysical', rows, this._inTranCb, null, rows);
}

/**
 * Process soap response from server
 */
CalemInPhysicalFormEdit.prototype.onInTranCallback =
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
CalemInPhysicalFormEdit.prototype._onCancel =
function() {
	this._closeAndResumeParentForm();
}  



