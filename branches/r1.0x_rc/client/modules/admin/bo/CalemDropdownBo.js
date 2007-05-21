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
 * CalemDropdownBo.
 */
function CalemDropdownBo() {
	this._fldConf=CalemConf['view_engine']['tableViewDesign'].fieldConf;
}

CalemDropdownBo.getInstance =
function() {
	if (!CalemDropdownBo.singleton) {
		CalemDropdownBo.singleton = new CalemDropdownBo();
	}
	return CalemDropdownBo.singleton;
}

/**
 * Verify input validity.
 * a) type and length must match, length must not exceed max value.
 * b) field name must be valid (alpha numerical with underscore)
 * c) field name not duplicate of existing field.
 */
CalemDropdownBo.prototype._verifyInputBo =
function(row, controller) {
	this._verifyFieldName(row['id']);
	this._verifyIdDuplicated(row, controller.getTableDd());
	return true;
}

CalemDropdownBo.prototype._verifyEditBo =
function(row, id, controller) {
	this._verifyFieldName(row['id']);
	if (row['id']==id) this._verifyIdDuplicated(row, controller.getTableDd());
	return true;
}

CalemDropdownBo.prototype._verifyFieldName =
function(fld, tableDd, isNew) {
	var re = new RegExp(this._fldConf.nameRegExp);
	if (re.exec(fld) != fld) {
		throw CalemMsg.getMsg('field_name_invalid');
	}
}

CalemDropdownBo.prototype._verifyIdDuplicated =
function(fld, tableDd) {
	var dnMap=tableDd.getDropdownMap();
	if (dnMap[fld]) {
		throw CalemMsg.getMsg('field_name_duplicate');
	}
}

