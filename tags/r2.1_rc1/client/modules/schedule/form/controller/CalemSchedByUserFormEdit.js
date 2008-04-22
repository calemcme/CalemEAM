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
 * CalemSchedByUserFormEdit
 */
function CalemSchedByUserFormEdit(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormEdit.call(this, parent, formId, data);
	//callback
	this._cacheLoadedCb=new AjxCallback(this, this.onCacheLoaded);
	this._schedCb = new AjxCallback(this, this.onSchedCallback);
	this._cache=CalemContext.getInstance().getRegistry().getCache();
}

CalemSchedByUserFormEdit.prototype = new CalemFormEdit;
CalemSchedByUserFormEdit.prototype.constructor = CalemSchedByUserFormEdit;

CalemSchedByUserFormEdit.prototype.toString = function() { return "CalemSchedByUserFormEdit";}

/**
 * Initialize data for the transaction
 */
CalemSchedByUserFormEdit.prototype._createDataModel =
function() {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate();
}

CalemSchedByUserFormEdit.prototype._instantiate =
function(data) {
	//Restore last data entered
	this._modelItem.createNewRecord();
	var rec=this._modelItem.getCurrentRecord();
	rec.id=1;
	if (this._inputRow) {
		rec.getField('start_date').setServerDateString(this._inputRow['start_date']);
		rec.getField('end_date').setServerDateString(this._inputRow['end_date']);
		rec.getField('shift_id').setRawValue(this._inputRow['shift_id']);
	}
	//Force a repaint.
	this.onRecChanged();
}

CalemSchedByUserFormEdit.prototype._loadData =
function() {//Record should have been set already.
	this._cache.bulkLoadCacheForTable(this._modelItem.getId(), this._cacheLoadedCb);
} 

CalemSchedByUserFormEdit.prototype.onCacheLoaded =
function() {
	this.onDataLoaded();
} 

/**
 * Business APIs
 */
CalemSchedByUserFormEdit.prototype._verifyInputBo =
function() {
	var startDate=this._view.getFieldValue('start_date');
	var endDate=this._view.getFieldValue('end_date');
	var errMsg =null;
	//A few constraints here
	// a) startDate <= endDate
	// b) endDate - startDate < Max (say 30 days)
	if (startDate >= endDate) {
		errMsg= CalemMsg.getMsg('invalid_start_end_date');
	} else if ( (endDate-startDate)/AjxDateUtil.MSEC_PER_DAY > CalemConf['sched_conf']['max_schedule_days']) {
		errMsg= AjxMessageFormat.format(CalemMsg.getMsg('err_sched_max_days'), [CalemConf['sched_conf']['max_schedule_days']]);
	}
	if (errMsg) {
		this._view.setFieldError('start_date', errMsg);
		this._view.setFieldError('end_date', errMsg);
		throw errMsg;
	}
	return true;
}

//Using save function to do transaction
CalemSchedByUserFormEdit.prototype._onSave =
function(evt) {
	var row=this._getInputDataRow();
	this._inputRow=row;
	rows={in_0: row};
	CalemSoapUtil._onSoapCall('BatchSchedule', rows, this._schedCb, null, rows);
}

/**
 * Process soap response from server
 */
CalemSchedByUserFormEdit.prototype.onSchedCallback =
function(resp, rows) {
	//This is single record so let's process it.
	var tranResp=resp[0];
	if (tranResp.status == CalemForm.SOAP_SUCC) { //Update local copy.
		//Resync the form for next processing.
		this._instantiate();
	} else { //Need to display error.
		this._showSoapError(tranResp);
	}	
}


