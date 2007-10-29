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
 * String trim function
 * @see http://www.thescripts.com/forum/thread165013.html by Alex Vassiliev
 */
String.prototype.trim = 
function() {
	return this.replace(/^\s*|\s*$/g, "");
} 

/**
 * Workaround the 10/31/05 DST time issue.
 */
// By pass detailed comparison for now
AjxTimezone._compareRules = 
function(rule, std, dst, pos) {
	var equal = false;
	var d = new Date(rule.changeStd[0], rule.changeStd[1], (rule.changeStd[2] -1)).getTimezoneOffset();
	var s = new Date(rule.changeStd[0], rule.changeStd[1], (rule.changeStd[2] + 30)).getTimezoneOffset();
	if (!pos) {
		s = s * -1;
		d = d * -1;
	}
	//alert("name = " + rule.name + ' s = ' + s + " d = " + d + " std = " + std + " dst = " + dst);
	if ( (std == s) && (dst == d) ) {
		s = new Date(rule.changeD[0], rule.changeD[1], (rule.changeD[2] -30)).getTimezoneOffset();
		d = new Date(rule.changeD[0], rule.changeD[1], (rule.changeD[2] + 1)).getTimezoneOffset();
		if (!pos) {
			s = s * -1;
			d = d * -1;
		}
		//alert("name = " + rule.name + ' s = ' + s + " d = " + d + " std = " + std + " dst = " + dst);
		if ((std == s) && (dst == d))
			equal = true;
	}
	return equal;
}; 

/**
 * Date utility
 */
function CalemTextUtil() {
} 

var k=0;
CalemTextUtil.DATE_READ_FORMATTER = k++;
CalemTextUtil.DATE_EDIT_FORMATTER = k++;
CalemTextUtil.DATE_SERVER_FORMATTER = k++;

CalemTextUtil.TIME_READ_FORMATTER = k++;
CalemTextUtil.TIME_EDIT_FORMATTER = k++;
CalemTextUtil.TIME_SERVER_FORMATTER = k++;

CalemTextUtil.DATETIME_READ_FORMATTER = k++;
CalemTextUtil.DATETIME_SERVER_FORMATTER = k++;

CalemTextUtil.INTEGER_FORMATTER =k++;
CalemTextUtil.INTEGER_SERVER_FORMATTER = k++;

CalemTextUtil.NUMBER_FORMATTER = k++;
CalemTextUtil.NUMBER_SERVER_FORMATTER = k++;

CalemTextUtil.CURRENCY_READ_FORMATTER  =k++;
CalemTextUtil.CURRENCY_EDIT_FORMATTER  =k++;

CalemTextUtil.PERCENT_FORMATTER =k++;

//Time portion fill
CalemTextUtil.NULL_YEAR=1970;
CalemTextUtil.NULL_MONTH=1;
CalemTextUtil.NULL_DATE=1;
CalemTextUtil.NULL_HOURS=0;
CalemTextUtil.NULL_MINUTES=0;
CalemTextUtil.NULL_SECONDS=0;
CalemTextUtil.NULL_MS=0;

CalemTextUtil.formatters = new Array();

CalemTextUtil._init = 
function() {
	CalemTextUtil._timezone = AjxTimezone._guessMachineTimezone();
	CalemTextUtil._clientId = AjxTimezone.getClientId(CalemTextUtil._timezone);
	
	var conf=CalemConf["text_formatter"];
	var i=0;
	CalemTextUtil.formatters[i++]= new AjxDateFormat(conf.date.read);
	CalemTextUtil.formatters[i++]= new AjxDateFormat(conf.date.edit);
	CalemTextUtil.formatters[i++]= new AjxDateFormat(conf.date.server);

	CalemTextUtil.formatters[i++]= new AjxDateFormat(conf.time.read);
	CalemTextUtil.formatters[i++]= new AjxDateFormat(conf.time.edit);
	CalemTextUtil.formatters[i++]= new AjxDateFormat(conf.time.server);

	CalemTextUtil.formatters[i++]= new AjxDateFormat(conf.datetime.read);
	CalemTextUtil.formatters[i++]= new AjxDateFormat(conf.datetime.server);

	CalemTextUtil.formatters[i++]= new AjxNumberFormat(conf.integer.local);
	CalemTextUtil.formatters[i++]= new AjxNumberFormat(conf.integer.server);
	
	CalemTextUtil.formatters[i++]= new AjxNumberFormat(conf.number.local);
	CalemTextUtil.formatters[i++]= new AjxNumberFormat(conf.number.server);
	
	CalemTextUtil.formatters[i++]= new AjxNumberFormat(conf.sys_currency.read);
	CalemTextUtil.formatters[i++]= new AjxNumberFormat(conf.sys_currency.edit);
	
	CalemTextUtil.formatters[i++]= new AjxNumberFormat(conf.percent);	
}

