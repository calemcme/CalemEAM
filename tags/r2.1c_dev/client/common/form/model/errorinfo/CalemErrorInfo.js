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
 * CalemErrorInfo
 */
function CalemErrorInfo(table, errorInfo) {
	if (arguments.length==0) return;
	this._table=table;
	this._errorInfo=errorInfo;
}

CalemErrorInfo.prototype.toString = function() {return "CalemErrorInfo";}

CalemErrorInfo.prototype._getNativeError =
function(errorMsg) {
	var rtn=errorMsg;
	if (this._errorInfo && this._errorInfo.nativeError) {
		var ne=[this._errorInfo.id, ' \n ', this._errorInfo.nativeError].join('');
		var msg=AjxMessageFormat.format(CalemMsg.getMsg('error_native_label'), [ne]);
		rtn= [errorMsg, ' \n \n ', msg].join('');
	} 
	return rtn;
}

CalemErrorInfo.prototype.getMessage = 
function() {
	return this._getNativeError(CalemMsg.getMsg('error_default'));
}

/**
 * CalemDboDuplicateKeyException
 */
function CalemDboDuplicateKeyException(table, errorInfo) {
	if (arguments.length==0) return;
	CalemErrorInfo.call(this, table, errorInfo);
}

CalemDboDuplicateKeyException.prototype = new CalemErrorInfo;
CalemDboDuplicateKeyException.prototype.constructor=CalemDboDuplicateKeyException;

CalemDboDuplicateKeyException.prototype.toString = function() {return "CalemDboDuplicateKeyException";}

CalemDboDuplicateKeyException.prototype.getMessage = 
function() {
	//Let's figure out how to get the
	var tableDd=CalemContext.getInstance().getRegistry().getTableDd(this._table);
	var fields='';
	var keys; 
	var first=true;
	if (keys=tableDd.getUniqueIndexes()) {//Do unique indexes
		for (var i in keys) {
			var idx=keys[i];
			fields += "(";
			for (var j=0; j < idx.length; j++) {
				if (!first) fields += ', '; 
				else first=false;
				fields += tableDd.getFieldLabel(idx[j]);
			}
			fields += ") "
		}
	}
	var msg= AjxMessageFormat.format(CalemMsg.getMsg('error_key_duplication'), [fields])
	return this._getNativeError(msg);
}

/**
 * CalemDboDataNotFoundException
 */
function CalemDboDataNotFoundException(table, errorInfo) {
	if (arguments.length==0) return;
	CalemErrorInfo.call(this, table, errorInfo);
}

CalemDboDataNotFoundException.prototype = new CalemErrorInfo;
CalemDboDataNotFoundException.prototype.constructor=CalemDboDataNotFoundException;

CalemDboDataNotFoundException.prototype.toString = function() {return "CalemDboDataNotFoundException";}

CalemDboDataNotFoundException.prototype.getMessage = 
function() {
	var msg= CalemMsg.getMsg('error_data_not_found')
	return this._getNativeError(msg);
}

