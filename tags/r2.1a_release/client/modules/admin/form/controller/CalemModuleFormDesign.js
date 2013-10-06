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
 * CalemModuleFormDesign
 * This is the form design controller.
 * 
 */
function CalemModuleFormDesign(parent, formId, data, designId, dataModel) {
	if (arguments.length==0) return;
	CalemFormDesign.call(this, parent, formId, data, designId, dataModel);	
}

CalemModuleFormDesign.prototype = new CalemFormDesign;
CalemModuleFormDesign.prototype.constructor = CalemModuleFormDesign;

CalemModuleFormDesign.prototype.toString = 
function() {
	return "CalemModuleFormDesign";
}

/** Record which module we're dealing with. */
CalemModuleFormDesign.prototype._createDataModel =
function(data) {
	CalemFormDesign.prototype._createDataModel.call(this);	//no need for the info.
	this._modId=data.item.id;
}

CalemModuleFormDesign.prototype.getModId =
function() {
	return this._modId;
}

/**
 * Render factory
 */
CalemModuleFormDesign.prototype.getRender =
function(info) {
	var render= CalemConf['view_engine']['moduleViewDesign'][info.getClassName()];
	if (!render) {
		render=CalemFormDesign.prototype.getRender.call(this, info);
	}
	return render;
}

/**
 * Save handler
 */
CalemModuleFormDesign.prototype._onSave =
function(ev) {
	//Collect acl and viewInfo.
	var customInfo=this._view.getCustomizedView();
	//Now let's make a soap call with busy signal
	var mod={mod_0: {   id: this._modId, 
							  shared: this.getDesignTarget().isGroup() ? 1 : 0, 
							  target: this.getDesignTarget().getId(),
							  custom: Base64.encode(customInfo.getJson())}};	
	CalemSoapUtil._onSoapCall('SaveModule', mod, new AjxCallback(this, this._onSoapSaveViewResponse, customInfo));
} 

/**
 * get design item
 */
CalemModuleFormDesign.prototype.getCustomInfo =
function() {
	return CalemCustomModuleManager.getInstance().getFullCustomInfo(this._modId, this.getDesignTarget()); 
}

CalemModuleFormDesign.prototype.getParentCustomInfo =
function() {
	return CalemCustomModuleManager.getInstance().getParentCustomInfo(this._modId, this.getDesignTarget());
}

CalemModuleFormDesign.prototype.getMyCustomInfo =
function() {
	return CalemCustomModuleManager.getInstance().getMyCustomInfo(this._modId, this.getDesignTarget());
}

CalemModuleFormDesign.prototype.addCustomInfo =
function(customInfo) {
	return CalemCustomModuleManager.getInstance().addCustomInfo(customInfo, this.getDesignTarget());
}

CalemModuleFormDesign.prototype.getDesignTarget =
function() {
	return CalemDesignTargetInfo.getModuleDesignTarget();
}

//Do not cache this form since each time it might be for a different group.
CalemModuleFormDesign.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

