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
 * CalemDocUploadFormEdit
 */
function CalemDocUploadFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
}

CalemDocUploadFormEdit.prototype = new CalemFormEdit;
CalemDocUploadFormEdit.prototype.constructor = CalemDocUploadFormEdit;

CalemDocUploadFormEdit.prototype.toString = function() { return "CalemDocUploadFormEdit";}

//Creating upload handler.
CalemDocUploadFormEdit.prototype.setFileUploadEls =
function(params) {
	this._fileUpload=new CalemFileUpload(params);
}

//Do not cache this form
CalemDocUploadFormEdit.prototype.getCacheEmbedOnClose =
function() {
	return false;
}

//Two-phase save operation.
CalemDocUploadFormEdit.prototype._onSave =
function(evt) {
	var rows=this._prepareDataEdit();
	var fileUpdate=rows['row_0']['base']['update']['file_upload'];
	if (fileUpdate) {
		var stNew=rows['row_0']['base']['update']['access_id'];
		var stOld=rows['row_0']['base']['current']['access_id'];
		var st= (stNew ? stNew : stOld);
		var cb=new AjxCallback(this, this._onUploadCallback, rows);
		this._fileUpload.uploadFile(CalemConf['file_upload']['uploadEdit'], st, cb);
	} else {
		this._onSaveCall(rows);
	}
} 

CalemDocUploadFormEdit.prototype._onUploadCallback =
function(rows, rf) {
	rows['row_0']['base']['update']['file_upload']=rf;
	this._onSaveCall(rows);
} 

