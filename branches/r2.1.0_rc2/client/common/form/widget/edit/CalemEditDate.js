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
 * CalemEditDate
 * This is the date edit lookup supporting date lookup.
 */
function CalemEditDate(param) {
	if (arguments.length==0) return;
	DwtComposite.call(this, param.parent, param.className, param.posStyle);
	this._editFormatter=CalemTextUtil.getFormatter(CalemTextUtil.DATE_EDIT_FORMATTER);
	this._createControl(param);
} 

CalemEditDate.prototype = new DwtComposite;
CalemEditDate.prototype.constructor = CalemEditDate;

CalemEditDate.prototype.toString = function() { return "CalemEditDate"; }

CalemEditDate.prototype._createControl  =
function(param) {
	var el=this.getHtmlElement();
	var dateFieldId = Dwt.getNextId();
	var dateLookupId = Dwt.getNextId();
	var prompt=CalemEditDate.getDatePrompt(this._editFormatter);
	el.innerHTML=["<table cellspacing='0' cellpadding='0'><tr>",
	              "<td id=", dateFieldId, "></td>",
	              "<td id=", dateLookupId, " class=CalemDateLookupTd> </td>",
	              "<td class=CalemDatePrompt>", prompt, "</td>",
	              "</tr></table>"].join('');
	//Get the elements
	this._dateFieldEl=document.getElementById(dateFieldId);
	this._dateLookupEl=document.getElementById(dateLookupId);	              
	//Two components for 	              
	this._dateField=new CalemInputField(param);
	this._dateField.setValidatorFunction(this, this.onValidator);
	//Lookup
	this._dateLookup=new CalemDateLookupButton(param.parent);
	//Link fields to the control
	this._dateFieldEl.appendChild(this._dateField.getHtmlElement());
	this._dateLookupEl.appendChild(this._dateLookup.getHtmlElement());
	//Set up event listeners
	this._dateLookup.setDateField(this);		
}

//Get date prompt
CalemEditDate.getDatePrompt = 
function(format) {
	if (!CalemEditDate._date_prompt) {
		var prompt=CalemConf["text_formatter"]['datePrompt'];
		var ar=[CalemConf["text_formatter"].date.edit, format.format(new Date())];
		CalemEditDate._date_prompt=AjxMessageFormat.format(prompt, ar);
	}
	return CalemEditDate._date_prompt;
}

//Some initialization
CalemEditDate.prototype.setValidStringLengths =
function(min, max) {
	this._dateField.setValidStringLengths(min, max);
}

CalemEditDate.prototype.setValue =
function(val, noValidate) {
	this._dateField.setValue(val, noValidate);
}

CalemEditDate.prototype.getDate =
function() {
	return this.getFieldValue();
}

CalemEditDate.prototype.setDate =
function(date, noValidation) {
	this.setValue(this._editFormatter.format(date), noValidation);
}

CalemEditDate.prototype.setRequired =
function(date) {
	this._dateField.setRequired(true);
}

CalemEditDate.prototype.focus =
function() {
	this._dateField.focus();
}

CalemEditDate.prototype.disable =
function() {
	this._dateField.disable();
	this._dateLookup.setEnabled(false);
}

CalemEditDate.prototype.enable =
function() {
	this._dateField.enable();
	this._dateLookup.setEnabled(true);
}

/**
 * Validation
 */
CalemEditDate.prototype.setValidationCallback =
function(callback) {
	this._dateField.setValidationCallback(callback);
} 

CalemEditDate.prototype.setFieldInfo =
function(info) {
	this._dateField.setFieldInfo(info);
} 

CalemEditDate.prototype.isValid =
function() {
	return this._dateField.isValid();
}

//Validation function
CalemEditDate.prototype.onValidator = 
function(value) {
	if (this._dateField._required && !value) throw AjxMsg.valueIsRequired;
	return CalemTextUtil.isLocalDateValid(value);
}

//This is native type
CalemEditDate.prototype.getFieldValue =
function() {
	var date;
	var val=this._dateField.getValue();
	if (val)
		date = this._editFormatter.parse(val);
	return date;
} 

//This is server type.
CalemEditDate.prototype.getEditFieldServerValue =
function() {
	var rtn;
	var date=this.getFieldValue();
	if (date) { //Format it for server use
		rtn=CalemTextUtil.formatServerDate(date);
	}
	return rtn;
} 

CalemEditDate.prototype.setFieldError =
function(errMsg) {
	this._dateField.setFieldError(errMsg);
} 

CalemEditDate.prototype.clearFieldError =
function() {
	this._dateField._clearFieldError();
} 

/**
 * CalemDateLookupButton
 * This is the lookup button that controls the datelookup
 */
function CalemDateLookupButton(parent, style, className, posStyle) {
	if (arguments.length==0) return; 
	className= className || 'TBButton';
	DwtButton.call(this, parent, style, className, posStyle);
	//init the control
	this._initControl();
} 

CalemDateLookupButton.prototype = new DwtButton;
CalemDateLookupButton.prototype.constructor = CalemDateLookupButton;

CalemDateLookupButton.prototype.toString = function() { return "CalemDateLookupButton"; }

CalemDateLookupButton.prototype._initControl  =
function(param) {
	//Creating a singleton calendar lookup instance
	if (!CalemDateLookupButton._dateLookupInstance)	{
		var shell=CalemContext.getInstance().getShell();
		//So the calendar control is safe and will not be disposed.
		CalemDateLookupButton._dateLookupInstance=new CalemDateLookup(shell);
		CalemDateLookupButton._dateLookupInstance.popdown();
	}
	//Creating a listener
	this._dateListener=new AjxListener(this, this.onDateSelection);
	this._selectListener=new AjxListener(this, this.onButtonClick);
	this.addSelectionListener(this._selectListener);
	//Set up the text here.
	this.setImage('CalemDateLookup');
} 

CalemDateLookupButton.prototype.setDateField =
function(dateField) {
	this._dateField=dateField;
}

//Pop up calendar
CalemDateLookupButton.prototype.onButtonClick =
function(ev) {
	CalemDateLookupButton._dateLookupInstance.popupCalendar(this.getBounds(), this._dateField.getDate(), this._dateListener);
}

//Popdown calendar
CalemDateLookupButton.prototype.onDateSelection =
function(ev) {
	var dt=CalemDateLookupButton._dateLookupInstance.getDate();
	this._dateField.setDate(dt);	
}
	 
