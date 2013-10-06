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
 * CalemWoPlannedDowntimeFormList
 */
function CalemWoPlannedDowntimeFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
}

CalemWoPlannedDowntimeFormList.prototype = new CalemFormListDet;
CalemWoPlannedDowntimeFormList.prototype.constructor = CalemWoPlannedDowntimeFormList;

CalemWoPlannedDowntimeFormList.prototype.toString = function() { return "CalemWoPlannedDowntimeFormList";}

/**
 * Business APIs
 */
CalemWoPlannedDowntimeFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemWoPlannedDowntimeFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemWoPlannedDowntimeFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemWoPlannedDowntimeFormRead';
} 

CalemWoPlannedDowntimeFormList.prototype.canCreate =
function() {
	return this._canModify();
} 

CalemWoPlannedDowntimeFormList.prototype.canDelete =
function() {
	return this._canModify();
}  

CalemWoPlannedDowntimeFormList.prototype._canModify =
function() {
	var rec=this._dataModel.getParentRec();
	return CalemWoBo.getInstance().canModify(rec);
}  
