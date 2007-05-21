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
 * CalemInReceivePoFormEdit
 */
function CalemInReceivePoFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
	//callback
	this._cacheLoadedCb=new AjxCallback(this, this.onCacheLoaded);
	this._cache=CalemContext.getInstance().getRegistry().getCache();
}

CalemInReceivePoFormEdit.prototype = new CalemFormEdit;
CalemInReceivePoFormEdit.prototype.constructor = CalemInReceivePoFormEdit;

CalemInReceivePoFormEdit.prototype.toString = function() { return "CalemInReceivePoFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemInReceivePoFormEdit.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInReceivePoFormEdit.prototype._instantiate =
function(data) {
	//Creating a record for display
	this._inRec=data.inRec;
	this._receiveType=data.type;
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	rec.getField('in_id').setRawValue(this._inRec.id);
	rec.getField('receive_type_id').setRawValue(data.type);
	rec.getField('uom_id').setRawValue(this._inRec.getField('uom_id').getRawValue());
	//Current time and users
	rec.getField('tran_time').setRawValue(CalemTextUtil.getCurrentGmt());
	rec.getField('store_user_id').setRawValue(CalemContext.getInstance().getUserId());
	//refill last tran data
	if (this._inputRow) {
		rec.getField('costcode_id').setRawValue(this._inputRow['costcode_id']);
		rec.getField('tran_user_id').setRawValue(this._inputRow['tran_user_id']);
		rec.getField('note').setRawValue(this._inputRow['note']);
	} else {
		rec.getField('costcode_id').setRawValue(this._inRec.getField('costcode_id').getRawValue());
	}
	//Force a repaint.
	this.onRecChanged();
}

CalemInReceivePoFormEdit.prototype._loadData =
function() {//Record should have been set already.
	this._cache.bulkLoadCacheForTable(this._modelItem.getId(), this._cacheLoadedCb);
} 

CalemInReceivePoFormEdit.prototype.onCacheLoaded =
function() {
	this.onDataLoaded();
} 

CalemInReceivePoFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	this._setFieldsReadOnly(['in_id', 'receive_type_id', 'uom_id']);
}

//Using save function to do transaction
CalemInReceivePoFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	this._inputRow=row;
	row['receive_type_id']=this._receiveType;
	row['qty_remaining']=Number(row['qty']);
	this._setRcf(row);
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemInReceiveStockFormList', {tranRow: row});
	this._embedForm(ebInfo);
}

CalemInReceivePoFormEdit.prototype._setRcf =
function(row) {
	row['receive_from_id']=row['po_id'];
}

//Need to check for changes.
CalemInReceivePoFormEdit.prototype._onCancel =
function() {
	this._closeAndResumeParentForm();
}  

CalemInReceivePoFormEdit.prototype.onInReceiveDoneAction =
function() {
	this._closeAndResumeParentForm(new CalemInReceiveDoneAction());
}



