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
 * CalemPoItemRemoveFormLookup
 */
function CalemPoItemRemoveFormLookup(parent, formId, data) {
	if (arguments.length==0) return;
	CalemPoItemAddFormLookup.call(this, parent, formId, data);
}

CalemPoItemRemoveFormLookup.prototype = new CalemPoItemAddFormLookup;
CalemPoItemRemoveFormLookup.prototype.constructor = CalemPoItemRemoveFormLookup;

CalemPoItemRemoveFormLookup.prototype.toString = function() { return "CalemPoItemRemoveFormLookup";}


CalemPoItemRemoveFormLookup.prototype._instantiate =
function(data) {
	this._poRec=data.poRec;
	this._poItemRec=data.poItemRec;
	var inId=this._poItemRec.getField('in_id').getRawValue();
	
	this._andExpr=new CalemExprAnd();
	//Add po id
	var fld=new CalemDbField('req_item', 'po_id');
	var val=new CalemDbString(this._poRec.id);
	var expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	this._andExpr.add(expr);
	//in_id
	fld=new CalemDbField('req_item', 'in_id');
	val=new CalemDbString(inId);
	expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	this._andExpr.add(expr);
} 

/**
 * multi-selection is allowed here.
 */
CalemPoItemRemoveFormLookup.prototype._onSelect =
function(evt) {
	var items=CalemEvent.getItems(evt);
	var action=new CalemPoItemRemoveAction('po_item', this._poRec, items);
	this._closeAndResumeParentForm(action);
}
