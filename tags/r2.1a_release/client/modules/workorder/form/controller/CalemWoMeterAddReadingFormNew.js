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
 * CalemWoMeterAddReadingFormNew
 */
function CalemWoMeterAddReadingFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNew.call(this, parent, formId, data);
}

CalemWoMeterAddReadingFormNew.prototype = new CalemFormNew;
CalemWoMeterAddReadingFormNew.prototype.constructor = CalemWoMeterAddReadingFormNew;

CalemWoMeterAddReadingFormNew.prototype.toString = function() { return "CalemWoMeterAddReadingFormNew";}

/**
 * Initialize data for the transaction
 */
CalemWoMeterAddReadingFormNew.prototype._createDataModel =
function(data) {
	CalemFormNew.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemWoMeterAddReadingFormNew.prototype._instantiate =
function(data) {
	//Creating a record for display
	this._parentRow=data.parentRow;
	this._modelItem.createNewRecord();
	//Force a repaint.
	this.onRecChanged();
}

//Make sure all the lookups are included in case some fields are not on form.
CalemWoMeterAddReadingFormNew.prototype._getInputDataRow =
function() {
	var row= CalemFormNew.prototype._getInputDataRow.call(this);
	row['wo_id']=this._parentRow['wo_id'];
	row['meter_id']=this._parentRow['meter_id'];
	return row;
}

//reload parent data
CalemWoMeterAddReadingFormNew.prototype._getDataInsertedAction =
function(table, data) {
	return new CalemReloadDataAction('wo_meter');
}

CalemWoMeterAddReadingFormNew.prototype.onCancel =
function() {
	this._closeAndResumeParentForm(new CalemReloadDataAction('wo_meter'));
}