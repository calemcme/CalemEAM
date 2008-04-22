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
 * CalemWoToolFormList
 */
function CalemWoToolFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	this._woToolNew = new AjxListener(this, this.onWoToolNew);
	this._woToolAdd = new AjxListener(this, this.onWoToolAdd);
	this._woToolReturn = new AjxListener(this, this.onWoToolReturn);
}

CalemWoToolFormList.prototype = new CalemFormListDet;
CalemWoToolFormList.prototype.constructor = CalemWoToolFormList;

CalemWoToolFormList.prototype.toString = function() { return "CalemWoToolFormList";}

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemWoToolFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemWoToolFormRead';
}

/**
 * Tools checkout/return handling
 */
CalemWoToolFormList.prototype.getOpenWoToolNew =
function(evt) {
	return this._woToolNew;
} 

CalemWoToolFormList.prototype.getOpenWoToolAdd =
function(evt) {
	return this._woToolAdd;
}

CalemWoToolFormList.prototype.getOpenWoToolReturn =
function(evt) {
	return this._woToolReturn;
} 

//Handlers
CalemWoToolFormList.prototype.onWoToolNew =
function(evt) {
	if (!this._canModify()) return;
	
	var pRec=this._dataModel.getParentRec();
	this._openWoTranForm('CalemWoToolCheckoutFormEdit', {woRec: pRec});
} 

CalemWoToolFormList.prototype.onWoToolAdd =
function(evt) {
	if (!this._canModify()) return;
	
	var wopRec=CalemEvent.getItem(evt);
	var pRec=this._dataModel.getParentRec();
	this._openWoTranForm('CalemWoToolAddFormEdit', {woRec: pRec, wopRec: wopRec});
} 
CalemWoToolFormList.prototype.onWoToolReturn =
function(evt) {
	if (!this._canModify()) return;
	
	var wopRec=CalemEvent.getItem(evt);
	var pRec=this._dataModel.getParentRec();
	this._openWoTranForm('CalemWoToolReturnFormEdit', {woRec: pRec, wopRec: wopRec});
}

//Open form
CalemWoToolFormList.prototype._openWoTranForm =
function(fmId, data) {
	var ebInfo=new CalemEmbedInfo(this._parent, fmId, data);
	this._embedForm(ebInfo);
}

CalemWoToolFormList.prototype.canDelete =
function() {
	return this._canModify();
}  

CalemWoToolFormList.prototype._canModify =
function() {
	var rec=this._dataModel.getParentRec();
	return CalemWoBo.getInstance().canModify(rec);
}