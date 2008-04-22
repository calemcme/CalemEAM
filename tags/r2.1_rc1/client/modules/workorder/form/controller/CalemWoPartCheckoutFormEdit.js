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
 * CalemWoPartCheckoutFormEdit
 */
function CalemWoPartCheckoutFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemWoPartCheckoutFormEdit.prototype = new CalemFormEdit;
CalemWoPartCheckoutFormEdit.prototype.constructor = CalemWoPartCheckoutFormEdit;

CalemWoPartCheckoutFormEdit.prototype.toString = function() { return "CalemWoPartCheckoutFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemWoPartCheckoutFormEdit.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemWoPartCheckoutFormEdit.prototype._instantiate =
function(data) {
	//Creating a record for display
	this._woRec=data.woRec;
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	this._initData(data, rec);
	//Force a repaint.
	this.onRecChanged();
}

CalemWoPartCheckoutFormEdit.prototype._initData =
function(data, rec) {
	//Current time and users
	rec.getField('tran_time').setRawValue(CalemTextUtil.getCurrentGmt());
	rec.getField('tran_user_id').setRawValue(CalemContext.getInstance().getUserId());
	//refill last tran data
	if (this._inputRow) {
		rec.getField('tran_user_id').setRawValue(this._inputRow['tran_user_id']);
		rec.getField('store_user_id').setRawValue(this._inputRow['store_user_id']);
		rec.getField('note').setRawValue(this._inputRow['note']);
	}
}

CalemWoPartCheckoutFormEdit.prototype._render =
function() {
	CalemFormEdit.prototype._render.call(this);
	this._initReadOnly();
}

CalemWoPartCheckoutFormEdit.prototype._initReadOnly =
function() {
}

//Using save function to do transaction
CalemWoPartCheckoutFormEdit.prototype._onSave =
function(evt) {
	var row=this._setupInputRow(row);
	//Next figure out location to check out from.
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemInStockSelectFormList', {tranRow: row, nextFm: 'CalemInCheckoutQtyFormEdit'});
	this._embedForm(ebInfo);
}

CalemWoPartCheckoutFormEdit.prototype._setupInputRow =
function(row) {
	var row=this._getInputDataRow();
	//For stock receive
	row['qty_remaining']=Number(row['qty_used']);
	//Tran info from WO
	row['checkout_type_id']='ict_wo';
	row['checkout_to_id']=this._woRec.id;
	row['costcode_id']=this._woRec.getField('costcode_id').getRawValue();
	//keep track of it.
	this._inputRow=row;
	return row;
}

//Need to check for changes.
CalemWoPartCheckoutFormEdit.prototype._onCancel =
function() {
	this._closeAndResumeParentForm();
}  

CalemWoPartCheckoutFormEdit.prototype.getLookupFormByFld =
function(tbl, fld) {
	return (fld=='in_id') ? 'CalemInPartFormLookup' : null;
} 

CalemWoPartCheckoutFormEdit.prototype.onInTranDoneAction =
function() {
	this._closeAndResumeParentForm(new CalemReloadDataAction('wo_part'));
}



