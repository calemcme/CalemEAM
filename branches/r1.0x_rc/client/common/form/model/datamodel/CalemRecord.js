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
 * CalemRecord Holds a data record. It's used for many purposes
 * <ul>
 * <li>Data storage
 * <li>Data presentation
 * <li>Data editing
 * </ul>
 */
function CalemRecord(recList, fldMap, recValue) {
	if (arguments.length==0) return;
	CalemModel.call(this, true);
	this._recList=recList;
	this._fldMap=fldMap;
	this._recValue=recValue;
	this._tableDd=recList.getTableDd();
	if (recValue) this.id=recValue[fldMap[this._tableDd.getIdFieldName()]];
}

CalemRecord.toNumeric=
function(val) {
	return (val==null) ? null : Number(val);
}

CalemRecord.prototype = new CalemModel;
CalemRecord.prototype.constructor = CalemRecord;

CalemRecord.prototype.toString = 
function() {
	return "CalemRecord";
}

/** 
 * factory method to create a field 
 * Note: all fields returned from MySql are strings so let's convert for numeric fields here.
 */ 
CalemRecord.prototype.createField =
function(fn, value, tableDd) {
	var fld, joinValue, df;
	//Handle table-dependent fields first.
	if (tableDd.isDropdownField(fn)) {
		fld=new CalemDropdownField(this, fn, value)
	} else if (tableDd.isMemoryCachedField(fn)) {
		fld=new CalemCachedJoinField(this, fn, value)
	} else if (tableDd.isJoinField(fn)) {		
		//The real value is brought in so let's get it.
		joinValue=this._recValue[this._fldMap[tableDd.getJoinFieldName(fn)]];
		fld=new CalemJoinField(this, fn, value, joinValue);
	} 
	//Date, Time and DateTime fields
	else if (tableDd.isDateField(fn) ) {
		fld=new CalemDateField(this, fn);
		fld.setServerDateString(value);
	} else if (tableDd.isTimeField(fn) ) {
		fld=new CalemTimeField(this, fn);
		fld.setServerTimeString(value);
	} else if (tableDd.isDateTimeField(fn) ) {
		fld=new CalemDateTimeField(this, fn);
		fld.setServerDateTimeString(value);
	} 
	//Boolean
	else if (tableDd.isBooleanField(fn) ) {
		fld=new CalemBooleanField(this, fn, CalemRecord.toNumeric(value));
	} 
	//Integer and number fields
	else if (tableDd.isIntegerField(fn)) {
		fld=new CalemIntegerField(this, fn, CalemRecord.toNumeric(value));
	} else if (tableDd.isNumberField(fn)) {
		fld=new CalemNumberField(this, fn, CalemRecord.toNumeric(value));
	} else if (tableDd.isPercentField(fn)) {
		fld=new CalemPercentField(this, fn, CalemRecord.toNumeric(value));
	}
	//Currency and currencyId fields
	else if (tableDd.isCurrencyField(fn)) {
		fld=new CalemCurrencyField(this, fn, CalemRecord.toNumeric(value));
	} else if (tableDd.isSysCurrencyField(fn)) {
		fld=new CalemSysCurrencyField(this, fn, CalemRecord.toNumeric(value));
	} else if (tableDd.isCurrencyIdField(fn)) {
		fld=new CalemCurrencyIdField(this, fn, value);
	} 
	//text fields
	else if (tableDd.isStringField(fn)) {
		fld=new CalemStringField(this, fn, value);
	}
	//Otherwise it's the system field
	else if (fn==tableDd.getIdFieldName()) { //Create Id field
		fld=new CalemStringField(this, fn, value);
	}
	return fld;
}

/**
 * Get record as json object
 * Only fields in the object are returned.
 */
CalemRecord.prototype.getJsonObject =
function() {
	var obj=new Object();
	var fields = this._tableDd.getFields();
	for (var i in fields) {
		obj[i]=this.getServerValue(i);
	}
	return obj;
} 

CalemRecord.prototype.getTableDd = function() {return this._tableDd;}

