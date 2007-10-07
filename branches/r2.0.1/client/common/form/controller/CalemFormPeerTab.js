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
 * CalemFormPeerTab
 * This is multi-tab form controller.
 * 
 */
function CalemFormPeerTab(parent, formId, data) {
	if (arguments.length==0) return;
	CalemForm.call(this, parent, formId, data);
}

CalemFormPeerTab.prototype = new CalemForm;
CalemFormPeerTab.prototype.constructor = CalemFormPeerTab;

CalemFormPeerTab.prototype.toString = function() { return "CalemFormPeerTab"; }

/**
 * Data model factory method
 */
CalemFormPeerTab.prototype._createDataModel =
function(data) {	
	var impl= CalemConf['desktop_mainView']['form']['formPeerModelImpl'];
	var model=this._formInfo.getModel();
	this._formModel=eval(['new ', impl, '(this._parent, model, this, data)'].join(''));
}

CalemFormPeerTab.prototype._getDataModel=
function() {
	return this._formModel;
}

/**
 * Share the same ViewMdTab
 */
CalemFormPeerTab.prototype.createView =
function() {
	//Figure out the tab count here.
	var customInfo=this.getCustomInfo();
	var layout= (customInfo && customInfo.getLayout()) ? customInfo.getLayout() : this._formInfo.getLayout();
	var ext= layout.getTabList().length > 1 ? CalemConst._TAB_MULTI : CalemConst._TAB_SINGLE;
	var impl= CalemConf['desktop_mainView']['form']['viewPeerTabImpl'][ext];
	this._view=eval(['new ', impl, '(this._viewHolder, this)'].join(''));
	this._fitViewToParent();
}

/**
 * To prepare data fetch functions for one call.
 */
CalemFormPeerTab.prototype._loadData =
function() {
	this._formModel.load(this._dataLoadCallback);
} 

//Register for cache listeners.
CalemFormPeerTab.prototype._onDataLoaded =
function() {
	this._formModel.onInitDataLoaded(); //Form model to do initialization.
	CalemForm.prototype._onDataLoaded.call(this);
}

/**
 * Form def services
 */
CalemFormPeerTab.prototype.getFormModel =
function() {
	return this._formModel;
}
 
/**
 * Render factory for mdTab - use toString() to get render.
 */
CalemFormPeerTab.prototype.getRender =
function(info) {
	return CalemConf['view_engine']['viewRenderPeerTab'][info.toString()];
}

/**
 * shutdown
 * <ul>
 * <li> shutdown each form owned.
 * </ul>
 */
CalemFormPeerTab.prototype._shutdown =
function() {	
	this._formModel._shutdown();
	this._view._shutdown();
}

/**
 * get custom info
 */
CalemFormPeerTab.prototype.getCustomInfo =
function() {
	return CalemCustomFormManager.getInstance().getFullCustomInfo(this._formInfo.getId(), this.getDesignTarget()); 
} 

//Get form design
CalemFormPeerTab.prototype.getDesign =
function() {
	return 'CalemFormPeerTabDesign';
}

CalemFormPeerTab.prototype.getFormInfo =
function() {
	return this._formInfo;
}

/**
 * MdTab reRenderView.
 */
CalemFormPeerTab.prototype.reRenderView =
function() {
	//Simply close and reopen the form.
	var action=new CalemOpenFormAction(this._formInfo.getId(), this._data);
	this._closeForm(action);
}

/**
 * Action handling
 */
//Db bound record insertion handling
CalemFormPeerTab.prototype.onNewDbRecordRaw =
function(table, recRaw) {
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onNewDbRecordRaw(table, recRaw);
	this._resumeView();
}

CalemFormPeerTab.prototype.onDeleteDbRecAction =
function(table, id) {
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onDeleteDbRecAction(table, id);
	this._resumeView();
}
 
CalemFormPeerTab.prototype.onUpdateDbRecAction =
function(table, rec) {
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onUpdateDbRecAction(table, rec);
	this._resumeView();
}  

CalemFormPeerTab.prototype.onLookupSelectAction =
function(table, rec) {
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onLookupSelectAction(table, rec);
}  

CalemFormPeerTab.prototype.onReloadDataAction =
function(table) {	
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onReloadDataAction(table);
} 
