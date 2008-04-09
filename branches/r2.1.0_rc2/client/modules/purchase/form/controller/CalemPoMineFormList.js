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
 * CalemPoMineFormList
 */
function CalemPoMineFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
}

CalemPoMineFormList.prototype = new CalemFormList;
CalemPoMineFormList.prototype.constructor = CalemPoMineFormList;

CalemPoMineFormList.prototype.toString = function() { return "CalemPoMineFormList";}

CalemPoMineFormList.prototype.initQueryByForm =
function(tblQuery) {
	var uid=CalemContext.getInstance().getUserId();
	var fld=new CalemDbField('po', 'buyer_id');
	var val=new CalemDbString(uid);
	var expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
   tblQuery.addWhere(this._modelItem.getId(), null, expr, this._modelItem.getTableDd());
	return tblQuery;
}  

/**
 * Business APIs
 */
CalemPoMineFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemPoFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemPoMineFormList.prototype._onOpen =
function(evt) {
	//Get the selection event
    var item=CalemEvent.getItem(evt);
	//Prepare data for master detail view.
	var data = {modelItem: this._modelItem, item: item};
	//pass-through current data model and selection
	this._openForm('CalemPoFormMdTab', data);
} 

/**
 * Deletion must be handled specially
 */
CalemPoMineFormList.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemPoBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

//Report
CalemPoMineFormList.prototype.getReportId =
function() {
	return 'CalemPoReportMdTab';
} 