CalemTextUtil.getTimezone = function() {return CalemTextUtil._timezone;}
CalemTextUtil.getClientId = function() {return CalemTextUtil._clientId;}
CalemTextUtil.getFormatter = function(i) {return CalemTextUtil.formatters[i];}

/** DST considered when getting offset */
CalemTextUtil.getLocalTimeOffset =
function(date) {
	return -1 * date.getTimezoneOffset();
}

CalemTextUtil.getNoDateTimeOffset =
function() {
	var rule = AjxTimezone.getRule(CalemTextUtil.getClientId());
	return rule ? -1*rule.stdOffset : 0;
}
/**
 * Persistence functions for formatting for server storage.
 */
CalemTextUtil.formatServerDate=
function(date) {
	return CalemTextUtil.getFormatter(CalemTextUtil.DATE_SERVER_FORMATTER).format(date);
}

CalemTextUtil.formatServerDateTime=
function(date) {
	return CalemTextUtil.getFormatter(CalemTextUtil.DATETIME_SERVER_FORMATTER).format(date);
}

CalemTextUtil.formatServerTime=
function(date) {
	return CalemTextUtil.getFormatter(CalemTextUtil.TIME_SERVER_FORMATTER).format(date);
}

//- Local date based on local date format
CalemTextUtil.formatLocalDateRead=
function(date) {
	return CalemTextUtil.getFormatter(CalemTextUtil.DATE_READ_FORMATTER).format(date);
}

CalemTextUtil.formatLocalDateEdit=
function(date) {
	return CalemTextUtil.getFormatter(CalemTextUtil.DATE_EDIT_FORMATTER).format(date);
}

CalemTextUtil.formatTimeEdit=
function(date) {
	return CalemTextUtil.getFormatter(CalemTextUtil.TIME_EDIT_FORMATTER).format(date);
}

//- integer
CalemTextUtil.formatServerInteger=
function(i) {
	return CalemTextUtil.getFormatter(CalemTextUtil.INTEGER_SERVER_FORMATTER).format(i);
}

CalemTextUtil.formatServerNumber=
function(n) {
	return CalemTextUtil.getFormatter(CalemTextUtil.NUMBER_SERVER_FORMATTER).format(n);
}

//Date time equality
CalemTextUtil.dateEquals =
function(dt1, dt2) {
	return (dt1.getFullYear()==dt2.getFullYear() 
	      && dt1.getMonth()==dt2.getMonth()
	      && dt1.getDate()==dt2.getDate());
}

CalemTextUtil.timeEquals =
function(dt1, dt2) {
	return (dt1.getHours()==dt2.getHours() 
	      && dt1.getMinutes()==dt2.getMinutes()
	      && (!CalemConf['text_formatter']['time_compare_secs'] || dt1.getSeconds()== dt2.getSeconds()) );
}

/**
 * Server date is of the format: yyyy-mm-dd
 */
CalemTextUtil.parseServerDate=
function(dateStr, reset) {
	if (!dateStr) return null;
	var dt = new Date();
	var yyyy = parseInt(dateStr.substr(0,4), 10);
	var MM = parseInt(dateStr.substr(5,2), 10);
	var dd = parseInt(dateStr.substr(8,2), 10);
	dt.setFullYear(yyyy);
	dt.setMonth(MM - 1);
	dt.setMonth(MM - 1); // See AjxUtil's comment so keep as is.
	dt.setDate(dd);
	if (reset) dt=CalemTextUtil.resetTime(dt);
	return dt;
}

CalemTextUtil.resetTime =
function(dt) {
	if (dt) {
		dt.setHours(CalemTextUtil.NULL_HOURS, CalemTextUtil.NULL_MINUTES, 
							CalemTextUtil.NULL_SECONDS, CalemTextUtil.NULL_MS);
	}
	return dt;
}

