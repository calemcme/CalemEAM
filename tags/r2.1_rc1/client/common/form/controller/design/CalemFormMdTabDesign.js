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
 * CalemFormMdTabDesign
 * This is the form design widget.
 * 
 */
function CalemFormMdTabDesign(parent, formId, data, designId, dataModel) {
	if (arguments.length==0) return;
	CalemFormDesign.call(this, parent, formId, data, designId, dataModel);	
}

CalemFormMdTabDesign.prototype = new CalemFormDesign;
CalemFormMdTabDesign.prototype.constructor = CalemFormMdTabDesign;

CalemFormMdTabDesign.prototype.toString = 
function() {
	return "CalemFormMdTabDesign";
}

/**
 * Need to fake the primary model for menu button use.
 */
CalemFormMdTabDesign.prototype._createDataModel =
function(data) {	
	//Getting info from formModel
	var fmId=this._formInfo.getModel().getMaster();
	var mdId=this._parentDataModel.getForm(fmId).getDataModel().getId();
	//Creating the model for form design.
	var impl= CalemConf['desktop_mainView']['form']['modelImpl'];
	this._dataModel=eval(['new ', impl, '(mdId, this, data)'].join(''));
	this._modelItem=this._dataModel.getModelItem();
}

// default is CalemView
CalemFormMdTabDesign.prototype.createView =
function() {	
	var impl= CalemConf['view_engine']['viewMdTabDesign']['viewImpl'];
	this._view=eval(['new ', impl, '(this._viewHolder, this)'].join(''));
	this._fitViewToParent();
}

/**
 * Render factory
 */
CalemFormMdTabDesign.prototype.getRender =
function(info) {
	var render= CalemConf['view_engine']['viewMdTabDesign'][info.getClassName()];
	if (!render) {
		render=CalemFormDesign.prototype.getRender.call(this, info);
	}
	return render;
}

/**
 * Save handler
 */
CalemFormMdTabDesign.prototype._onSave =
function(ev) {
	//Collect acl and viewInfo.
	var customInfo=this._view.getCustomizedView();
	//Now let's make a soap call with busy signal
	var forms={form_0: {id: customInfo.getId(), 
							  shared: this.getDesignTarget().isGroup() ? 1 : 0, 
							  target: this.getDesignTarget().getId(),
							  custom: Base64.encode(customInfo.getJson())}};	
	CalemSoapUtil._onSoapCall('SaveForm', forms, new AjxCallback(this, this._onSoapSaveViewResponse, customInfo));
} 

/**
 * get design item
 */
CalemFormMdTabDesign.prototype.getCustomInfo =
function() {
	return CalemCustomFormManager.getInstance().getFullCustomInfo(this._formInfo.getId(), this.getDesignTarget()); 
}

CalemFormMdTabDesign.prototype.getParentCustomInfo =
function() {
	return CalemCustomFormManager.getInstance().getParentCustomInfo(this._formInfo.getId(), this.getDesignTarget());
}

CalemFormMdTabDesign.prototype.getMyCustomInfo =
function() {
	return CalemCustomFormManager.getInstance().getMyCustomInfo(this._formInfo.getId(), this.getDesignTarget());
}

CalemFormMdTabDesign.prototype.addCustomInfo =
function(customInfo) {
	return CalemCustomFormManager.getInstance().addCustomInfo(customInfo, this.getDesignTarget());
}

/**
 * This design form is relatively fast to open...so close it when quit.
 */
CalemFormMdTabDesign.prototype.getCacheEmbedOnClose =
function() {
	return false; 
}
