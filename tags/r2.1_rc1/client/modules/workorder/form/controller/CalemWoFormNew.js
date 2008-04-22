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
 * CalemWoFormNew
 */
function CalemWoFormNew(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormNewCacheLoad.call(this, parent, formId, data);
}

CalemWoFormNew.prototype = new CalemFormNewCacheLoad;
CalemWoFormNew.prototype.constructor = CalemWoFormNew;

CalemWoFormNew.prototype.toString = function() { return "CalemWoFormNew";}

/**
 * Initialize data for the transaction
 */
CalemWoFormNew.prototype._createDataModel =
function(data) {
	CalemFormNewCacheLoad.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemWoFormNew.prototype._instantiate =
function(data) {
	//Creating a record for display
	this._row=data.row;
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	var dd=this._modelItem.getTableDd();
	for (var i in this._row) {
		if (dd.isField(i)) rec.getField(i).setRawValue(this._row[i]);
	}
	//Force a repaint.
	this.onRecChanged();
}

CalemWoFormNew.prototype._render =
function() {
	CalemFormNewCacheLoad.prototype._render.call(this);
	this._setFieldsReadOnly(['asset_id', 'pm_id']);
}

//Make sure all the lookups are included in case some fields are not on form.
CalemWoFormNew.prototype._getInputDataRow =
function() {
	var row= CalemFormNewCacheLoad.prototype._getInputDataRow.call(this);
	for (var i in this._row) {
		if ( this._row[i] && !this.hasRender(i) ) {
			row[i]=this._row[i];
		}
	}
	return row;
}

//To skip the pm selection situation so it could go back to asset selection form.
CalemWoFormNew.prototype._onSoapSaveSuccess =
function(action) {
	var ca=new CalemFormActionCombo(true);
	if (action) ca.add(action);
	ca.add(new CalemWoNewFromPmSaved('workorder'));
	this._closeAndResumeParentForm(ca);
}

