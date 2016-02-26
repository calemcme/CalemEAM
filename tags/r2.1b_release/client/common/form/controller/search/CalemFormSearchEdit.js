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
 * CalemFormSearchEdit
 * This is the search edit form - for creating, editing or viewing a filter
 * @parent - parent
 * @formId - search select form id
 * @dataModel - the data model of the parent form, copied over so we don't need to create it. 
 * @search - the search passed in.
 */
function CalemFormSearchEdit(parent, formId, dataModel, search) {
	if (arguments.length==0) return;
	this._dataModel=dataModel;
	this._setSearch(search);
	CalemFormSearch.call(this, parent, formId);
	//Search ops
	this._ops=CalemConf['view_engine']['viewSearchEditRender'].FieldEditOps;
	//Toolbar
	this._applySaveListener=new AjxListener(this, this.onApplySave);
	this._applyListener=new AjxListener(this, this.onApply);
	this._saveListener=new AjxListener(this, this.onSave);
	//Validation callback for checking validity.
	this._validationCallback=new AjxCallback(this, this.onDataValidationEvent);
	//Two soap callback handler
	this._soapSaveCallback = new AjxCallback(this, this.onSoapSaveCallback);
	this._soapApplySaveCallback=new AjxCallback(this, this.onSoapApplySaveCallback);
}

CalemFormSearchEdit.prototype = new CalemFormSearch;
CalemFormSearchEdit.prototype.constructor = CalemFormSearchEdit;

CalemFormSearchEdit.prototype.toString = function() { return "CalemFormSearchEdit"; }

/** Handle very first render */
CalemFormSearchEdit.prototype._render =
function() {
	CalemFormSearch.prototype._render.call(this);
	//make sure toolbar is correct
	this.onDataValidationEvent(null, null, null, true);
}
/**
 * Edit renders
 */
CalemFormSearchEdit.prototype.getRender =
function(info) {
	var render;
	if (!(render=CalemConf['view_engine']['viewSearchEditRender'][info.getClassName()])) {
		render=CalemFormSearch.prototype.getRender.call(this, info);
	} 
	return render;
} 

CalemFormSearchEdit.prototype.getFieldRender =
function(normType) {
	var render;
	if (!(render=CalemConf['view_engine']['viewSearchEditRender']['FieldRenders'][normType])
	  &&!(render=CalemConf['view_engine']['viewSearchEditRender']['FieldRenders']['default'])) {
		render=CalemFormSearch.prototype.getFieldRender.call(this, normType);
	} 
	return render;
}

/**
 * Listeners - Apply, Save and cancel (in parent's class)
 */
//Apply+save
CalemFormSearchEdit.prototype.getApplySaveListener =
function() {
	return this._applySaveListener;
} 

CalemFormSearchEdit.prototype.onApplySave =
function() {
	this._onSave(this._soapApplySaveCallback);
} 

//Apply
CalemFormSearchEdit.prototype.getApplyListener =
function() {
	return this._applyListener;
} 

CalemFormSearchEdit.prototype.onApply =
function(ev) {
	this._collectSearch(); //Get search info together.
	this._onApply();
} 

//Save
CalemFormSearchEdit.prototype.getSaveListener =
function() {
	return this._saveListener;
} 

CalemFormSearchEdit.prototype.onSave =
function(ev) {
	this._onSave(this._soapSaveCallback);
	
} 

//Get form design
CalemFormSearchEdit.prototype.getDesign =
function() {
	return 'CalemFormRecordDesign';
}

//Get search
CalemFormSearchEdit.prototype.getSearch =
function() {
	return this._search;
}

//Do resume view here.
CalemFormSearchEdit.prototype.setSearch =
function(search) {
	this._setSearch(search);
	this.__resumeView(); //enforce resumeView
	//make sure toolbar is correct
	this.onDataValidationEvent(null, null, null, true);
}

CalemFormSearchEdit.prototype._setSearch =
function(search) {
	this._search=search;
	this._tableSearch= search ? search.getTableSearch(this._dataModel.getId()) : null;
}

//Disable standard resume view.
CalemFormSearchEdit.prototype._resumeView =
function() {
	//stopped here.
}

CalemFormSearchEdit.prototype.getTableSearch =
function() {
	return this._tableSearch;
}

CalemFormSearchEdit.prototype.getSearchOps =
function() {
	return this._ops;
}

//Events validation
/**
 * Data validation callback
 */
CalemFormSearchEdit.prototype.getValidationCallback =
function() {
	return this._validationCallback;
} 

//Get hold of the search save render.
CalemFormSearchEdit.prototype.setSearchSave =
function(searchSave) {
	this._searchSave=searchSave;
} 

/**
 * Verify search validity
 */
CalemFormSearchEdit.prototype._onDataValidationEvent =
function(field, isValid, value) {
	var valid=isValid;
	if (isValid) { 
        var fld= (typeof(field)=='string' && field==CalemConst._DUMMY_FLD) ? CalemConst._DUMMY_FLD : field.getFieldInfo().fld;
        valid=this._isViewInputValid(fld, isValid);
	}
	//Generate events and show error msg if any.
	if (valid) {
		this._formErrorRender.hide();
	} else {
		var evt=new CalemSearchEditEvent(CalemEvent.SEARCH_NOT_VALID);
		this._modelItem.notifyListeners(evt.getType(), evt);
		this._formErrorRender.setErrorMsg(CalemMsg.getMsg('search_not_valid'));
	}
	return valid;
}

/**
 * Check for rec change if validation is good.
 */
