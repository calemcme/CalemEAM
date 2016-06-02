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
 * CalemModuleFormList
 */
function CalemModuleFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
	this._customizeModuleListListener=new AjxListener(this, this.onCustomizeModuleList);
	this._customizeModuleListener=new AjxListener(this, this.onCustomizeModule);
}

CalemModuleFormList.prototype = new CalemFormList;
CalemModuleFormList.prototype.constructor = CalemModuleFormList;

CalemModuleFormList.prototype.toString = function() { return "CalemModuleFormList";}

/**
 * Prepare the module list based on group id:
 * a) at initial form opening
 * b) reopen after close
 */
CalemModuleFormList.prototype._createDataModel =
function(data) {
	CalemFormList.prototype._createDataModel.call(this);	
	this._grpRec=data.item; //Wait for _loadData to start data loading.
}

//Invoked by changing a group and reuse the same form.
CalemModuleFormList.prototype.setCurrentRecord =
function(grpRec) {
	this._grpRec=grpRec;
	this._loadData(new AjxCallback(this, this._onFormReuse)); //Reload the grp info.
}

//Frst time, let's check for data loading task.
CalemModuleFormList.prototype._loadData = 
function(callback) {
	callback= callback || new AjxCallback(this, this._onInitialDataLoaded);
	var groupCache=CalemContext.getInstance().getRegistry().getCache().get('acl_group');
	var grps=groupCache.getGroupsToLoad(this._grpRec.id);
	if (grps.length > 0) {		
		var loadInfo={custom_0: {targets: grps.join(';')}};	
		CalemSoapUtil._onSoapCall('LoadCustomInfo', loadInfo, 
		                  new AjxCallback(this, this._onLoadCustomInfoResponse), null, {grps: grps, callback: callback});
	} else {
		callback.run();
	}
}

/**
 * Process soap response from server
 */
CalemModuleFormList.prototype._onLoadCustomInfoResponse =
function(resp, ei) {
	if (resp[0].status == CalemForm.SOAP_SUCC) {
		eval(Base64.decode(resp[0].reload)); //synchronize with server.
	}
	//Set groups as loaded
	var groupCache=CalemContext.getInstance().getRegistry().getCache().get('acl_group');
	groupCache.setCustomLoaded(ei.grps, false);
	ei.callback.run();
}

/** First time data loaded */
CalemModuleFormList.prototype._onInitialDataLoaded = 
function() {
	this._reloadGroupModules();
	this.onDataLoaded(); //to continue form display.
}

/** Form is reused */
CalemModuleFormList.prototype._onFormReuse = 
function() {
	this.reRenderView();
}

//Reloading data.
CalemModuleFormList.prototype._reloadGroupModules =
function() {
	var modListMgr=CalemCustomModListManager.getInstance();
	var myInfo=modListMgr.getFullCustomInfo('', this.getDesignTarget());
	var modList=myInfo.getLayout() ? myInfo.getLayout() : modListMgr.getSysModList();
	//Now creating mod list as a recList.
	var ar=[];
	for (var i=0; i< modList.length; i++) {
		var mod=modList[i];		
		if (myInfo && !myInfo.checkAcl(mod)) continue;
		ar.push([mod, CalemMsg.getMsg(mod)]);
	}
	//Creating a cached item
	var cache=CalemContext.getInstance().getRegistry().getCache();
	var cachedModList=new CalemLocalCachedItem(cache, 'vt_module_list', ar);
	this._modelItem.onLoadResult(cachedModList.getRecordList());
}

CalemModuleFormList.prototype.reRenderView = 
function() {
	this._reloadGroupModules();
	this._resumeView();
}

CalemModuleFormList.prototype.getCustomizeModuleListListener =
function() {
	return this._customizeModuleListListener;
}

CalemModuleFormList.prototype.getCustomizeModuleListener =
function() {
	return this._customizeModuleListener;
}

//Module design
CalemModuleFormList.prototype.onCustomizeModuleList =
function() {
   var ebInfo=new CalemEmbedDesignInfo(this._parent, 'CalemModuleFormListDesign', this.getId(), null, this._getDataModel());
	this._embedForm(ebInfo);
}

//Module design
CalemModuleFormList.prototype.onCustomizeModule =
function(evt) {
	var item=CalemEvent.getItem(evt);
	var ebInfo=new CalemEmbedDesignInfo(this._parent, 'CalemModuleFormDesign', this.getId(), {item: item, grpRec: this._grpRec}, this._getDataModel());
	this._embedForm(ebInfo);
}

//Do not cache this form since each time it might be for a different group.
CalemModuleFormList.prototype.getCacheEmbedOnClose =
function() {
	return false; //close down upon close.
}

