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
 * CalemWoPartFormList
 */
function CalemWoPartFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	this._woPartNew = new AjxListener(this, this.onWoPartNew);
	this._woPartAdd = new AjxListener(this, this.onWoPartAdd);
	this._woPartReturn = new AjxListener(this, this.onWoPartReturn);
}

CalemWoPartFormList.prototype = new CalemFormListDet;
CalemWoPartFormList.prototype.constructor = CalemWoPartFormList;

CalemWoPartFormList.prototype.toString = function() { return "CalemWoPartFormList";}

/**
 * Business APIs
 */
CalemWoPartFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemWoPartFormRead';
} 

/**
 * Parts checkout/return handling
 */
CalemWoPartFormList.prototype.getOpenWoPartNew =
function(evt) {
	return this._woPartNew;
} 

CalemWoPartFormList.prototype.getOpenWoPartAdd =
function(evt) {
	return this._woPartAdd;
}

CalemWoPartFormList.prototype.getOpenWoPartReturn =
function(evt) {
	return this._woPartReturn;
} 

//Handlers
CalemWoPartFormList.prototype.onWoPartNew =
function(evt) {
	if (!this._canModify()) return;
	
	var pRec=this._dataModel.getParentRec();
	this._openWoTranForm('CalemWoPartCheckoutFormEdit', {woRec: pRec});
} 

CalemWoPartFormList.prototype.onWoPartAdd =
function(evt) {
	if (!this._canModify()) return;
	
	var wopRec=CalemEvent.getItem(evt);
	var pRec=this._dataModel.getParentRec();
	this._openWoTranForm('CalemWoPartAddFormEdit', {woRec: pRec, wopRec: wopRec});
} 
CalemWoPartFormList.prototype.onWoPartReturn =
function(evt) {
	if (!this._canModify()) return;
	
	var wopRec=CalemEvent.getItem(evt);
	var pRec=this._dataModel.getParentRec();
	this._openWoTranForm('CalemWoPartReturnFormEdit', {woRec: pRec, wopRec: wopRec});
}

//Open form
CalemWoPartFormList.prototype._openWoTranForm =
function(fmId, data) {
	var ebInfo=new CalemEmbedInfo(this._parent, fmId, data);
	this._embedForm(ebInfo);
} 
 
CalemWoPartFormList.prototype.canDelete =
function() {
	return this._canModify();
} 

CalemWoPartFormList.prototype._canModify =
function() {
	var rec=this._dataModel.getParentRec();
	return CalemWoBo.getInstance().canModify(rec);
}  
