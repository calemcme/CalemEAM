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
 * CalemEditScheduleTime
 * This is the time edit control
 */
function CalemEditScheduleTime(param) {
	if (arguments.length==0) return;
	DwtComposite.call(this, param.parent);
	this._param=param;
	this._createControl();
	this._formatter=CalemTextUtil.getFormatter(CalemTextUtil.INTEGER_FORMATTER);
	//Validation callback
	this._vdCallbackProxy = new AjxCallback(this, this.onVdCallbackProxy);
} 

CalemEditScheduleTime.START_TIME=0;
CalemEditScheduleTime.REPEAT=1;
CalemEditScheduleTime.END_TIME=2;
CalemEditScheduleTime.MINUTES=3;
CalemEditScheduleTime.HOURS=4;
CalemEditScheduleTime.RM=5;
CalemEditScheduleTime.RH=6;
CalemEditScheduleTime.OBJ_COUNT=7;

CalemEditScheduleTime.TIME_FLDS=[CalemEditScheduleTime.START_TIME, CalemEditScheduleTime.END_TIME];
CalemEditScheduleTime.R_FLDS=[CalemEditScheduleTime.RM, CalemEditScheduleTime.RH];
CalemEditScheduleTime.E_FLDS=[CalemEditScheduleTime.START_TIME, CalemEditScheduleTime.END_TIME,
										CalemEditScheduleTime.MINUTES, CalemEditScheduleTime.HOURS];

CalemEditScheduleTime.prototype = new DwtComposite;
CalemEditScheduleTime.prototype.constructor = CalemEditScheduleTime;

CalemEditScheduleTime.prototype.toString = function() { return "CalemEditScheduleTime"; }

//create control
CalemEditScheduleTime.prototype._createControl  =
function() {	
	//internal data mappings
	this._map=new Array();
	for (var i=0; i< CalemEditScheduleTime.OBJ_COUNT; i++) {
		var obj=new Object();
		obj._id=Dwt.getNextId();
		this._map.push(obj);
	}
	
	var html=new Array();
	var i=0;
	html[i++]="<table class=CalemScheduleTimeTable>";
	//Start time
	html[i++]=["<tr><td class=CalemScheduleTimeLabel>", CalemMsg.getMsg("schedule_start_time"), ":", "</td>"].join('');
	html[i++]=["<td class=CalemScheduleTimeTd id=", this._map[CalemEditScheduleTime.START_TIME]._id, "></td>"].join('');
	//Repeat check box
	html[i++]=["<td><input class=CalemScheduleTimeCheckBox type='checkbox' id=", this._map[CalemEditScheduleTime.REPEAT]._id, 
		           ">", CalemMsg.getMsg("schedule_repeat"), "</td></tr>"].join('');
	//Till time
	html[i++]=["<tr><td></td><td></td><td><table class=CalemScheduleUntilTable><tr><td class=CalemScheduleTimeLabel>", CalemMsg.getMsg("schedule_until"), ":", "</td>"].join('');
	html[i++]=["<td class=CalemScheduleTimeTd id=", this._map[CalemEditScheduleTime.END_TIME]._id, "></td></tr></table></td><tr>"].join('');
	//Radio group for minutes		           
	html[i++]="<tr><td></td><td></td><td><table class=CalemScheduleTimeMHTable>";
	html[i++]=["<tr><td><input type='radio' class=CalemEditScheduleTimeRadio name='schedule_time', id=", this._map[CalemEditScheduleTime.RM]._id,
			     ">", CalemMsg.getMsg("schedule_every"), "</td>"].join('');
	html[i++]=["<td class=CalemScheduleTimeTd id=", this._map[CalemEditScheduleTime.MINUTES]._id, "></td>"].join('');
	html[i++]=["<td class=CalemScheduleTimeLabel>", CalemMsg.getMsg("schedule_minutes"), "</td></tr>"].join('');
	//Radio group for hours
	html[i++]=["<tr><td><input type='radio' class=CalemEditScheduleTimeRadio name='schedule_time', id=", this._map[CalemEditScheduleTime.RH]._id,
			     ">", CalemMsg.getMsg("schedule_every"), "</td>"].join('');
	html[i++]=["<td class=CalemScheduleTimeTd id=", this._map[CalemEditScheduleTime.HOURS]._id, "></td>"].join('');
	html[i++]=["<td class=CalemScheduleTimeLabel>", CalemMsg.getMsg("schedule_hours"), "</td></tr>"].join('');
	//End table doms
	html[i++]="</table></td></tr></table>";
	
	//Set html layout.
	var el=this.getHtmlElement();
	el.innerHTML=html.join('');
	//Now continue layout and binding
	for (var i=0; i< this._map.length; i++) {
		this._map[i]._el=document.getElementById(this._map[i]._id);
	}
	//startTime and endTime fields
	this._bindTimeFields(CalemEditScheduleTime.TIME_FLDS);
	//Min and hour fields
	this._bindIntField(CalemEditScheduleTime.MINUTES, CalemConf['edit_schedule_time']['int_field_len'], this.minuteValidator);
	this._bindIntField(CalemEditScheduleTime.HOURS, CalemConf['edit_schedule_time']['int_field_len'], this.hourValidator);
	//Handle click events on repeat check box and radio buttons
	this._map[CalemEditScheduleTime.REPEAT]._el.onclick = CalemEditScheduleTime._onRepeatClick;
	this._map[CalemEditScheduleTime.RM]._el.onclick = CalemEditScheduleTime._onRadioClick;
	this._map[CalemEditScheduleTime.RM]._eFld = this._map[CalemEditScheduleTime.MINUTES]._fld;
	this._map[CalemEditScheduleTime.RH]._el.onclick = CalemEditScheduleTime._onRadioClick;
	this._map[CalemEditScheduleTime.RH]._eFld = this._map[CalemEditScheduleTime.HOURS]._fld;
	
}

