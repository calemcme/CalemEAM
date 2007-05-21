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
 * CalemFormMdTab
 * This is multi-tab form controller.
 * 
 */
function CalemFormMdTab(parent, formId, data) {
	if (arguments.length==0) return;
	CalemForm.call(this, parent, formId, data);
}

CalemFormMdTab.prototype = new CalemForm;
CalemFormMdTab.prototype.constructor = CalemFormMdTab;

CalemFormMdTab.prototype.toString = function() { return "CalemFormMdTab"; }

/**
 * Data model factory method
 */
CalemFormMdTab.prototype._createDataModel =
function(data) {	
	var impl= CalemConf['desktop_mainView']['form']['formModelImpl'];
	var model=this._formInfo.getModel();
	this._formModel=eval(['new ', impl, '(this._parent, model, this, data)'].join(''));
}

CalemFormMdTab.prototype._getDataModel=
function() {
	return this._formModel;
}

/**
 * Share the same ViewMdTab
 */
CalemFormMdTab.prototype.createView =
function() {
	//Figure out the tab count here.
	var customInfo=this.getCustomInfo();
	var layout= (customInfo && customInfo.getLayout()) ? customInfo.getLayout() : this._formInfo.getLayout();
	var ext= layout.getTabList().length > 1 ? CalemConst._TAB_MULTI : CalemConst._TAB_SINGLE;
	var impl= CalemConf['desktop_mainView']['form']['viewMdTabImpl'][ext];
	this._view=eval(['new ', impl, '(this._viewHolder, this)'].join(''));
	this._fitViewToParent();
}

/**
 * To prepare data fetch functions for one call.
 */
CalemFormMdTab.prototype._loadData =
function() {
	this._formModel.load(this._dataLoadCallback);
} 

//Register for cache listeners.
CalemFormMdTab.prototype._onDataLoaded =
function() {
	this._formModel.onInitDataLoaded(); //Form model to do initialization.
	CalemForm.prototype._onDataLoaded.call(this);
}

/**
 * Form def services
 */
CalemFormMdTab.prototype.getFormModel =
function() {
	return this._formModel;
}
 
/**
 * Render factory for mdTab - use toString() to get render.
 */
CalemFormMdTab.prototype.getRender =
function(info) {
	return CalemConf['view_engine']['viewRenderMdTab'][info.toString()];
}

/**
 * shutdown
 * <ul>
 * <li> shutdown each form owned.
 * </ul>
 */
CalemFormMdTab.prototype._shutdown =
function() {	
	this._formModel._shutdown();
	this._view._shutdown();
} 

/**
 * resync data based on list selection
 */
CalemFormMdTab.prototype.openAt =
function(data, callback) {
	//If data model is changed will reclose and open again
	//Switching data model is too expensive and error prone (due to listeners resync).
	if (this._formModel.isDataModelChanged(data)) {
		this._data=data;
		callback.run(); //Bring form to front first (so it can be closed).
		this.reRenderView();
	} else {
		this._formModel.openAt(data, callback);
	}
}

/**
 * get custom info
 */
CalemFormMdTab.prototype.getCustomInfo =
function() {
	return CalemCustomFormManager.getInstance().getFullCustomInfo(this._formInfo.getId(), this.getDesignTarget()); 
} 

//Get form design
CalemFormMdTab.prototype.getDesign =
function() {
	return 'CalemFormMdTabDesign';
}

CalemFormMdTab.prototype.getFormInfo =
function() {
	return this._formInfo;
}

/**
 * MdTab reRenderView.
 */
CalemFormMdTab.prototype.reRenderView =
function() {
	//Simply close and reopen the form.
	var action=new CalemOpenFormAction(this._formInfo.getId(), this._data);
	this._closeForm(action);
}

/**
 * Action handling
 */
//Db bound record insertion handling
CalemFormMdTab.prototype.onNewDbRecordRaw =
function(table, recRaw) {
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onNewDbRecordRaw(table, recRaw);
	this._resumeView();
}

CalemFormMdTab.prototype.onDeleteDbRecAction =
function(table, id) {
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onDeleteDbRecAction(table, id);
	this._resumeView();
}
 
CalemFormMdTab.prototype.onUpdateDbRecAction =
function(table, rec) {
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onUpdateDbRecAction(table, rec);
	this._resumeView();
}  

CalemFormMdTab.prototype.onLookupSelectAction =
function(table, rec) {
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onLookupSelectAction(table, rec);
}  

CalemFormMdTab.prototype.onReloadDataAction =
function(table) {	
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onReloadDataAction(table);
} 

