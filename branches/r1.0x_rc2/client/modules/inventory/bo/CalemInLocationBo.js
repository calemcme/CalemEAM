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
 * CalemInLocationBo - business logic
 */
function CalemInLocationBo() {
}

CalemInLocationBo._details = ['in_stock', 'in_tran'];

CalemInLocationBo.getInstance =
function() {
	if (!CalemInLocationBo.singleton) {
		CalemInLocationBo.singleton = new CalemInLocationBo();
	}
	return CalemInLocationBo.singleton;
}

//Asset deletion check
CalemInLocationBo.prototype.canDelete =
function(rec, callback) {
	var reg=CalemContext.getInstance().getRegistry();
	var dbQry=new CalemDbQuery();
	//Add details
	for (var i=0; i< CalemInLocationBo._details.length; i++ ) {
		var dd=reg.getTableDd(CalemInLocationBo._details[i]);
		var qry=dd.buildGetAllQueryByLookup('location_id', rec.id);
		dbQry.add(qry);
	}
	
	var dd=reg.getTableDd('in_location');
	//Now add query by the fld.
	var orExpr=new CalemExprOr();
	var val=new CalemDbString(rec.id);
	var fld1=new CalemDbField('in_location', 'parent_id');
	var expr1=new CalemDbExpr(fld1, CalemDbExpr.EQ, val);
	dbQry.add(dd.buildGetAllQueryByExpr(expr1));
	
	//Now do a bulk query for count
	var boUtil=CalemBoUtil.getInstance();
	var soapCb=new AjxCallback(boUtil, boUtil.onDeleteByLookupResponse, callback);
	reg.getCache().bulkLoadCountBypassCache(dbQry, soapCb);
}
