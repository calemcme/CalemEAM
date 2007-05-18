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
 * CalemForm
 * This is the form widget.
 * 
 */
function CalemForm(parent, formId, data) {
	if (arguments.length==0) return;
	CalemController.call(this, parent);
	this._formInfo=CalemJson.setJson(CalemItemDef[formId]);
	this._data=data;	
	//Initializing data model
	this._dataLoadCallback=new AjxCallback(this, this.onDataLoaded);
	this._dataReLoadCallback=new AjxCallback(this, this.onDataReLoaded);
	this._createDataModel(data);
	//Customize listener
	this._customizeListener=new AjxListener(this, this.onCustomize);
	//Data refresh
	this._dataRefreshListener = new AjxListener(this, this.onDataRefresh);
	//Get a cache reference
	this._cache=CalemContext.getInstance().getRegistry().getCache();
	//Edit function moved to form level
	this._soapEditTranSaveCallback=new AjxCallback(this, this.onSoapEditSaveTranCallback);
	//Delete info callback
	this._deleteInfoCallback = new AjxCallback(this, this.onDeleteInfoCallback);
}

CalemForm.SOAP_SUCC = 0;
CalemForm.SOAP_UPDATE_CONFLICT = -10;

CalemForm.prototype = new CalemController;
CalemForm.prototype.constructor = CalemForm;

CalemForm.prototype.toString = 
function() {
	return "CalemForm";
}

/**
 * Receive a view holder to host the view for the controller.
 */
CalemForm.prototype.setViewHolder =
function(viewHolder) {
	this._viewHolder=viewHolder;
}

CalemForm.prototype.getViewHolder =
function() {
	return this._viewHolder;
}

/**
 * Data model factory method
 */
CalemForm.prototype._createDataModel =
function(data) {	
	var impl= CalemConf['desktop_mainView']['form']['modelImpl'];
	var mdId=this._formInfo.getModel();
	this._dataModel=eval(['new ', impl, '(mdId, this, data)'].join(''));
	this._modelItem=this._dataModel.getModelItem();
}

// default is CalemView
CalemForm.prototype.createView =
function() {
	var impl= this._formInfo.getView().getImpl() || CalemConf['desktop_mainView']['form']['viewImpl'];
	this._view=eval(['new ', impl, '(this._viewHolder, this)'].join(''));
	this._fitViewToParent();
}

//Provide the view 
CalemForm.prototype.getView =
function() {
	return this._view;
}

/**
 * Form rendering
 * <ul>
 * <li> Prepare data
 * <li> Render view
 * </ul>
 */
CalemForm.prototype.showForm =
function() {
	//Prepare data first
	if (!this._dataLoaded) {
		this._loadData(); //Assume this is async call and will call showView later.
	} else { //Continue display
		this._showView();
	}
}  

/*
 * Resume hosted form
 */
CalemForm.prototype.resumeHostForm =
function(action) {
	if (!action) {
		this._resumeView();
	} else {
		action.onAction(this); //Delegate to the action and handle how to process the form.
	}
} 

/**
 * Special action handler
 * This is valid for atomic form. For MdTab it must handle by itself.
 */
CalemForm.prototype.reRenderView =
function() {
	//The simple solution is to shutdown toolbar, grid, modelItem's events' listeners and redo again.
	this._view._shutdown();
	//recreate the view
	this.createView();
	//render it.
	this._render();
}  

/**
 * Reload with a new query
 */
CalemForm.prototype.reLoadDataBySearch =
function(tblQuery) {
	this._modelItem.setTableQuery(tblQuery);
	this._reLoadData(); //force data load.
	this._reLoadDataBySearch(tblQuery);
} 

//post data loading by query
CalemForm.prototype._reLoadDataBySearch =
function(tblQuery) {
	//overwrite.
}

//Initial data load.
CalemForm.prototype._loadData =
function() {
	//To be overwritten by specific form controllers.
} 

//Reload data due query change or refresh.
CalemForm.prototype._reLoadData =
function() {
	//To be overwritten by specific form controllers.
}

/**
 * Data loaded by this form
 */
CalemForm.prototype.onDataLoaded =
function() {
	this._dataLoaded=true;
	this._onDataLoaded();
}

/**
 * Must repaint the screen.
 */
CalemForm.prototype.onDataReLoaded =
function() {
	this.__resumeView(); //force a screen repaint.
}

