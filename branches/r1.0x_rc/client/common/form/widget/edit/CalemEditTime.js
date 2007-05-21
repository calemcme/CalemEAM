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
 * CalemEditTime
 * This is the time edit control
 */
function CalemEditTime(param) {
	if (arguments.length==0) return;
	DwtControl.call(this, param.parent);
	this._editFormatter=CalemTextUtil.getFormatter(CalemTextUtil.TIME_EDIT_FORMATTER);
	this._createControl(param);
} 

CalemEditTime.prototype = new DwtControl;
CalemEditTime.prototype.constructor = CalemEditTime;

CalemEditTime.prototype.toString = function() { return "CalemEditTime"; }

//create control
CalemEditTime.prototype._createControl  =
function(param) {	
	var el=this.getHtmlElement();
	var timeFieldId = Dwt.getNextId();
	var promId = Dwt.getNextId();
	var prompt=CalemEditTime.getTimePrompt(this._editFormatter);
	el.innerHTML=["<table cellspacing='0' cellpadding='0'><tr>",
	              "<td id=", timeFieldId, "></td>",
	              "<td><div class=CalemTimePrompt>", prompt, "</div></td>",
	              "</tr></table>"].join('');
	//Get the elements
	this._timeFieldEl=document.getElementById(timeFieldId);	              
	//Two components for 	              
	this._timeField=new CalemInputField(param);
	//set validator
	this._timeField.setValidatorFunction(this, this.onValidator);
	//Reparent the control
	this._timeField.reparentHtmlElement(this._timeFieldEl);
}

//Get date prompt
CalemEditTime.getTimePrompt = 
function(format) {
	if (!CalemEditTime._time_prompt) {
		var prompt=CalemConf["text_formatter"]['timePrompt'];
		var ar=[CalemConf["text_formatter"].time.edit, format.format(new Date())];
		CalemEditTime._time_prompt=AjxMessageFormat.format(prompt, ar);
	}
	return CalemEditTime._time_prompt;
}

//Some initialization
CalemEditTime.prototype.setValidStringLengths =
function(min, max) {
	this._timeField.setValidStringLengths(min, max);
}

CalemEditTime.prototype.setValue =
function(val, noValidate) {
	this._timeField.setValue(val, noValidate);
}

CalemEditTime.prototype.setTime =
function(date, noValidation) {
	this.setValue(this._editFormatter.format(date), noValidation);
}

CalemEditTime.prototype.setRequired =
function() {
	this._timeField.setRequired(true);
}

CalemEditTime.prototype.focus =
function() {
	this._timeField.focus();
}

//Validation function
CalemEditTime.prototype.onValidator = 
function(value) {
	if ( this._timeField._required && !value) throw AjxMsg.valueIsRequired;
	return CalemTextUtil.isLocalTimeValid(value);
}

/**
 * Validation
 */
CalemEditTime.prototype.setValidationCallback =
function(callback) {
	this._timeField.setValidationCallback(callback);
} 

CalemEditTime.prototype.setFieldInfo =
function(info) {
	this._timeField.setFieldInfo(info);
} 

CalemEditTime.prototype.isValid =
function() {
	this._timeField.isValid();
	return true;
}

CalemEditTime.prototype.getFieldLocalValue =
function() {
	var date;
	var val=this._timeField.getValue();
	if (val) {
		date = this._editFormatter.parse(val);
	}
	return date;
}

//This is native type
CalemEditTime.prototype.getFieldValue =
function() {
	var date=this.getFieldLocalValue();
	//Keep time as is, no time zone conversion for now.
	//if (date) date=CalemTextUtil.localDateTimeToGmt(date);
	return date;
} 

//This is server type.
CalemEditTime.prototype.getEditFieldServerValue =
function() {
	var rtn;
	var date=this.getFieldValue();
	if (date) { //Format it for server use
		rtn=CalemTextUtil.formatServerTime(date);
	}
	return rtn;
} 

CalemEditTime.prototype.setFieldError =
function(errMsg) {
	this._timeField.setFieldError(errMsg);
} 

CalemEditTime.prototype.clearFieldError =
function() {
	this._timeField._clearFieldError();
} 

CalemEditTime.prototype.enable =
function() {
	this._timeField.enable();
} 

CalemEditTime.prototype.disable =
function() {
	this._timeField.disable();
} 
