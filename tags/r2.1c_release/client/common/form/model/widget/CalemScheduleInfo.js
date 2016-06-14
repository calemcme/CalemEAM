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
 * CalemScheduleInfo
 */
function CalemScheduleInfo(selection, weekly, weeks, months, dates, days) {
	if (arguments.length==0) return;
	this._selection=selection;
	this._weekly=weekly;
	this._weeks=weeks;
	this._months=months;
	this._days=days;
	this._dates=dates;
}

CalemScheduleInfo._decode =
function(val) {
	var rtn;
	var info = val ? Base64.decode(val) : null;
	if (info) {
		eval("var obj="+info);
		rtn=CalemJson.setJson(obj);
	} else {
		rtn=new CalemScheduleInfo();
	}
	return rtn;	
}

CalemScheduleInfo.prototype.toString = function() {return "CalemScheduleInfo";}
CalemScheduleInfo.prototype.getClassName = function() {return "CalemScheduleInfo";}

//Deserialize the object
CalemScheduleInfo.prototype.setJson =
function(obj) {
	this._selection=obj.selection;
	this._weekly=CalemJson.setJson(obj.weekly);
	this._weeks=CalemJson.setJson(obj.weeks);
	this._months=CalemJson.setJson(obj.months);
	this._days=CalemJson.setJson(obj.days);
	this._dates=CalemJson.setJson(obj.dates);
}

//Serialization - for PHP use as well.
CalemScheduleInfo.prototype.getJsonPhp =
function() {
	return ["{\"CalemScheduleInfo\": {\"selection\": '", this.getSelection(), "'",
	        (this._weekly ? [", \"weekly\": ", this._weekly.getJsonPhp()].join('') : ''), 
	        (this._weeks  ?  [", \"weeks\": ", this._weeks.getJsonPhp()].join('') : ''),
	        (this._months ?  [", \"months\": ", this._months.getJsonPhp()].join('') : ''),
	        (this._days ?  [", \"days\": ", this._days.getJsonPhp()].join('') : ''),
	        (this._dates  ?   [", \"dates\": ", this._dates.getJsonPhp()].join('') : ''), "}}"].join('');
}

CalemScheduleInfo.prototype.getSelection =
function() {
	return this._selection ? this._selection : CalemConf['edit_schedule']['defaultSelection'];
}

CalemScheduleInfo.prototype.getWeekly =
function() {
	return this._weekly;
}

CalemScheduleInfo.prototype.getWeeks =
function() {
	return this._weeks;
}

CalemScheduleInfo.prototype.getMonths =
function() {
	return this._months;
}

CalemScheduleInfo.prototype.getDays =
function() {
	return this._days;
}

CalemScheduleInfo.prototype.getDates =
function() {
	return this._dates;
}

CalemScheduleInfo.prototype.inWeekly =
function(dow) {
	return this._weekly ? this._weekly.inDow(dow) : false;
}

CalemScheduleInfo.prototype.getText =
function() {
	var text='';
	var obj=null;
	if (this._selection=='weekly') {
		obj=this._weekly;
	} else if (this._selection=='weeks') {
		obj=this._weeks;
	} else if (this._selection=='months'){
		obj=this._months;
	} else if (this._selection=='days'){
		obj=this._days;
	}
	if (obj) {
		text=obj.getText();
		var dtText= this._dates ? this._dates.getText() : null;
		if (dtText) text=[text, ' ', dtText].join('');
	}
	return text;
}

/**
 * Weekly
 */
function CalemScheduleWeekly(arDow) {
	if (arguments.length==0) return;
	if (arDow && arDow instanceof Array) {
		this._dow=arDow;
	} else {
		this._dow=new Array();
	}
}

CalemScheduleWeekly.prototype.toString = function() {return "CalemScheduleWeekly";}
CalemScheduleWeekly.prototype.getClassName = function() {return "CalemScheduleWeekly";}

//Deserialize the object
CalemScheduleWeekly.prototype.setJson =
function(obj) {
	this._dow=CalemJson.setJsonAsArray(obj);
}

//Serialization - for PHP use as well.
CalemScheduleWeekly.prototype.getJsonPhp =
function() {
	return ["{\"CalemScheduleWeekly\": ", CalemJson.arrayToJson(this._dow), "}"].join('');
}

CalemScheduleWeekly.prototype.getDow =
function() {
	return this._dow;
}

CalemScheduleWeekly.prototype.inDow =
function(dow) {
	var rtn=false;
	if (this._dow) {
		for (var i=0; i< this._dow.length; i++) {
			if (this._dow[i]==dow) {
				rtn=true;
				break;
			}
		}
	}
	return rtn;
}

CalemScheduleWeekly.prototype.getText =
function() {
	var text=null;
	if (this._dow) {
		var ar=[];
		for (var i=0; i< this._dow.length; i++) ar.push(CalemMsg.getMsg(this._dow[i]));
		if (ar.length > 0) {
			text=AjxMessageFormat.format(CalemMsg.getMsg('schedule_weekly_text'), [ar.join(', ')]);
		}
	}
	return text;
}

/**
 * CalemScheduleWeeks
 */
function CalemScheduleWeeks(freq, dow) {
	if (arguments.length==0) return;
	this._freq=freq;
	this._dow=dow;
}

CalemScheduleWeeks.prototype.toString = function() {return "CalemScheduleWeeks";}
CalemScheduleWeeks.prototype.getClassName = function() {return "CalemScheduleWeeks";}

