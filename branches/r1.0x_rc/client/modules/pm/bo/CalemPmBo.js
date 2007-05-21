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
 * CalemPmBo - business logic
 */
function CalemPmBo() {
}

CalemPmBo._pm_detail = ['pm_labor', 'pm_tool', 'pm_part', 'pm_downtime', 'pm_step', 'pm_safety', 'pm_doc',
                        'pm_audit', 'pm_comment', 'pm_dependency', 'pm_asset', 'workorder'];

CalemPmBo.getInstance =
function() {
	if (!CalemPmBo.singleton) {
		CalemPmBo.singleton = new CalemPmBo();
	}
	return CalemPmBo.singleton;
}

//Pm deletion check
CalemPmBo.prototype.canDeletePm =
function(recPm, callback) {
	var reg=CalemContext.getInstance().getRegistry();
	var dbQry=new CalemDbQuery();
	//Add details
	for (var i=0; i< CalemPmBo._pm_detail.length; i++ ) {
		var dd=reg.getTableDd(CalemPmBo._pm_detail[i]);
		var qry=dd.buildGetAllQueryByLookup('pm_id', recPm.id);
		dbQry.add(qry);
	}
	//Check for PM dependency
	var dd=reg.getTableDd('pm_dependency');
	var val=new CalemDbString(recPm.id);
	var fld1=new CalemDbField('pm_dependency', 'child_pm_id');
	var expr1=new CalemDbExpr(fld1, CalemDbExpr.EQ, val);
	dbQry.add(dd.buildGetAllQueryByExpr(expr1));
	//Now do a bulk query for count
	var boUtil=CalemBoUtil.getInstance();
	var soapCb=new AjxCallback(boUtil, boUtil.onDeleteByLookupResponse, callback);
	reg.getCache().bulkLoadCountBypassCache(dbQry, soapCb);
}
