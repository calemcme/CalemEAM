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
 * CalemEditPassword
 * This is the password editor.
 */
function CalemEditPassword(param) {
	if (arguments.length==0) return;
	DwtComposite.call(this, param.parent, param.className, param.posStyle);
	this._createControl(param);
} 

CalemEditPassword.prototype = new DwtComposite;
CalemEditPassword.prototype.constructor = CalemEditPassword;

CalemEditPassword.prototype.toString = function() { return "CalemEditPassword"; }

CalemEditPassword.prototype._createControl  =
function(param) {
	var el=this.getHtmlElement();
	var fieldId = Dwt.getNextId();
	var retypeId = Dwt.getNextId();
	var style=param.style || CalemConst.LAYOUT_HORIZONTAL;
	if (style==CalemConst.LAYOUT_HORIZONTAL) {
		el.innerHTML=["<table cellspacing='0' cellpadding='0'><tr>",
	              "<td id=", fieldId, "></td>",
	              "<td class=CalemRetypePrompt>", CalemMsg.getMsg('retype'), ":", "</td>",
	              "<td id=", retypeId, "> </td>",
	              "</tr></table>"].join('');
	} else {
		el.innerHTML=["<table cellspacing='0' cellpadding='0'>",
	              "<tr> <td id=", fieldId, "></td> </tr>",
	              "<tr> <td class=CalemRetypePromptBack>", CalemMsg.getMsg('retype'),"</td>",
	              "<td id=", retypeId, "> </td>",
	              "</tr></table>"].join('');
	}
	//Get the elements
	this._fieldEl=document.getElementById(fieldId);
	this._retypeEl=document.getElementById(retypeId);	              
	//Two components for 	              
	this._field=new CalemInputField(param);
	this._retypeField=new CalemInputField(param);
	//Link these fields to els
	this._field.reparentHtmlElement(this._fieldEl);
	this._retypeField.reparentHtmlElement(this._retypeEl);
	//validator
	this._field.setValidatorFunction(this, this.onFieldValidator);		
	this._retypeField.setValidatorFunction(this, this.onRetypeValidator);
}

//Some initialization
CalemEditPassword.prototype.setValidStringLengths =
function(min, max) {
	this._field.setValidStringLengths(min, max);
	this._retypeField.setValidStringLengths(min, max);
}

CalemEditPassword.prototype.setValue =
function(val, noValidate) {
	this._field.setValue(val, noValidate);
	this._retypeField.setValue(val, noValidate);
}

CalemEditPassword.prototype.setRequired =
function() {
	this._field.setRequired(true);
	this._retypeField.setRequired(true);
}

CalemEditPassword.prototype.focus =
function() {
	this._field.focus();
}

/**
 * Validation
 */
CalemEditPassword.prototype.setValidationCallback =
function(callback) {
	this._field.setValidationCallback(callback);
	this._retypeField.setValidationCallback(callback);
} 

CalemEditPassword.prototype.setFieldInfo =
function(info) {
	this._field.setFieldInfo(info);
	this._retypeField.setFieldInfo(info);
} 

CalemEditPassword.prototype.onFieldValidator =
function(value) {
	this._onValidator(value);
}

CalemEditPassword.prototype.onRetypeValidator =
function(value) {
	this._onValidator(value);
}

CalemEditPassword.prototype._onValidator =
function(value) {
	if ( this._field._required && (!this._field.getValue() || !this._retypeField.getValue)) throw AjxMsg.valueIsRequired;
	var valid= (this._field.getValue()==this._retypeField.getValue());
	if (valid) {
		this._field._clearFieldError();
		this._retypeField._clearFieldError();
	} else {
		var msg=CalemMsg.getMsg('retype_error');
		this._field.setFieldError(msg);
		this._retypeField.setFieldError(msg);
		throw msg;
	}
	return value;
}

CalemEditPassword.prototype.isValid =
function() {
	this._onValidator();
	return true;
}

//This is native type
CalemEditPassword.prototype.getFieldValue =
function() {
	return this._field.getValue();
} 

//This is server type.
CalemEditPassword.prototype.getEditFieldServerValue =
function() {
	return this._field.getValue();
} 

CalemEditPassword.prototype.setFieldError =
function(errMsg) {
	this._field.setFieldError(errMsg);
	this._retypeField.setFieldError(errMsg);
} 
