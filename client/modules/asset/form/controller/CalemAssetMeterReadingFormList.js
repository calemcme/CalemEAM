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
 * CalemAssetMeterReadingFormList
 */
function CalemAssetMeterReadingFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDetNoMd.call(this, parent, formId, data);
}

CalemAssetMeterReadingFormList.prototype = new CalemFormListDetNoMd;
CalemAssetMeterReadingFormList.prototype.constructor = CalemAssetMeterReadingFormList;

CalemAssetMeterReadingFormList.prototype.toString = function() { return "CalemAssetMeterReadingFormList";}

/**
 * Business APIs
 */
CalemAssetMeterReadingFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemAssetMeterReadingFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemAssetMeterReadingFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemAssetMeterReadingFormRead';
} 

//Close upon done.
CalemAssetMeterReadingFormList.prototype.getCacheEmbedOnClose =
function() {
	return false; 
}

//Ask meter_reading form to reload
CalemAssetMeterReadingFormList.prototype._onCancel =
function(evt) {
	this._closeAndResumeParentForm(new CalemReloadDataAction('asset_meter'));
}


