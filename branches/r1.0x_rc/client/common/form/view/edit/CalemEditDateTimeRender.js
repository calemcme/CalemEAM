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
 * CalemEditDateTimeRender
 * Render datetime field for editing.
 *  
 */
function CalemEditDateTimeRender(parent, id, fldInfo, controller) {
	if (arguments.length==0) return;
	CalemEditRender.call(this, parent, id, fldInfo, controller);
   //Validation callback
	this._parentVdCallback=this._controller.getValidationCallback();
	this._vdCallback=new AjxCallback(this, this.onVdCallback);
}

CalemEditDateTimeRender.prototype=new CalemEditRender;
CalemEditDateTimeRender.prototype.constructor=CalemEditDateTimeRender;

CalemEditDateTimeRender.prototype.toString = function() { return "CalemEditDateTimeRender"; }

//This render will create a container for both date and time fields.
CalemEditDateTimeRender.prototype.render =
function(parentEl, yOff) {
	//This render will draw both date and time fields and supply values from here.
	var dateFieldId = Dwt.getNextId();
	var timeLabelId = Dwt.getNextId();
	var timeFieldId = Dwt.getNextId();
	parentEl.innerHTML=["<table cellspacing='0' cellpadding='0'><tr>",
	              "<td id=", dateFieldId, "></td>",
	              "<td><div id=", timeLabelId, " class=CalemTimeLabel></div></td>",
	              "<td id=", timeFieldId, "> </td>",
	              "</tr></table>"].join('');
	//Get the elements
	this._dateFieldEl=document.getElementById(dateFieldId);
	this._timeLabelEl=document.getElementById(timeLabelId);
	this._timeFieldEl=document.getElementById(timeFieldId);
	//Render date
	var len=this._tableDd.getDateInputLength();
	this._dateField=new CalemEditDate({parent: this._parent, type: DwtInputField.DATE, 
	              size: len,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._dateField.setValidStringLengths(null, len);
	//Time
	len=this._tableDd.getTimeInputLength();
	this._timeField=new CalemEditTime({parent: this._parent, type: DwtInputField.STRING, 
	              size: len,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	//Set required.
	if (this._tableDd.isRequired(this._field)) {
		this._dateField.setRequired(true);
	}
	//Relink html.
	this._dateField.reparentHtmlElement(this._dateFieldEl);
	this._timeField.reparentHtmlElement(this._timeFieldEl);
	//Set the label for time:
	this._timeLabelEl.innerHTML=CalemMsg.getMsg('at_time')+":";
	//Init values.
	this.resumeView();          
}

/**
 * This is a special render so have to controll all the APIs
 */
//validation
CalemEditDateTimeRender.prototype.setupValidation =
function() {
	this._dateField.setValidationCallback(this._vdCallback);
	this._timeField.setValidationCallback(this._vdCallback);
	this._dateField.setFieldInfo(this.getFieldInfo());
	this._timeField.setFieldInfo(this.getFieldInfo());
} 

/**
 * Either date or time portion cannot tell if the field is valid.
 * The validity must be determined at an upper level (that's here)!
 */
CalemEditDateTimeRender.prototype.onVdCallback =
function(field, isValid, value) {
	var valid=this.verifyInput();
	this._parentVdCallback.run(field, valid, value);
}

//Default implementation
CalemEditDateTimeRender.prototype.setFocus =
function() {
	this._dateField.focus();
}

//Verify input
CalemEditDateTimeRender.prototype.verifyInput =
function(fld, isValid) {
	return CalemViewUtil.datetimeVerifyInput(this._dateField, this._timeField);
} 

//fieldValue
CalemEditDateTimeRender.prototype.getFieldValue =
function() {
	//Should merge two values
	var date=this._dateField.getFieldValue();
	if (date) {
		var time=this._timeField.getFieldLocalValue();
		if (time) {
			date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
		} else { //Clear time portion of the date.
			date=CalemTextUtil.resetTime(date);
		}
		date=CalemTextUtil.localDateTimeToGmt(date);
	}
	return date;
}

//Considering going back to null (as in null replacement)
CalemEditDateTimeRender.prototype._getCtrlValue =
function() {
	var val=this.getFieldValue();
	if (val==this.getNullReplacement()) val=null; //Get rid of null replacement.
	return val;
}

//Value for server (such as string for date)
CalemEditDateTimeRender.prototype.getEditFieldServerValue =
function() {
	var rtn=null;
	var date=this.getFieldValue();
	if (date) {
		rtn=CalemTextUtil.formatServerDateTime(date);
	}
	return rtn;
} 

CalemEditDateTimeRender.prototype.getInsertFieldServerValue =
function() {
	return this.getEditFieldServerValue();
} 

//set field error
CalemEditDateTimeRender.prototype.setFieldError =
function(errMsg) {
	//This is a rough call here - this is business logic so let's set at date and time field.
	this._dateField.setFieldError(errMsg);
	this._timeField.setFieldError(errMsg);
} 

//shutdown
CalemEditDateTimeRender.prototype._shutdown =
function() {
	//Overwrite
}

//Default implementation for all the read renders.
CalemEditDateTimeRender.prototype.resumeView =
function() {
	var val= this._getFieldRawValue();
	if (val) {
		val = CalemTextUtil.gmtDateTimeToLocal(val);
		this._dateField.setDate(val, true); 
		this._timeField.setTime(val, true);
	} else {
		val=this.getNullReplacement();
		this._dateField.setValue(val, true);
		this._timeField.setValue(val, true);
	}
}

CalemEditDateTimeRender.prototype.setFieldReadOnly =
function() {
	this._dateField.disable();
	this._timeField.disable();
}


