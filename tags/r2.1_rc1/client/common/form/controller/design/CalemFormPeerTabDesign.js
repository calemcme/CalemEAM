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
 * CalemFormPeerTabDesign
 * This is the form design widget.
 * 
 */
function CalemFormPeerTabDesign(parent, formId, data, designId, dataModel) {
	if (arguments.length==0) return;
	CalemFormMdTabDesign.call(this, parent, formId, data, designId, dataModel);	
}

CalemFormPeerTabDesign.prototype = new CalemFormMdTabDesign;
CalemFormPeerTabDesign.prototype.constructor = CalemFormPeerTabDesign;

CalemFormPeerTabDesign.prototype.toString = 
function() {
	return "CalemFormPeerTabDesign";
}

/**
 * Need to fake the primary model for menu button use.
 */
CalemFormPeerTabDesign.prototype._createDataModel =
function(data) {	
	//Getting info from formModel
	var fmId=this._parentDataModel.getFirstFormId();
	var mdId=this._parentDataModel.getForm(fmId).getDataModel().getId();
	//Creating the model for form design.
	var impl= CalemConf['desktop_mainView']['form']['modelImpl'];
	this._dataModel=eval(['new ', impl, '(mdId, this, data)'].join(''));
	this._modelItem=this._dataModel.getModelItem();
}

// default is CalemView
CalemFormPeerTabDesign.prototype.createView =
function() {	
	var impl= CalemConf['view_engine']['viewPeerTabDesign']['viewImpl'];
	this._view=eval(['new ', impl, '(this._viewHolder, this)'].join(''));
	this._fitViewToParent();
}

/**
 * Render factory
 */
CalemFormPeerTabDesign.prototype.getRender =
function(info) {
	var render= CalemConf['view_engine']['viewPeerTabDesign'][info.getClassName()];
	if (!render) {
		render=CalemFormDesign.prototype.getRender.call(this, info);
	}
	return render;
}
 