/**
 * Loading by a layer above
 */
CalemForm.prototype.onLoadResult =
function(result) {
	this._dataLoaded=true;
	this._dataModel.onLoadResult(result);
} 

CalemForm.prototype.setDataLoaded =
function(val) {
	this._dataLoaded=val;
} 

/** by default is to display data */
CalemForm.prototype._onDataLoaded =
function() {
	this._showView();
}

CalemForm.prototype._showView =
function() {
	//Need to re-render if resized.
	if (!this._rendered) {
		this._layoutChanged(); //Init the boundary first time.
		this._render();
		this._rendered=true;
	} else { //Layout change
		this.onLayoutChange();
	}
}

CalemForm.prototype._resumeView =
function() {
	if (CalemDebug.isDebug()) CalemDebug.debug("resumeView for form="+this.getId());
	this.__resumeView();
}

//This function is final and cannot be overwritten
CalemForm.prototype.__resumeView =
function() {
	//Checking for layout change first.
	this.onLayoutChange();
	//refresh for data item changes.
	this._view.resumeView();
}

/**
 * Data change event - needs a repaint.
 */
CalemForm.prototype._onDataChanged =
function(ev) {
	if (CalemDebug.isDebug()) CalemDebug.debug("_onDataChanged received on: "+this.getId());
	if (this._view && this._view.getElVisible()) {//in case View is not rendered yet.
		this.__resumeView(); //This is made unconditional.
		this._viewReset();
	}
} 

//Default impl.
CalemForm.prototype._viewReset =
function(ev) {
	//No action
} 

/**
 * Default implmentation for <code>this._render</code>.
 */
CalemForm.prototype._render =
function() {
	if (!this._view) {
		this.createView();
	}
	this._view.render();
	this._initReadOnlyFields();
} 

CalemForm.prototype._initReadOnlyFields =
function() {
}

CalemForm.prototype._layoutChanged =
function() {
	var rtn=false;
	var sz=this._viewHolder.getSize();
	if (!this._sz) {
		this._sz={x: sz.x, y: sz.y};
	} else {
		rtn= (sz.x != this._sz.x || sz.y != this._sz.y);
		this._sz={x: sz.x, y: sz.y}; //reset size here.
	}
	return rtn;
}

CalemForm.prototype.onLayoutChange =
function() {
	if (this._layoutChanged()) {
		this._fitViewToParent();
		this._view.onLayoutChange(); //Re-render the view again.
	}
}

CalemForm.prototype._fitViewToParent =
function() {
	//By default to fit the view to parent.
	var sz=this._viewHolder.getSize();
	this._view.setSize(sz.x, sz.y);
}

/**
 * Form def services
 */
CalemForm.prototype.getFormInfo =
function() {
	return this._formInfo;
} 

CalemForm.prototype.getDataModel =
function() {
	return this._dataModel;
}

CalemForm.prototype.getModelItem =
function() {
	return this._modelItem;
}
 
CalemForm.prototype.getId =
function() {
	return this._formInfo.getId();
}

CalemForm.prototype.getTitle =
function() {
	return CalemMsg.getMsg(this._formInfo.getTitle());
} 

CalemForm.prototype.getIcon =
function() {
	return this._formInfo.getIcon();
} 

CalemForm.prototype.getReplaceType =
function() {
	return this._formInfo.getReplaceType();
}

CalemForm.prototype.isReplaceById =
function() {
	return (this._formInfo.getReplaceType()==CalemItemDef.REPLACE_BY_ID);
}

CalemForm.prototype.isReplaceByIdData =
function() {
	return (this._formInfo.getReplaceType()==CalemItemDef.REPLACE_BY_ID_DATA);
}

CalemForm.prototype.getViewId =
function() {
	return this._formInfo.getView().getId();
}

CalemForm.prototype.getViewInfo =
function() {
	return this._view.getViewInfo();
}

CalemForm.prototype.getData =
function() {
	return this._data;
}

//Return tabViewPage
CalemForm.prototype.getTabPageView =
function() {
	return this._viewHolder;
}

/**
 * Render factory
 */
CalemForm.prototype.getRender =
function(info) {
	return CalemConf['view_engine']['viewRender'][info.getClassName()];
}

CalemForm.prototype.getFieldRender =
function(normType) {
	return CalemConf['view_engine']['viewRender']['FieldRenders'][normType];
}

