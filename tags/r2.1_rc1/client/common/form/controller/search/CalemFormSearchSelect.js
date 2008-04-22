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
 * CalemFormSearchSelect
 * This is the search selection form
 * @parent - parent
 * @formId - search select form id
 * @searchSelectFormId - the select form Id for embed checking
 * @searchEditFormId - the search edit form to be embedded 
 * @dataModel - the data model of the parent form, copied over so we don't need to create it. 
 */
function CalemFormSearchSelect(parent, formId, searchSelectFormId, searchEditFormId, dataModel) {
	if (arguments.length==0) return;
	this._searchSelectFormId=searchSelectFormId;
	this._searchEditFormId = searchEditFormId;
	this._dataModel=dataModel;
	CalemFormSearch.call(this, parent, formId);
	//Toolbar
	this._newListener=new AjxListener(this, this.onNew);
	this._refreshListener=new AjxListener(this, this.onRefresh);
	this._refreshCallback=new AjxCallback(this, this.onRefreshCallback);
	
	//Filter buttons
	this._applyListener=new AjxListener(this, this.onApply);
	this._editListener=new AjxListener(this, this.onEdit); 
	this._deleteListener=new AjxListener(this, this.onDelete);
}

CalemFormSearchSelect.prototype = new CalemFormSearch;
CalemFormSearchSelect.prototype.constructor = CalemFormSearchSelect;

CalemFormSearchSelect.prototype.toString = function() { return "CalemFormSearchSelect"; }

/**
 * Select renders
 */
CalemFormSearchSelect.prototype.getRender =
function(info) {
	var render;
	if (!(render=CalemConf['view_engine']['viewSearchSelectRender'][info.getClassName()])) {
		render=CalemFormSearch.prototype.getRender.call(this, info);
	} 
	return render;
} 

/**
 * Form ID
 */
CalemFormSearchSelect.prototype.getId = function() {return this._searchSelectFormId;} 

/**
 * Listeners - new, refresh, edit, view
 */
//New listener
CalemFormSearchSelect.prototype.getNewListener =
function() {
	return this._newListener;
} 

CalemFormSearchSelect.prototype.onNew =
function() {
	this._embedSearchEditForm();
} 

//Edit
CalemFormSearchSelect.prototype.getRefreshListener =
function() {
	return this._refreshListener;
} 

CalemFormSearchSelect.prototype.onRefresh =
function(ev) {
	var rows=CalemViewUtil.getRefreshTargets();
	CalemSoapUtil._onSoapCall('RefreshSearch', rows, this._refreshCallback);
} 

/**
 * Process soap response from server
 */
CalemFormSearchSelect.prototype.onRefreshCallback =
function(resp) {
	//This is a list of response - no deletetion at this time till next login.
	for (var i=0; i< resp.length; i++) {
		if (resp[i].status == CalemForm.SOAP_SUCC) {
			eval(Base64.decode(resp[i].reload)); //synchronize with server.
		}
	}
	this.__resumeView();
}

//Apply
CalemFormSearchSelect.prototype.getApplyListener =
function() {
	return this._applyListener;
} 

CalemFormSearchSelect.prototype.onApply =
function(ev) {
	var search=ev.item.getData(CalemContext.DATA);
	this._closeAndResumeParentForm(new CalemApplySearchAction(search)); //Need to rerender form.
} 

//Edit
CalemFormSearchSelect.prototype.getEditListener =
function() {
	return this._editListener;
} 

CalemFormSearchSelect.prototype.onEdit =
function(ev) {
	var search=ev.item.getData(CalemContext.DATA);
	this._embedSearchEditForm(search);
} 

//Embed edit form
CalemFormSearchSelect.prototype._embedSearchEditForm =
function(search) {
	var ebInfo=new CalemEmbedSearchEditInfo(this._parent, this._searchEditFormId, this._dataModel, search);
	this._embedForm(ebInfo);
}

//Delete
CalemFormSearchSelect.prototype.getDeleteListener =
function() {
	return this._deleteListener;
} 

CalemFormSearchSelect.prototype.onDelete =
function(ev) {
	var search=ev.item.getData(CalemContext.DATA);
	var rows={search_0: {
		id: search.getId(), table: search.getTable(),
		shared: search.getShared(), target: search.getAxoId()}};
	CalemSoapClient.soapCall('DeleteSearch', rows, 
						new AjxCallback(this, this.onSoapDeleteCallback, search) );
}

//Soap save callback.
CalemFormSearchSelect.prototype.onSoapDeleteCallback =
function(search, resp) {
	//Analyze error msg.
   if (resp.getException()) {
   	var msg;
   	if (msg=resp.getErrorMsg()) CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), msg);
   } else {//Analyze soap response.
      var dsr=resp.getResponse().DeleteSearchResponse;
      this._onSoapDeleteResponse(search, dsr);     
   }
}

/**
 * Process soap response from server
 */
CalemFormSearchSelect.prototype._onSoapDeleteResponse =
function(search, resp) {
	//This is single record so let's process it.
	var delResp=resp[0];
	if (delResp.status == CalemForm.SOAP_SUCC) { //Update local copy.
		CalemViewUtil.deleteLocalSearch(search);
		//continue the callback.
		this._resumeView();
	} else { //Need to display error.
		//display error msg based on exception.
		var errorHandler;
		if (delResp.errorInfo && delResp.errorInfo.id) {
			errorHandler=eval(['new ', delResp.errorInfo.id, '(delResp.id, delResp.errorInfo)'].join(''));
		} else {
			errorHandler=new CalemErrorInfo(delResp.id)
		}
		CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), errorHandler.getMessage());
	}
}

