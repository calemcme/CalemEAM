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
 * CalemInToolFormLookup
 */
function CalemInToolFormLookup(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormLookup.call(this, parent, formId, data);
}

CalemInToolFormLookup.prototype = new CalemFormLookup;
CalemInToolFormLookup.prototype.constructor = CalemInToolFormLookup;

CalemInToolFormLookup.prototype.toString = function() { return "CalemInToolFormLookup";}

/**
 * Business APIs
 */
CalemInToolFormLookup.prototype._getFormNewId =
function() {
   return 'CalemInFormNew';
} 

/**
 * Open a master detailed view with recordlist and current record position.
 */
CalemInToolFormLookup.prototype._getFormReadId =
function(evt) {
	return 'CalemInFormRead';
} 

/**
 * Built-in filter support at list form
 */
CalemInToolFormLookup.prototype.initQueryByForm =
function(tblQuery) {
	if(!this._partExpr) {
		var val=new CalemDbString('icg_tool');
		var fld=new CalemDbField('inventory', 'category_id');
		this._partExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	}
	tblQuery.addWhere(this._modelItem.getId(), null, this._partExpr, this._modelItem.getTableDd());
	return tblQuery;
}
