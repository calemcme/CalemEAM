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
 * CalemEditSchedule
 * This is the time edit control
 */
function CalemEditSchedule(param) {
	if (arguments.length==0) return;
	DwtComposite.call(this, param.parent);
	this._param=param;
	this._createControl();
	//Validation callback
	this._vdCallbackProxy = new AjxCallback(this, this.onVdCallbackProxy);
} 

CalemEditSchedule.prototype = new DwtComposite;
CalemEditSchedule.prototype.constructor = CalemEditSchedule;

CalemEditSchedule.prototype.toString = function() { return "CalemEditSchedule"; }

//create control
CalemEditSchedule.prototype._createControl  =
function() {	
	//internal data mappings
	this._radioGroups=new Object();
	this._createCommon();
	this._createWeeklyData();
	this._createWeeksData();
	this._createMonthsData();
	this._createDaysData();
	this._createDatesData();
	
	var html=new Array();
	var i=0;
	html[i++]="<table class=CalemEditScheduleTable><tr>";
	html[i++]=["<td><input type='radio' class=CalemEditScheduleRadio name='schedule', id=", this._radioGroups['weekly']._id,
	            ">", CalemMsg.getMsg("schedule_weekly"), "</td>"].join('');
	html[i++]="<td><table class=CalemScheduleWeeklyTable><tr>";
	for (var j=0; j< 7; j++) {
		html[i++]=["<td><input class=CalemEditScheduleCheckBox type='checkbox' id=", this._dow[j]._id, 
		           ">", this._weekDays[j].msg, "</td>"].join('');
	};
	html[i++]="</tr></table></td></tr>";
	//weeks
	html[i++]=["<tr><td><input type='radio' class=CalemEditScheduleRadio name='schedule', id=", this._radioGroups['weeks']._id,
			     ">", CalemMsg.getMsg("schedule_weeks"), "</td>"].join('');
	html[i++]="<td><table class=CalemEditScheduleWeeksTable><tr>";
	html[i++]=["<td class=CalemEditScheduleWeeksTd id=", this._weeks._id, "></td>"].join('');
	html[i++]=["<td class=CalemEditScheduleWeeksOnTextTd>", CalemMsg.getMsg("schedule_on"), "</td>"].join('');
	html[i++]=["<td class=CalemEditScheduleWeeksOnTd id=", this._weeksOn._id, "></td>"].join('');
	html[i++]="</tr></table></td></tr>"
	//months
	html[i++]=["<tr><td><input type='radio' class=CalemEditScheduleRadio name='schedule', id=", this._radioGroups['months']._id,
			     ">", CalemMsg.getMsg("schedule_months"), "</td>"].join('');
	html[i++]="<td><table class=CalemEditScheduleMonthsTable><tr>";
	html[i++]=["<td class=CalemEditScheduleMonthsTd id=", this._months._id, "></td>"].join('');
	html[i++]=["<td class=CalemEditScheduleMonthsOnTextTd>", CalemMsg.getMsg("schedule_on"), "</td>"].join('');
	html[i++]=["<td class=CalemEditScheduleMonthsOnTd id=", this._monthsOn._id, "></td>"].join('');
	html[i++]=["<td class=CalemEditScheduleMonthsOnDowTd id=", this._monthsOnDow._id, "></td>"].join('');
	html[i++]="</tr></table></td></tr>"
	//days
	html[i++]=["<tr><td><input type='radio' class=CalemEditScheduleRadio name='schedule', id=", this._radioGroups['days']._id,
			     ">", CalemMsg.getMsg("schedule_days"), "</td>"].join('');
	html[i++]="<td><table class=CalemEditScheduleDaysTable><tr>";
	html[i++]=["<td class=CalemEditScheduleDaysTd id=", this._days._id, "></td>"].join('');
	html[i++]="</tr></table></td></tr>"
	//dates
	html[i++]="<tr><td colSpan=2><table class=CalemEditScheduleDatesTable><tr>";
	html[i++]=["<td class=CalemEditScheduleLabelText>", CalemMsg.getMsg("schedule_start"), ":", "</td>"].join('');
	html[i++]=["<td class=CalemEditScheduleDateTd id=", this._startDate._id, "></td>"].join('');
	html[i++]=["<td class=CalemEditScheduleLabelText>", CalemMsg.getMsg("schedule_until"), ":", "</td>"].join('');
	html[i++]=["<td class=CalemEditScheduleDateTd id=", this._endDate._id, "></td>"].join('');
	//done
	html[i++]="</tr></table></td></tr></table>";
	//Set html layout.
	var el=this.getHtmlElement();
	el.innerHTML=html.join('');
	//Now continue layout and binding
	for (var i in this._radioGroups) {
		this._radioGroups[i]._el=document.getElementById(this._radioGroups[i]._id);
		this._radioGroups[i]._el.onclick = CalemEditSchedule._onRadioClick;
	}
	this._bindWeekly();
	this._bindWeeks();
	this._bindMonths();
	this._bindDays();
	this._bindDates();
}

