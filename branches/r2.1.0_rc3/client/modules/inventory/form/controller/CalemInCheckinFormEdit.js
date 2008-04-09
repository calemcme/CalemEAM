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
 * CalemInCheckinFormEdit
 */
function CalemInCheckinFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
	//callback
	this._cacheLoadedCb=new AjxCallback(this, this.onCacheLoaded);
	this._inTranCb = new AjxCallback(this, this.onInTranCallback);
	this._cache=CalemContext.getInstance().getRegistry().getCache();
}

CalemInCheckinFormEdit.prototype = new CalemFormEdit;
CalemInCheckinFormEdit.prototype.constructor = CalemInCheckinFormEdit;

CalemInCheckinFormEdit.prototype.toString = function() { return "CalemInCheckinFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemInCheckinFormEdit.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInCheckinFormEdit.prototype._instantiate =
function(data) {
	//Creating a record for display
	var stockRec=data.rec;
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	rec.getField('in_id').setRawValue(stockRec.getField('in_id').getRawValue());
	rec.getField('location_id').setRawValue(stockRec.getField('location_id').getRawValue());
	//Current time and users
	rec.getField('tran_time').setRawValue(CalemTextUtil.getCurrentGmt());
	rec.getField('store_user_id').setRawValue(CalemContext.getInstance().getUserId());
	//refill last tran data
	if (this._inputRow) {
		rec.getField('tran_user_id').setRawValue(this._inputRow['tran_user_id']);
		rec.getField('note').setRawValue(this._inputRow['note']);
		rec.getField('costcode_id').setRawValue(this._inputRow['costcode_id']);
	}
	//Force a repaint.
	this.onRecChanged();
}

CalemInCheckinFormEdit.prototype._loadData =
function() {//Record should have been set already.
	this._cache.bulkLoadCacheForTable(this._modelItem.getId(), this._cacheLoadedCb);
}

CalemInCheckinFormEdit.prototype.onCacheLoaded =
function() {
	this.onDataLoaded();
} 

CalemInCheckinFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	this._setFieldsReadOnly(['location_id']);
}

//Using save function to do transaction
CalemInCheckinFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	var rec=this._modelItem.getCurrentRecord();
	row['in_id']=rec.getField('in_id').getRawValue();
	this._inputRow=row;
	rows={in_0: row};
	CalemSoapUtil._onSoapCall('InTranCheckin', rows, this._inTranCb, null, rows);
}

/**
 * Process soap response from server
 */
CalemInCheckinFormEdit.prototype.onInTranCallback =
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
CalemInCheckinFormEdit.prototype._onCancel =
function() {
	this._closeAndResumeParentForm();
}  



