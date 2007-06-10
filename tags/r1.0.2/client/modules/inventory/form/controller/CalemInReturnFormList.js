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
 * CalemInReturnFormList
 */
function CalemInReturnFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
	this._inReturnListener=new AjxListener(this, this.onInReturn);
}

CalemInReturnFormList.prototype = new CalemFormListDet;
CalemInReturnFormList.prototype.constructor = CalemInReturnFormList;

CalemInReturnFormList.prototype.toString = function() { return "CalemInReturnFormList";}

CalemInReturnFormList.prototype._createDataModel =
function(data) {
	CalemFormList.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInReturnFormList.prototype._instantiate =
function(data) {
	this._tranRow=data.tranRow;
	this._initQueryExpr();
}

//To construct a query and narrow list of interest.
CalemInReturnFormList.prototype._initQueryExpr =
function() {
	this._dbExpr= new CalemExprAnd();
	//in_id and type (see in_tran index order)
	this._addExpr(this._dbExpr, 'in_id', new CalemDbString(this._tranRow['in_id']));
	this._addExpr(this._dbExpr, 'type_id', new CalemDbString('itt_checkout'));
	//checkout_to_id, checkout_type_id (see index field order on in_tran)
	this._addExpr(this._dbExpr, 'checkout_to_id', new CalemDbString(this._tranRow['checkout_to_id']));
	this._addExpr(this._dbExpr, 'checkout_type_id', new CalemDbString(this._tranRow['checkout_type_id']));
	//qty_available>0
	var fd=new CalemDbField('in_tran', 'qty_available');
	this._dbExpr.add(new CalemDbExpr(fd, CalemDbExpr.GT, new CalemDbNumber(0)));
} 

CalemInReturnFormList.prototype._addExpr =
function(andExpr, fld, val) {
	var fd=new CalemDbField('in_tran', fld);
	andExpr.add(new CalemDbExpr(fd, CalemDbExpr.EQ, val ));
}

//To construct a query and narrow list of interest.
CalemInReturnFormList.prototype.initQueryByForm =
function(tblQuery) {
    tblQuery.addWhere(this._modelItem.getId(), null, this._dbExpr, this._modelItem.getTableDd());
	return tblQuery;
} 
 

/**
 * Business API
 */
CalemInReturnFormList.prototype.getOpenInTranReturn =
function() {
	return this._inReturnListener;
}

CalemInReturnFormList.prototype.onInReturn =
function(ev) {
	var item=CalemEvent.getItem(ev); //Get the transaction record	
	var fmId=(this._tranRow['icg_id']=='icg_tool') ? 'CalemInReturnToolFormEdit' : 'CalemInReturnPartFormEdit';
	var ebInfo=new CalemEmbedInfo(this._parent, fmId, {tranRow: this._tranRow, tranRec: item});
	this._embedForm(ebInfo);
}

//Do not cache this form
CalemInReturnFormList.prototype.getCacheEmbedOnClose =
function() {
	return false;
}