CalemEditSchedule.prototype._createCommon =
function() {
	this._weekDays=[];
	var conf=CalemConf['edit_schedule']['dow_short'];
	for (var i=0; i< conf.length; i++) {
		this._weekDays.push({id: conf[i], msg: CalemMsg.getMsg(conf[i])});
	}
	
	//Creating select for month
	this._weekNos=[];
	conf=CalemConf['edit_schedule']['week_no'];
	for (var i=0; i< conf.length; i++) {
		this._weekNos.push({id: conf[i], msg: CalemMsg.getMsg(conf[i])});
	}
}

/**
 * Weekly data
 */
CalemEditSchedule.prototype._createWeeklyData =
function() {
	this._radioGroups['weekly']=new Object();
	this._radioGroups['weekly']._id=Dwt.getNextId();
	this._dow=new Array();
	for (var i=0; i< 7; i++) {
		var o=new Object();
		o._id=Dwt.getNextId();
		this._dow.push(o);
	}
}
 
CalemEditSchedule.prototype._bindWeekly =
function() {
	for (var i=0; i< 7; i++) {
		this._dow[i]._el=document.getElementById(this._dow[i]._id);
		this._dow[i]._el.onclick = CalemEditSchedule._onWeekdayClick;
	}
	this._radioGroups['weekly']._enableCallback=new AjxCallback(this, this._enableWeekly);
	this._radioGroups['weekly']._disableCallback=new AjxCallback(this, this._disableWeekly);
	this._radioGroups['weekly']._setterCallback=new AjxCallback(this, this._setWeekly);
	this._radioGroups['weekly']._getterCallback=new AjxCallback(this, this._getWeekly);
}

/**
 * Weeks
 */
CalemEditSchedule.prototype._createWeeksData =
function() {
	this._radioGroups['weeks']=new Object();
	this._radioGroups['weeks']._id=Dwt.getNextId();
	this._weeks=new Object();
	this._weeks._id=Dwt.getNextId();
	this._weeksOn=new Object();
	this._weeksOn._id=Dwt.getNextId();
}

