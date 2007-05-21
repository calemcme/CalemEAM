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
 * CalemRcmActionFormList
 */
function CalemRcmActionFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	this._rcmViewPart = new AjxListener(this, this.onRcmViewPart);
}

CalemRcmActionFormList.prototype = new CalemFormListDet;
CalemRcmActionFormList.prototype.constructor = CalemRcmActionFormList;

CalemRcmActionFormList.prototype.toString = function() { return "CalemRcmActionFormList";}

/**
 * Business APIs
 */
CalemRcmActionFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemRcmActionFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemRcmActionFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemRcmActionFormRead';
} 

CalemRcmActionFormList.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemRcmActionBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

CalemRcmActionFormList.prototype.getRcmViewPart =
function() {
	return this._rcmViewPart;
}

CalemRcmActionFormList.prototype.onRcmViewPart =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	var link=new CalemFieldMdInfo('action_id', 'id');
	var ebInfo=new CalemEmbedInfo(this._parent, 'CalemRcmActionPartFormList', {parentRec: rec, link: link});
	this._embedForm(ebInfo);
}