CalemFormSearchEdit.prototype.onDataValidationEvent =
function(field, isValid, value, bypassValid) {
	var valid= bypassValid ? bypassValid : this._onDataValidationEvent.call(this, field, isValid, value);
	
	if (valid) {//Check for data change and generate proper events.
	   //If search is empty, do not allow any action.
	   if (this.getSearchEmpty()) {//So search is not deemed valid in this case.
	   	this._notifySearchEvent(CalemEvent.SEARCH_NOT_VALID);	   
	   	if (CalemDebug.isDebug()) CalemDebug.debug("search empty, invalid event sent, id="+this.getId());
	   } else {//If search is not empty, it's valid
	   	this._notifySearchEvent(CalemEvent.SEARCH_VALID);
	   	if (valid=this._searchSave.isValid()) {//If saveSearch is valid, then all is valid
	   		this._notifySearchEvent(CalemEvent.SEARCH_VALID_ALL);
	   	}
	   	if (CalemDebug.isDebug()) CalemDebug.debug("search valid event sent, id="+this.getId());
	   }
	} else {
		this._notifySearchEvent(CalemEvent.SEARCH_NOT_VALID);
		if (CalemDebug.isDebug()) CalemDebug.debug("search invalid event sent, id="+this.getId());
	}
}

CalemFormSearchEdit.prototype._notifySearchEvent =
function(id) {
	//Notify search is not valid.
	var evt=new CalemSearchEditEvent(id);
	this.getModelItem().notifyListeners(id, evt); //Directly feed into modelItem.
}

/**
 * Checking search empty
 */
CalemFormSearchEdit.prototype.getSearchEmpty =
function() {
	var tableDd=this._modelItem.getTableDd();
	var fields=tableDd.getFields();
	for (var i in fields) {
		var rtn=this._view.getFieldSearch(i);
		if (rtn!=null) return false;
	}
	return true;
} 

/**
 * prepare search
 */
CalemFormSearchEdit.prototype._collectSearch =
function() {
	//Construct a searchInfo from the edit form.
	var search=new Object();
	var tableDd=this._modelItem.getTableDd();
	var fields=tableDd.getFields();
	var expr;
	for (var i in fields) {
		if (expr=this._view.getFieldSearch(i)) {
			search[i]=expr;
		}
	}
	//Now construct a table search
	var tblSearch=new CalemTableSearchInfo(this._modelItem.getId(), search);
	var sm=new Object();
	sm[tblSearch._table]=tblSearch;
	var saveValue=this._searchSave.getSaveValue();
	var id=this._getId(saveValue._name, saveValue._axoId);
	this._searchInfo=new CalemSearchInfo(id, saveValue._name, this._modelItem.getId(),
											saveValue._shared, saveValue._axoId, sm);											
} 

/**
 * Figure out the id for the search
 */
CalemFormSearchEdit.prototype._getId =
function(name, axoId) {
	return AjxMD5.hex_md5(axoId+name);
}

/**
 * Save handler
 */
CalemFormSearchEdit.prototype._onSave =
function(callback) {
	this._collectSearch(); //Get search info together.
	//Now let's make a soap call with busy signal
	var rows={search_0: {
		id: this._searchInfo.getId(), table: this._searchInfo.getTable(),
		shared: this._searchInfo.getShared(), target: this._searchInfo.getAxoId(),
		search: Base64.encode(this._searchInfo.getJson())}};
	CalemSoapClient.soapCall('SaveSearch', rows, 
						new AjxCallback(this, this.onSoapSaveSearchCallback, callback) );
}

//Soap save callback.
CalemFormSearchEdit.prototype.onSoapSaveSearchCallback =
function(callback, resp) {
	//Analyze error msg.
   if (resp.getException()) {
   	var msg;
   	if (msg=resp.getErrorMsg()) CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), msg);
   } else {//Analyze soap response.
      var ssr=resp.getResponse().SaveSearchResponse;
      this._onSoapSaveSearchResponse(callback, ssr);     
   }
}

/**
 * Process soap response from server
 */
CalemFormSearchEdit.prototype._onSoapSaveSearchResponse =
function(callback, resp) {
	//This is single record so let's process it.
	var saveResp=resp[0];
	if (saveResp.status == CalemForm.SOAP_SUCC) { //Update local copy.
		CalemViewUtil.updateLocalSearch(this._searchInfo);
		//continue the callback.
		callback.run();
	} else { //Need to display error.
		//display error msg based on exception.
		var errorHandler;
		if (saveResp.errorInfo && saveResp.errorInfo.id) {
			errorHandler=eval(['new ', saveResp.errorInfo.id, '(saveResp.id, saveResp.errorInfo)'].join(''));
		} else {
			errorHandler=new CalemErrorInfo(saveResp.id)
		}
		CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), errorHandler.getMessage());
	}
}

//Continue for save.
CalemFormSearchEdit.prototype.onSoapSaveCallback =
function() {
	this._closeAndResumeParentForm(); //Need to rerender form.
}

//Continue to apply the search.
CalemFormSearchEdit.prototype.onSoapApplySaveCallback =
function() {
	this._onApply();
}

CalemFormSearchEdit.prototype._onApply =
function() {
	this._closeAndResumeParentForm(new CalemApplySearchAction(this._searchInfo)); //Need to rerender form.
}

//Lookup validation for edit and new form
CalemFormSearchEdit.prototype.validateLookup =
function(lkupTable, lkupFld, fld, value, callback) {
	var hostForm=this.getHostForm(2); //skip search select here.
	hostForm.validateLookup(lkupTable, lkupFld, fld, value, callback);
}
