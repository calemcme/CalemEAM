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
 * CalemFormList
 * This is the listView form.
 * 
 */
function CalemFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemForm.call(this, parent, formId, data);
	//Toolbar handlers
	this._newListener=new AjxListener(this, this.onNew);
	this._openListener=new AjxListener(this, this.onOpen);
	//Optionally support edit listener
	this._editListener=new AjxListener(this, this.onEdit);
	//Delete handling
	this._deleteListener=new AjxListener(this, this.onDelete);
	this._soapDeleteCallback=new AjxCallback(this, this.onSoapDeleteCallback);
	//Print handler.
	this._printListener=new AjxListener(this, this.onPrint);
	this._printCustomizeListener=new AjxListener(this, this.onPrintCustomize);
	//Search and search clear
	this._searchListener=new AjxListener(this, this.onSearch);
	this._searchClearListener=new AjxListener(this, this.onSearchClear);
	//Add cancel listener
	this._cancelListener = new AjxListener(this, this.onCancel);
}

CalemFormList.prototype = new CalemForm;
CalemFormList.prototype.constructor = CalemFormList;

CalemFormList.prototype.toString = function() { return "CalemFormList"; }

/** To load data ASAP */
CalemFormList.prototype._loadData =
function() {
	this._dataModel.load(this._dataLoadCallback);
}

/** RE load data ASAP */
CalemFormList.prototype._onDataRefresh =
function() {
    this._reLoadData(true);
}

CalemFormList.prototype._reLoadData =
function(forceReload) {
	this._dataModel.load(this._dataReLoadCallback, forceReload);
}

/**
 * Search form id
 */
CalemFormList.prototype.getSearchFormId =
function() {
	return this._formInfo.getSearchFormId();
} 

/**
 * Event listeners
 */
CalemFormList.prototype.getNewListener =
function() {
	return this._newListener;
} 

CalemFormList.prototype.onNew =
function(evt) {
	this._onNew(evt);
}

CalemFormList.prototype._onNew =
function(evt) {
	if (!this.canCreate()) return;
   //To embed new form.
   var ebInfo=new CalemEmbedInfo(this._parent, this._getFormNewId());
	this._embedForm(ebInfo);
} 

/**
 * Open
 */
CalemFormList.prototype.getOpenListener =
function() {
	return this._openListener;
} 

CalemFormList.prototype.onOpen =
function(evt) {
	this._onOpen(evt);
} 

//Default is to open a read form
CalemFormList.prototype._onOpen =
function(evt) {	
	//Get the selection event
	var item=CalemEvent.getItem(evt);
	//Prepare data for master detail view.
	var data = {modelItem: this._modelItem, item: item};
	//embed read form here.
   var ebInfo=new CalemEmbedReadInfo(this._parent, this._getFormReadId(), data);
   this._embedForm(ebInfo);
} 

/**
 * Edit handling
 */
CalemFormList.prototype.getEditListener =
function() {
	return this._editListener;
} 

CalemFormList.prototype.onEdit =
function(evt) {
	if (!this._canEdit()) return false;
	this._onEdit(evt);
}

CalemFormList.prototype._onEdit =
function(evt) {
	//Overwrite.
}

/**
 * Delete
 */
CalemFormList.prototype.getDeleteListener =
function() {
	return this._deleteListener;
} 

/**
 * Print
 */
CalemFormList.prototype.getPrintListener =
function() {
	return this._printListener;
} 

CalemFormList.prototype.getPrintCustomizeListener =
function() {
	return this._printCustomizeListener;
} 

//Render factory
CalemFormList.prototype.getRender =
function(info) {
	var render;
	if (!(render=CalemConf['view_engine']['viewListRender'][info.getClassName()])) {
		render=CalemForm.prototype.getRender.call(this, info);
	} 
	return render;
}

/**
 * Search listener
 */
CalemFormList.prototype.getSearchListener =
function() {
	return this._searchListener;
} 

CalemFormList.prototype.onSearch =
function(evt) {
	this._onSearch(evt);
}

CalemFormList.prototype._onSearch =
function(evt) {
	var ebInfo=new CalemEmbedSearchSelectInfo(this._parent, this.getSearchFormId(), this.getDataModel());
	this._embedForm(ebInfo);
}

/**
 * Search clear listener
 */
CalemFormList.prototype.getSearchClearListener =
function() {
	return this._searchClearListener;
} 

/**
 * Cancel listener
 */
CalemFormList.prototype.getCancelListener =
function() {
	return this._cancelListener;
} 

CalemFormList.prototype.onCancel =
function(evt) {
	this._onCancel(evt);
}

CalemFormList.prototype._onCancel =
function(evt) {
	this._closeAndResumeParentForm();
}


//post data loading by query
CalemFormList.prototype._reLoadDataBySearch =
function(tblQuery) {
	var evt= tblQuery ? new CalemEvent(CalemEvent.SEARCH_APPLIED) : new CalemEvent(CalemEvent.SEARCH_REMOVED);
	this._modelItem.notifyListeners(evt.getType(), evt);
}

CalemFormList.prototype.onSearchClear =
function(evt) {
	this._onSearchClear(evt);
}

//Remove current search.
CalemFormList.prototype._onSearchClear =
function(evt) {
	this.reLoadDataBySearch();
}

//Custom info handling
/**
 * Prepare grid info
 * {aclMap: MapOfHiddenFields,
 *  listInfo: CalemListInfo
 * }
 * Combining acls, custom and original layout.
 */
CalemFormList.prototype.getGridCustomInfo =
function() {
	var customInfo=this.getCustomInfo();
	var layout= customInfo.getLayout();
	var gridListInfo= layout ? layout.getGridLayout() : this.getViewInfo().getItem('grid').getListInfo();
	return {acl: customInfo.getAcl().getViewAcl()._acl, listInfo: gridListInfo};
}
