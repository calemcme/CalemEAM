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
 * CalemNewWoPmFormLookup
 */
function CalemNewWoPmFormLookup(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormLookup.call(this, parent, formId, data);
	this._lookupCb=new AjxCallback(this, this.onLookupCallback);
}

CalemNewWoPmFormLookup.prototype = new CalemFormLookup;
CalemNewWoPmFormLookup.prototype.constructor = CalemNewWoPmFormLookup;

CalemNewWoPmFormLookup.prototype.toString = function() { return "CalemNewWoPmFormLookup";}

/**
 * Initialize data for the transaction
 */
CalemNewWoPmFormLookup.prototype._createDataModel =
function(data) {
	this._row=data.row;
	CalemFormLookup.prototype._createDataModel.call(this);
}

CalemNewWoPmFormLookup.prototype.initQueryByForm =
function(tblQuery) {
	if (this._row['pm_select_id']=='wps_asset') {
		var jn=new CalemTableJoin(CalemTableJoin.INNTER, 'pm', 'id', 'pm_asset', 'pm_id');
		var fld=new CalemDbField('pm_asset_id', 'asset_id'); //m114 - use proper alias here based on join
		var val=new CalemDbString(this._row['asset_id']);
		var expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
		tblQuery.setWhere('pm_asset', expr, jn);
	}
	return tblQuery;
}

CalemNewWoPmFormLookup.prototype._onSelect =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	var row=new Object();
	row['pm_id']=rec.id;
	row['asset_id']=this._row['asset_id'];
	//Do a lookup to bring back info.
	var rows={row_0: row};
	CalemSoapUtil._onSoapCall('LookupWoNewByPm', rows, this._lookupCb);
}

CalemNewWoPmFormLookup.prototype.onLookupCallback =
function(resp) {
	//This is single record so let's process it.
	var spResp=resp[0];
	if (spResp.status == CalemForm.SOAP_SUCC) { //Update local copy.		
	   var row=spResp.lookup;
		var ebInfo=new CalemEmbedInfo(this._parent, 'CalemWoFormNew', {row: row});
	   this._embedForm(ebInfo);
	} else { //Need to display error.
		this._showSoapError(spResp);
	}	
}

CalemNewWoPmFormLookup.prototype.getCacheEmbedOnClose =
function() {
	return false;
}

//Close this form.
CalemNewWoPmFormLookup.prototype.onWoNewFromPmSaved =
function(table) {
	this._closeAndResumeParentForm();
}