/**
 * Server time is of the format: hh:mm:ss
 */
CalemTextUtil.parseServerTimeGmt=
function(dateStr) {
	return CalemTextUtil._parseServerTime(dateStr, false);
}

CalemTextUtil.parseServerTimeLocal=
function(dateStr) {
	return CalemTextUtil._parseServerTime(dateStr, true);
}

CalemTextUtil._parseServerTime=
function(dateStr, toGmt) {
	if (!dateStr) return null;
	var dt = new Date();
	var hh = parseInt(dateStr.substr(0,2), 10);
	var mm = parseInt(dateStr.substr(3,2), 10);
	if (toGmt) mm -= CalemTextUtil.getNoDateTimeOffset();  
	var ss = parseInt(dateStr.substr(6,2), 10);
	dt.setHours(hh, mm, ss, 0);
	return dt;
}

/**
 * Get local time presentation out of server time
 */
CalemTextUtil._getLocalTimeFromServerTime =
function(serverTime) {
	var rtn=null;
	if (serverTime) {
		var dt=CalemTextUtil.parseServerTimeLocal(serverTime);
		rtn=CalemTextUtil.formatTimeEdit(dt);
	}
	return rtn;
}

/**
 * Server datetime is of the format: yyyy-mm-dd hh:mi:ss
 * Server time is in UTC so let's convert to local time.
 */
CalemTextUtil.PARSE_TO_LOCAL = 1;
CalemTextUtil.PARSE_TO_GMT   = 2;
CalemTextUtil.PARSE_TO_NONE  = 3;

/**
 * Check for empty hour/min/sec/ms
 */
CalemTextUtil.isTimeNull =
function(date) {
	return (date.getHours()==CalemTextUtil.NULL_HOURS && date.getMinutes()==CalemTextUtil.NULL_MINUTES
	    &&  date.getSeconds()==CalemTextUtil.NULL_SECONDS && date.getMilliseconds()==CalemTextUtil.NULL_MS);
} 

CalemTextUtil.isNullHms = 
function(hh, mm, ss) {
	return (hh==CalemTextUtil.NULL_HOURS && mm==CalemTextUtil.NULL_MINUTES && ss==CalemTextUtil.NULL_SECONDS);
}
 
CalemTextUtil.parseServerDateTimeToLocal=
function(dateStr) {
	return CalemTextUtil._parseServerDateTime(dateStr, CalemTextUtil.PARSE_TO_LOCAL);
}

CalemTextUtil.parseServerDateTimeToGmt=
function(dateStr) {
	return CalemTextUtil._parseServerDateTime(dateStr, CalemTextUtil.PARSE_TO_GMT);
}

/**
 * Parse server date time and no timezone processing.
 */
CalemTextUtil.parseServerDateTime=
function(dateStr) {
	return CalemTextUtil._parseServerDateTime(dateStr, CalemTextUtil.PARSE_TO_NONE);
}

CalemTextUtil._parseServerDateTime=
function(dateStr, to) {
	var dt= CalemTextUtil.parseServerDate(dateStr);
	//Let's figure out the DST
	var hh = parseInt(dateStr.substr(11,2), 10);
	var mm = parseInt(dateStr.substr(14,2), 10);
	var ss = parseInt(dateStr.substr(17,2), 10);
	if (!CalemTextUtil.isNullHms(hh, mm, ss)) {
		if (to!=CalemTextUtil.PARSE_TO_NONE) {
			var offset=CalemTextUtil.getLocalTimeOffset(dt);
			if (to==CalemTextUtil.PARSE_TO_LOCAL) mm += offset;
			else mm -= offset;
		} 
	}
	dt.setHours(hh, mm, ss, 0);
	return dt;
}

/**
 * Converting a GMT date to local date.
 */
CalemTextUtil.gmtDateTimeToLocal =
function(date) {
	if (!date) return null;
	var lcDate=new Date();
	lcDate.setTime(date.getTime());
	if (!CalemTextUtil.isTimeNull(date)) {
		var mm=date.getMinutes();
		mm += CalemTextUtil.getLocalTimeOffset(date);
		lcDate.setMinutes(mm);
	}
	return lcDate;
}

