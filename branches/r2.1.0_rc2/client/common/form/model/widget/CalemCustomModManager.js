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
 * CalemCustomModManager
 * Customized for efficiency in accessing module acl and layout.
 */
function CalemCustomModManager() {}

/**
 * Get my custom acl. 
 * Needs to traverse the hierarchy to till the top.
 */
CalemCustomModManager.prototype.getMyCustomInfo =
function(id, target) {
	var userInfo=CalemContext.getInstance().getUserInfo();
	var uid=userInfo.uid;
	var isGroup= (target && target.isGroup());
	var gid= isGroup ? target.getId() : userInfo.gid;
	return this._getCustomInfo(id, gid, false, true); //The first one found, stop.
}

/**
 * Get parent acl for design
 */
CalemCustomModManager.prototype.getParentCustomInfo =
function(id, target) {//This is for design case.
   var userInfo=CalemContext.getInstance().getUserInfo();
   var isGroup= (target && target.isGroup());
	var gid= isGroup ? target.getId() : userInfo.gid;
	return this._getCustomInfo(id, gid, true, false); //skipping current one and all the way up.
}

/**
 * Get all the Acls and first layout that's valid if applicable.
 */
CalemCustomModManager.prototype.getFullCustomInfo =
function(id, target) {
	var userInfo=CalemContext.getInstance().getUserInfo();
	var isGroup= (target && target.isGroup());
	var gid= isGroup ? target.getId() : userInfo.gid;
	return this._getCustomInfo(id, gid, false, false);
}

/**
 * Assemble a view's acl based on current user, group and default system info.
 */
CalemCustomModManager.prototype._getCustomInfo =
function(id, gid, excludeMyGroup, stopWhenFound) {
	//Creating a customInfo for result.
	var customInfo=this._getEmptyCustomInfo();
	var foundIt=false;
	
	//Aggregate group
	if (!excludeMyGroup) {
		foundIt = this.aggregate(id, gid, customInfo);
		if (stopWhenFound && foundIt) return customInfo;
	}
	
	var cachedGroups=CalemContext.getInstance().getRegistry().getCache().get('acl_group');
	var parents=cachedGroups.findParents(gid);
	if (parents) {
		for (var i=0; i< parents.length; i++) {
			foundIt = this.aggregate(id, parents[i], customInfo);
			if (stopWhenFound && foundIt) return customInfo;
		}
	}
	return customInfo;
}

/**
 * Aggregate all ACLs but only the very first layout is used as the layout.
 */
CalemCustomModManager.prototype.aggregate =
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

CalemCustomViewManager.prototype=new CalemCustomModManager;
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

CalemCustomFormManager.prototype=new CalemCustomModManager;
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

/**
 * CalemCustomModuleManager
 */
function CalemCustomModuleManager() {}

CalemCustomModuleManager.getInstance =
function() {
	if (!CalemCustomModuleManager._INSTANCE) {
		CalemCustomModuleManager._INSTANCE=new CalemCustomModuleManager();
	}
	return CalemCustomModuleManager._INSTANCE;
}

CalemCustomModuleManager.prototype=new CalemCustomModManager;
CalemCustomModuleManager.prototype.constructor = CalemCustomModuleManager;

CalemCustomModuleManager.prototype.addCustomInfo =
function(customInfo, target) {
   eval("var custom="+customInfo.getJson());
	CalemModuleCustomDef[customInfo.getId()+"_"+target.getId()] = custom; 
}

/**
 * Creating an empty CustomViewInfo.
 */
CalemCustomModuleManager.prototype._getEmptyCustomInfo =
function(id) {
	var acl=new CalemAclInfo({});
	return new CalemModuleCustomInfo(id, acl, null);
}

//CustomInfo check
CalemCustomModuleManager.prototype._getCustomInfoById =
function(id, oid) {
	return oid ? CalemModuleCustomDef[id+"_"+oid] : null;
}

//Original moduleInfo
CalemCustomModuleManager.prototype.getSysModInfo =
function(id) {
	return CalemJson.setJson(CalemModuleDef[id]);
}

/**
 * CalemCustomModListManager
 */
function CalemCustomModListManager() {}

CalemCustomModListManager.getInstance =
function() {
	if (!CalemCustomModListManager._INSTANCE) {
		CalemCustomModListManager._INSTANCE=new CalemCustomModListManager();
	}
	return CalemCustomModListManager._INSTANCE;
}

CalemCustomModListManager.prototype=new CalemCustomModuleManager;
CalemCustomModListManager.prototype.constructor = CalemCustomModListManager;

CalemCustomModListManager.prototype.addCustomInfo =
function(customInfo, target) {
   eval("var custom="+customInfo.getJson());
	CalemModListCustomDef[target.getId()] = custom; 
}

/**
 * Creating an empty CustomViewInfo.
 */
CalemCustomModListManager.prototype._getEmptyCustomInfo =
function(id) {
	var acl=new CalemAclInfo({});
	return new CalemModListCustomInfo(acl, null);
}

//CustomInfo check
CalemCustomModListManager.prototype._getCustomInfoById =
function(id, oid) {
	return oid ? CalemModListCustomDef[oid] : null;
}

CalemCustomModListManager.prototype.getSysModList =
function() {
	return CalemConf['registry_module']['names'];
}