/**
 * View functions
 */
CalemForm.prototype.setViewVisible =
function(bl) {
	 if (!bl) { //Make sure cursor is parked somewhere safely.
		CalemContext.getInstance().doFf167801();
	 }
	 this._view.setVisible(bl);
}

CalemForm.prototype._removeView =
function() {
	//Remove the view first.
	this._viewHolder.removeChild(this._view);
	this._view.dispose();
}

/**
 * Form embedding and resume.
 */
CalemForm.prototype._embedForm =
function(ebInfo) {
	this._viewHolder.embedController(ebInfo);
}

/**
 * Restore host form
 */
CalemForm.prototype._closeAndResumeParentForm =
function(action) {	
	this._viewHolder.closeAndResumeParentController(action);
} 

/**
 * Find out the host form for the current form
 */
CalemForm.prototype.getHostForm =
function(idx) {
	return this._viewHolder.getHostForm(idx);
}

/**
 * Restore host form
 */
CalemForm.prototype._closeForm =
function(action) {	
	this._viewHolder.closeForm(action);
} 

/**
 * Parent controller handling of data inserted.
 */
CalemForm.prototype._reportDataInserted =
function(feedback) {
	var mi = this._modelItem;
	mi.onDataInserted(feedback.data);
} 

/**
 * Error render
 */
CalemForm.prototype.setFormErrorRender =
function(render) {
	this._formErrorRender=render;
}

CalemForm.prototype.getValidationCallback =
function() {
	return null;
} 

//Default definition
CalemForm.prototype._verifyInputBo =
function() {
	return true;
}

/**
 * Delete prompt
 */
CalemForm.prototype._onDeletePrompt =
function(promptCallback) {
	if (CalemConf['form_data_change']['deletePrompt']==CalemConst.DELETE_PROMPT) {
		CalemQuestionDialog.showIt(CalemMsg.getMsg('form_delete_title'), CalemMsg.getMsg('form_delete_prompt'), promptCallback);
	}
} 

/**
 * Form dependency management
 */
CalemForm.prototype.setFormLink =
function(link) {
	this._dataModel.setFormLink(link);	
} 

CalemForm.prototype.getCurrentRecord =
function() {
	return this._dataModel.getCurrentRecord();
}

CalemForm.prototype.setParentRec =
function(masterRec) {
	this._dataModel.setParentRec(masterRec);
}

CalemForm.prototype.getParentRec =
function() {
	return this._dataModel.getParentRec();
}

CalemForm.prototype.getFormQueryByParentRec =
function() {
	return this._dataModel.getTableQueryByParentRec();
}

/**
 * Open a form by desktop.
 */
CalemForm.prototype._openForm =
function(fmId, data) {
	CalemContext.getInstance().getDesktop().openForm(fmId, data);
}

/**
 * Form close and shutdown handling.
 * It's forwarded to ViewHolder since there may be many forms involved.
 */
CalemForm.prototype.canClose =
function(callback) {
	this._viewHolder.canClose(callback);
}

CalemForm.prototype.shutdown =
function() {
	this._viewHolder.shutdown();
}

/**
 * Each form has its own way of handling close and shutdown.
 */
CalemForm.prototype._canClose =
function(callback) { //By default, yes just close it.
	callback.run(true);
} 

/**
 * resync data based on list selection
 */
CalemForm.prototype.moveTo =
function(data, callback) {
	//overwrite	
	callback.run();
}

CalemForm.prototype.setCurrentRecord =
function(rec) {
	return this._dataModel.setCurrentRecord(rec);	
}

/**
 * Generic form event handling
 */

/**
 * BO deletion callback
 */
CalemForm.prototype.onDeleteBoCallback =
function(param, del) {
	if (del) this._onDeleteMore(param.evt); //Continue on with default handling.
} 

/**
 * Delete handling
 * Shared by List, Edit and Read forms.
 */ 
CalemForm.prototype.onDelete =
function(evt) {
	if (!this.canDelete(evt)) return;
	this._onDeleteMore(evt);
}

CalemForm.prototype._onDeleteMore =
function(evt) {
	var data=evt.item.getData(CalemContext.DATA);
	this.onDeleteWithData(data);
}