CalemEditSchedule.prototype._bindWeeks =
function() {
	this._weeks._el = document.getElementById(this._weeks._id);
	this._weeksOn._el = document.getElementById(this._weeksOn._id);
	//Render integer field.
	this._weeks._fld = new CalemInputField({parent: this, type: DwtInputField.INTEGER, 
	              size: 2, errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._weeks._fld.reparentHtmlElement(this._weeks._el);
	//Render onSelect
	this._weeksOn._fld = new CalemEditDropdown(this, this._weekDays);
	this._weeksOn._fld.reparentHtmlElement(this._weeksOn._el);
	
	this._radioGroups['weeks']._enableCallback=new AjxCallback(this, this._enableWeeks);
	this._radioGroups['weeks']._disableCallback=new AjxCallback(this, this._disableWeeks);
	this._radioGroups['weeks']._setterCallback=new AjxCallback(this, this._setWeeks);
	this._radioGroups['weeks']._getterCallback=new AjxCallback(this, this._getWeeks);
}

/**
 * Months
 */
CalemEditSchedule.prototype._createMonthsData =
function() {
	this._radioGroups['months']=new Object();
	this._radioGroups['months']._id=Dwt.getNextId();
	
	this._months=new Object();
	this._months._id=Dwt.getNextId();
	this._monthsOn=new Object();
	this._monthsOn._id=Dwt.getNextId();
	this._monthsOnDow=new Object();
	this._monthsOnDow._id=Dwt.getNextId();
}
 
CalemEditSchedule.prototype._bindMonths =
function() {
	this._months._el= document.getElementById(this._months._id);
	this._monthsOn._el = document.getElementById(this._monthsOn._id);
	this._monthsOnDow._el = document.getElementById(this._monthsOnDow._id);
	//Render integer field.
	this._months._fld = new CalemInputField({parent: this, type: DwtInputField.INTEGER, 
	              size: 2, errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._months._fld.reparentHtmlElement(this._months._el);
	//Render week no.
	this._monthsOn._fld = new CalemEditDropdown(this, this._weekNos);
	this._monthsOn._fld.reparentHtmlElement(this._monthsOn._el);
	//Render dow
	this._monthsOnDow._fld = new CalemEditDropdown(this, this._weekDays);
	this._monthsOnDow._fld.reparentHtmlElement(this._monthsOnDow._el);
	
	this._radioGroups['months']._enableCallback=new AjxCallback(this, this._enableMonths);
	this._radioGroups['months']._disableCallback=new AjxCallback(this, this._disableMonths);
	this._radioGroups['months']._setterCallback=new AjxCallback(this, this._setMonths);
	this._radioGroups['months']._getterCallback=new AjxCallback(this, this._getMonths);
}

/**
 * Days
 */
CalemEditSchedule.prototype._createDaysData =
function() {
	this._radioGroups['days']=new Object();
	this._radioGroups['days']._id=Dwt.getNextId();
	
	this._days=new Object();
	this._days._id=Dwt.getNextId();
}
 
CalemEditSchedule.prototype._bindDays =
function() {
	this._days._el= document.getElementById(this._days._id);
	//Render integer field.
	this._days._fld = new CalemInputField({parent: this, type: DwtInputField.INTEGER, 
	              size: 4, errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._days._fld.reparentHtmlElement(this._days._el);
	
	this._radioGroups['days']._enableCallback=new AjxCallback(this, this._enableDays);
	this._radioGroups['days']._disableCallback=new AjxCallback(this, this._disableDays);
	this._radioGroups['days']._setterCallback=new AjxCallback(this, this._setDays);
	this._radioGroups['days']._getterCallback=new AjxCallback(this, this._getDays);
}

/**
 * Dates
 */
CalemEditSchedule.prototype._createDatesData =
function() {
	this._startDate=new Object();
	this._startDate._id=Dwt.getNextId();
	this._endDate=new Object();
	this._endDate._id=Dwt.getNextId();
}

CalemEditSchedule.prototype._bindDates =
function() {
	this._startDate._el= document.getElementById(this._startDate._id);
	this._endDate._el= document.getElementById(this._endDate._id);
	//Render dates
	var len= CalemConf['view_record_size']['edit']['date'];
	//Start date
	this._startDate._fld = new CalemEditDate({parent: this, type: DwtInputField.DATE, 
	              size: len, errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._startDate._fld.reparentHtmlElement(this._startDate._el);	
	//End date
	this._endDate._fld = new CalemEditDate({parent: this, type: DwtInputField.DATE, 
	              size: len, errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']});
	this._endDate._fld.reparentHtmlElement(this._endDate._el);              
}

/**
 * To display.
 */
CalemEditSchedule.prototype.setValue =
function(val, noValidate) {
	var schedInfo=CalemScheduleInfo._decode(val);
	this._radioGroups[schedInfo.getSelection()]._setterCallback.run(schedInfo);
	this._setDates(schedInfo);
}

CalemEditSchedule.prototype.setRequired =
function() {
	//Do not support for now.
}

CalemEditSchedule.prototype.focus =
function() {
	this._radioGroups['weekly']._el.focus();
}

/**
 * Validation
 */
CalemEditSchedule.prototype.setValidationCallback =
function(callback) {
	this._vdCallback=callback;
	//Now set up callback in all fields.
	this._weeks._fld.setValidationCallback(this._vdCallbackProxy);
	this._months._fld.setValidationCallback(this._vdCallbackProxy);
	this._days._fld.setValidationCallback(this._vdCallbackProxy);
	this._startDate._fld.setValidationCallback(this._vdCallbackProxy);
	this._endDate._fld.setValidationCallback(this._vdCallbackProxy);
} 

CalemEditSchedule.prototype.onVdCallbackProxy =
function(fld, isValid, value) {
	if (isValid) {
		try {
			this.isValid();
		} catch (ex) {
			if (CalemDebug.isDebug()) CalemDebug.debug("CalemEditSchedule, got exception in vdCallbackProxy: "+ex);
			isValid=false;
		}
	}
	this._vdCallback.run(this, isValid, value)
}

CalemEditSchedule.prototype.setFieldInfo =
function(info) {
	this._fieldInfo=info;
} 

CalemEditSchedule.prototype.getFieldInfo =
function(info) {
	return this._fieldInfo;
}

CalemEditSchedule.prototype.isValid =
function() {
	this._startDate._fld.isValid();
	this._endDate._fld.isValid();
	this._weeks._fld.isValid();
	this._months._fld.isValid();
	this._days._fld.isValid();
	return true;
}

//This is native type
CalemEditSchedule.prototype.getFieldValue =
function() {
	var schedInfo=new CalemScheduleInfo();
	for (var i in this._radioGroups) {
		if (this._radioGroups[i]._el.checked) {
			this._radioGroups[i]._getterCallback.run(schedInfo);
			break;
		}
	}
	//add dates
	this._getDates(schedInfo);
	if (CalemDebug.isDebug()) CalemDebug.debug("EditSchedule info="+schedInfo.getJsonPhp());
	return Base64.encode(schedInfo.getJsonPhp());
} 

//This is server type.
CalemEditSchedule.prototype.getEditFieldServerValue =
function() {
	return this.getFieldValue();
} 

CalemEditSchedule.prototype.setFieldError =
function(errMsg) {
	//
} 

CalemEditSchedule.prototype.clearFieldError =
function() {
	//
} 

//Handle radio button clicked.
CalemEditSchedule.prototype.onRadioClicked =
function(noReport) {
	for (var i in this._radioGroups) {
		if (this._radioGroups[i]._el.checked) {
			this._radioGroups[i]._enableCallback.run();
		} else {
			this._radioGroups[i]._disableCallback.run();
		}		
	}
	if (!noReport) {
		this.onVdCallbackProxy(this, true, null);
	}
} 

//Handle checkbox clicked.
CalemEditSchedule.prototype.onWeekdayClick =
function() {
	this.onVdCallbackProxy(this, true, null);
} 

CalemEditSchedule.prototype._setWeeklyDisabled =
function(bl) {
	for (var i in this._dow) {
		this._dow[i]._el.disabled=bl;
	}
}

CalemEditSchedule.prototype._enableWeekly =
function() {
	this._setWeeklyDisabled(false);
}

CalemEditSchedule.prototype._disableWeekly =
function() {
	this._setWeeklyDisabled(true);
}

CalemEditSchedule.prototype._enableWeeks =
function() {
	this._weeks._fld.enable();
	this._weeksOn._fld.enable();
}

CalemEditSchedule.prototype._disableWeeks =
function() {
	this._weeks._fld.disable();
	this._weeksOn._fld.disable();
}

CalemEditSchedule.prototype._enableMonths =
function() {
	this._months._fld.enable();
	this._monthsOn._fld.enable();
	this._monthsOnDow._fld.enable();
}

CalemEditSchedule.prototype._disableMonths =
function() {
	this._months._fld.disable();
	this._monthsOn._fld.disable();
	this._monthsOnDow._fld.disable();
}

CalemEditSchedule.prototype._enableDays =
function() {
	this._days._fld.enable();
}

CalemEditSchedule.prototype._disableDays =
function() {
	this._days._fld.disable();
}

/**
 * Setters
 */
CalemEditSchedule.prototype._setWeekly =
function(schedInfo) {
	this._radioGroups['weekly']._el.checked=true;
	this.onRadioClicked(true);
	//Cleanup first
	for (var i=0; i< this._weekDays.length; i++) {
		if (schedInfo.inWeekly(this._weekDays[i].id)) {
			this._dow[i]._el.checked=true;
		} else {
			this._dow[i]._el.checked=false;
		}
	}
} 

CalemEditSchedule.prototype._setWeeks =
function(schedInfo) {
	this._radioGroups['weeks']._el.checked=true;
	this.onRadioClicked(true);
	var weeks=schedInfo.getWeeks();
	if (weeks) {//Continue setting.
		this._weeks._fld.setValue(weeks.getFreq(), true);
		this._weeksOn._fld.setValue(weeks.getDow(), true);
	}	
} 

CalemEditSchedule.prototype._setMonths =
function(schedInfo) {
	this._radioGroups['months']._el.checked=true;
	this.onRadioClicked(true);
	var months=schedInfo.getMonths();
	if (months) {//Continue setting.
		this._months._fld.setValue(months.getFreq(), true);
		this._monthsOn._fld.setValue(months.getWeekNo(), true);
		this._monthsOnDow._fld.setValue(months.getDow(), true);
	}	
} 

CalemEditSchedule.prototype._setDays =
function(schedInfo) {
	this._radioGroups['days']._el.checked=true;
	this.onRadioClicked(true);
	var days=schedInfo.getDays();
	if (days) {//Continue setting.
		this._days._fld.setValue(days.getFreq(), true);
	}	
} 

/**
 * Getters
 */
CalemEditSchedule.prototype._getWeekly =
function(schedInfo) {
	schedInfo._selection='weekly';
	var ar=[];
	for (var i=0; i< this._dow.length; i++) {
		if (this._dow[i]._el.checked) {
			ar.push(this._weekDays[i].id);
		}
	}
	var wkly=new CalemScheduleWeekly(ar);
	schedInfo._weekly=wkly;
} 

CalemEditSchedule.prototype._getWeeks =
function(schedInfo) {
	schedInfo._selection='weeks';
	var freq=this._weeks._fld.getFieldValue();
	var dow=this._weeksOn._fld.getFieldValue();
	if (!dow) dow=this._weekDays[0].id;
	var wks=new CalemScheduleWeeks(freq, dow);
	schedInfo._weeks=wks;
} 

CalemEditSchedule.prototype._getMonths =
function(schedInfo) {
	schedInfo._selection='months';
	var freq=this._months._fld.getFieldValue();
	var weekNo=this._monthsOn._fld.getFieldValue();
	if (!weekNo) weekNo=this._weekNos[0].id;
	var dow=this._monthsOnDow._fld.getFieldValue();
	if (!dow) dow=this._weekDays[0].id;
	var mths=new CalemScheduleMonths(freq, weekNo, dow);
	schedInfo._months=mths;	
} 

CalemEditSchedule.prototype._getDays =
function(schedInfo) {
	schedInfo._selection='days';
	var freq=this._days._fld.getFieldValue();
	var ds=new CalemScheduleDays(freq);
	schedInfo._days=ds;	
} 

CalemEditSchedule.prototype._getDates =
function(schedInfo) {
	var dates=new CalemScheduleDates(this._startDate._fld.getEditFieldServerValue(), this._endDate._fld.getEditFieldServerValue());
	schedInfo._dates=dates;
}

CalemEditSchedule.prototype._setDates =
function(schedInfo) {
	var dates=schedInfo.getDates();
	if (!dates) return;
	
	var val=dates.getStartLocal();
	val=(val) ? CalemTextUtil.formatLocalDateEdit(val) : CalemTextUtil.getNullReplacement();
	this._startDate._fld.setValue(val, true);
	val=dates.getEndLocal();
	val=(val) ? CalemTextUtil.formatLocalDateEdit(val) : CalemTextUtil.getNullReplacement();
	this._endDate._fld.setValue(val, true);
}

/**
 * radio click function
 */
CalemEditSchedule._onRadioClick =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (obj) obj.onRadioClicked();
} 

CalemEditSchedule._onWeekdayClick =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (obj) obj.onWeekdayClick();
}

 
