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
 * CalemEditBoolean
 * This is the Boolean control.
 */
function CalemEditBoolean(parent) {
	if (arguments.length==0) return;
	DwtControl.call(this, parent);
	//Prepare the values from the value
	this._initControl();
}

CalemEditBoolean.prototype = new DwtControl;
CalemEditBoolean.prototype.constructor = CalemEditBoolean;

CalemEditBoolean.prototype.toString = function() {return "CalemEditBoolean";}

//Relayout so it's aligned and error flag.
CalemEditBoolean.prototype._initControl =
function() {
	var inputId = Dwt.getNextId();
	var errorIconId = Dwt.getNextId();
	var el = this.getHtmlElement();
	el.innerHTML=["<table cellspacing='0' cellpadding='0'><tr>", 
	           "<td style='padding-right:2px;'id='", errorIconId, "'></td>",
	           "<td><input type='checkbox' id=", inputId, " class=CalemEditCheckbox></td>",
	           "</tr></table>"].join('');
	this._inputField=document.getElementById(inputId);
	this._inputField.onclick = CalemEditBoolean._onClick;
	//Init error icon to none.
	this._errorIconTd = document.getElementById(errorIconId);
	this._errorIconTd.vAlign = "middle";
	this._errorIconTd.innerHTML = DwtInputField._NOERROR_ICON_HTML;
	this._readonly=false;
}
/**
 * Control interfaces with render.
 */
CalemEditBoolean.prototype.setFieldInfo =
function(info) {
	this._fieldInfo=info;
}

CalemEditBoolean.prototype.getFieldInfo =
function() {
	return this._fieldInfo;
}

CalemEditBoolean.prototype.setReadOnly =
function() {
	this._readonly=true;
}

//Validation callback
CalemEditBoolean.prototype.setValidationCallback =
function(vcCallback) {
	this._vcCallback=vcCallback; //Need this so we can report a change.
}

//Only string type
CalemEditBoolean.prototype.getFieldValue =
function() {
	return (this._inputField.checked ? 1 : 0);
} 

//Only string type
CalemEditBoolean.prototype.getEditFieldServerValue =
function() {
	return this.getFieldValue(); //This is only for string type.
} 


CalemEditBoolean.prototype.setFieldError =
function(errMsg) {
	//No errors for this field
} 

CalemEditBoolean.prototype._clearFieldError =
function() {
  //no action.
}

CalemEditBoolean.prototype.setValue =
function(value, noValidation) {
	if (noValidation) {//do not fire event.
		var backup=this._vcCallback;
		this._vcCallback=null;
		this._inputField.checked= value ? true : false;
		this._vcCallback=backup;
	} else {
		this._inputField.checked= value ? true : false;
	}
	this._value=this._inputField.checked;
}

CalemEditBoolean.prototype.setController =
function(controller) {
	this._controller=controller;
}

//Focus method
CalemEditBoolean.prototype.focus =
function() {
	this._inputField.focus();
}

CalemEditBoolean.prototype.onFieldChanged =
function() {
	if (this._readonly) {
		this._inputField.checked=this._value;
		return;
	}
	if (this._vcCallback) this._vcCallback.run(this, true, this.getFieldValue());
}

CalemEditBoolean.prototype.isValid =
function() {
	return true;
}

//Detecting change.
CalemEditBoolean._onClick =
function(ev) {
	var keyEv = DwtShell.keyEvent;
	keyEv.setFromDhtmlEvent(ev);

	var obj = keyEv.dwtObj;
	var keyCode = keyEv.keyCode;
	if (obj.onFieldChanged) {
		obj.onFieldChanged();	
	}
}
