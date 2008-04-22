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
 * CalemInOrderFormList
 */
function CalemInOrderFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
}

CalemInOrderFormList.prototype = new CalemFormList;
CalemInOrderFormList.prototype.constructor = CalemInOrderFormList;

CalemInOrderFormList.prototype.toString = function() { return "CalemInOrderFormList";}

/**
 * Business APIs
 */
CalemInOrderFormList.prototype._getFormReadId =
function(evt) {
    return 'CalemInOrderFormRead';
} 

CalemInOrderFormList.prototype.initQueryByForm =
function(tblQuery) {
	var fld=new CalemDbField('inventory', 'qty_to_order');
	var val=new CalemDbNumber(0);
	var expr=new CalemDbExpr(fld, CalemDbExpr.GT, val);
	
   tblQuery.addWhere(this._modelItem.getId(), null, expr, this._modelItem.getTableDd());
	return tblQuery;
}

//Report
CalemInOrderFormList.prototype.getReportId =
function() {
	return 'CalemInOrderReportList';
}  
