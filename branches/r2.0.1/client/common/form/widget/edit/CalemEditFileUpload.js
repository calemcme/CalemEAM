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
 * CalemEditFileUpload
 * This is the edit text adapted from DwtInput's text area implementation so the cols can be set and alignment with other
 * input fields are kept.
 */
function CalemEditFileUpload(params) {
	if (arguments.length==0) return;
	this._origClassName = params.className ? params.className : "DwtInputField";
	this._errorClassName = this._origClassName + "-Error";
	DwtControl.call(this, params.parent, params.className, params.posStyle);

	this._type = params.type ? params.type : DwtInputField.STRING;
	this._errorIconStyle = params.errorIconStyle ? params.errorIconStyle :
							params.validator ? DwtInputField.ERROR_ICON_RIGHT : DwtInputField.ERROR_ICON_NONE;
	this._validationStyle = params.validationStyle ? params.validationStyle : DwtInputField.ONEXIT_VALIDATION;

	var errorIconId = Dwt.getNextId();
	//For upload use
	var iFrameId=Dwt.getNextId();
	var fmId=Dwt.getNextId();
	var fileId=Dwt.getNextId();
	var cmdId=Dwt.getNextId();
	var paramId=Dwt.getNextId();
	var htmlEl = this.getHtmlElement();
	
	//iframe
	var ifDiv = document.createElement('DIV');
	ifDiv.innerHTML = '<iframe style="display:none" src="about:blank" id="'+iFrameId+'" name="'+iFrameId+'" onload="CalemFileUpload.onFrameLoaded(\''+iFrameId+'\')"></iframe>';
	htmlEl.appendChild(ifDiv);
	var iFrame=document.getElementById(iFrameId);
	//form
	var fmDiv = document.createElement('DIV');
	fmDiv.innerHTML = ['<form id="', fmId, '" enctype="multipart/form-data" ',
						' target="', iFrameId, '" action="', calemRequestUrl, '" method="POST"> ',
						'<input type="hidden" name="aid" value="', CalemConf['file_upload']['uploadAid'], '" /> ',
						'<input type="hidden" name="cmd" id="', cmdId, '" /> ',
						'<input type="hidden" name="param" id="', paramId, '" /> ',
						"<table cellspacing='0' cellpadding='0'><tr>", 
	           		"<td style='padding-right:2px;'id='", errorIconId, "'></td>",
	           		'<td><input type="file" name="file_upload" id="', fileId, '" size=', CalemConf['file_upload']['size'], '/></td>',
	           		'</tr></table></form>'].join('');						
	htmlEl.appendChild(fmDiv);
	fmEl=document.getElementById(fmId);
	this._inputField=document.getElementById(fileId);
	cmdEl=document.getElementById(cmdId);
	paramEl=document.getElementById(paramId);
	//Provide all the info to the controller
	params.controller.setFileUploadEls({'iFrame': iFrame, 'form': fmEl, cmd: cmdEl, param: paramEl});
	
	if (this._errorIconStyle != DwtInputField.ERROR_ICON_NONE) {
		this._errorIconTd = document.getElementById(errorIconId);
		this._errorIconTd.vAlign = "middle";
		this._errorIconTd.innerHTML = DwtInputField._NOERROR_ICON_HTML;
	}

	Dwt.associateElementWithObject(this._inputField, this);

	this._inputField.onkeyup = CalemEditFileUpload._keyUpHdlr;
	this._inputField.onblur = CalemEditFileUpload._blurHdlr;

	if (params.maxLen)
		this._inputField.maxLength = this._maxLen = params.maxLen;

	this.setCursor("default");

	this.setValidatorFunction(params.validatorCtxtObj, params.validator);
	this._setMouseEventHdlrs(false);
	this._setKeyPressEventHdlr(false);
} 

CalemEditFileUpload.prototype = new CalemInputField;
CalemEditFileUpload.prototype.constructor = CalemEditFileUpload;

CalemEditFileUpload.prototype.toString = function() { return "CalemEditFileUpload"; }

CalemEditFileUpload.prototype.validate =
function() {
	return true;
};

CalemEditFileUpload._blurHdlr =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (obj && obj._validationStyle == DwtInputField.ONEXIT_VALIDATION) {
		obj._validateInput(obj._inputField.value);
	}
};

CalemEditFileUpload._keyUpHdlr =
function(ev) {
	var keyEv = DwtShell.keyEvent;
	keyEv.setFromDhtmlEvent(ev);

	var obj = keyEv.dwtObj;
	var keyCode = keyEv.keyCode;

	// Force input handling since FF does not handle mouse properly.
	if (AjxEnv.isFirefox) {
		obj._validateInput(keyEv.target.value);
	}

	return true;
};