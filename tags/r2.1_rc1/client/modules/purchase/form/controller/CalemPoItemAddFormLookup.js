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
 * CalemPoItemAddFormLookup
 */
function CalemPoItemAddFormLookup(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormLookup.call(this, parent, formId, data);
}

CalemPoItemAddFormLookup.prototype = new CalemFormLookup;
CalemPoItemAddFormLookup.prototype.constructor = CalemPoItemAddFormLookup;

CalemPoItemAddFormLookup.prototype.toString = function() { return "CalemPoItemAddFormLookup";}

/**
 * Initialize data for the transaction
 */
CalemPoItemAddFormLookup.prototype._createDataModel =
function(data) {
	CalemFormLookup.prototype._createDataModel.call(this);
	this._instantiate(data);
}

CalemPoItemAddFormLookup.prototype._instantiate =
function(data) {
	this._poRec=data.poRec;
	var vendorId=this._poRec.getField('vendor_id').getRawValue();
	//REQ item where: po_id is NULL AND vendor_id=this vendorId AND req status is approved
	this._andExpr=new CalemExprAnd();
	//Add po id
	var fld=new CalemDbField('req_item', 'po_id');
	var expr=new CalemDbExpr(fld, CalemDbExpr.IS_NULL);
	this._andExpr.add(expr);
	//vendor_id
	fld=new CalemDbField('req_item', 'vendor_id');
	var val=new CalemDbString(vendorId);
	expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	this._andExpr.add(expr);
	//Add req status
	fld=new CalemDbField('requisition_req_id', 'status_id'); //manually fix the table Id.
	val=new CalemDbString('req_status_approved');
	expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	this._andExpr.add(expr);	  		
}

CalemPoItemAddFormLookup.prototype.initQueryByForm =
function(tblQuery) {
   tblQuery.addWhere(this._modelItem.getId(), null, this._andExpr, this._modelItem.getTableDd());
	return tblQuery;
} 

/**
 * multi-selection is allowed here.
 */
CalemPoItemAddFormLookup.prototype._onSelect =
function(evt) {
	var items=CalemEvent.getItems(evt);
	var action=new CalemPoItemAddAction('po_item', this._poRec, items);
	this._closeAndResumeParentForm(action);
}

//Do not cache this form
CalemPoItemAddFormLookup.prototype.getCacheEmbedOnClose =
function() {
	return false;
} 
