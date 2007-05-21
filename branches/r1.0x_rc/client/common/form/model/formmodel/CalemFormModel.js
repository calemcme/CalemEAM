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
 * CalemFormModel
 * @data includes a record, and optionally a model.
 */
function CalemFormModel(parent, model, controller, data) {
	if (arguments.length==0) return;
	this._parent=parent;
	this._modelInfo=model;
	this._controller=controller;
	//Prepare cache and registry
	this._reg=CalemContext.getInstance().getRegistry();
	this._cache=this._reg.getCache();
	//Model internal data
	this._forms=new Object();
	this._formsByModel=new Object(); //For propagating query results.
	//Current record change listener for managing master detail navigation
	this._recMoveListener = new AjxListener(this, this.onRecMove);
	//Master rec change listener
	this._recModifiedListener = new AjxListener(this, this.onRecModified);
	//Internal init
	this._init(data);
}

CalemFormModel.prototype.toString = function() { return "CalemFormModel"; }

//Build up the form model first.
CalemFormModel.prototype._init =
function(data) {
	this._masterItem=this._modelInfo.getMaster();
	this._addFormItem(this._masterItem, data);
	var items=this._modelInfo.getItems();
   if (items) {
   	for (var i=0; i< items.length; i++) {
		   var modelItem=items[i];
   		this._addFormItem(modelItem.getId(), null, modelItem.getLink());
   	}
   } 
   //Listens to current record change event of the master record for now.
   //For now register a data change listener anyway
	this._forms[this._masterItem].addRecMoveListener(this._recMoveListener);
	this._forms[this._masterItem].addRecModifiedListener(this._recModifiedListener);
	//Setup formId
	this._forms[this._masterItem].setMdTabId(this._controller.getId());
}

//Return cache reference
CalemFormModel.prototype.getCache =
function() {
	return this._cache;
}

//Add a model item
CalemFormModel.prototype._addFormItem =
function(fmId, data, link) {
	var controllerId=CalemViewUtil.getFormControllerById(fmId);
	this._forms[fmId]= eval(['new ', controllerId, '(this._parent, fmId, data)'].join(''));
	if (link) {//Build up link relationship between forms.
		this._forms[fmId].setFormLink(link);
	}
	var model=this._forms[fmId].getDataModel();
	this._formsByModel[model.getId()]=this._forms[fmId];
}

//public APIs
CalemFormModel.prototype.getRegistry =
function() {
	return this._reg;
}

/**
 * Initial data loading
 */
CalemFormModel.prototype.load =
function(callback) {   
	var dbQuery=new CalemDbQuery();
	var rec=this._forms[this._masterItem].getCurrentRecord();
	if (rec) { //Current rec is valid.
		for (var i in this._forms) {
			if (i==this._masterItem) continue; //Master is populated already.
			var form=this._forms[i];
			form.setParentRec(rec);
			dbQuery.add(form.getFormQueryByParentRec());
		}
		//Define a callback
		var loadCallback=new AjxCallback(this, this.onDataLoadResponse, {callback: callback});
		this._cache.bulkLoad(dbQuery, loadCallback);
	} else { //Otherwise the parent rec is null so let's make sure all detailed records are cleared.
		//Empty out each record list 
		for (var i in this._forms) {
			if (i==this._masterItem) continue; //Don't mess with the query of the primary recordset.
			this._forms[i].setParentRec(null);
			this._forms[i].onLoadResult(null);
		}
		if (callback) callback.run(); //Continue with callback.
	}
}

/**
 * Data loading response. 
 */
CalemFormModel.prototype.onDataLoadResponse =
function(param, resultList) {
	this._forms[this._masterItem].setDataLoaded(true);
	for (var i in resultList) {
		this._formsByModel[i].onLoadResult(resultList[i]);
	}
	if (param.callback) param.callback.run();
} 

CalemFormModel.prototype.getForm =
function(id) {
	return this._forms[id];
}

CalemFormModel.prototype.getFormByModel =
function(modelId) {
	return this._formsByModel[modelId];
}

/**
 * Shutdown all forms of the MD form.
 */
CalemFormModel.prototype._shutdown =
function(id) {
	this._forms[this._masterItem].removeRecMoveListener(this._recMoveListener);
	this._forms[this._masterItem].removeRecModifiedListener(this._recModifiedListener);
	for (var i in this._forms) {
		this._forms[i]._shutdown();
	}
}

/**
 * resync data based on list selection
 */
CalemFormModel.prototype.isDataModelChanged =
function(data) {
	return  (data.modelItem != this._forms[this._masterItem]._modelItem);
} 
CalemFormModel.prototype.openAt =
function(data, callback) {
	if (data.item && this._forms[this._masterItem].getCurrentRecord().id == data.item.id) {
		callback.run(); //Assume no change.
	} else {
		this._forms[this._masterItem].setCurrentRecord(data.item);
		this.load(callback);
	}
}

/**
 * Prepare for cache listener setup.
 */
CalemFormModel.prototype.onInitDataLoaded =
function() {
	for (var i in this._forms) {
		this._forms[i].addCacheListener();
	}
}

/**
 * Current Record change listener
 * @param ev - the model id is included in the event.
 */
CalemFormModel.prototype.onRecMove =
function(ev) {
	var mdId=ev.getItems().get(0);
	if (mdId) {
		if (mdId==this._forms[this._masterItem].getDataModel().getId()) {//Reload dependent data.
			this.load(new AjxCallback(this, this._onRecMoveCallback, {mdId: mdId, ev: ev}));
		}
	}
}

//Use this event to reset parent rec to propagate the change
CalemFormModel.prototype.onRecModified =
function(ev) {
	var fmId=ev.getFmId();
	var rec=ev.getRec();
	if (fmId != this._masterItem) return;

	for (var i in this._forms) {
		if (i==this._masterItem) continue; //Don't mess with the query of the primary recordset.
		this._forms[i].setParentRec(rec);
	}
}

CalemFormModel.prototype._onRecMoveCallback =
function(params) {
	for (var i in this._forms) {
		this._forms[i]._onDataChanged(params.ev);
	}
}
