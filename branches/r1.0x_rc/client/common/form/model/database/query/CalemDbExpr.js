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
 * CalemExprComposition
 * Expression composition
 */
function CalemExprComposite(type) {
	if (arguments.length==0) return;
	this._type=type;
	this._exprs=new Array();
}

CalemExprComposite.prototype.toString =
function() {
	return 'CalemExprComposite';
}

CalemExprComposite.prototype.add = 
function(expr) {
	this._exprs.push(expr);
}

//Serialization to string first.
CalemExprComposite.prototype.getJson =
function() {
	return rtn=["{", this.toString(), ": ", CalemJson.arrayToJson(this._exprs), "}"].join('');
}

//Serialization to string first.
CalemExprComposite.prototype.setJson =
function(ar) {
	this._exprs=new Array(); //Creating the array first.
	CalemJson.setJsonByArray(ar, this);
}

CalemExprComposite.prototype.isExprOnTable =
function(table) {
	var rtn=true;
	for (var i=0; i< this._exprs.length; i++) {
		if (!this._exprs[i].isExprOnTable(table)) {
			rtn=false;
			break;
		}
	}
	return rtn;
}

//SQL
CalemExprComposite.prototype.getSql =
function() {
	return ['(', CalemJson.arrayToSql(this._exprs, this._type), ")"].join('');
}

CalemExprComposite.AND='AND';
CalemExprComposite.OR='OR';

/**
 * CalemExprComposition
 * Expression composition
 */
function CalemExprAnd() {
   CalemExprComposite.call(this, CalemExprComposite.AND);
}

CalemExprAnd.prototype=new CalemExprComposite;
CalemExprAnd.prototype.constructor=CalemExprAnd;

CalemExprAnd.prototype.toString =
function() {
	return 'CalemExprAnd';
}

CalemExprAnd.prototype.query =
function(rec) {
	var rtn=true;
	for (var i=0; i< this._exprs.length; i++) {
		if (!this._exprs[i].query(rec)) {
			rtn=false;
			break;
		}
	}
	return rtn;
}

function CalemExprOr() {
   CalemExprComposite.call(this, CalemExprComposite.OR);
}

CalemExprOr.prototype=new CalemExprComposite;
CalemExprOr.prototype.constructor=CalemExprOr;

CalemExprOr.prototype.toString =
function() {
	return 'CalemExprOr';
}

CalemExprOr.prototype.query =
function(rec) {
	var rtn=false;
	for (var i=0; i< this._exprs.length; i++) {
		if (this._exprs[i].query(rec)) {
			rtn=true;
			break;
		}
	}
	return rtn;
}

/**
 * These expr classes are ported from server's CalemDboFilterExpr.
 * Supported exprs: ==, !=, >=, >, <=, <, isNull, isNotNull, like, in, and, or
 * 
 */
function CalemDbExpr(fld, op, value) {
	if (arguments.length==0) return;
	this._field=fld;
	this._op=op;
	this._value=value;
}

CalemDbExpr.EQ=CalemConst.DbExpr_EQ;
CalemDbExpr.NEQ=CalemConst.DbExpr_NEQ;
CalemDbExpr.GTEQ=CalemConst.DbExpr_GTEQ;
CalemDbExpr.GT=CalemConst.DbExpr_GT;
CalemDbExpr.LTEQ=CalemConst.DbExpr_LTEQ;
CalemDbExpr.LT=CalemConst.DbExpr_LT;
CalemDbExpr.IS_NULL=CalemConst.DbExpr_IS_NULL;
CalemDbExpr.IS_NOT_NULL=CalemConst.DbExpr_IS_NOT_NULL;
CalemDbExpr.LIKE=CalemConst.DbExpr_LIKE;
CalemDbExpr.IN=CalemConst.DbExpr_IN;

//serialize
CalemDbExpr.prototype.getJson =
function() {
	return ["{CalemDbExpr: {field: ", this._field.getJson(), ", op: '", this._op, "'",
	         (this._value ? [", value: ", this._value.getJson()].join('') : ''), "}}"].join('');	
}

//deserialize
CalemDbExpr.prototype.setJson =
function(obj) {
	this._values=new Array(); //Creating the values.
	this._field=CalemJson.setJson(obj.field);
	this._op=obj.op;
	this._value=obj.value? CalemJson.setJson(obj.value) : null;
}

