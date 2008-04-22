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
 * CalemFormPeerModel
 * It implements the same interface as CalemFormModel.
 */
function CalemFormPeerModel(parent, model, controller, data) {
	if (arguments.length==0) return;
	this._controller=controller;
	//Prepare cache and registry
	this._reg=CalemContext.getInstance().getRegistry();
	this._cache=this._reg.getCache();
	//Model internal data
	this._forms=new Object();
	this._formsByModel=new Object(); //For propagating query results.
	//Internal init
	this._init(data);
}

CalemFormPeerModel.prototype.toString = function() { return "CalemFormPeerModel"; }

//Build up the form model first.
CalemFormPeerModel.prototype._init =
function(data) {
	var items=this._controller.getFormInfo().getFormItems();
   if (items) {
   	for (var i=0; i< items.length; i++) {
   		if (i==0) this._firstFmId=items[i].getId();
   		this._addFormItem(items[i].getId(), data);
   	}
   } 
}

//Return cache reference
CalemFormPeerModel.prototype.getCache =
function() {
	return this._cache;
}

CalemFormPeerModel.prototype.getFirstFormId = 
function() {
	return this._firstFmId;
}

//Add a model item
CalemFormPeerModel.prototype._addFormItem =
function(fmId, data) {
	var controllerId=CalemViewUtil.getFormControllerById(fmId);
	this._forms[fmId]= eval(['new ', controllerId, '(this._parent, fmId, data)'].join(''));
	var model=this._forms[fmId].getDataModel();
	//In case model is not initialized.
	if (model) this._formsByModel[model.getId()]=this._forms[fmId];
	//Set up parent form Id
	this._forms[fmId].setMdTabId(this._controller.getId());
}

//public APIs
CalemFormPeerModel.prototype.getRegistry =
function() {
	return this._reg;
}

//each form is responsible for its own loading.
CalemFormPeerModel.prototype.load =
function(callback) {   
	if (callback) callback.run(); //Continue with callback.
}

CalemFormPeerModel.prototype.getForm =
function(id) {
	return this._forms[id];
}

CalemFormPeerModel.prototype.getFormByModel =
function(modelId) {
	return this._formsByModel[modelId];
}

/**
 * Shutdown all forms of the MD form.
 */
CalemFormPeerModel.prototype._shutdown =
function(id) {
	for (var i in this._forms) {
		this._forms[i]._shutdown();
	}
}


//no action
CalemFormPeerModel.prototype.onInitDataLoaded =
function() {
}
