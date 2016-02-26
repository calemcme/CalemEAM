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
 * CalemAclInfo
 */
function CalemAclInfo(acl) {
	if (arguments.length==0) return;
	this._acl=acl;
}

CalemAclInfo.ACCESS=0;
CalemAclInfo.NO_ACCESS=1;

//Serialization
CalemAclInfo.prototype.getJson =
function() {
	return CalemJson.mapToJson(this._acl);
}

CalemAclInfo.prototype.aggregate =
function(acl) {
	for (var i in acl._acl) this._acl[i]=acl._acl[i];
}

CalemAclInfo.prototype.checkAcl =
function(i) {
	return (this._acl[i] != CalemAclInfo.NO_ACCESS);
}

/**
 * CalemCustomViewManager
 * Customized for efficiency in accessing acl and layout.
 */
function CalemCustomViewManager() {}

/**
 * Get my custom acl. 
 */
CalemCustomViewManager.prototype.getMyCustomInfo =
function(id, target) {
	var userInfo=CalemContext.getInstance().getUserInfo();
	var uid=userInfo.uid;
	var isGroup= (target && target.isGroup());
	var gid= isGroup ? target.getId() : userInfo.gid;
	if (!CalemDropdownUtil.isGroupCalem(gid) && !CalemDropdownUtil.isGroupCustom(gid)) {
		gid=CalemConst.CUSTOM_SYSTEM;
	}
	var customInfo=this._getEmptyCustomInfo();
	var foundIt = this.aggregate(id, gid, customInfo);
	if (!foundIt && CalemDropdownUtil.isGroupCustom(gid)) {
		this.aggregate(id, CalemConst.CALEM_OOB, customInfo);
	}
	return customInfo;
}

/**
 * Get parent acl for design
 */
CalemCustomViewManager.prototype.getParentCustomInfo =
function(id, target) {//This is for design case.
   var userInfo=CalemContext.getInstance().getUserInfo();
   var isGroup= (target && target.isGroup());
	var gid= isGroup ? target.getId() : userInfo.gid;
	if (!CalemDropdownUtil.isGroupCalem(gid) && !CalemDropdownUtil.isGroupCustom(gid)) {
		gid=CalemConst.CUSTOM_SYSTEM;
	} else if (CalemDropdownUtil.isGroupCustom(gid)) {
		gid=CalemConst.CALEM_OOB;
	}
	var customInfo=this._getEmptyCustomInfo();
	this.aggregate(id, gid, customInfo);
	if (CalemDropdownUtil.isGroupCustom(gid)) {
		this.aggregate(id, CalemConst.CALEM_OOB, customInfo);
	}
	return customInfo;
}

/**
 * Get all the Acls if applicable.
 */
CalemCustomViewManager.prototype.getFullCustomInfo =
function(id, target) {
	var userInfo=CalemContext.getInstance().getUserInfo();
	var isGroup= (target && target.isGroup());
	var gid= isGroup ? target.getId() : userInfo.gid;
	if (!CalemDropdownUtil.isGroupCalem(gid) && !CalemDropdownUtil.isGroupCustom(gid)) {
		gid=CalemConst.CUSTOM_SYSTEM;
	}
	var customInfo=this._getEmptyCustomInfo();
	this.aggregate(id, gid, customInfo);
	if (CalemDropdownUtil.isGroupCustom(gid)) {
		this.aggregate(id, CalemConst.CALEM_OOB, customInfo);
	}
	return customInfo;
}

/**
 * Aggregate all ACLs but only the very first layout is used as the layout.
 */
CalemCustomViewManager.prototype.aggregate =
function(id, aid, customInfo) {
	var info=this._getCustomInfoById(id, aid);
	if (info) {
		var cInfo=CalemJson.setJson(info);
		rtn=customInfo.getAcl().aggregate(cInfo.getAcl());
		if (!customInfo.getLayout() && cInfo.getLayout()) customInfo.setLayout(cInfo.getLayout());
	}
	return info;
}

/**
 * CalemCustomViewManager
 */
function CalemCustomViewManager() {}

CalemCustomViewManager.getInstance =
function() {
	if (!CalemCustomViewManager._INSTANCE) {
		CalemCustomViewManager._INSTANCE=new CalemCustomViewManager();
	}
	return CalemCustomViewManager._INSTANCE;
}

CalemCustomViewManager.prototype=new CalemCustomViewManager;
CalemCustomViewManager.prototype.constructor = CalemCustomViewManager;
 
CalemCustomViewManager.prototype.addCustomInfo =
function(customInfo, target) {
   eval("var custom="+customInfo.getJson());
	CalemViewCustomDef[customInfo.getId()+"_"+target.getId()] = custom; 
}

/**
 * Creating an empty CustomViewInfo.
 */
CalemCustomViewManager.prototype._getEmptyCustomInfo =
function(id) {
	var viewAcl=new CalemViewAclInfo(new CalemAclInfo({}), new CalemAclInfo({}));
	return new CalemViewCustomInfo(id, viewAcl, null);
}

//CustomInfo check
CalemCustomViewManager.prototype._getCustomInfoById =
function(id, oid) {
	return oid ? CalemViewCustomDef[id+"_"+oid] : null;
}
 
/**
 * CalemCustomFormManager
 */
function CalemCustomFormManager() {}

CalemCustomFormManager.getInstance =
function() {
	if (!CalemCustomFormManager._INSTANCE) {
		CalemCustomFormManager._INSTANCE=new CalemCustomFormManager();
	}
	return CalemCustomFormManager._INSTANCE;
}

CalemCustomFormManager.prototype=new CalemCustomViewManager;
CalemCustomFormManager.prototype.constructor = CalemCustomFormManager;

CalemCustomFormManager.prototype.addCustomInfo =
function(customInfo, target) {
   eval("var custom="+customInfo.getJson());
	CalemFormCustomDef[customInfo.getId()+"_"+target.getId()] = custom; 
}

/**
 * Creating an empty CustomViewInfo.
 */
CalemCustomFormManager.prototype._getEmptyCustomInfo =
function(id) {
	var formAcl=new CalemFormAclInfo(new CalemAclInfo({}), new CalemAclInfo({}));
	return new CalemFormCustomInfo(id, formAcl, null);
}

//CustomInfo check
CalemCustomFormManager.prototype._getCustomInfoById =
function(id, oid) {
	return oid ? CalemFormCustomDef[id+"_"+oid] : null;
}
