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
 * CalemFormListDesign
 * This is the form design controller.
 * 
 */
function CalemFormListDesign(parent, formId, data, designId, dataModel) {
	if (arguments.length==0) return;
	CalemFormDesign.call(this, parent, formId, data, designId, dataModel);	
}

CalemFormListDesign.prototype = new CalemFormDesign;
CalemFormListDesign.prototype.constructor = CalemFormListDesign;

CalemFormListDesign.prototype.toString = 
function() {
	return "CalemFormListDesign";
}

// default is CalemView
CalemFormListDesign.prototype.createView =
function() {
	CalemFormDesign.prototype.createView.call(this);
}

/**
 * Render factory
 */
CalemFormListDesign.prototype.getRender =
function(info) {
	var render= CalemConf['view_engine']['viewListDesign'][info.getClassName()];
	if (!render) {
		render=CalemFormDesign.prototype.getRender.call(this, info);
	}
	return render;
}

/**
 * Prepare grid info
 * {aclMap: MapOfHiddenFields,
 *  listInfo: CalemListInfo
 * }
 * Combining acls, custom and original layout.
 */
CalemFormListDesign.prototype.getGridCustomInfo =
function() {
	var customInfo=this.getCustomInfo();
	var layout= customInfo.getLayout();
	var gridListInfo= layout ? layout.getGridLayout() : this.getViewInfo().getItem('grid').getListInfo();
	return {acl: customInfo.getAcl().getViewAcl()._acl, listInfo: gridListInfo};
}

/**
 * List form design is relatively fast to open...so close it when quit.
 */
CalemFormListDesign.prototype.getCacheEmbedOnClose =
function() {
	return false; 
}

