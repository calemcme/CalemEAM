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
 

function CalemWoBo() {
}

CalemWoBo._details = ['wo_planned_labor', 'wo_planned_part', 'wo_planned_tool', 'wo_planned_downtime', 'wo_meter', 'wo_doc',
                      'wo_sched_labor', 'wo_labor', 'wo_part', 'wo_tool', 'wo_step','wo_safety', 'wo_comment'];

CalemWoBo.getInstance =
function() {
	if (!CalemWoBo.singleton) {
		CalemWoBo.singleton = new CalemWoBo();
	}
	return CalemWoBo.singleton;
}

CalemWoBo.prototype.canDelete =
function(recWo, callback) {
	if (!this.canModify(recWo)) {
		callback.run(false);
		return;
	}
	var reg=CalemContext.getInstance().getRegistry();
	var dbQry=new CalemDbQuery();
	//Add details
	for (var i=0; i< CalemWoBo._details.length; i++ ) {
		var dd=reg.getTableDd(CalemWoBo._details[i]);
		var qry=dd.buildGetAllQueryByLookup('wo_id', recWo.id);
		dbQry.add(qry);
	}
	//If this asset is a location or parent asset.
	var dd=reg.getTableDd('workorder');
	//Now add query by the fld.
	var orExpr=new CalemExprOr();
	var val=new CalemDbString(recWo.id);
	var fld1=new CalemDbField('workorder', 'parent_wo_id');
	var expr1=new CalemDbExpr(fld1, CalemDbExpr.EQ, val);
	orExpr.add(expr1);
	var fld2=new CalemDbField('workorder', 'rework_wo_id');
	var expr2=new CalemDbExpr(fld2, CalemDbExpr.EQ, val);
	orExpr.add(expr2);
	var fld3=new CalemDbField('workorder', 'duplicate_wo_id');
	var expr3=new CalemDbExpr(fld3, CalemDbExpr.EQ, val);
	orExpr.add(expr3);
	dbQry.add(dd.buildGetAllQueryByExpr(orExpr));
	//Now do a bulk query for count
	var boUtil=CalemBoUtil.getInstance();
	var soapCb=new AjxCallback(boUtil, boUtil.onDeleteByLookupResponse, callback);
	reg.getCache().bulkLoadCountBypassCache(dbQry, soapCb);
}

CalemWoBo.prototype.canModify =
function(recWo) {
	var rtn=(recWo.getField('status_id').getRawValue()!='wos_closed');
	if (!rtn) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_wo_edit'),CalemMsg.getMsg('wo_closed_no_edit'));
	}
	return rtn;
}