//Function to allow formEdit to call by fake data.
CalemForm.prototype.onDeleteWithData =
function(data) {
	this._onDeletePrompt(new AjxCallback(this, this._onDeletePromptCallback, data));
}

/**
 * Delete prompt callback
 */ 
CalemForm.prototype._onDeletePromptCallback =
function(data, selection) {
	if (selection) this._onDelete(data);
}

/**
 * Generic deletion handling.
 */
CalemForm.prototype._onDelete =
function(data) {	
	//Build the structure for soap call.
	var items=data.event.getItems();
	var tableDd=this._modelItem.getTableDd();	
	var rows=new Object();
	for (var i=0; i< items.size(); i++) {
		var item=items.get(i);
		rows['row_'+i] = {base: {table: data.table, id: item.id}};
		if (tableDd.getCustomFields()) {
			rows['row_'+i]['custom']={table: tableDd.getCustomTableName(), zc_id: item.id};
		}
	}
	CalemSoapClient.soapCall('DeleteData', rows, this._soapDeleteCallback)
} 

//Soap delete callback.
CalemForm.prototype.onSoapDeleteCallback =
function(resp) {
	//Analyze error msg.
   if (resp.getException()) {
   	var msg;
   	if (msg=resp.getErrorMsg()) CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), msg);
   } else {//Analyze soap response.
      var ddr=resp.getResponse().DeleteDataResponse;
      this._onSoapDeleteResponse(ddr);     
   }
}

/**
 * Process soap response from server
 */
CalemForm.prototype._onSoapDeleteResponse =
function(resp) {
	//This is batch process so let's handle it.
	var deleted=[];
	var errors=[];
	for (var i=0; i< resp.length; i++) {
		var recResp=resp[i];
		if (recResp.status==CalemForm.SOAP_SUCC) {
			deleted.push(recResp.feedback);
		} else {
			errors.push(recResp);
		}
	}
	//handle deletion first, then display error.
	if (deleted.length > 0) {
		var action=this._onDataDeleted(deleted);
		if (action) action.onAction(this);
		//post processing.
		this._onSoapDeleteSuccess();	
	};
	if (errors.length>0) { //Show first error
		var rowResp=errors[0];
		var errorHandler;
		if (rowResp.errorInfo && rowResp.errorInfo.id) {
			errorHandler=eval(['new ', rowResp.errorInfo.id, '(rowResp.table, rowResp.errorInfo)'].join(''));
		} else {
			errorHandler=new CalemErrorInfo(rowResp.table)
		}
		CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), errorHandler.getMessage());
	}
}

/**
 * Propagate deleted data
 */
CalemForm.prototype._onDataDeleted =
function(deleted) {
	//Cache update or none-cached.
	for (var i=0; i< deleted.length; i++) {
		recResp=deleted[i];
		var tableDd = this._modelItem.getTableDd();
		if (tableDd.isCached()) {
			this._dataModel.getCache().onDataDeleted(recResp.table, recResp.id);
		} else { //To update local cache.
		   return new CalemDeleteDbRecAction(recResp.table, recResp.id);
		}
	}
} 

//Soap call save is successful - refresh the form.
CalemForm.prototype._onSoapDeleteSuccess =
function() {
	//overwrite.
}

//Print handling.
CalemForm.prototype.onPrint =
function(ev) {
	this._onPrint(ev);
} 

CalemForm.prototype.onPrintCustomize =
function(ev) {
	this._onPrintCustomize(ev);
} 

CalemForm.prototype._onPrint =
function(ev) {
	var item=this._getSelectedItem(ev);
	//A few things to prepare - timezone offset, date format, time format, number, integer format
	var conf=CalemConf['text_formatter'];
	var loc=["{timezone: '", CalemTextUtil.getTimezone(),
	            "', datefmt: '", conf.date.read,
	            "', timefmt: '", conf.time.read,
	            "', datetimefmt: '",  conf.datetime.read,
	            "', intfmt: '", conf.integer.local,
	            "', numberfmt: '", conf.number.local,
	            "', currencyfmt: '", conf.sys_currency.read, "'}"].join('');
	var loc64=Base64.encode(loc);
	//Open report window
	var url=calemRequestUrl + "?aid=CalemReport&cid="+(item? item.id: '')+"&rid="+this.getReportId()+"&lid="+loc64+"&xid="+this._getReportExtraId();
	window.open(url, 'CalemReport', CalemConf['report_window_conf']);
} 

