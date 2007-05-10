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
 * CalemAssetMeterSelectFormList
 */
function CalemAssetMeterSelectFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormLookup.call(this, parent, formId, data);
}

CalemAssetMeterSelectFormList.prototype = new CalemFormLookup;
CalemAssetMeterSelectFormList.prototype.constructor = CalemAssetMeterSelectFormList;

CalemAssetMeterSelectFormList.prototype.toString = function() { return "CalemAssetMeterSelectFormList";}

CalemAssetMeterSelectFormList.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

/**
 * Initialize data for the transaction
 */
CalemAssetMeterSelectFormList.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemAssetMeterSelectFormList.prototype._instantiate =
function(data) {
	this._parentRec=data.parentRec;
	this._table=data.table;
	var fld=new CalemDbField('asset_meter', 'asset_id');
	var val=new CalemDbString(this._parentRec.getField('asset_id').getRawValue());
	this._dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
}

CalemAssetMeterSelectFormList.prototype.initQueryByForm =
function(tblQuery) {
    tblQuery.addWhere(this._modelItem.getId(), null, this._dbExpr, this._modelItem.getTableDd());
	return tblQuery;
} 

/**
 * to handle select
 */
CalemAssetMeterSelectFormList.prototype._onSelect =
function(evt) {
	var item=CalemEvent.getItem(evt);
	this._closeAndResumeParentForm(new CalemLookupSelectAction(this._table, item));
}

//Do not cache this form
CalemAssetMeterSelectFormList.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}


