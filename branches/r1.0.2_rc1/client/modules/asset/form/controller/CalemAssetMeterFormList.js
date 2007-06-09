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
 * CalemAssetMeterFormList
 */
function CalemAssetMeterFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormListDet.call(this, parent, formId, data);
	//Reading history and add reading listeners
	this._meterReadingHistoryListener = new AjxListener(this, this.onMeterReadingHistory);
	this._addMeterReadingListener = new AjxListener(this, this.onAddMeterReading);
}

CalemAssetMeterFormList.prototype = new CalemFormListDet;
CalemAssetMeterFormList.prototype.constructor = CalemAssetMeterFormList;

CalemAssetMeterFormList.prototype.toString = function() { return "CalemAssetMeterFormList";}

/**
 * Business APIs
 */
CalemAssetMeterFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemAssetMeterFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemAssetMeterFormList.prototype._getFormReadId =
function(evt) {
	return 'CalemAssetMeterFormRead';
} 

/**
 * Deletion must be handled specially
 */
CalemAssetMeterFormList.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemAssetMeterBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

/**
 * Reading list form
 */
CalemAssetMeterFormList.prototype.getOpenMeterReadingHistory =
function() {
	return this._meterReadingHistoryListener;
} 
 
CalemAssetMeterFormList.prototype.getOpenAddMeterReading =
function() {
	return this._addMeterReadingListener;
}

//Listeners - both may need to update parent model item when operation is made.
CalemAssetMeterFormList.prototype.onMeterReadingHistory =
function(evt) {
	var item=CalemEvent.getItem(evt);
	var link=new CalemFieldMdInfo('meter_id', 'id');
	//To embed the reading history form.
   var ebInfo=new CalemEmbedInfo(this._parent, 'CalemAssetMeterReadingFormList', {parentRec: item, link: link});
	this._embedForm(ebInfo);
}

CalemAssetMeterFormList.prototype.onAddMeterReading =
function(evt) {	
	var item=CalemEvent.getItem(evt);
	var link=new CalemFieldMdInfo('meter_id', 'id');
	var ebInfo=new CalemEmbedNewDetInfo(this._parent, 'CalemAssetMeterReadingFormNew', item, link);
	this._embedForm(ebInfo);
}

CalemAssetMeterFormList.prototype.onNewDbRecordRaw =
function(table, recRaw) {
	if (table == this._modelItem.getId()) {//add to this data model
		CalemFormListDet.prototype.onNewDbRecordRaw.call(this, table, recRaw);
	} else {//Otherwise refresh the current grid.
		if (table=='meter_transaction') {
			this.reLoadDataBySearch(this._dataModel.getTableQueryByParentRec());
		}
	}
}