CalemRecord.prototype.getField =
function(fld) {
	if (!this._created) {
		this._created=new Object();
		this._fields=new Object();
	}
	if (!this._created[fld]) {
		this._fields[fld]=this.createField(fld, this._getRawValue(fld), this._tableDd);
		this._created[fld]=true;
	}
	return this._fields[fld];
}

CalemRecord.prototype.getCache =
function() {
	if (!this._cache) this._cache=this._recList.getCache();
	return this._cache;
}

CalemRecord.prototype._getRawValue =
function(fld) {
	return this._recValue[this._fldMap[fld]];
}

CalemRecord.prototype.getValue =
function(fld) {
	return this.getField(fld).getValue();
}

CalemRecord.prototype.getServerValue =
function(fld) {
	return this.getField(fld).getServerValue();
}

CalemRecord.prototype.getJoinValue =
function(fldId, valId) {
	var join=this._tableDd.getJoin(fldId);
	return this.getCache().findValueById(join, valId);
}

CalemRecord.prototype.getIdByJoinValue =
function(fld, value) {
	var join=this._tableDd.getJoin(fld);
	return this.getCache().findIdByJoinValue(join, value);
}

CalemRecord.prototype.getIdByJoinValueNoCache =
function(fld, value) {
	var join=this._tableDd.getJoin(fld);
	return this.getCache().findIdByJoinValueNoCache(join, value);
}

CalemRecord.prototype.getRecList =
function() {
	return this._recList;
}

//Sort
CalemRecord.setOrderBy =
function(orderBy) {
	CalemRecord.orderBy=orderBy;
}
CalemRecord.getOrderByField=
function() {
	return CalemRecord.orderBy.getField();
}

CalemRecord.sortCompare =
function(a, b) {
	var fld=CalemRecord.getOrderByField();
	var fa=a.getField(fld);
	var fb=b.getField(fld);	
	//Field objects are always created.
	return fa.compare(fb);
}

/**
 * Currency handling by record
 * <ul>
 * <li>currencyId value
 * <li>currencyId read formatter
 * <li>currencyId edit formatter
 * </ul>
 */


/**
 * Wrapper around field values
 * <ul>
 * <li>CalemDropdownField
 * <li>CalemCachedJoinField
 * <li>CalemJoinField
 * <li>CalemDateField
 * <li>CalemTimeField
 * <li>CalemDateTimeField
 * <li>CalemBooleanField
 * <li>CalemIntegerField
 * <li>CalemNumberField
 * <li>CalemCurrencyField
 * <li>CalemSysCurrencyField
 * <li>CalemCurrencyIdField
 * <li>CalemPercentField
 * <li>CalemStringField
 * </ul>
 * Interfaces supported:
 * <ul>
 * <li>compare - for sort
 * <li>getValue - for presentation 
 * <li>getEditValue - for editting
 * <li>isValid - for validity check
 * <li>setRawValue - for modification
 * <li>equality - compare for changes
 * <li>clone - copy for changes
 * </ul>
 */

/**
 * CalemField
 */
function CalemField(rec, name, value) {
	if (arguments.length==0) return;
	this._rec=rec;
	this._name=name;
	this._value=value;
}

CalemField.prototype.getValue =
function() {
	if (this._value==null) return null;
	return this._getValue();
}

CalemField.prototype.getServerValue =
function() {
	if (this._value==null) return null;
	return this._getServerValue();
}

CalemField.prototype._getServerValue =
function() {
	return this._value;
}

CalemField.prototype._getValue =
function() {
	return this._value;
}

CalemField.prototype.getQueryValue =
function() {
	return this._value;
}

CalemField.prototype.getEditValue =
function() {
	if (this._value==null) return null;
	return this._getEditValue();
}

CalemField.prototype._getEditValue =
function() {
	return this._getValue();
}

//_value is the raw value.
CalemField.prototype.getRawValue =
function() {
	return this._value;
}

CalemField.prototype.setRawValue =
function(value) {
	this._value=value;
}

//Default is always true.
CalemField.prototype.isValid = 
function(value) {
	if (value==null) return !this._isRequired();
	return this._isValid(value);
}

CalemField.prototype._isValid =
function(value) {
	return true;
}

CalemField.prototype._isRequired =
function() {
	return false;
}

/**
 * Numeric (date, time, numeric)
 */