CalemForm.prototype._getSelectedItem =
function(ev) {
	return CalemEvent.getItem(ev);
}

CalemForm.prototype._getReportExtraId =
function() {
	return '';
}

CalemForm.prototype._onPrintCustomize =
function(ev) {
	//Get the selection event
	var item=this._getSelectedItem(ev);
	//Prepare data for master detail view.
	var data = item ? {modelItem: this._modelItem, item: item} : {modelItem: this._modelItem};
	this._openForm(this.getReportId(), data);
}

/**
 * Default shutdown handling.
 * Remove all external links so all form objects can be garbage collected.
 * <ul>
 * <li> remove data model listeners to cache
 * <li> remove control listeners to data model
 * <li> remove form listeners (what of them?)
 * </ul>
 */
CalemForm.prototype._shutdown =
function() {	
	this._dataModel._shutdown();
	if (this._view) {//Some viewPageMd is not rendered at all.
		this._view._shutdown();
	}
} 

/**
 * Form to add cache listener after data load
 */
CalemForm.prototype.addCacheListener =
function() {
	this._modelItem.addCacheListener();
}

/**
 * To cache a form on close when embeded
 */
CalemForm.prototype.getCacheEmbedOnClose =
function() {
	return true; //Default policy is to keep it.
}
 
/**
 * Customize listener
 */ 
CalemForm.prototype.getCustomizeListener =
function()  {
	return this._customizeListener;
}

CalemForm.prototype.onCustomize =
function(ev) {
	this._onCustomize(ev);
}

CalemForm.prototype._getDataModel=
function() {
	return this._dataModel;
}

CalemForm.prototype._onCustomize =
function(ev) {
    var ebInfo=new CalemEmbedDesignInfo(this._parent, this.getDesign(), this.getId(), null, this._getDataModel());
	this._embedForm(ebInfo);
}

//Get form design
CalemForm.prototype.getDesign =
function() {
	return 'CalemFormListDesign';
}

/**
 * get custom info
 */
CalemForm.prototype.getCustomInfo =
function() {	
	return CalemCustomViewManager.getInstance().getFullCustomInfo(this.getViewId(), this.getDesignTarget()); 
}

CalemForm.prototype.getDesignTarget =
function() {
    return CalemDesignTargetInfo.getFormDesignTarget();
} 

/**
 * Shared editing functions.
 */
CalemForm.prototype._isViewInputValid =
function(fld, isValid) {
	var valid;
	try {
		valid=this._view.verifyViewInput(fld, isValid);
	} catch (ex) {
		if (CalemDebug.isInfo()) CalemDebug.info("Got verifyViewInput exception "+ ex);
		valid=false;
	}
	return valid;
}

CalemForm.prototype._onSoapResponseException =
function(resp) {
	//display error msg based on exception.
	var errorHandler;
	if (resp.errorInfo && resp.errorInfo.id) {
		try {
			errorHandler=eval(['new ', resp.errorInfo.id, '(resp.table, resp.errorInfo)'].join(''));
		} catch (ex) {
			CalemDebug.error("Error creating exception handler for: " + resp.errorInfo.id);
			errorHandler=new CalemErrorInfo(resp.table, resp.errorInfo);
		}
	} else {
		errorHandler=new CalemErrorInfo(resp.table)
	}
	CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), errorHandler.getMessage());
}

//Db bound record insertion handling
CalemForm.prototype.onNewDbRecordRaw =
function(table, recRaw) {
	if (table==this._modelItem.getTableName()) this._modelItem.onDataInserted(recRaw);
}

CalemForm.prototype.onDeleteDbRecAction =
function(table, id) {
	this._modelItem.onDataDeleted(id);
}

CalemForm.prototype.onUpdateDbRecAction =
function(table, rec) {
	this._modelItem.onDataUpdated(rec);
}

CalemForm.prototype.onReloadDataAction =
function(table) {
	if (table != this._modelItem.getId()) return;
	this._reLoadData();
}

CalemForm.prototype._checkParentRec =
function() {
	var rtn=true;
	if (!this._dataModel.getParentRec()) {
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_new_title'), CalemMsg.getMsg('new_no_parent'));
		rtn=false;
	}
	return rtn;
}

/**
 * Data refresh
 */
CalemForm.prototype.getDataRefreshListener =
function() {
	return this._dataRefreshListener;
}