//Parse local string date time.
CalemTextUtil.localDateTimeToGmt =
function(date) {
	if (!date) return null;
	var gmtDate=new Date();
	gmtDate.setTime(date.getTime());
	if (!CalemTextUtil.isTimeNull(date)) {
		var mm=date.getMinutes();
		mm -= CalemTextUtil.getLocalTimeOffset(date);
		gmtDate.setMinutes(mm);
	}
	return gmtDate;
}

//Parse local time to GMT - make it consistent with CalemTextUtio._parseServerTime
CalemTextUtil.localTimeToGmt =
function(date) {
	if (!date) return null;
	var ldate=new Date();
	ldate.setTime(date.getTime());
	var mm=date.getMinutes();
	mm += CalemTextUtil.getNoDateTimeOffset();
	ldate.setMinutes(mm);
	return ldate;
}

//Get current GMT time
CalemTextUtil.getCurrentGmt =
function() {
	var dt=new Date();
	return CalemTextUtil.localDateTimeToGmt(dt);
}

/**
 * Validation function
 * @exception thrown exception if validation fails.
 */
CalemTextUtil.isDateValid =
function(dateStr, formatter) {
	//Check for null string case
	if (!dateStr) return null;
	var dt;
	try {
		dt=formatter.parse(dateStr);
		if (dt==null) throw AjxMsg.invalidDatetimeString;
		dateStr=formatter.format(dt);			
	} catch (e) {
		throw AjxMsg.invalidDatetimeString;
	}
	return dateStr;
}

/**
 * Filter validation methods
 * @return the date object if it's valid.
 */
CalemTextUtil.isLocalDateValid =
function(dateStr) {
	var fmt=CalemTextUtil.getFormatter(CalemTextUtil.DATE_EDIT_FORMATTER);
	return CalemTextUtil.isDateValid(dateStr, fmt);
}

CalemTextUtil.isLocalTimeValid =
function(timeStr) {
	var fmt=CalemTextUtil.getFormatter(CalemTextUtil.TIME_EDIT_FORMATTER);
	return CalemTextUtil.isDateValid(timeStr, fmt);
}


/**
 * Simple and quick numeric parsing utility functions for integer, number, currency and percent.
 * @todo to revisit when needs arise.
 */
CalemTextUtil._simplifyNumberString =
function(intStr, extra) {
	//Remove space and thousand separator, then replace decimal with "."
	extra= extra ? ('|'+ extra) : '';
	var re = new RegExp(['\\s|', I18nMsg.numberSeparatorGrouping, extra].join(''), 'g');
	var st=intStr.replace(re, '');
	st=st.replace(I18nMsg.numberSeparatorDecimal, '.');	
	return CalemTextUtil._parseMinusSign(st);
}

CalemTextUtil._verifyValidDigits =
function(st, split, frontExceptions, backExceptions) {
	var ar=[];
	if (split) {
		ar=st.split(split);
	} else {
		ar.push(st);
	}
	if (ar.length>2) return null;
	for (var i=0; i< ar.length; i++) {
		var a=ar[i].match(/\D/);
		if (a) {
			if ( (i==0 && frontExceptions && frontExcepion.indexOf(a) != -1)
			   ||(i==1 && backExceptions && backExceptions.indexOf(a) != -1)) continue;
			else throw AjxMsg.notANumber;
		}
	}
	return st;
}

CalemTextUtil._parseMinusSign =
function(st) {
	//Leading and trailing minus sign
	var sign=-1;
	if (st) {
		if (st.charAt(0)==I18nMsg.numberSignMinus) {
			sign=0;
			st=st.substring(1);
		} else if (st.charAt(st.length-1)==I18nMsg.numberSignMinus) {
			st=st.substring(0, st.length-1);
			sign=1;
		}		
	}
	return {sign: sign, st: st};
}

CalemTextUtil._addMinusSign =
function(sign, st) {
	if (sign>=0) {
		st=I18nMsg.numberSignMinus + st;
	} 
	return st;
}
CalemTextUtil._parseValid =
function(n, st) {
	return !isNaN(n);
}