//Compare
CalemField.prototype.compare =
function(fld) {
	var raw= fld.getRawValue();
	var myRaw=this.getRawValue();
	if (raw==myRaw) return 0; //shortcut.
	if (myRaw==null && raw==null) return 0;
	else if (myRaw==null && raw!=null) return -1;
	else if (myRaw!=null && raw==null) return 1;
	else return this._compareSafe(fld); //Each field must implement a way to compare.
}

CalemField.prototype.equals =
function(fld) {
	var raw= fld ? fld.getRawValue() : null;
	if (raw==null && this.getRawValue()==null) return rtn=0;
	else return (fld!=null && this._sameType(fld) && raw==this.getRawValue());
}

//Compare
CalemField.prototype._compareSafe =
function(fld) {
	return CalemField.compare(this.getRawValue(), fld.getRawValue());
} 

/**
 * Compare a value against a field.
 */
CalemField.prototype.valueEquals =
function(raw) {
	if (raw==null || this.getRawValue()==null) return (raw==this.getRawValue());	
	else return this._valueEqualSafe(raw);
}

CalemField.prototype._valueEqualSafe =
function(raw) {
	return raw==this.getRawValue();
}

//General comparison functions
CalemField.compareString =
function(s1, s2) {
	if (CalemConf['db_recordList']['sortCaseSensitive']) {
		return (s1==s2) ? 0 : (s1 < s2) ? -1 : 1;
	} else {
		var s1L = s1 ? s1.toLowerCase() : '';
		var s2L = s2 ? s2.toLowerCase() : '';
		return (s1L==s2L) ? 0 : (s1L < s2L) ? -1 : 1;
	}
}

CalemField.compare =
function(v1, v2) {
	return (v1-v2);
}

/**
 * CalemDropdownField
 */
function CalemDropdownField(rec, name, value) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
}

CalemDropdownField.prototype=new CalemField;
CalemDropdownField.prototype.constructor=CalemDropdownField;
CalemDropdownField.prototype.toString = function() {return 'CalemDropdownField';}

//Getters
CalemDropdownField.prototype._getValue = 
function() {
	return CalemMsg.getMsg(this._value);
}

CalemDropdownField.prototype._getEditValue = 
function() {
	return this._getValue();
}

//Compare - to compare about priority (P1, P2, etc.)
CalemDropdownField.prototype._compareSafe =
function(fld) {
	return CalemField.compare(this.getValue(), fld.getValue());
}

//Type comparison
CalemDropdownField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemDropdownField);
}

//Trim string value to compare.
CalemDropdownField.prototype.valueEquals =
function(raw) {
	raw = raw ? raw.trim() : '';
	var myRaw= this._value ? this._value.trim() : '';
	return (raw==myRaw);
}

/**
 * CalemCachedJoinField
 */
function CalemCachedJoinField(rec, name, value) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
}

CalemCachedJoinField.prototype=new CalemField;
CalemCachedJoinField.prototype.constructor=CalemCachedJoinField;
CalemCachedJoinField.prototype.toString = function() {return 'CalemCachedJoinField';}

//Getters
CalemCachedJoinField.prototype._getValue = 
function() {
	return this._rec.getJoinValue(this._name, this._value);
}

CalemCachedJoinField.prototype._isValid =
function(value) {
	return this._rec.getIdByJoinValue(this._name, value);
}

CalemCachedJoinField.prototype._getEditValue = 
function() {
	return this._getValue();
}

//Compare
CalemCachedJoinField.prototype._compareSafe =
function(fld) {
	return CalemField.compareString(this.getValue(), fld.getValue());
}

//Type comparison
CalemCachedJoinField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemCachedJoinField);
}

//Consider case sensitivity
CalemCachedJoinField.prototype.getQueryValue =
function() {
	var rtn=this._getValue();
	if (rtn && !CalemConf['db_recordList']['sortCaseSensitive']) {
		rtn=rtn.toLowerCase();
	}
	return rtn;
}

/**
 * CalemJoinField
 */
function CalemJoinField(rec, name, value, joinValue) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
	this._joinValue=joinValue;
}

CalemJoinField.prototype=new CalemField;
CalemJoinField.prototype.constructor=CalemJoinField;
CalemJoinField.prototype.toString = function() {return 'CalemJoinField';}