CalemForm.prototype.onDataRefresh =
function() {
	this._onDataRefresh();
}

CalemForm.prototype._onDataRefresh =
function() {
	//to be provided by detail forms.
}

CalemForm.prototype.onLookup =
function(fmId, lkupCallback, id, fld) {
   var ebInfo=new CalemEmbedLookupInfo(this._parent, fmId, lkupCallback, id);
	this._embedForm(ebInfo);
}

/**
 * Lookup control by controller
 * Note: host may not be straightforward. No use case at this time.
 */
CalemForm.prototype.getLookupFormByFld =
function(tbl, fld) {
	return null;
}

/**
 * Built-in filter support at list form
 */
CalemForm.prototype.initQueryByForm =
function(tblQuery) {
	return tblQuery;
}

/**
 * Lookup validation for edit, new and search edit form
 */
CalemForm.prototype.validateLookup =
function(lkupTable, lkupFld, fld, value, callback) {
	var lkupInfo=this._getLookupExtraInfo(fld);
	if (!lkupInfo) {
		this._cache.validateLookupSingle(lkupTable, lkupFld, value, callback);
	} else {
		lkupInfo.push({fld: lkupFld, value: value});
		this._cache.validateLookupMultiple(lkupTable, lkupInfo, value, callback);
	}
}

CalemForm.prototype._getLookupExtraInfo =
function(fld) {
	return null;
}

/**
 * Set field readonly
 */
CalemForm.prototype._setFieldsReadOnly =
function(flds) {
	if (!flds) return;
	for (var i=0; i< flds.length; i++) {
		this._view.setFieldReadOnly(flds[i]);
	}
}

//Valid range
CalemForm.prototype.setValidRange =
function(fld, min, max) {
	if (!this._view) return;
	this._view.setValidRange(fld, min, max);	
}
 
CalemForm.prototype.onLookupSelect =
function(fld, recLkup) {
}

CalemForm.prototype.setFieldValue =
function(fld, fv) {
	this._view.setFieldValue(fld, fv);	
}

CalemForm.prototype.hasRender =
function(fld) {
	this._view.hasRender(fld);	
}

CalemForm.prototype._showSoapError =
function(soapResp) {
	//display error msg based on exception.
	var errorHandler;
	if (tranResp.errorInfo && tranResp.errorInfo.id) {
		errorHandler=eval(['new ', tranResp.errorInfo.id, '(tranResp.id, tranResp.errorInfo)'].join(''));
	} else {
		errorHandler=new CalemErrorInfo(tranResp.id)
	}
	CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), errorHandler.getMessage());
}

CalemForm.prototype._instantiate =
function(data) {
}

CalemForm.prototype.onLookupSelectAction =
function(table, rec) {
} 

CalemForm.prototype.canCreate =
function() {
	return true;
} 

CalemForm.prototype.canEdit =
function() {
	return true;
} 

CalemForm.prototype.canDelete =
function() {
	return true;
} 

//Open form embedded
CalemForm.prototype._openEmbedForm =
function(fmId, data) {
	var ebInfo=new CalemEmbedInfo(this._parent, fmId, data);
	this._embedForm(ebInfo);
} 

/**
 * Editing function shared between formread and formedit
 */

/**
 * Default handling to only process the update response.
 */
CalemForm.prototype.onSoapEditSaveTranCallback =
function(resp) {
	var rowResp=resp.TranResponse;
	if (rowResp.status == CalemForm.SOAP_SUCC) {
		//Report the data feedback.
		var rtn=this._onDataUpdated(resp.UpdateDataResponse[0].feedback);
		//post processing.
		this._onSoapSaveSuccess(rtn.action);		
	} else if (rowResp.status == CalemForm.SOAP_UPDATE_CONFLICT) {//Update conflict
		//@todo - to provide conflict resolution as another configuration.
		//Conflict info callback
	   var conflictCallback=new AjxCallback(this, this.onConflictInfoCallback, rowResp);
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_save_title'), CalemMsg.getMsg('form_save_conflict'), conflictCallback);
	} else { //Need to display error.
		this._handleSoapSaveRespError(rowResp);
	}
}

