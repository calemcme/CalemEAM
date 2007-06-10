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
 * CalemInGenOrderFormNew
 */
function CalemInGenOrderFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
}

CalemInGenOrderFormNew.prototype = new CalemFormNew;
CalemInGenOrderFormNew.prototype.constructor = CalemInGenOrderFormNew;

CalemInGenOrderFormNew.prototype.toString = function() { return "CalemInGenOrderFormNew";}
 
/**
 * Initialize data for the transaction
 */
CalemInGenOrderFormNew.prototype._createDataModel =
function(data) {
	CalemFormNew.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemInGenOrderFormNew.prototype._instantiate =
function(data) {
	this._inRow=data.row;
}

CalemInGenOrderFormNew.prototype._loadData =
function() {
	this._dataModel.createNewRecord();
	var rec=this._dataModel.getCurrentRecord();
	rec.getField('request_user_id').setRawValue(CalemContext.getInstance().getUserId());
	this.onDataLoaded(); //Mimic a callback so form opening can continue.
} 

//save handling.
CalemInGenOrderFormNew.prototype._onSave = 
function() {
	var reqRow=this._getInputDataRow();
	this._closeAndResumeParentForm(new CalemInGenOrderReqInfoCollected('inventory', reqRow, this._inRow));
}
//D not cache this form
CalemInGenOrderFormNew.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}
 