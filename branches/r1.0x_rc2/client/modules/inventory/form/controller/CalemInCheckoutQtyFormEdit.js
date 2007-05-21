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
 * CalemInCheckoutQtyFormEdit
 */
function CalemInCheckoutQtyFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemInTranQtyFormEdit.call(this, parent, formId, data);
}

CalemInCheckoutQtyFormEdit.prototype = new CalemInTranQtyFormEdit;
CalemInCheckoutQtyFormEdit.prototype.constructor = CalemInCheckoutQtyFormEdit;

CalemInCheckoutQtyFormEdit.prototype.toString = function() { return "CalemInCheckoutQtyFormEdit";}

CalemInCheckoutQtyFormEdit.prototype._initReadOnly =
function() {
	this._setFieldsReadOnly(['qty_remaining', 'qty_in_stock', 'location_id']);
}

CalemInCheckoutQtyFormEdit.prototype._initValidRange =
function() {
	//Enforce qty to check out
	var min=CalemConf['in_tran_conf']['minCheckout'];
	var minQ=this._tranRow['qty_remaining'];
	if (!CalemConf['in_tran_conf']['checkout']['allowNegativeStock']) {
		minQ=Math.min(minQ, this._stockRec.getField('qty').getRawValue());
	}
	this.setValidRange('qty', min, minQ);
} 

CalemInCheckoutQtyFormEdit.prototype._getSoapCall =
function() {
	return 'InTranCheckout';
} 

CalemInCheckoutQtyFormEdit.prototype._getDoneAction =
function() {
	return new CalemInTranDoneAction();
} 
 