CalemDbExpr.prototype.getSql =
function() {
	var rtn=[this._field.getSql(), ' ', this._op].join('');
	if (this._op != CalemDbExpr.IS_NULL && this._op!=CalemDbExpr.IS_NOT_NULL) {
		rtn=[rtn, " ", this._value.getSql(this._op)].join('');
	}
	return rtn;
}

/**
 * accessors for conveniece.
 */
CalemDbExpr.prototype.getFieldRawValue =
function(rec) {
	return rec.getField(this._field.getField()).getRawValue();
} 

CalemDbExpr.prototype.getValue =
function() {
	return this._value;
}

CalemDbExpr.prototype.getOp =
function() {
	return this._op;
}

/**
 * This is the ultimate evaluation of the query expressions.
 */
CalemDbExpr.prototype.query =
function(rec) {
	var raw=this.getFieldRawValue(rec);
	switch (this._op) { 
		case CalemDbExpr.IS_NULL :  return (typeof(raw)=='undefined' || raw==null);
		case CalemDbExpr.IS_NOT_NULL : return (raw != null);
	}
	//Otherwise process based on param values.
	if (typeof(raw)=='undefined' || raw ==null) return false;
	return this._value.query(rec, raw, this);
}

//Check expr on table
CalemDbExpr.prototype.isExprOnTable =
function(table) {
	return (this._field.getTable()==table);
}

/**
 * CalemField
 */
function CalemDbField(table, field) {
	if (arguments.length==0) return;
	this._table=table;
	this._field=field;
}

CalemDbField.prototype.getJson =
function() {
	return ["{CalemDbField: {table: '", this._table, "', field: '", this._field, "'}}"].join('');
}

CalemDbField.prototype.setJson =
function(obj) {
	this._table=obj.table;
	this._field=obj.field;
}

CalemDbField.prototype.getSql =
function() {
	return [this._table, ".", this._field].join('');
}

CalemDbField.prototype.getField =
function() {
	return this._field;
}

CalemDbField.prototype.getTable =
function() {
	return this._table;
}

/**
 * CalemDbValue 
 * Derived classes:
 * <ul>
 * <li>CalemDbString - normal string
 * <li>CalemDbLookup - id and string
 * <li>CalemDbNumber
 * <li>CaldmDbUser
 * <li>CalemDbDate
 * <li>CalemDbTime
 * <li>CalemDbDateTime
 * <li>CalemDbHolder
 * </ul>
 */
function CalemDbValue(val) {
	if (arguments.length==0) return;
	this._value=val;
}

CalemDbValue.prototype.getValue =
function() {
	return this._value;
}

CalemDbValue.prototype.getRawValue =
function() {
	return this._value;
}

CalemDbValue.prototype.getSql =
function() {
	return this._value;
}

/**
 * Query operations - the ultimate evaluation of the query expressions.
 */
CalemDbValue.prototype.query =
function(rec, fldRaw, dbExpr) {
	var rtn=false;
	switch (dbExpr.getOp()) {
		case CalemDbExpr.EQ :   rtn=(fldRaw == this.getRawValue()); break;
		case CalemDbExpr.NEQ :  rtn=(fldRaw != this.getRawValue()); break;
		case CalemDbExpr.GTEQ : rtn= (fldRaw >= this.getRawValue()); break;
		case CalemDbExpr.GT:    rtn= (fldRaw > this.getRawValue()); break;
		case CalemDbExpr.LTEQ : rtn= (fldRaw <= this.getRawValue()); break;
		case CalemDbExpr.LT :   rtn= (fldRaw < this.getRawValue()); break;
		case CalemDbExpr.LIKE : 
		   var val=this.getLikeValue(); //LIKE uses value which could be case insensitive
		   val=val.replace(/%/g, '');
		   if (!CalemViewUtil.sortCaseSensitive()) fldRaw=fldRaw.toLowerCase();
			rtn= (fldRaw.indexOf(val)!=-1); 
			break;
		case CalemDbExpr.IN : 
		   var rtn=false;
		   for (var i=0; i< this._value.length; i++) {
		   	if (fldRaw==this._value[i]) {
		   		rtn=true;
		   		break;
		   	}
		   }
		   break;
	}
	return rtn;
} 