//Getters
CalemJoinField.prototype._getValue = 
function() {
	return this._joinValue;
}

CalemJoinField.prototype._isValid =
function(value) {
	if (value==this._joinValue) return this.getRawValue();
	return this._rec.getIdByJoinValueNoCache(this._name, value);
}

CalemJoinField.prototype._getEditValue = 
function() {
	return this._getValue();
}

//Compare
CalemJoinField.prototype._compareSafe =
function(fld) {
	return CalemField.compareString(this.getValue(), fld.getValue());
}

//Type comparison
CalemJoinField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemJoinField);
}

//String value to do case insensitivity check.
CalemJoinField.prototype.getQueryValue =
function() {
	var rtn=this._joinValue;
	if (rtn && !CalemConf['db_recordList']['sortCaseSensitive']) {
		rtn=rtn.toLowerCase();
	}
	return rtn;
}

/**
 * CalemDateField
 * Internal format is Date.
 */
function CalemDateField(rec, name, value) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
	this._readFormatter=CalemTextUtil.getFormatter(CalemTextUtil.DATE_READ_FORMATTER);
	this._editFormatter=CalemTextUtil.getFormatter(CalemTextUtil.DATE_EDIT_FORMATTER);
}

CalemDateField.prototype=new CalemField;
CalemDateField.prototype.constructor=CalemDateField;

CalemDateField.prototype.toString = function() {return 'CalemDateField';}

/**
 * Server date is of the format: yyyy-mm-dd
 * Internal format is GMT
 */
CalemDateField.prototype.setServerDateString =
function(dateStr) {
	if (dateStr) {
		this._value=CalemTextUtil.parseServerDate(dateStr);
	}
}

CalemDateField.prototype.setRawValue =
function(date) {
	this._value=date;
}

CalemDateField.prototype._getValue =
function() {
	return this._readFormatter.format(this._value);
}

CalemDateField.prototype._getEditValue =
function() {
	return this._editFormatter.format(this._value);
}

CalemDateField.prototype._getServerValue =
function() {
	return CalemTextUtil.formatServerDate(this._value);
}

//General public function
CalemDateField.prototype._isValid = 
function(dateStr) {
	return CalemTextUtil.isDateValid(dateStr, this._editFormatter);
}

//Type comparison
CalemDateField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemDateField);
}

CalemDateField.prototype._valueEqualSafe =
function(raw) {
	return CalemTextUtil.dateEquals(raw, this._value);
}

/**
 * CalemTimeField
 * Internal format is Date GMT.
 */
function CalemTimeField(rec, name, value) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
	this._readFormatter=CalemTextUtil.getFormatter(CalemTextUtil.TIME_READ_FORMATTER);
	this._editFormatter=CalemTextUtil.getFormatter(CalemTextUtil.TIME_EDIT_FORMATTER);
	
}

CalemTimeField.prototype=new CalemField;
CalemTimeField.prototype.constructor=CalemTimeField;

CalemTimeField.prototype.toString = function() {return 'CalemTimeField';}

/**
 * Server date is of the format: yyyy-mm-dd
 */
CalemTimeField.prototype.setServerTimeString =
function(timeStr) {
	if (timeStr) {
		this._value=CalemTextUtil.parseServerTimeGmt(timeStr);
	}
}

CalemTimeField.prototype._getValue =
function() {
	return this._readFormatter.format(this._value);
}

CalemTimeField.prototype._getEditValue =
function() {
	return this._editFormatter.format(this._value);
}

CalemTimeField.prototype._getServerValue =
function() {
	return CalemTextUtil.formatServerTime(this._value);
}

//General public function
CalemTimeField.prototype._isValid = 
function(timeStr) {
	return CalemTextUtil.isDateValid(timeStr, this._editFormatter); //Same parsing mechanism.
}

//Type comparison
CalemTimeField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemTimeField);
}

CalemTimeField.prototype._valueEqualSafe =
function(raw) {
	return CalemTextUtil.timeEquals(raw, this._value);
}

/**
 * CalemDateTimeField
 * Local date time is the value - internally it's storing the local date value.
 */