//Handle soap response error
CalemForm.prototype._handleSoapSaveRespError =
function(rowResp) {
	if (rowResp.errorInfo && rowResp.errorInfo.id && rowResp.errorInfo.id == 'CalemDboDataNotFoundException') {
		//To remove this record from local storage and refresh.
		CalemInfoDialog.showIt(CalemMsg.getMsg('form_save_title'), CalemMsg.getMsg('form_save_deleted'), this._deleteInfoCallback);
	} else {//Display error msg and be done with it.
		//display error msg based on exception.
		var errorHandler;
		if (rowResp.errorInfo && rowResp.errorInfo.id) {
			errorHandler=eval(['new ', rowResp.errorInfo.id, '(rowResp.table, rowResp.errorInfo)'].join(''));
		} else {
			errorHandler=new CalemErrorInfo(this._modelItem.getId())
		}
		CalemInfoDialog.showIt(CalemMsg.getMsg('error_server'), errorHandler.getMessage());
	}
}

//Conflict info callback
CalemForm.prototype.onConflictInfoCallback =
function(rowResp) {
	//Refresh data
	var rtn=this._onDataUpdated(rowResp.feedback);
	if (rtn.action) {//Let's get the change to the parent record.
		//@todo - to make sure parent record also have this record updated.
		//this.callParentController(rtn.action);
	}
	//Repaint
	this._onDataChanged();
}

//Delete info callback
CalemForm.prototype.onDeleteInfoCallback =
function() {
	var rec=this._modelItem.getCurrentRecord();
	var action=this._onDataDeleted([ {table: this._modelItem.getId(), data: {id: rec.id}} ]);
	//Close form.
	this._closeAndResumeParentForm(action);
}

/**
 * Propagate new data
 */
CalemForm.prototype._onDataUpdated =
function(feedback) {
	//Cache update or parent controller update.
	var tableDd = this._modelItem.getTableDd();
	var action, rec;
	if (tableDd.isCached()) {
		rec=this._dataModel.getCache().onDataUpdated(feedback.table, feedback.server);
	} else {
		rec=this._modelItem.getRecordList()._getRecByRaw(feedback.server);
		action= this._getDataUpdatedAction(feedback.table, rec);
	}
	this._modelItem.setCurrentRecord(rec); //Make sure we update the rec.
	return {rec: rec, action: action};
}
 
CalemForm.prototype._getDataUpdatedAction =
function(table, rec) {
	var ob= new CalemUpdateDbRecAction(table, rec);
	return ob;
} 

CalemForm.prototype.setMdTabId =
function(id) {
	this._mdTabId=id;
}

//Allow customize
CalemForm.prototype.allowCustomize =
function() {
	return true;
}

//Check TbCustomize on the form
CalemForm.prototype.isTbAvailable =
function(btn) {
	var ci=this.getCustomInfo();
	return ci.checkTbAcl(btn);
}

CalemForm.prototype.getActiveController =
function() {
	return this._viewHolder.getActiveController();
}

/**
 * Auto-completion (enable search as well)
 * - Use disabled to turn it off.
 */
CalemForm.prototype.getInputAcEnabled =
function(fld) {
	return (!this._acDisabled || !this._acDisabled[fld]);
}

CalemForm.prototype.loadCachedRecList =
function(tbId) {
	var ci=CalemContext.getInstance().getRegistry().getCache().get(tbId);
	return (ci ? ci.getRecordList().getList() : null);
}

CalemForm.prototype.fetchAcList =
function(match, lkupFld, lkupDd, cb) {
	var dbQuery=new CalemDbQuery();
	//constructing an efficient query here
	var tbn=lkupDd.getTableName();
	var qry=new CalemTableQuery(tbn, tbn);
	var selId=new CalemSelectField(tbn, 'id');
	var sel=new CalemSelectField(tbn, lkupFld);
	qry.addSelect(selId);
	qry.addSelect(sel); //Select id and lookup field.
	
	var fld=new CalemDbField(tbn, lkupFld);
	var val=new CalemDbString(match);
	var expr=new CalemDbExpr(fld, CalemDbExpr.LIKE, val);
	qry.setWhere(tbn, expr);
	
	var orderBy=new CalemQueryOrderBy(sel, CalemQueryOrderBy.ASC);
	qry.setOrderBy(orderBy);
	var range=new CalemQueryRange(0, CalemConf['auto_completion']['maxMatch']);
	qry.setRange(range);
	
	dbQuery.add(qry);
	this._cache.bulkLoad(dbQuery, cb);
}
