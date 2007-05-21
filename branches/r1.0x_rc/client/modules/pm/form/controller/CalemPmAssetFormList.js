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
 * CalemPmAssetFormList
 */
function CalemPmAssetFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	//Reading history and add reading listeners
	this._pmMeterScheduleListener = new AjxListener(this, this.onPmMeterSchedule);
	this._pmSeasonListener = new AjxListener(this, this.onPmSeason);
}

CalemPmAssetFormList.prototype = new CalemFormListDet;
CalemPmAssetFormList.prototype.constructor = CalemPmAssetFormList;

CalemPmAssetFormList.prototype.toString = function() { return "CalemPmAssetFormList";}

/**
 * Business APIs
 */
CalemPmAssetFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemPmAssetFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemPmAssetFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemPmAssetFormRead';
} 

/**
 * Deletion must be handled specially
 */
CalemPmAssetFormList.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemPmAssetBo.getInstance().canDeletePmAsset(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

/**
 * Reading list form
 */
CalemPmAssetFormList.prototype.getOpenPmMeterSchedule =
function() {
	return this._pmMeterScheduleListener;
} 
 
CalemPmAssetFormList.prototype.getOpenPmSeason =
function() {
	return this._pmSeasonListener;
}

//Listeners - both may need to update parent model item when operation is made.
CalemPmAssetFormList.prototype.onPmMeterSchedule =
function(evt) {
	var item=CalemEvent.getItem(evt);
	var link=new CalemFieldMdInfo('pm_asset_id', 'id');
	//To embed the reading history form.
   var ebInfo=new CalemEmbedInfo(this._parent, 'CalemPmAssetMeterFormList', {parentRec: item, link: link});
	this._embedForm(ebInfo);
}

CalemPmAssetFormList.prototype.onPmSeason =
function(evt) {	
	var item=CalemEvent.getItem(evt);
	var link=new CalemFieldMdInfo('pm_asset_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemPmAssetSeasonFormList', {parentRec: item, link: link});
	this._embedForm(ebInfo);
}
