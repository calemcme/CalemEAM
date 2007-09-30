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
 * CalemDocUploadFormNew
 */
function CalemDocUploadFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
}

CalemDocUploadFormNew.prototype = new CalemFormNew;
CalemDocUploadFormNew.prototype.constructor = CalemDocUploadFormNew;

CalemDocUploadFormNew.prototype.toString = function() { return "CalemDocUploadFormNew";}

//Creating upload handler.
CalemDocUploadFormNew.prototype.setFileUploadEls =
function(params) {
	this._fileUpload=new CalemFileUpload(params);
}

//Do not cache this form
CalemDocUploadFormNew.prototype.getCacheEmbedOnClose =
function() {
	return false;
}

//Two-phase save operation.
CalemDocUploadFormNew.prototype._onSave =
function(evt) {
	var rows=this._prepareDataNew();
	var st=rows['row_0']['base']['data']['access_id'];
	var cb=new AjxCallback(this, this._onUploadCallback, rows);
	this._fileUpload.uploadFile(CalemConf['file_upload']['uploadNew'], st, cb);
} 

CalemDocUploadFormNew.prototype._onUploadCallback =
function(rows, rf) {
	rows['row_0']['base']['data']['file_upload']=rf;
	this._onSaveCall(rows);
} 

