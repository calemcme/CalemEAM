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
 * CalemAssetFormRead
 */
function CalemAssetFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormRead.call(this, parent, formId, data);
	this._serviceLog=new AjxListener(this, this.onAssetServiceLog);
	this._activityLog=new AjxListener(this, this.onAssetActivityLog);
}

CalemAssetFormRead.prototype = new CalemFormRead;
CalemAssetFormRead.prototype.constructor = CalemAssetFormRead;

CalemAssetFormRead.prototype.toString = function() { return "CalemAssetFormRead";}

/**
 * Business APIs
 */
CalemAssetFormRead.prototype._getFormNewId =
function() {
	return 'CalemAssetFormNew';
} 

CalemAssetFormRead.prototype._getFormEditId =
function() {
	return 'CalemAssetFormEdit';
}

/**
 * Deletion must be handled specially
 */
CalemAssetFormRead.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemAssetBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

/**
 * Service log
 */
CalemAssetFormRead.prototype.getAssetServiceLog =
function() {
	return this._serviceLog;
} 

CalemAssetFormRead.prototype.onAssetServiceLog =
function() {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //not a valid record.
	
	var link=new CalemFieldMdInfo('asset_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemAssetServiceLogFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}

/**
 * Activity log
 */
CalemAssetFormRead.prototype.getAssetActivityLog =
function() {
	return this._activityLog;
} 

CalemAssetFormRead.prototype.onAssetActivityLog =
function() {
	var rec=this._dataModel.getCurrentRecord();
	if (!rec.id) return; //not a valid record.
	
	var link=new CalemFieldMdInfo('asset_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemAssetActivityLogFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}