CalemTextUtil.isIntegerValid =
function(intStr) {
	 var rtn=null;
	 if (intStr) {
	 	 var sp=CalemTextUtil._simplifyNumberString(intStr);
	 	 var sign=sp.sign;
	 	 var st=sp.st;
		 if (CalemTextUtil._verifyValidDigits(st)) {
		 	 st=CalemTextUtil._addMinusSign(sign, st);
			 var i=parseInt(st);
			 if (CalemTextUtil._parseValid(i, st)) rtn=i;
		 }
		 if (isNaN(rtn)) throw AjxMsg.notAnInteger;
	 }
	 return rtn;
}

CalemTextUtil.isNumberValid =
function(nStr) {
	 var rtn=null;
	 if (nStr) {
	 	 var sp=CalemTextUtil._simplifyNumberString(nStr);
	 	 var sign=sp.sign;
	 	 var st=sp.st;
		 if (CalemTextUtil._verifyValidDigits(st, '.')) {
		 	 st=CalemTextUtil._addMinusSign(sign, st);
			 var i=parseFloat(st);
			 if (CalemTextUtil._parseValid(i, st)) rtn=i;
		 }
		 if (isNaN(rtn)) throw AjxMsg.notANumber;
	 }
	 return rtn;
}

CalemTextUtil.isPercentValid =
function(pStr) {
	 var rtn=null;
	 if (pStr) {
	 	 //Remove percent sign at the end if applicable
	 	 if (pStr.indexOf(I18nMsg.numberSignPercent)==pStr.length -1) {
	 	 	pStr=pStr.substr(0, pStr.length-1);
	 	 }
	 	 var sp=CalemTextUtil._simplifyNumberString(pStr);
	 	 var sign=sp.sign;
	 	 var st=sp.st;
		 if (CalemTextUtil._verifyValidDigits(st, '.')) {
		 	 st=CalemTextUtil._addMinusSign(sign, st);
			 var i=parseFloat(st);
			 if (CalemTextUtil._parseValid(i, st)) rtn=i;
		 }
		 if (isNaN(rtn)) throw AjxMsg.notANumber;
		 rtn= rtn/100;
	 }
	 return rtn;
}

CalemTextUtil._encodeReCurrencySymbol =
function(s) {
	if (s.length==1 && s.match(/[$.^]/)) s="\\"+s;
	return s;
}

CalemTextUtil.isCurrencyValid =
function(cStr) {
	 var rtn=null;
	 if (cStr) {
	 	 var s=CalemTextUtil._encodeReCurrencySymbol(I18nMsg.currencySymbol);
	 	 var sp=CalemTextUtil._simplifyNumberString(cStr, s);
	 	 var sign=sp.sign;
	 	 var st=sp.st;	 
		 if (CalemTextUtil._verifyValidDigits(st, '.')) {
		 	 st=CalemTextUtil._addMinusSign(sign, st);
			 var i=parseFloat(st);
			 if (CalemTextUtil._parseValid(i, st)) rtn=i;
		 }
		 if (isNaN(rtn)) throw AjxMsg.notANumber;
	 }
	 return rtn;
}

/**
 * Wrap text
 */
CalemTextUtil.wrapText =
function(text, len, eol) {
	len = len || CalemConf['dialog_text_wrap']['len'];
	eol = eol || CalemConf['dialog_text_wrap']['eol'];
	return AjxStringUtil.wordWrap(text, len, eol);
}

//Get time parsing conf.
CalemTextUtil._TimeParse=CalemConf["text_formatter"].time.parse;

/**
 * Adding parsing functions to time data
 * 
 */
AjxFormat.Segment._parseIntOpen = function(o, f, adjust, s, index) {
	var len=s.length;
	var head = index;
	for (var i = head; i < len; i++) {
		if (!s.charAt(index++).match(/\d/)) {
			index--;
			break;
		}
	}
	var tail = index;
	if (head == tail) {
		throw new AjxFormat.ParsingException(this._parent, this, "number not present"); // I18n
	}
	var value = parseInt(s.substring(head, tail), 10);
	if (f) {
		var target = o || window;
		f.call(target, value + adjust);
	}
	return tail;
};

AjxFormat.Segment._parseLiteralOpen = function(s, index, delimiter) {
	var len=s.length;
	var head = index;
	for (var i = head; i < len; i++) {
		if (s.charAt(index++).match(delimiter)) {
			index--;
			break;
		}
	}
	
	var tail = index;
	if (head == tail) {
		throw new AjxFormat.ParsingException(this._parent, this, "literal not present"); // I18n
	}
	return tail;
};
	
