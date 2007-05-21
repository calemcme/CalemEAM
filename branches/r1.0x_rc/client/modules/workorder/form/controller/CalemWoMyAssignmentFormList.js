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
 * CalemWoFormList
 */
function CalemWoMyAssignmentFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemWoFormList.call(this, parent, formId, data);
}

CalemWoMyAssignmentFormList.prototype = new CalemWoFormList;
CalemWoMyAssignmentFormList.prototype.constructor = CalemWoMyAssignmentFormList;

CalemWoMyAssignmentFormList.prototype.toString = function() { return "CalemWoMyAssignmentFormList";}

CalemWoMyAssignmentFormList.prototype.initQueryByForm =
function(tblQuery) {
	var uid=CalemContext.getInstance().getUserId();
	var andExpr=new CalemExprAnd();
	var fld=new CalemDbField('workorder', 'status_id');
	var val=new CalemDbString('wos_closed');
	var expr=new CalemDbExpr(fld, CalemDbExpr.NEQ, val);
	andExpr.add(expr);
	fld=new CalemDbField('workorder', 'assigned_to_id');
	val=new CalemDbString(uid);
	expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	andExpr.add(expr);
   tblQuery.addWhere(this._modelItem.getId(), null, andExpr, this._modelItem.getTableDd());
	return tblQuery;
}  