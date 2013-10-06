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
 * CalemModuleFormListDesign
 * This is the form design controller.
 * 
 */
function CalemModuleFormListDesign(parent, formId, data, designId, dataModel) {
	if (arguments.length==0) return;
	CalemFormDesign.call(this, parent, formId, data, designId, dataModel);	
}

CalemModuleFormListDesign.prototype = new CalemFormDesign;
CalemModuleFormListDesign.prototype.constructor = CalemModuleFormListDesign;

CalemModuleFormListDesign.prototype.toString = 
function() {
	return "CalemModuleFormListDesign";
}

/**
 * Render factory
 */
CalemModuleFormListDesign.prototype.getRender =
function(info) {
	var render= CalemConf['view_engine']['moduleViewListDesign'][info.getClassName()];
	if (!render) {
		render=CalemFormDesign.prototype.getRender.call(this, info);
	}
	return render;
}

/**
 * Save handler
 */
CalemModuleFormListDesign.prototype._onSave =
function(ev) {
	//Collect acl and viewInfo.
	var customInfo=this._view.getCustomizedView();
	//Now let's make a soap call with busy signal
	var modList={modlist_0: { 
							  shared: this.getDesignTarget().isGroup() ? 1 : 0, 
							  target: this.getDesignTarget().getId(),
							  custom: Base64.encode(customInfo.getJson())}};	
	CalemSoapUtil._onSoapCall('SaveModList', modList, new AjxCallback(this, this._onSoapSaveViewResponse, customInfo));
} 

/**
 * get design item
 */
CalemModuleFormListDesign.prototype.getCustomInfo =
function() {
	return CalemCustomModListManager.getInstance().getFullCustomInfo('', this.getDesignTarget()); 
}

CalemModuleFormListDesign.prototype.getParentCustomInfo =
function() {
	return CalemCustomModListManager.getInstance().getParentCustomInfo('', this.getDesignTarget());
}

CalemModuleFormListDesign.prototype.getMyCustomInfo =
function() {
	return CalemCustomModListManager.getInstance().getMyCustomInfo('', this.getDesignTarget());
}

CalemModuleFormListDesign.prototype.addCustomInfo =
function(customInfo) {
	return CalemCustomModListManager.getInstance().addCustomInfo(customInfo, this.getDesignTarget());
}

CalemModuleFormListDesign.prototype.getDesignTarget =
function() {
	return CalemDesignTargetInfo.getModuleDesignTarget();
}

//Do not cache this form since each time it might be for a different group.
CalemModuleFormListDesign.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

