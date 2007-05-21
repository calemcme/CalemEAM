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
 * CalemEditText
 * This is the edit text adapted from DwtInput's text area implementation so the cols can be set and alignment with other
 * input fields are kept.
 */
function CalemEditText(params) {
	if (arguments.length==0) return;
	this._origClassName = params.className ? params.className : "DwtInputField";
	this._errorClassName = this._origClassName + "-Error";
	DwtControl.call(this, params.parent, params.className, params.posStyle);

	this._type = params.type ? params.type : DwtInputField.STRING;
	this._errorIconStyle = params.errorIconStyle ? params.errorIconStyle :
							params.validator ? DwtInputField.ERROR_ICON_RIGHT : DwtInputField.ERROR_ICON_NONE;
	this._validationStyle = params.validationStyle ? params.validationStyle : DwtInputField.ONEXIT_VALIDATION;

	var inputFieldId = Dwt.getNextId();
	var errorIconId = Dwt.getNextId();
	var htmlEl = this.getHtmlElement();
	htmlEl.innerHTML=["<table cellspacing='0' cellpadding='0'><tr>", 
	           "<td style='padding-right:2px;'id='", errorIconId, "'></td>",
	           "<td><textarea id='", inputFieldId, "' rows=", params.rows, " cols=", params.size, "></textarea></td>",
	           "</tr></table>"].join('');
	if (this._errorIconStyle != DwtInputField.ERROR_ICON_NONE) {
		this._errorIconTd = document.getElementById(errorIconId);
		this._errorIconTd.vAlign = "middle";
		this._errorIconTd.innerHTML = DwtInputField._NOERROR_ICON_HTML;
	}


	this._inputField = document.getElementById(inputFieldId);
	Dwt.associateElementWithObject(this._inputField, this);

	this._inputField.onkeyup = DwtInputField._keyUpHdlr;
	this._inputField.onblur = DwtInputField._blurHdlr;
	//Handle text field length using keypress
	this._inputField.onkeypress = CalemEditText._keyPressHdlr;

	if (params.maxLen)
		this._inputField.maxLength = this._maxLen = params.maxLen;

	this.setCursor("default");

	this._inputField.value = params.initialValue || "";

	this.setValidatorFunction(params.validatorCtxtObj, params.validator);
	this._setMouseEventHdlrs(false);
	this._setKeyPressEventHdlr(false);
} 

CalemEditText.prototype = new CalemInputField;
CalemEditText.prototype.constructor = CalemEditText;

CalemEditText.prototype.toString = function() { return "CalemEditText"; }

CalemEditText.prototype.setReadOnly = 
function() { 
	this._inputField.disable();
}

/**
 * Use key up handler to decide if a key can be handled
 */
CalemEditText._keyPressHdlr =
function(ev) { 
   var keyEv = DwtShell.keyEvent;
	keyEv.setFromDhtmlEvent(ev);

	var obj = keyEv.dwtObj;
	if (obj && !obj._maxLen) return true;
	var charCode = keyEv.charCode;

	if (((charCode == 0x0D) || (charCode >=0x20 && charCode <= 0x7E))
	            && keyEv.target.value.length >= obj._maxLen) return false;
	return true;
}

	 
