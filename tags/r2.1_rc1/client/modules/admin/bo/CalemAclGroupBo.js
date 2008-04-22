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
 * CalemAclGroupBo - some common business logic for BudgetTitle.
 */
function CalemAclGroupBo() {
}

CalemAclGroupBo.getInstance =
function() {
	if (!CalemAclGroupBo.singleton) {
		CalemAclGroupBo.singleton = new CalemAclGroupBo();
	}
	return CalemAclGroupBo.singleton;
}

/**
 * Can the group be deleted?
 * Check for users and groups.
 */
CalemAclGroupBo.prototype.canDelete =
function(recTitle, callback) {
	//If this is admin group, cannot delete (CCS or OOB if any).
	if (this._checkForAdmin(recTitle)) return;
	
	var reg=CalemContext.getInstance().getRegistry();
	//Check for child groups.
	var groupDd=reg.getTableDd('acl_group');
	var qry=groupDd.buildGetAllQuery();
	//Query condition
	var val=new CalemDbLookup(recTitle.id);
	var fld=new CalemDbField('acl_group', 'parent_group_id');
	var dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	qry.setWhere('acl_group', dbExpr);
	var dbQry=new CalemDbQuery();
	dbQry.add(qry)
	//Check for users in the group
	var userDd=reg.getTableDd('users');
	qry=userDd.buildGetAllQuery();
	fld=new CalemDbField('users', 'acl_group_id');
	dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
	qry.setWhere('users', dbExpr);
	dbQry.add(qry);
	//Now do a bulk qury with a callback
	reg.getCache().bulkLoad(dbQry, new AjxCallback(this, this.onDeleteFetchResult, callback));
}

CalemAclGroupBo.prototype._checkForAdmin =
function(recTitle) {
	var rtn= (recTitle.id==CalemConst.CUSTOM_SYSTEM);
	if (rtn) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_delete_title'), CalemMsg.getMsg('built_in_group_no_deletion'));
	}
	return rtn;
}

CalemAclGroupBo.prototype.onDeleteFetchResult =
function(callback, result) {
	var recList=result['acl_group'];
	if (recList.getTotal() > 0) {//Prompt deletion now allowed.
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_delete_title'), CalemMsg.getMsg('child_group_not_empty'));
		return;
	} 
	
	recList=result['users'];
	if (recList.getTotal()>0) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_delete_title'), CalemMsg.getMsg('group_users_not_empty'));
		return;
	}
	
	callback.run(true);
}