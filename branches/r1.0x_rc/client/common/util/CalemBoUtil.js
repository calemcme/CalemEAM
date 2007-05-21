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
 * BO util.
 */
function CalemBoUtil() {
} 

CalemBoUtil.getInstance =
function() {
	if (!CalemBoUtil.singleton) {
		CalemBoUtil.singleton = new CalemBoUtil();
	}
	return CalemBoUtil.singleton;
}

/**
 * Generic deletion dependency check.
 */
//Asset deletion check
CalemBoUtil.prototype.canDeleteByLookup =
function(tbList, lkupFld, lkupVal, callback) {
	var reg=CalemContext.getInstance().getRegistry();
	var dbQry=new CalemDbQuery();
	//Add details
	for (var i=0; i< tbList.length; i++ ) {
		var table=tbList[i];
		var fld=lkupFld;
		if (typeof(table)=='object') {
			fld=table.fld;
			table=table.table;
		}
		var dd=reg.getTableDd(table);
		var qry=dd.buildGetAllQueryByLookup(fld, lkupVal);
		dbQry.add(qry);
	}
	//Now do a bulk query for count
	reg.getCache().bulkLoadCountBypassCache(dbQry, new AjxCallback(this, this.onDeleteByLookupResponse, callback));
}

CalemBoUtil.prototype.onDeleteByLookupResponse =
function(callback, countList) {
	var tbl=false;
	for (var i=0; i< countList.length; i++) {
		if (countList[i]['count'] > 0) {
			tbl=countList[i]['table'];
			break;
		}
	}
	if (tbl) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_delete_title'), 
			AjxMessageFormat.format(CalemMsg.getMsg('delete_dependency_no_del'), [CalemMsg.getMsg(tbl), tbl]));
	} else {
		callback.run(true);
	}
} 

CalemBoUtil.isUserInAdminGroup =
function() {
	var gid=CalemContext.getInstance().getGroupId();
	return (gid==CalemConst.CALEM_OOB || gid==CalemConst.CUSTOM_SYSTEM);
}