function CalemDateTimeField(rec, name) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name);
	this._readFormatter=CalemTextUtil.getFormatter(CalemTextUtil.DATETIME_READ_FORMATTER);
	this._serverFormatter=CalemTextUtil.getFormatter(CalemTextUtil.DATETIME_SERVER_FORMATTER);
}

CalemDateTimeField.prototype=new CalemField;
CalemDateTimeField.prototype.constructor=CalemDateTimeField;

CalemDateTimeField.prototype.toString = function() {return 'CalemDateTimeField';}

/**
 * Server date is of the format: yyyy-mm-dd hh:mi:ss
 */
CalemDateTimeField.prototype.setServerDateTimeString =
function(dateStr) {
	if (dateStr) {
		this._value=CalemTextUtil.parseServerDateTime(dateStr);
	}
}

CalemDateTimeField.prototype._getLocalRawValue =
function() {
	if (!this._localRaw) this._localRaw=CalemTextUtil.gmtDateTimeToLocal(this._value);
	return this._localRaw;
}

CalemDateTimeField.prototype._getValue =
function() {
	return this._readFormatter.format(this._getLocalRawValue());
}

CalemDateTimeField.prototype._getServerValue =
function() {
	return CalemTextUtil.formatServerDateTime(this._value);
}

//Type comparison
CalemDateTimeField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemDateTimeField);
}

CalemDateTimeField.prototype._valueEqualSafe =
function(raw) {
	return (CalemTextUtil.dateEquals(raw, this._value) && CalemTextUtil.timeEquals(raw, this._value));
} 

/**
 * CalemBooleanField
 * Boolean field is stored as small integer with values of 0 and 1
 */
function CalemBooleanField(rec, name, value) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
	this.setRawValue(value);
}

CalemBooleanField.prototype=new CalemField;
CalemBooleanField.prototype.constructor=CalemBooleanField;

CalemBooleanField.prototype.toString = function() {return 'CalemBooleanField';}

CalemBooleanField.prototype._getEditValue =
function() {
	return this.getRawValue();
}

//Type comparison
CalemBooleanField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemBooleanField);
}

//Normalize value
CalemBooleanField.prototype.setRawValue =
function(rVal) {
	this._value= rVal ? 1 : 0;
}

//Treat null properly.
CalemBooleanField.prototype.valueEquals =
function(raw) {
	raw = raw ? raw : 0;
	var myRaw= this._value ? this._value : 0;
	return (raw==myRaw);
}

/**
 * CalemNumberField
 * Number value field
 */
function CalemNumberField(rec, name, value) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
	this._formatter=CalemTextUtil.getFormatter(CalemTextUtil.NUMBER_FORMATTER);
}

CalemNumberField.prototype=new CalemField;
CalemNumberField.prototype.constructor=CalemNumberField;

CalemNumberField.prototype.toString = function() {return 'CalemNumberField';}

CalemNumberField.prototype._getValue =
function() {
	return this._formatter.format(this._value);
}

CalemNumberField.prototype._getEditValue =
function() {
	return this._getValue();
}

//General public function
CalemNumberField.prototype._isValid = 
function(nStr) {
	return CalemTextUtil.isNumberValid(nStr);
}

//Type comparison
CalemNumberField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemNumberField);
}

/**
 * CalemIntegerField
 * Integer value field
 */
function CalemIntegerField(rec, name, value) {
	if (arguments.length==0) return;
	CalemNumberField.call(this, rec, name, value);
	this._formatter=CalemTextUtil.getFormatter(CalemTextUtil.INTEGER_FORMATTER);
}

CalemIntegerField.prototype=new CalemNumberField;
CalemIntegerField.prototype.constructor=CalemIntegerField;

CalemIntegerField.prototype.toString = function() {return 'CalemIntegerField';}

//General public function
CalemIntegerField.prototype._isValid = 
function(intStr) {
	return CalemTextUtil.isIntegerValid(intStr);
}

//Type comparison
CalemIntegerField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemIntegerField);
}

/**
 * Percent field
 */
function CalemPercentField(rec, name, value) {
	if (arguments.length==0) return;
	CalemNumberField.call(this, rec, name, value);
	this._formatter=CalemTextUtil.getFormatter(CalemTextUtil.PERCENT_FORMATTER);
}

