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
 * CalemInStockSelectFormList
 */
function CalemInStockSelectFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormLookup.call(this, parent, formId, data);
}

CalemInStockSelectFormList.prototype = new CalemFormLookup;
CalemInStockSelectFormList.prototype.constructor = CalemInStockSelectFormList;

CalemInStockSelectFormList.prototype.toString = function() { return "CalemInStockSelectFormList";}

/**
 * Initialize data for the transaction
 */
CalemInStockSelectFormList.prototype._createDataModel =
function(data) {
	CalemFormLookup.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInStockSelectFormList.prototype._instantiate =
function(data) {
	this._tranRow=data.tranRow;
	this._nextFm=data.nextFm;
	var fld=new CalemDbField('in_stock', 'in_id');
	var val=new CalemDbString(this._tranRow['in_id']);
	this._dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
}

CalemInStockSelectFormList.prototype.initQueryByForm =
function(tblQuery) {
    tblQuery.addWhere(this._modelItem.getId(), null, this._dbExpr, this._modelItem.getTableDd());
	return tblQuery;
} 

/**
 * to handle select
 */
CalemInStockSelectFormList.prototype._onSelect =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	var ebInfo=new CalemEmbedInfo(this._parent, this._nextFm, {tranRow: this._tranRow, stockRec: rec});
	this._embedForm(ebInfo);
}

//Do not cache this form
CalemInStockSelectFormList.prototype.getCacheEmbedOnClose =
function() {
	return false;
}

CalemInStockSelectFormList.prototype.onInTranDoneAction =
function() {
	this._closeAndResumeParentForm(new CalemInTranDoneAction());
}
 
