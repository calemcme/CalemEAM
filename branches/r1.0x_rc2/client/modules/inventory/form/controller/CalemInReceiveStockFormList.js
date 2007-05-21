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
 * CalemInReceiveStockFormList
 */
function CalemInReceiveStockFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	//Transaction handling
	this._inTranReceiveListener = new AjxListener(this, this.onInTranReceive);
}

CalemInReceiveStockFormList.prototype = new CalemFormListDet;
CalemInReceiveStockFormList.prototype.constructor = CalemInReceiveStockFormList;

CalemInReceiveStockFormList.prototype.toString = function() { return "CalemInReceiveStockFormList";}

/**
 * Initialize data for the transaction
 */
CalemInReceiveStockFormList.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInReceiveStockFormList.prototype._instantiate =
function(data) {
	this._tranRow=data.tranRow;
	var fld=new CalemDbField('in_stock', 'in_id');
	var val=new CalemDbString(this._tranRow['in_id']);
	this._dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
}

CalemInReceiveStockFormList.prototype.initQueryByForm =
function(tblQuery) {
    tblQuery.addWhere(this._modelItem.getId(), null, this._dbExpr, this._modelItem.getTableDd());
	return tblQuery;
} 

CalemInReceiveStockFormList.prototype.getOpenInTranReceive =
function() {
	return this._inTranReceiveListener;
}

CalemInReceiveStockFormList.prototype.onInTranReceive =
function(ev) {
	var item=CalemEvent.getItem(ev);
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemInReceiveQtyFormEdit', {stockRec: item, tranRow: this._tranRow});
	this._embedForm(ebInfo);
} 

//Do not cache this form
CalemInReceiveStockFormList.prototype.getCacheEmbedOnClose =
function() {
	return false;
}

CalemInReceiveStockFormList.prototype.onInReceiveDoneAction =
function() {
	this._closeAndResumeParentForm(new CalemInReceiveDoneAction());
}


 
