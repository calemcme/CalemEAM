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
 * CalemUomBo - business logic
 */
function CalemUomBo() {
}

CalemUomBo.getInstance =
function() {
	if (!CalemUomBo.singleton) {
		CalemUomBo.singleton = new CalemUomBo();
	}
	return CalemUomBo.singleton;
}

//Asset deletion check
CalemUomBo.prototype.canDelete =
function(rec, callback) {
	var reg=CalemContext.getInstance().getRegistry();
	var dbQry=new CalemDbQuery();
	var dd=reg.getTableDd('inventory');
	
	//Now add query by the fld.
	var orExpr=new CalemExprOr();
	var val=new CalemDbString(rec.id);
	var fld1=new CalemDbField('inventory', 'uom_id');
	var expr1=new CalemDbExpr(fld1, CalemDbExpr.EQ, val);
	orExpr.add(expr1);
	var fld2=new CalemDbField('inventory', 'rent_uom_id');
	var expr2=new CalemDbExpr(fld2, CalemDbExpr.EQ, val);
	orExpr.add(expr2);
	dbQry.add(dd.buildGetAllQueryByExpr(orExpr));
	
	//Now do a bulk query for count
	var boUtil=CalemBoUtil.getInstance();
	var soapCb=new AjxCallback(boUtil, boUtil.onDeleteByLookupResponse, callback);
	reg.getCache().bulkLoadCountBypassCache(dbQry, soapCb);
}
