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
 * CalemScheduleTimeInfo
 * @param
 * startTime and endTime are server time format.
 * repeat: 0/1 (1 is repeat)
 * selection: m/h (minutes or hour)
 * minutes (1 to 60) and hours (1 to 24) are integers
 */
function CalemScheduleTimeInfo(startTime, repeat, endTime, selection, minutes, hours) {
	if (arguments.length==0) return;
	this._startTime=startTime;
	this._repeat=repeat;
	this._endTime=endTime;
	this._selection=selection
	this._minutes=minutes;
	this._hours=hours;
}

CalemScheduleTimeInfo._MINUTES = 'm';
CalemScheduleTimeInfo._HOURS = 'h';

CalemScheduleTimeInfo._decode =
function(val) {
	var rtn;
	var info = val ? Base64.decode(val) : null;
	if (info) {
		eval("var obj="+info);
		rtn=CalemJson.setJson(obj);
	} else {
		rtn=new CalemScheduleTimeInfo();
	}
	return rtn;	
}

CalemScheduleTimeInfo.prototype.toString = function() {return "CalemScheduleTimeInfo";}
CalemScheduleTimeInfo.prototype.getClassName = function() {return "CalemScheduleTimeInfo";}

//Deserialize the object
CalemScheduleTimeInfo.prototype.setJson =
function(obj) {
	this._startTime=obj.startTime;
	this._repeat=obj.repeat;
	this._endTime=obj.endTime;
	this._selection=obj.selection;
	this._minutes=obj.minutes;
	this._hours=obj.hours;
}

//Serialization - for PHP use as well.
CalemScheduleTimeInfo.prototype.getJsonPhp =
function() {
	return ["{\"CalemScheduleTimeInfo\": {\"startTime\": '", this.getStartTime(), "'",
			  ", \"repeat\": ", this.getRepeat(),
			  ", \"endTime\": '", this.getEndTime(), "'",
			  ", \"selection\": '", this.getSelection(), "'",
			  ", \"minutes\": ", this.getMinutes(), 
			  ", \"hours\": ", this.getHours(),"}}"].join('');
}

CalemScheduleTimeInfo.prototype.getStartTime =
function() {
	return this._startTime;
}

CalemScheduleTimeInfo.prototype.getRepeat =
function() {
	return this._repeat;
}

CalemScheduleTimeInfo.prototype.getEndTime =
function() {
	return this._endTime;
}

CalemScheduleTimeInfo.prototype.getSelection =
function() {
	return this._selection ? this._selection : CalemScheduleTimeInfo._MINUTES;
}



CalemScheduleTimeInfo.prototype.getMinutes =
function() {
	return this._minutes ? this._minutes : 0;
}

CalemScheduleTimeInfo.prototype.getHours =
function() {
	return this._hours ? this._hours : 0;
}

CalemScheduleTimeInfo.prototype.isRepeatValid =
function() {
	return (this._repeat && (this.isMinValid() || this.isHourValid()));
}

CalemScheduleTimeInfo.prototype.isMinValid =
function() {
	return (this._selection==CalemScheduleTimeInfo._MINUTES && this._minutes > 0 && this._minutes <=60);
}

CalemScheduleTimeInfo.prototype.isHourValid =
function() {
	return (this._selection==CalemScheduleTimeInfo._HOURS && this._hours > 0 && this._hours <=24);
}

CalemScheduleTimeInfo.prototype.getText =
function() {
	var text='';
	if (!this._startTime) {
		return text;
	}
	var start=CalemTextUtil._getLocalTimeFromServerTime(this._startTime);
	var tm=AjxMessageFormat.format(CalemMsg.getMsg('schedule_time_start'), [start]);
	if (!this.isRepeatValid()) {
		return tm;
	}
	//We've got valid repeat
	if (this._endTime) {
		var end=CalemTextUtil._getLocalTimeFromServerTime(this._endTime);
		tm=AjxMessageFormat.format(CalemMsg.getMsg('schedule_time_start_end'), [start, end]);
	} 
	//construct mins/hours
	var iv;
	if (this.isMinValid()) {
		iv=AjxMessageFormat.format(CalemMsg.getMsg('schedule_time_minutes'), [this._minutes]);
	} else {
		iv=AjxMessageFormat.format(CalemMsg.getMsg('schedule_time_hours'), [this._hours]);
	}
	//Now combine the text together
	text=AjxMessageFormat.format(CalemMsg.getMsg('schedule_time_full'), [tm, iv]);
	return text;
}
