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
 * CalemInReturnCheckoutToFormEdit
 */
function CalemInReturnCheckoutToFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
	//callback
	this._cacheLoadedCb=new AjxCallback(this, this.onCacheLoaded);
	this._inTranCb = new AjxCallback(this, this.onInTranCallback);
	this._cache=CalemContext.getInstance().getRegistry().getCache();
}

CalemInReturnCheckoutToFormEdit.prototype = new CalemFormEdit;
CalemInReturnCheckoutToFormEdit.prototype.constructor = CalemInReturnCheckoutToFormEdit;

CalemInReturnCheckoutToFormEdit.prototype.toString = function() { return "CalemInReturnCheckoutToFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemInReturnCheckoutToFormEdit.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInReturnCheckoutToFormEdit.prototype._instantiate =
function(data) {
	this._inRec=data.rec;
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	rec.getField('in_id').setRawValue(this._inRec.id);
	//Current time and users
	rec.getField('tran_time').setRawValue(CalemTextUtil.getCurrentGmt());
	rec.getField('store_user_id').setRawValue(CalemContext.getInstance().getUserId());
	this._saved=false;
	//Force a repaint.
	this.onRecChanged();
}

CalemInReturnCheckoutToFormEdit.prototype._loadData =
function() {//Record should have been set already.
	this._cache.bulkLoadCacheForTable(this._modelItem.getId(), this._cacheLoadedCb);
} 

CalemInReturnCheckoutToFormEdit.prototype.onCacheLoaded =
function() {
	this.onDataLoaded();
}

//Using save function to do transaction
CalemInReturnCheckoutToFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	var checkoutTo=row['checkout_to'];
	row['checkout_type_id']=checkoutTo.getCheckoutTypeId();
	row['checkout_to_id']=checkoutTo.getCheckoutToId();
	//Copy info from IN
	row['icg_id']=this._inRec.getField('category_id').getRawValue();
	row['rent_uom_id']=this._inRec.getField('rent_uom_id').getRawValue();
	row['rent_rate']=this._inRec.getField('rent_rate').getRawValue();
	
	delete row['checkout_to'];
	this._inputRow=row;
	var rec=this._modelItem.getCurrentRecord();
	row['in_id']=rec.getField('in_id').getRawValue();
	//Now query db and find out all about the check out transactions to the CheckoutTo
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemInReturnFormList', {tranRow: row});
	this._embedForm(ebInfo);
	this._saved=true;
}

//Need to check for changes.
CalemInReturnCheckoutToFormEdit.prototype._onCancel =
function() {
	var action= this._saved ? (new CalemReloadDataAction('in_stock')) : null;
	this._closeAndResumeParentForm(action);
}  
