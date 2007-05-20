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
 * CalemWoMeterReadingFormList
 */
function CalemWoMeterReadingFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
}

CalemWoMeterReadingFormList.prototype = new CalemFormList;
CalemWoMeterReadingFormList.prototype.constructor = CalemWoMeterReadingFormList;

CalemWoMeterReadingFormList.prototype.toString = function() { return "CalemWoMeterReadingFormList";}

/**
 * Business APIs
 */
CalemWoMeterReadingFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemAssetMeterReadingFormRead';
} 
 
/**
 * Initialize data for the transaction
 */
CalemWoMeterReadingFormList.prototype._createDataModel =
function(data) {
	CalemFormEdit.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemWoMeterReadingFormList.prototype._instantiate =
function(data) {
	var rec=data.woRec;
	this._table=data.table;
	var fld=new CalemDbField('meter_transaction', 'wo_id');
	var val=new CalemDbString(rec.id);
	this._dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
}

CalemWoMeterReadingFormList.prototype.initQueryByForm =
function(tblQuery) {
   tblQuery.addWhere(this._modelItem.getId(), null, this._dbExpr, this._modelItem.getTableDd());
	return tblQuery;
}  

CalemWoMeterReadingFormList.prototype.getCacheEmbedOnClose =
function() {
	return false; 
}
		
