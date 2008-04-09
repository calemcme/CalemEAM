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
 * CalemBudgetTitleBo - some common business logic for BudgetTitle.
 */
function CalemBudgetTitleBo() {
}

CalemBudgetTitleBo.getInstance =
function() {
	if (!CalemBudgetTitleBo.singleton) {
		CalemBudgetTitleBo.singleton = new CalemBudgetTitleBo();
	}
	return CalemBudgetTitleBo.singleton;
}

CalemBudgetTitleBo.prototype._verifyDates =
function(view) {
	var verified=true;
	var startDate=view.getFieldValue('start_date');
	var endDate=view.getFieldValue('end_date');
	if (startDate && endDate && startDate >= endDate) {
		verified=false;
		var errMsg= CalemMsg.getMsg('invalid_start_end_date');
		view.setFieldError('start_date', errMsg);
		view.setFieldError('end_date', errMsg);
		throw errMsg;
	}
	return verified;
}
	
/**
 * Can the budget title be deleted?
 * If the budget title has detailed records do not allow a deletion.
 */
CalemBudgetTitleBo.prototype.canDelete =
function(recTitle, callback) {
	var reg=CalemContext.getInstance().getRegistry();
	var budgetDd=reg.getTableDd('budget');
	var qry=budgetDd.buildGetAllQuery();
	//Query condition
	var val=new CalemDbLookup(recTitle.id);
	var fld=new CalemDbField('budget', 'title_id');
	var dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	qry.setWhere('budget', dbExpr);
	var dbQry=new CalemDbQuery();
	dbQry.add(qry)
	//Now do a bulk query with a callback
	reg.getCache().bulkLoad(dbQry, new AjxCallback(this, this.onDeleteFetchResult, callback));
}

CalemBudgetTitleBo.prototype.onDeleteFetchResult =
function(callback, result) {
	var recList=result['budget'];
	if (recList.getTotal() > 0) {//Prompt deletion now allowed.
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_delete_title'), CalemMsg.getMsg('budget_not_empty'));
	} else {
		callback.run(true);
	}
}