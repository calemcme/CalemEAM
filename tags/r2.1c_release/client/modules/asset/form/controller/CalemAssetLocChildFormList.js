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
 * CalemAssetLocChildFormList
 */
function CalemAssetLocChildFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDetNoMd.call(this, parent, formId, data);
	this._serviceLog=new AjxListener(this, this.onAssetServiceLog);
	this._activityLog=new AjxListener(this, this.onAssetActivityLog);
}

CalemAssetLocChildFormList.prototype = new CalemFormListDetNoMd;
CalemAssetLocChildFormList.prototype.constructor = CalemAssetLocChildFormList;

CalemAssetLocChildFormList.prototype.toString = function() { return "CalemAssetLocChildFormList";}

/**
 * Business APIs
 */
CalemAssetLocChildFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemAssetLocChildFormRead';
} 

//D not cache this form
CalemAssetLocChildFormList.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

/**
 * Service log
 */
CalemAssetLocChildFormList.prototype.getAssetServiceLog =
function() {
	return this._serviceLog;
} 

CalemAssetLocChildFormList.prototype.onAssetServiceLog =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	if (!rec.id) return; //not a valid record.
	
	var link=new CalemFieldMdInfo('asset_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemAssetServiceLogFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}

/**
 * Activity log
 */
CalemAssetLocChildFormList.prototype.getAssetActivityLog =
function() {
	return this._activityLog;
} 

CalemAssetLocChildFormList.prototype.onAssetActivityLog =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	if (!rec.id) return; //not a valid record.
	
	var link=new CalemFieldMdInfo('asset_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemAssetActivityLogFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}

