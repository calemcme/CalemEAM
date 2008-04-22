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
 * CalemFieldBo.
 */
function CalemFieldBo() {
	this._fldConf=CalemConf['view_engine']['tableViewDesign'].fieldConf;
}

CalemFieldBo.getInstance =
function() {
	if (!CalemFieldBo.singleton) {
		CalemFieldBo.singleton = new CalemFieldBo();
	}
	return CalemFieldBo.singleton;
}

/**
 * Verify input validity.
 * a) type and length must match, length must not exceed max value.
 * b) field name must be valid (alpha numerical with underscore)
 * c) field name not duplicate of existing field.
 */
CalemFieldBo.prototype._verifyInputBo =
function(row, controller) {
	this._verifyFieldName(row['id']);
	this._verifyIdDuplicated(row['id'], controller.getFieldTableDd());
	this._verifyFieldLength(row['field_type'], row['field_length']);
	return true;
}

CalemFieldBo.prototype._verifyNameEdit =
function(row, oldId, controller) {
	this._verifyFieldName(row['id']);
	if (row['id'] != oldId) this._verifyIdDuplicated(row['id'], controller.getFieldTableDd());
	return true;
}

CalemFieldBo.prototype._verifyFieldTypeChange =
function(row, controller) {
	this._verifyFieldLength(row['field_type'], row['field_length']);
	return true;
}

CalemFieldBo.prototype._verifyFieldName =
function(fld) {
	var re = new RegExp(this._fldConf.nameRegExp);
	if (re.exec(fld) != fld) {
		throw CalemMsg.getMsg('field_name_invalid');
	}
}

CalemFieldBo.prototype._verifyIdDuplicated =
function(fld, tableDd) {
	if (tableDd.isField(fld)) {
		throw CalemMsg.getMsg('field_name_duplicate');
	}
}

CalemFieldBo.prototype._verifyFieldLength =
function(type, len) {
	if (type=='vt_field_varchar') {
		if (!(len && len >= 1 && len <= this._fldConf.varcharMaxLen)) {
			throw CalemMsg.getMsg('field_length_invalid');
		}
	}
}

//Creating field object based on row.
CalemFieldBo.prototype.getFieldByRow =
function(row) {
	var field={type: row['field_type']};
	if (row['field_type']=='varchar') field['length']=row['field_length'];
	if (row['required']) field['required']=true;
	return field;
}
