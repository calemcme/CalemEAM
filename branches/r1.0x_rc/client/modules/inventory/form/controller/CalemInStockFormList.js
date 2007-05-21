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
 * CalemInStockFormList
 */
function CalemInStockFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	//Transaction handling
	this._inCheckoutListener = new AjxListener(this, this.onInCheckout);
	this._inReturnListener = new AjxListener(this, this.onInReturn);
	this._inMoveListener = new AjxListener(this, this.onInMove);
	this._inPhysicalListener = new AjxListener(this, this.onInPhysical);
	this._inReceiveListener = new AjxListener(this, this.onInReceive);
	this._inCheckinListener = new AjxListener(this, this.onInCheckin);
}

CalemInStockFormList.prototype = new CalemFormListDet;
CalemInStockFormList.prototype.constructor = CalemInStockFormList;

CalemInStockFormList.prototype.toString = function() { return "CalemInStockFormList";}

/**
 * Business APIs
 */
CalemInStockFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemInStockFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemInStockFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemInStockFormRead';
} 

/**
 * Transaction handling.
 */
CalemInStockFormList.prototype.getOpenInCheckout =
function() {
	return this._inCheckoutListener;
} 

CalemInStockFormList.prototype.getOpenInReturn =
function() {
	return this._inReturnListener;
} 
 
CalemInStockFormList.prototype.getOpenInPhysical =
function() {
	return this._inPhysicalListener;
} 

CalemInStockFormList.prototype.getOpenInMove =
function() {
	return this._inMoveListener;
} 

CalemInStockFormList.prototype.getOpenInReceive =
function() {
	return this._inReceiveListener;
} 

CalemInStockFormList.prototype.getOpenInCheckin =
function() {
	return this._inCheckinListener;
}  

//Listeners
CalemInStockFormList.prototype.onInCheckout =
function(ev) {
	var item=CalemEvent.getItem(ev);
	if (CalemInTranBo.getInstance().canCheckout(item.getField('qty').getRawValue())) {
		this._openInTranForm(item, 'CalemInCheckoutLocFormEdit');
	}
} 

CalemInStockFormList.prototype.onInReturn =
function(ev) {
	var rec=this._dataModel.getParentRec();
	if (!rec) return;
	this._openInTranForm(rec, 'CalemInReturnCheckoutToFormEdit');
}

CalemInStockFormList.prototype.onInPhysical =
function(ev) {
	var item=CalemEvent.getItem(ev);
	this._openInTranForm(item, 'CalemInPhysicalFormEdit');
}

CalemInStockFormList.prototype.onInMove =
function(ev) {
	var item=CalemEvent.getItem(ev);
	if (CalemInTranBo.getInstance().canMove(item.getField('qty').getRawValue())) {
		this._openInTranForm(item, 'CalemInMoveFormEdit');
	}
}

CalemInStockFormList.prototype.onInReceive =
function(ev) {
	var rec=this._dataModel.getParentRec();
	if (!rec) return;
	this._openInTranForm(rec, 'CalemInReceiveSelectFormEdit');
}

CalemInStockFormList.prototype.onInCheckin =
function(ev) {
	var item=CalemEvent.getItem(ev);
	this._openInTranForm(item, 'CalemInCheckinFormEdit');
}

//Open form
CalemInStockFormList.prototype._openInTranForm =
function(item, fmId) {
	var ebInfo=new CalemEmbedInfo(this._parent, fmId, {rec: item});
	this._embedForm(ebInfo);
} 


 
