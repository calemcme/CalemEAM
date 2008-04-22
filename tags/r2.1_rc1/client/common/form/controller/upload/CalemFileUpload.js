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
 * CalemFileUpload
 * This is the file upload controller. It's adapted from the smart
 * file upload code of http://www.webtoolkit.info/ajax-file-upload.html
 */
function CalemFileUpload(params) {
	this._els=params;
	this._callId='P' + Math.floor(Math.random() * 99999);
}

CalemFileUpload._SUCC='{SUCC:';

CalemFileUpload.prototype.toString = function() { return "CalemFileUpload"; }

//Service api
CalemFileUpload.prototype.uploadFile =
function(cmd, param, callback) {
	this._els['cmd'].value=cmd;
	this._els['param'].value=param;
	var cb=new AjxCallback(this, this.onUploadResponse, callback);
	this._els['iFrame']._callback=cb;
	this._setBusy();	
	this._els['form'].submit();
}

CalemFileUpload.prototype.onUploadResponse =
function(cb, resp) {
	this._clearBusy();
	if (CalemDebug.isDebug()) CalemDebug.debug("Upload resp=" + resp);
	if (resp.indexOf(CalemFileUpload._SUCC)==0) {//coming back as JSON
	   var rf=resp.substr(CalemFileUpload._SUCC.length);
		cb.run(rf);
	} else {//Other exceptions
		CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), resp);
	}
}

CalemFileUpload.prototype._setBusy =
function() {
	var shell=CalemContext.getInstance().getShell();
	shell.setBusy(true, this._callId, false, 0, null);
   shell.setBusyDialogText(CalemMsg.getMsg('upload_busy'));
}

CalemFileUpload.prototype._clearBusy =
function() {
	var shell=CalemContext.getInstance().getShell(); 
	shell.setBusy(false, this._callId);
} 

CalemFileUpload.prototype.getFileEl =
function() {
	return this._file;
}

CalemFileUpload.onFrameLoaded =
function(frameId) {
	var i = document.getElementById(frameId);
	if (i.contentDocument) {
		var d = i.contentDocument;
	} else if (i.contentWindow) {
		var d = i.contentWindow.document;
	} else {
		var d = window.frames[id].document;
	}
	if (d.location.href == "about:blank") {
		return;
	}

	if (i._callback) {
		i._callback.run(d.body.innerHTML);
		i._callback=null;
	}
}

CalemFileUpload._viewFile =
function(id) {
	window.open(calemRequestUrl+'?aid='+CalemConf['file_upload']['viewAid']+"&fid="+id);
}