CalemEditScheduleTime.prototype._bindTimeFields =
function(arFlds) {
	var timeLen=CalemConf['view_record_size']['edit']['time'];
	for (var i=0; i< arFlds.length; i++) {
		var idx=arFlds[i];
		this._map[idx]._fld=new CalemEditTime({parent: this.parent, type: DwtInputField.STRING, 
	              size: timeLen,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
		this._map[idx]._fld.setValidStringLengths(null, timeLen);
		this._map[idx]._fld.reparentHtmlElement(this._map[idx]._el);	
	}
}

CalemEditScheduleTime.prototype._bindIntField =
function(idx, fldLen, validator) {
	this._map[idx]._fld=new CalemInputField({parent: this.parent, type: DwtInputField.STRING, 
	              size: fldLen,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});              
	this._map[idx]._fld.setValidatorFunction(this, validator);
	this._map[idx]._fld.reparentHtmlElement(this._map[idx]._el);  
}

/**
 * minute and hour validator
 */
CalemEditScheduleTime.prototype.minuteValidator = 
function(value) {	
	return this.intValidator(value, CalemConf['edit_schedule_time']['minute_range']);
} 

CalemEditScheduleTime.prototype.hourValidator = 
function(value) {
	return this.intValidator(value, CalemConf['edit_schedule_time']['hour_range']);
} 

CalemEditScheduleTime.prototype.intValidator = 
function(value, range) {
	var val=CalemTextUtil.isIntegerValid(value);
	if (val==null || val=='') return;
	if (range.min && value < range.min)
		throw AjxMessageFormat.format(AjxMsg.numberLessThanMin, range.min);
	if (range.max && value > range.max)
		throw AjxMessageFormat.format(AjxMsg.numberMoreThanMax, range.max);
	return val ? this._formatter.format(val) : val;
}

/**
 * To display.
 */
CalemEditScheduleTime.prototype.setValue =
function(val, noValidate) {
	var sti=CalemScheduleTimeInfo._decode(val);
	//start/end time
	this._setLocalTime(CalemEditScheduleTime.START_TIME, sti.getStartTime());
	this._setLocalTime(CalemEditScheduleTime.END_TIME, sti.getEndTime());
	//mins/hours
	this._map[CalemEditScheduleTime.MINUTES]._fld.setValue(sti.getMinutes(), true);
	this._map[CalemEditScheduleTime.HOURS]._fld.setValue(sti.getHours(), true);
	//radio buttons
	if (sti.getSelection() == CalemScheduleTimeInfo._MINUTES) {
		this._map[CalemEditScheduleTime.RM]._el.checked=true;
	} else {
		this._map[CalemEditScheduleTime.RH]._el.checked=true;
	}
	//check box
	this._map[CalemEditScheduleTime.REPEAT]._el.checked=sti.getRepeat();
	this.onRepeatClick(true);
}

CalemEditScheduleTime.prototype._setLocalTime =
function(idx, val) {	
	val=(val) ? CalemTextUtil._getLocalTimeFromServerTime(val) : CalemTextUtil.getNullReplacement();
	this._map[idx]._fld.setValue(val, true);
}

CalemEditScheduleTime.prototype.setRequired =
function() {
	//Do not support for now.
}

CalemEditScheduleTime.prototype.focus =
function() {
	this._map[CalemEditScheduleTime.START_TIME]._el.focus();
}

/**
 * Validation
 */
CalemEditScheduleTime.prototype.setValidationCallback =
function(callback) {
	this._vdCallback=callback;
	//Now set up callback in all fields.
	for (var i=0; i< CalemEditScheduleTime.E_FLDS.length; i++) {
		var idx=CalemEditScheduleTime.E_FLDS[i];
		this._map[idx]._fld.setValidationCallback(this._vdCallbackProxy);
	}	
} 

CalemEditScheduleTime.prototype.onVdCallbackProxy =
function(fld, isValid, value) {
	if (isValid) {
		try {
			this.isValid();
		} catch (ex) {
			if (CalemDebug.isDebug()) CalemDebug.debug("CalemEditScheduleTime, got exception in vdCallbackProxy: "+ex);
			isValid=false;
		}
	}
	this._vdCallback.run(this, isValid, value)
}

CalemEditScheduleTime.prototype.setFieldInfo =
function(info) {
	this._fieldInfo=info;
} 

CalemEditScheduleTime.prototype.getFieldInfo =
function(info) {
	return this._fieldInfo;
}

CalemEditScheduleTime.prototype.isValid =
function() {
	for (var i=0; i< CalemEditScheduleTime.E_FLDS.length; i++) {
		var idx=CalemEditScheduleTime.E_FLDS[i];
		this._map[idx]._fld.isValid();
	}
	return true;
}

//This is native type
CalemEditScheduleTime.prototype.getFieldValue =
function() {
	var startTime=this._map[CalemEditScheduleTime.START_TIME]._fld.getEditFieldServerValue();
	var repeat=this._map[CalemEditScheduleTime.REPEAT]._el.checked;
	var selection=CalemScheduleTimeInfo._MINUTES;
	var endTime=null;
	var mins=0;
	var hours=0;
	if (repeat) {
		endTime=this._map[CalemEditScheduleTime.END_TIME]._fld.getEditFieldServerValue();
		if (this._map[CalemEditScheduleTime.RM]._el.checked) {
			mins=this._map[CalemEditScheduleTime.MINUTES]._fld.getEditFieldServerValue();
		} else {
			hours=this._map[CalemEditScheduleTime.HOURS]._fld.getEditFieldServerValue();
			selection=CalemScheduleTimeInfo._HOURS;
		}
	}
	var sti=new CalemScheduleTimeInfo(startTime, repeat, endTime, selection, mins, hours);
	if (CalemDebug.isDebug()) CalemDebug.debug("EditScheduleTime info="+sti.getJsonPhp());
	return Base64.encode(sti.getJsonPhp());
} 

//This is server type.
CalemEditScheduleTime.prototype.getEditFieldServerValue =
function() {
	return this.getFieldValue();
} 

CalemEditScheduleTime.prototype.setFieldError =
function(errMsg) {
	//
} 

CalemEditScheduleTime.prototype.clearFieldError =
function() {
	//
} 

//Handle radio button clicked.
CalemEditScheduleTime.prototype.onRadioClicked =
function(enabled, noReport) {
	for (var i=0; i< CalemEditScheduleTime.R_FLDS.length; i++) {
		var idx=CalemEditScheduleTime.R_FLDS[i];
		this._map[idx]._el.disabled=!enabled; //radio button enablement.
		if (this._map[idx]._el.disabled || !this._map[idx]._el.checked) {
			this._map[idx]._eFld.disable();
		} else {
			this._map[idx]._eFld.enable();
		}
	}
	if (!noReport) {
		this.onVdCallbackProxy(this, true, null);
	}
} 

CalemEditScheduleTime.prototype.onRepeatClick =
function(noReport) {
	var enabled=this._map[CalemEditScheduleTime.REPEAT]._el.checked;
	//Util field enablement
	if (enabled) this._map[CalemEditScheduleTime.END_TIME]._fld.enable();
	else this._map[CalemEditScheduleTime.END_TIME]._fld.disable();
	this.onRadioClicked(enabled, true);
	if (!noReport) {
		this.onVdCallbackProxy(this, true, null);
	}
}

/**
 * radio click function
 */
CalemEditScheduleTime._onRadioClick =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (obj) obj.onRadioClicked(true);
} 

CalemEditScheduleTime._onRepeatClick =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (obj) obj.onRepeatClick();
}

 