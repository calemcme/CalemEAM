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
 * CalemReRenderAction
 * Special handler for the form.
 */
function CalemReRenderAction() {
}

CalemReRenderAction.prototype.toString = function() {return "CalemReRenderAction";}

CalemReRenderAction.prototype.onAction =
function(fm) {
	fm.reRenderView(); //Rerender a view.	
}

/**
 * CalemApplySearchAction
 * Special handler for the form.
 */
function CalemApplySearchAction(searchInfo) {
	this._searchInfo=searchInfo;
}

CalemApplySearchAction.prototype.toString = function() {return "CalemApplySearchAction";}

CalemApplySearchAction.prototype.onAction =
function(fm) {
	if (fm instanceof CalemFormSearchSelect) {
		fm._closeAndResumeParentForm(this); //Need to rerender form.
	} else {//let's apply the search condition.
		fm.reLoadDataBySearch(this._searchInfo.getTableQuery());
	}
}

/**
 * CalemOpenFormAction
 * To open a form
 */
function CalemOpenFormAction(fmId, data) {
	if (arguments.length==0) return;
	this._fmId=fmId;
	this._data=data;
}

CalemOpenFormAction.prototype.toString = function() {return "CalemOpenFormAction";}

CalemOpenFormAction.prototype.onAction =
function() {
	CalemContext.getInstance().openForm(this._fmId, this._data);
}

/**
 * CalemNewRecRawAction
 * To add record to the calling form.
 */
function CalemNewDbRecRawAction(table, recRaw) {
	if (arguments.length==0) return;
	this._table=table;
	this._recRaw=recRaw;
}

CalemNewDbRecRawAction.prototype.toString = function() {return "CalemNewDbRecRawAction";}

CalemNewDbRecRawAction.prototype.onAction =
function(fm) {
	fm.onNewDbRecordRaw(this._table, this._recRaw);
}

/**
 * CalemDeleteDbRecAction
 */
function CalemDeleteDbRecAction(table, id) {
	if (arguments.length==0) return;
	this._table=table;
	this._id=id;
}

CalemDeleteDbRecAction.prototype.toString = function() {return "CalemDeleteDbRecAction";}

CalemDeleteDbRecAction.prototype.onAction =
function(fm) {
	fm.onDeleteDbRecAction(this._table, this._id);
}

/**
 * CalemUpdateDbRecAction
 */
function CalemUpdateDbRecAction(table, rec) {
	if (arguments.length==0) return;
	this._table=table;
	this._rec=rec;
}

CalemUpdateDbRecAction.prototype.toString = function() {return 'CalemUpdateDbRecAction';}

CalemUpdateDbRecAction.prototype.onAction =
function(fm) {
	fm.onUpdateDbRecAction(this._table, this._rec);
}

/**
 * CalemReloadDataAction
 */
function CalemReloadDataAction(table) {
	if (arguments.length==0) return;
	this._table=table;
}

CalemReloadDataAction.prototype.toString = function() {return 'CalemReloadDataAction';}

CalemReloadDataAction.prototype.onAction =
function(fm) {
	fm.onReloadDataAction(this._table);
}

/**
 * ActionCombo
 */
function CalemFormActionCombo(dummy) {
	if (arguments.length==0) return;
	this._actions=new AjxVector(); //It's an array.
}

CalemFormActionCombo.prototype.toString = function() {return 'CalemFormActionCombo';}

CalemFormActionCombo.prototype.add =
function(action) {
	this._actions.add(action);
}

CalemFormActionCombo.prototype.remove =
function(action) {
	this._actions.remove(action);
}

CalemFormActionCombo.prototype.onAction =
function(fm) {
	for (var i=0; i< this._actions.size(); i++) {
		var action=this._actions.get(i);
		action.onAction(fm);
	}
}

/**
 * CalemLookupSelectAction
 */
function CalemLookupSelectAction(table, rec) {
	if (arguments.length==0) return;
	this._table=table;
	this._rec=rec;
}

CalemLookupSelectAction.prototype.toString = function() {return 'CalemLookupSelectAction';}

CalemLookupSelectAction.prototype.onAction =
function(fm) {
	fm.onLookupSelectAction(this._table, this._rec);
}