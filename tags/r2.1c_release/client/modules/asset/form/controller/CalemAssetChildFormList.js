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
 * CalemAssetChildFormList
 */
function CalemAssetChildFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDetNoMd.call(this, parent, formId, data);
	this._serviceLog=new AjxListener(this, this.onAssetServiceLog);
	this._activityLog=new AjxListener(this, this.onAssetActivityLog);
}

CalemAssetChildFormList.prototype = new CalemFormListDetNoMd;
CalemAssetChildFormList.prototype.constructor = CalemAssetChildFormList;

CalemAssetChildFormList.prototype.toString = function() { return "CalemAssetChildFormList";}

/**
 * Business APIs
 */
CalemAssetChildFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemAssetChildFormRead';
} 

//D not cache this form
CalemAssetChildFormList.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

/**
 * Service log
 */
CalemAssetChildFormList.prototype.getAssetServiceLog =
function() {
	return this._serviceLog;
} 

CalemAssetChildFormList.prototype.onAssetServiceLog =
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
CalemAssetChildFormList.prototype.getAssetActivityLog =
function() {
	return this._activityLog;
} 

CalemAssetChildFormList.prototype.onAssetActivityLog =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	if (!rec.id) return; //not a valid record.
	
	var link=new CalemFieldMdInfo('asset_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemAssetActivityLogFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}