CalemPercentField.prototype=new CalemNumberField;
CalemPercentField.prototype.constructor=CalemPercentField;

CalemPercentField.prototype.toString = function() {return 'CalemPercentField';}

//Type comparison
CalemPercentField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemPercentField);
}

/**
 * CalemSysCurrencyField
 * 
 */
function CalemSysCurrencyField(rec, name, value) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
	this._readFormatter=CalemTextUtil.getFormatter(CalemTextUtil.CURRENCY_READ_FORMATTER);
	this._editFormatter=CalemTextUtil.getFormatter(CalemTextUtil.CURRENCY_EDIT_FORMATTER);
}

CalemSysCurrencyField.prototype=new CalemField;
CalemSysCurrencyField.prototype.constructor=CalemSysCurrencyField;

CalemSysCurrencyField.prototype.toString = function() {return 'CalemSysCurrencyField';}

//General public function
CalemSysCurrencyField.prototype._isValid = 
function(nStr) {
	return CalemTextUtil.isCurrencyValid(nStr);
}

CalemSysCurrencyField.prototype._getValue =
function() {
	return this._readFormatter.format(this._value);
}

CalemSysCurrencyField.prototype._getEditValue =
function() {
	return this._editFormatter.format(this._value);
}

//Type comparison
CalemSysCurrencyField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemSysCurrencyField);
}

/**
 * CalemCurrencyField
 * 
 */
function CalemCurrencyField(rec, name, value) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
}

CalemCurrencyField.prototype=new CalemField;
CalemCurrencyField.prototype.constructor=CalemCurrencyField;

CalemCurrencyField.prototype.toString = function() {return 'CalemCurrencyField';}

//General public function
CalemCurrencyField.prototype._isValid = 
function(nStr) {
	return CalemTextUtil.isCurrencyValid(nStr);
}

CalemCurrencyField.prototype._getValue =
function() {
	//@todo - to figure out currency format from currencyId
	return this._readFormatter.format(this._value);
}

CalemCurrencyField.prototype._getEditValue =
function() {
	//@todo - to figure out.
	return this._editFormatter.format(this._value);
}

CalemCurrencyField.prototype.getFieldLabel =
function() {
	//@todo - to derive from currencyId
}

//Type comparison
CalemCurrencyField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemCurrencyField);
}

/**
 * CalemPercentField
 * 
 */
function CalemPercentField(rec, name, value) {
	if (arguments.length==0) return;
	CalemNumberField.call(this, rec, name, value);
	this._formatter=CalemTextUtil.getFormatter(CalemTextUtil.PERCENT_FORMATTER);
}

CalemPercentField.prototype=new CalemNumberField;
CalemPercentField.prototype.constructor=CalemPercentField;

CalemPercentField.prototype.toString = function() {return 'CalemPercentField';}

//General public function
CalemPercentField.prototype._isValid = 
function(nStr) {
	return CalemTextUtil.isPercentValid(nStr);
}

//Type comparison
CalemPercentField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemPercentField);
}

/**
 * CalemStringField
 */
function CalemStringField(rec, name, value) {
	if (arguments.length==0) return;
	CalemField.call(this, rec, name, value);
}

CalemStringField.prototype=new CalemField;
CalemStringField.prototype.constructor=CalemStringField;

CalemStringField.prototype.toString = function() {return 'CalemStringField';}

//Compare
CalemStringField.prototype._compareSafe =
function(fld) {
	return CalemField.compareString(this.getRawValue(), fld.getRawValue());
}

//Type comparison
CalemStringField.prototype._sameType =
function(fld) {
	return (fld instanceof CalemStringField);
}

//String value to do case insensitivity check.
CalemStringField.prototype.getQueryValue =
function() {
	var rtn=this._value;
	if (this._value && !CalemConf['db_recordList']['sortCaseSensitive']) {
		rtn=this._value.toLowerCase();
	}
	return rtn;
}

//Trim string value to compare.
CalemStringField.prototype._valueEqualSafe =
function(raw) {
	raw = raw ? raw.trim() : '';
	var myRaw= this._value ? this._value.trim() : '';
	return (raw==myRaw);
}