//Deserialize the object
CalemScheduleWeeks.prototype.setJson =
function(obj) {
	this._freq=obj.freq;
	this._dow=obj.dow;
}

//Serialization - for PHP use as well.
CalemScheduleWeeks.prototype.getJsonPhp =
function() {
	return ["{\"CalemScheduleWeeks\": {\"freq\": ", (this._freq ? this._freq : 0), 
	        ", \"dow\": '", this._dow,"'}}"].join('');
}

CalemScheduleWeeks.prototype.getFreq =
function() {
	return this._freq;
}

CalemScheduleWeeks.prototype.getDow =
function() {
	return this._dow;
}

CalemScheduleWeeks.prototype.getText =
function() {
	var text=null;
	if (this._freq) {
		text=AjxMessageFormat.format(CalemMsg.getMsg('schedule_weeks_text'), 
		      [this._freq, CalemMsg.getMsg(this._dow)]);
	}
	return text;
}

/**
 * CalemScheduleMonths
 */
function CalemScheduleMonths(freq, weekNo, dow) {
	if (arguments.length==0) return;
	this._freq=freq;
	this._weekNo=weekNo;
	this._dow = dow;
}

CalemScheduleMonths.prototype.toString = function() {return "CalemScheduleMonths";}
CalemScheduleMonths.prototype.getClassName = function() {return "CalemScheduleMonths";}

//Deserialize the object
CalemScheduleMonths.prototype.setJson =
function(obj) {
	this._freq=obj.freq;
	this._weekNo=obj.weekNo;
	this._dow=obj.dow;
}

//Serialization - for PHP use as well.
CalemScheduleMonths.prototype.getJsonPhp =
function() {
	return ["{\"CalemScheduleMonths\": {\"freq\": ", (this._freq ? this._freq : 0), 
	        ", \"weekNo\": '", this._weekNo, 
	        "', \"dow\": '", this._dow, "'}}"].join('');
}

CalemScheduleMonths.prototype.getFreq =
function() {
	return this._freq;
}

CalemScheduleMonths.prototype.getWeekNo =
function() {
	return this._weekNo;
}

CalemScheduleMonths.prototype.getDow =
function() {
	return this._dow;
}

CalemScheduleMonths.prototype.getText =
function() {
	var text=null;
	if (this._freq) {
		text=AjxMessageFormat.format(CalemMsg.getMsg('schedule_months_text'), 
		      [this._freq, CalemMsg.getMsg(this._weekNo), CalemMsg.getMsg(this._dow)]);
	}
	return text;
}

/**
 * CalemScheduleDays
 */
function CalemScheduleDays(freq) {
	if (arguments.length==0) return;
	this._freq=freq;
}

CalemScheduleDays.prototype.toString = function() {return "CalemScheduleDays";}
CalemScheduleDays.prototype.getClassName = function() {return "CalemScheduleDays";}

//Deserialize the object
CalemScheduleDays.prototype.setJson =
function(obj) {
	this._freq=obj.freq;
}

//Serialization - for PHP use as well.
CalemScheduleDays.prototype.getJsonPhp =
function() {
	return ["{\"CalemScheduleDays\": {\"freq\": ", (this._freq ? this._freq : 0), "}}"].join('');
}

CalemScheduleDays.prototype.getFreq =
function() {
	return this._freq;
}

CalemScheduleDays.prototype.getText =
function() {
	var text=null;
	if (this._freq) {
		text=AjxMessageFormat.format(CalemMsg.getMsg('schedule_days_text'), [this._freq]);
	}
	return text;
}

/**
 * CalemScheduleDates
 */
function CalemScheduleDates(start, end) {
	if (arguments.length==0) return;
	this._start=start;
	this._end=end;
}

CalemScheduleDates.prototype.toString = function() {return "CalemScheduleDates";}
CalemScheduleDates.prototype.getClassName = function() {return "CalemScheduleDates";}

//Deserialize the object
CalemScheduleDates.prototype.setJson =
function(obj) {
	this._start=obj.start;
	this._end=obj.end;
}

//Serialization - for PHP use as well.
CalemScheduleDates.prototype.getJsonPhp =
function() {
	return ["{\"CalemScheduleDates\": {\"start\": '", this._start, 
	        "', \"end\": '", this._end, "'}}"].join('');
}

CalemScheduleDates.prototype.getStartLocal =
function() {
	return this._getDateLocal(this._start);
}

CalemScheduleDates.prototype.getEndLocal =
function() {
	return this._getDateLocal(this._end);
}

CalemScheduleDates.prototype._getDateLocal =
function(dateStr) {
	var rtn=null;
	if (dateStr) {
		rtn=CalemTextUtil.parseServerDate(dateStr);
	}
	return rtn;
}

CalemScheduleDates.prototype.getText =
function() {
	var start = this.getStartLocal();
	if (start) start=CalemTextUtil.formatLocalDateRead(start);
	var end = this.getEndLocal();
	if (end) end=CalemTextUtil.formatLocalDateRead(end);

	var text=null;
	if (start && end) {
		text=AjxMessageFormat.format(CalemMsg.getMsg('schedule_dates_from_till'), [start, end]);
	} else if (start) {
		text=AjxMessageFormat.format(CalemMsg.getMsg('schedule_dates_from'), [start]);
	} else if (end) {
		text=AjxMessageFormat.format(CalemMsg.getMsg('schedule_dates_till'), [end]);
	}
	return text;
}