//Parsing functions
AjxDateFormat.HourSegment.prototype.parse = function(date, s, index) {	
	var nindex = AjxFormat.Segment._parseIntOpen(date, date.setHours, 0, s, index);
	return nindex;
};

AjxDateFormat.MinuteSegment.prototype.parse = function(date, s, index) {
	var nindex = AjxFormat.Segment._parseIntOpen(date, date.setMinutes, 0, s, index);
	return nindex;
};

AjxDateFormat.SecondSegment.prototype.parse = function(date, s, index) {
	var nindex = AjxFormat.Segment._parseIntOpen(date, date.setSeconds, 0, s, index);
	return nindex;
};

AjxDateFormat.AmPmSegment.prototype.parse = function(date, s, index) {
	var value=null;
	try {
		var nindex=AjxFormat.Segment._parseLiteralOpen(s, index, ' ');
		value=s.substring(index, nindex);
	} catch (ex) {
		//No am/pm found.
		value=null;
		if (CalemTextUtil._TimeParse.ampm_reqd) throw ex;
	}
	var hours=date.getHours();
	if (value) {
		if (value==I18nMsg["periodAm"]) {
			if (hours >= 12) hours -=12; // throw new AjxFormat.ParsingException(this._parent, this, "Invalid AM setting"); // I18n
		} else if (value==I18nMsg["periodPm"]) {
			if (hours < 12) date.setHours(hours+12);
		}
	} else {
		//Deciding if it's am or pm
		if (hours < CalemTextUtil._TimeParse.pmMax) date.setHours(hours+12);;
	}
	return nindex;
};

AjxDateFormat.TimezoneSegment.prototype.parse = function(date, s, index) {
	//Don't deal with it.
	return s.length();
}; 

//A correction to get proper formatting
// Protected methods

AjxNumberFormat.NumberSegment.prototype._normalize = function(s) {
	var match = s.split(/([\.Ee])/);	
	// normalize whole part
	var whole = match.shift();
	if (whole.length < this._parent._minIntDigits) {
		whole = AjxFormat._zeroPad(whole, this._parent._minIntDigits, I18nMsg.numberZero);
	}
	if (whole.length > this._parent._groupingOffset) {
		var a = [];
		
		var i = whole.length - this._parent._groupingOffset;
		while (i > 0) {
			a.unshift(whole.substr(i, this._parent._groupingOffset));
			a.unshift(I18nMsg.numberSeparatorGrouping);
			i -= this._parent._groupingOffset;
		}
		a.unshift(whole.substring(0, i + this._parent._groupingOffset));
		
		whole = a.join("");
	}
	// normalize rest
	var fract = '0';
	var expon;
	if (match.length>0) {//workaround for IE 7.0Beta that '.' or 'E/e' is not included.
		if (!match[0].match(/[\.Ee]/)) {
			fract=match[0];
		} else {
			while (match.length > 0) {
				switch (match.shift()) {
					case '.': fract = match.shift(); break;
					case 'E': case 'e': expon = match.shift(); break;
					default: // NOTE: should never get here!
				}
			}
		}
	}
	

	fract = fract.replace(/0+$/,"");
	if (fract.length < this._parent._minFracDigits) {
		fract = AjxFormat._zeroPad(fract, this._parent._minFracDigits, I18nMsg.numberZero, true);
	}
	
	var a = [ whole ];
	if (fract.length > 0) {
		var decimal = this._parent._isCurrency
		            ? I18nMsg.numberSeparatorMoneyDecimal
		            : I18nMsg.numberSeparatorDecimal;
		a.push(decimal, fract);
	}
	if (expon) {
		a.push('E', expon.replace(/^\+/,""));
	}
	
	// return normalize result
	return a.join("");
};

/**
 * IE may show null in the field
 */
CalemTextUtil.getNullReplacement =
function() {
	return '';
}

/**
 * Use special encoding to pass param to server
 */
CalemTextUtil.encodeUrlParam =
function(p) {
	var np=p.replace(/%/, '(%)');
	return AjxStringUtil.urlEncode(np);
}