/**
 * CalemDbString
 * 
 */
function CalemDbString(val) {
	if (arguments.length==0) return;
	CalemDbValue.call(this, val);
}

CalemDbString.prototype=new CalemDbValue;
CalemDbString.prototype.constructor = CalemDbString;

CalemDbString.SQUOTE="'";
CalemDbString.SQUOTE_ES="%27";
CalemDbString.DQUOTE="\"";
CalemDbString.DQUOTE_ES="%22";


/**
 * JS escape so don't need to worry about special chars in persistence.
 */
CalemDbString.prototype.getJson =
function() {
	return ["{CalemDbString: '", escape(this._value), "'}"].join('');
}

//deserialize
CalemDbString.prototype.setJson =
function(val) {
	this._value=unescape(val);
}

/**
 * Escape " and ' so JS handling is ok.
 */
CalemDbString.prototype.getSql =
function(op) {
	return this._getSql(op, this._value);
}

CalemDbString.prototype._getSql =
function(op, val) {
	if (val.indexOf(CalemDbString.SQUOTE)!=-1) {
		val=val.replace(/'/g, CalemDbString.SQUOTE_ES)
	}
	if (val.indexOf(CalemDbString.DQUOTE)!=-1){
		val=val.replace(/"/g, CalemDbString.DQUOTE_ES)
	}
	if (op && op==CalemDbExpr.LIKE) {
		val=['%', val, '%'].join('');
	}
	return ["'", val, "'"].join('');
}

//String value to do case insensitivity check.
CalemDbString.prototype.getLikeValue =
function() {
	var rtn=this._value;
	if (this._value && !CalemViewUtil.sortCaseSensitive()) {
		rtn=this._value.toLowerCase();
	}
	return rtn;
}

/**
 * CalemDbLookup 
 */
function CalemDbLookup(id, val) {
	if (arguments.length==0) return;
	this._id=id;
	CalemDbString.call(this, val);
}

CalemDbLookup.prototype=new CalemDbString;
CalemDbLookup.prototype.constructor = CalemDbLookup;

/**
 * JS escape so don't need to worry about special chars in persistence.
 */
CalemDbLookup.prototype.getJson =
function() {
	return ["{CalemDbLookup: {", 
	       (this._id ? ["id: '", this._id, "', "].join('') : ''),
	       "value: '", escape(this._value), "'}"].join('');
}

//deserialize
CalemDbLookup.prototype.setJson =
function(obj) {
	this._id=obj.id;
	this._value=unescape(obj.value);
}

//Getters
CalemDbLookup.prototype.getId = function() {return this._id;}
CalemDbLookup.prototype.getValue=function() {return this._value;}
CalemDbLookup.prototype.getRawValue=function() {return this._id;}

CalemDbLookup.prototype.getSql =
function(op) {
	var val= (op==CalemDbExpr.LIKE) ? this._value : (this._id ? this._id : this._value);
	return CalemDbString.prototype._getSql(op, val);
}

/**
 * CalemDbNumber
 * 
 */
function CalemDbNumber(val) {
	if (arguments.length==0) return;
	CalemDbValue.call(this, val);
}

CalemDbNumber.prototype=new CalemDbValue;
CalemDbNumber.prototype.constructor = CalemDbNumber;

CalemDbNumber.prototype.getJson =
function() {
	return ["{CalemDbNumber: ", this._value, "}"].join('');
}

CalemDbNumber.prototype.setJson =
function(val) {
	this._value=val;
}

/**
 * CalemDbUser
 * 
 */
function CalemDbUser(dummy) {
	if (arguments.length==0) return;
	CalemDbValue.call(this);
}

CalemDbUser.prototype=new CalemDbValue;
CalemDbUser.prototype.constructor = CalemDbUser;

CalemDbUser.prototype.getJson =
function() {
	return ["{CalemDbUser:}"].join('');
}

CalemDbUser.prototype.setJson =
function() {
}

//@todo - to set this up from login.
CalemDbUser.prototype.getSql =
function() {
	return "'CalemDbUser'";
}

/**
 * CalemDbDate
 * Internal format is GMT date.
 */
function CalemDbDate(val) {
	if (arguments.length==0) return;
	CalemDbValue.call(this, val);
}

CalemDbDate.prototype=new CalemDbValue;
CalemDbDate.prototype.constructor = CalemDbDate;

CalemDbDate.prototype.getJson =
function() {
	return ["{CalemDbDate: '", 
				CalemTextUtil.formatServerDate(this._value)
				, "'}"].join('');
}

CalemDbDate.prototype.setJson =
function(val) {
	this._value=CalemTextUtil.parseServerDate(val);
}

CalemDbDate.prototype.getSql =
function() {
	return ["'", CalemTextUtil.formatServerDate(this._value), "'"].join('');
}

/**
 * CalemDbDateTime
 * Internal format is GMT.
 * @val - is datetime object format.
 */
function CalemDbDateTime(val) {
	if (arguments.length==0) return;
	CalemDbValue.call(this, val);
}

CalemDbDateTime.prototype=new CalemDbValue;
CalemDbDateTime.prototype.constructor = CalemDbDateTime;

CalemDbDateTime.prototype.getJson =
function() {
	return ["{CalemDbDateTime: '", CalemTextUtil.formatServerDateTime(this._value), "'}"].join('');
}

CalemDbDateTime.prototype.setJson =
function(val) {
	this._value=CalemTextUtil.parseServerDateTime(val);
}

CalemDbDateTime.prototype.getSql =
function() {
	return ["'", CalemTextUtil.formatServerDateTime(this._value), "'"].join('');
}

/**
 * CalemDbTime
 * Internal format is date
 */
function CalemDbTime(val) {
	if (arguments.length==0) return;
	CalemDbValue.call(this, val);
}

CalemDbTime.prototype=new CalemDbValue;
CalemDbTime.prototype.constructor = CalemDbTime;

CalemDbTime.prototype.getJson =
function() {
	return ["{CalemDbTime: '", CalemTextUtil.formatServerTime(this._value), "'}"].join('');
}

CalemDbTime.prototype.setJson =
function(val) {
	this._value=CalemTextUtil.parseServerTimeGmt(val);
}

CalemDbTime.prototype.getSql =
function() {
	return ["'", CalemTextUtil.formatServerTime(this._value), "'"].join('');
}

/**
 * CalemDbParamHolder
 * 
 */
function CalemDbParamHolder(dummy) {
	if (arguments.length==0) return;
	CalemDbValue.call(this);
}

CalemDbParamHolder.prototype=new CalemDbValue;
CalemDbParamHolder.prototype.constructor = CalemDbParamHolder;

CalemDbParamHolder.prototype.getJson =
function() {
	return ["{CalemDbParamHolder:}"].join('');
}

CalemDbParamHolder.prototype.setJson =
function() {
}

CalemDbParamHolder.prototype.getSql =
function() {
	return "?";
}

/**
 * CalemDbDropdown
 * @value is an array of values.
 */
function CalemDbDropdown(value) {
	if (arguments.length==0) return;
	CalemDbValue.call(this, value);
} 

CalemDbDropdown.prototype=new CalemDbValue;
CalemDbDropdown.prototype.constructor = CalemDbDropdown;

CalemDbDropdown.prototype.getJson =
function() {
	return ["{CalemDbDropdown: ", CalemJson.arrayToJson(this._value), "}"].join('');
}

CalemDbDropdown.prototype.setJson =
function(obj) {
	this._value=CalemJson.setJsonAsArray(obj);
}

CalemDbDropdown.prototype.getSql =
function() {
	return ["(", CalemJson.arrayToSql(this._value),")"].join('');
}

/**
 * CalemDbBoolean
 */
function CalemDbBoolean(value) {
	if (arguments.length==0) return;
	CalemDbValue.call(this, value);
} 

CalemDbBoolean.prototype=new CalemDbValue;
CalemDbBoolean.prototype.constructor = CalemDbBoolean;

CalemDbBoolean.prototype.getJson =
function() {
	return ["{CalemDbBoolean: ", this._value, "}"].join('');
}

CalemDbBoolean.prototype.setJson =
function(obj) {
	this._value=obj? 1 : 0;
}

