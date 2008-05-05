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
 * CalemDocAttachmentFormList
 */
function CalemDocAttachmentFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	this._viewListener = new AjxListener(this, this.onViewAttachment);
}

CalemDocAttachmentFormList.prototype = new CalemFormListDet;
CalemDocAttachmentFormList.prototype.constructor = CalemDocAttachmentFormList;

CalemDocAttachmentFormList.prototype.toString = function() { return "CalemDocAttachmentFormList";}

/**
 * Business APIs
 */
CalemDocAttachmentFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemDocAttachmentFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemDocAttachmentFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemDocAttachmentFormRead';
} 

//Event handlers
CalemDocAttachmentFormList.prototype.getAttachmentViewListener =
function() {
	return this._viewListener;
} 

CalemDocAttachmentFormList.prototype.onViewAttachment =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	var id=rec.getField('upload_id').getRawValue();
	CalemFileUpload._viewFile(id);
}
