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
 * CalemEmbedInfo
 */
function CalemEmbedInfo(parent, id, data) {
	if (arguments.length==0) return;
	this._parent=parent;
	this._id=id;
	this._data=data;
}

CalemEmbedInfo.prototype.toString = function() {return "CalemEmbedInfo";}

CalemEmbedInfo.prototype.getId =
function() {
	return this._id;
}

/**
 * Creating the form.
 */
CalemEmbedInfo.prototype.create = 
function() {
	return eval(['new ', this._id, "(this._parent, this._id, this._data)"].join(''));
}

//Refill data for reuse.
CalemEmbedInfo.prototype.instantiate = 
function(fm) {
	fm._instantiate(this._data);
}

/**
 * Design target info
 * @param: target is an object with property and value.
 */
function CalemDesignTargetInfo(type, id, value) {
	if (arguments.length==0) return;
	this._type=type;
	this._id=id;
	this._value=value;
} 

CalemDesignTargetInfo.USER='user';
CalemDesignTargetInfo.GROUP='group';

CalemDesignTargetInfo.setSystemDesignTarget =
function(designTarget) {
	CalemDesignTargetInfo._systemDesignTarget=designTarget;
}

CalemDesignTargetInfo.getModuleDesignTarget =
function() {
	var userInfo=CalemContext.getInstance().getUserInfo();
	var targetInfo;
	if (CalemDesignTargetInfo._systemDesignTarget) {
		targetInfo=CalemDesignTargetInfo._systemDesignTarget;
	} else if (userInfo.uid==CalemConf['view_engine']['dev_admin_id'] && CalemConf['view_engine'].devDesignPhase 
        && userInfo.gid==CalemConst.CUSTOM_SYSTEM) {
		var grp=CalemConf['view_engine'].devDesignGroup;
		targetInfo=new CalemDesignTargetInfo(CalemDesignTargetInfo.GROUP, grp, CalemMsg.getMsg(grp));		
	} else {//Design for self.
		targetInfo=new CalemDesignTargetInfo(CalemDesignTargetInfo.USER, userInfo.uid, userInfo.uname);
	}
	return targetInfo;
}

CalemDesignTargetInfo.getFormDesignTarget =
function() {
	var userInfo=CalemContext.getInstance().getUserInfo();
	var targetInfo;
	if (userInfo.uid==CalemConf['view_engine']['dev_admin_id'] && CalemConf['view_engine'].devDesignPhase 
        && userInfo.gid==CalemConst.CUSTOM_SYSTEM) {
		var grp=CalemConf['view_engine'].devDesignGroup;
		targetInfo=new CalemDesignTargetInfo(CalemDesignTargetInfo.GROUP, grp, CalemMsg.getMsg(grp));		
	} else {//Design for self.
		targetInfo=new CalemDesignTargetInfo(CalemDesignTargetInfo.GROUP, CalemConst.CUSTOM_SYSTEM, CalemMsg.getMsg(CalemConst.CUSTOM_SYSTEM));
	}
	return targetInfo;
}

CalemDesignTargetInfo.prototype.getType = function() {return this._type;}
CalemDesignTargetInfo.prototype.getId = function() {return this._id;}
CalemDesignTargetInfo.prototype.getValue = function() {return this._value;}
CalemDesignTargetInfo.prototype.isGroup = function() {return this._type==CalemDesignTargetInfo.GROUP;}

CalemDesignTargetInfo.getLabelDesignPermit =
function() {
	//Creating a menu for text edit if privilege is good.
	var labelGid=CalemConf['view_engine']['labelDesign']['group'];
	var userInfo=CalemContext.getInstance().getUserInfo();
	var gid=userInfo.gid;
	var grpCache=CalemContext.getInstance().getRegistry().getCache().get('acl_group');
	return grpCache.inGroupPath(labelGid, gid, true);	
}

/**
 * CalemEmbedDesignInfo
 * @param fmId is the form to be designed.
 */
function CalemEmbedDesignInfo(parent, id, fmId, data, dataModel) {
	if (arguments.length==0) return;
	CalemEmbedInfo.call(this, parent, id);
	this._fmId=fmId;
	this._designId=[id, '_', fmId].join('');
	this._dataModel=dataModel;
	this._data=data;
}

CalemEmbedDesignInfo.prototype = new CalemEmbedInfo;
CalemEmbedDesignInfo.prototype.constructor = CalemEmbedDesignInfo;

CalemEmbedDesignInfo.prototype.toString = function() {return "CalemEmbedDesignInfo";}

CalemEmbedDesignInfo.prototype.getId =
function() {
	return this._designId;
}

/**
 * Creating the design
 */
CalemEmbedDesignInfo.prototype.create = 
function() {	
	var fm= eval(['new ', this._id, "(this._parent, this._fmId, this._data, this._designId, this._dataModel)"].join(''));
	return fm;
}

/**
 * CalemEmbedNewDetInfo
 */
function CalemEmbedNewDetInfo(parent, id, parentRec, fmLink) {
	if (arguments.length==0) return;
	CalemEmbedInfo.call(this, parent, id);
	this._parentRec=parentRec;
	this._fmLink=fmLink;	
}

CalemEmbedNewDetInfo.prototype = new CalemEmbedInfo;
CalemEmbedNewDetInfo.prototype.constructor = CalemEmbedNewDetInfo;

CalemEmbedNewDetInfo.prototype.toString = function() {return "CalemEmbedNewDetInfo";}


CalemEmbedNewDetInfo.prototype.create = 
function() {
	var fm= CalemEmbedInfo.prototype.create.call(this);
	this._instantiate(fm);
	return fm;
}

/**
 * Refabricate a form with new data
 */
CalemEmbedNewDetInfo.prototype.instantiate = 
function(fm) {
	//check parent rec change here.
	var rec=fm.getParentRec();
	this._instantiate(fm);
	if (this._parentRec.id != rec.id) {//Force the form to repaint.
		fm.onRecChanged();
	}
}

CalemEmbedNewDetInfo.prototype._instantiate = 
function(fm) {
	fm.setParentRec(this._parentRec);
	fm.setFormLink(this._fmLink);
}

/**
 * CalemEmbedReadInfo
 */
function CalemEmbedReadInfo(parent, id, data) {
	if (arguments.length==0) return;
	CalemEmbedInfo.call(this, parent, id, data);
}

CalemEmbedReadInfo.prototype = new CalemEmbedInfo;
CalemEmbedReadInfo.prototype.constructor = CalemEmbedReadInfo;

CalemEmbedReadInfo.prototype.toString = function() {return "CalemEmbedReadInfo";}

/**
 * Refabricate a form with new data
 */
CalemEmbedReadInfo.prototype.instantiate = 
function(fm) {
	//Assume same data model.
	fm.setCurrentRecord(this._data.item);
}

/**
 * CalemEmbedReadDetInfo
 */
function CalemEmbedReadDetInfo(parent, id, data, parentRec, fmLink) {
	if (arguments.length==0) return;
	CalemEmbedReadInfo.call(this, parent, id, data);
	this._parentRec=parentRec;
	this._fmLink=fmLink;	
}

CalemEmbedReadDetInfo.prototype = new CalemEmbedReadInfo;
CalemEmbedReadDetInfo.prototype.constructor = CalemEmbedReadDetInfo;

CalemEmbedReadDetInfo.prototype.toString = function() {return "CalemEmbedReadDetInfo";}

CalemEmbedReadDetInfo.prototype.create = 
function() {
	var fm= CalemEmbedReadInfo.prototype.create.call(this);
	this._instantiate(fm);
	return fm;
}

/**
 * Refabricate a form with new data
 */
CalemEmbedReadDetInfo.prototype.instantiate = 
function(fm) {
	CalemEmbedReadInfo.prototype.instantiate.call(this, fm);
	this._instantiate(fm);
}

CalemEmbedReadDetInfo.prototype._instantiate = 
function(fm) {
	fm.setParentRec(this._parentRec);
	fm.setFormLink(this._fmLink);
}

/**
 * CalemEmbedEditInfo
 */
function CalemEmbedEditInfo(parent, id, data) {
	if (arguments.length==0) return;
	CalemEmbedInfo.call(this, parent, id, data);
}

CalemEmbedEditInfo.prototype = new CalemEmbedInfo;
CalemEmbedEditInfo.prototype.constructor = CalemEmbedEditInfo;

CalemEmbedEditInfo.prototype.toString = function() {return "CalemEmbedEditInfo";}

/**
 * Refabricate a form with new data
 */
CalemEmbedEditInfo.prototype.instantiate = 
function(fm) {
	var rec=fm.getCurrentRecord();
	//Force a change (since record could have been updated by cache).
	fm.setCurrentRecord(this._data.item);
	//Force the form to repaint.
	fm.onRecChanged();
}

/**
 * CalemEmbedEditDetInfo
 */
function CalemEmbedEditDetInfo(parent, id, data, parentRec, fmLink) {
	if (arguments.length==0) return;
	CalemEmbedEditInfo.call(this, parent, id, data);
	this._parentRec=parentRec;
	this._fmLink=fmLink;
}

CalemEmbedEditDetInfo.prototype = new CalemEmbedEditInfo;
CalemEmbedEditDetInfo.prototype.constructor = CalemEmbedEditDetInfo;

CalemEmbedEditDetInfo.prototype.toString = function() {return "CalemEmbedEditDetInfo";}

CalemEmbedEditDetInfo.prototype.create = 
function() {
	var fm= CalemEmbedEditInfo.prototype.create.call(this);
	this._instantiate(fm);
	return fm;
}

/**
 * Refabricate a form with new data
 */ 
CalemEmbedEditDetInfo.prototype.instantiate = 
function(fm) {
	CalemEmbedEditInfo.prototype.instantiate.call(this, fm);
	this._instantiate(fm);
}
 
CalemEmbedEditDetInfo.prototype._instantiate = 
function(fm) {
	fm.setParentRec(this._parentRec);
	fm.setFormLink(this._fmLink);
}

/**
 * CalemEmbedLookupInfo
 */
function CalemEmbedLookupInfo(parent, id, lkupCallback, recId, data) {
	if (arguments.length==0) return;
	CalemEmbedInfo.call(this, parent, id, data);
	this._lkupCallback = lkupCallback;
	this._recId = recId;
	this._data=data;
}

CalemEmbedLookupInfo.prototype = new CalemEmbedInfo;
CalemEmbedLookupInfo.prototype.constructor = CalemEmbedLookupInfo;

CalemEmbedLookupInfo.prototype.toString = function() {return "CalemEmbedLookupInfo";}

/**
 * Creating the form.
 */
CalemEmbedLookupInfo.prototype.create = 
function() {
	var fm= CalemEmbedInfo.prototype.create.call(this);
	this._instantiate(fm);
	return fm;
}

/**
 * Refabricate a form with new data
 */
CalemEmbedLookupInfo.prototype.instantiate = 
function(fm) {
	this._instantiate(fm);
}

CalemEmbedLookupInfo.prototype._instantiate = 
function(fm) {
	fm.setLkupCallback(this._lkupCallback);
	fm.setCurrentRecId(this._recid);
}

/**
 * CalemEmbedSearchSelectInfo
 */
function CalemEmbedSearchSelectInfo(parent, searchEditFormId, dataModel) {
	if (arguments.length==0) return;
	this._searchEditFormId=searchEditFormId;
	this._dataModel=dataModel;
	//Use a composite id so this select form will not be confused with another one.
	this._searchSelectFormId='CalemFormSearchSelect';
	var id=[this._searchSelectFormId, '_', searchEditFormId].join('');
	CalemEmbedInfo.call(this, parent, id);
}

CalemEmbedSearchSelectInfo.prototype = new CalemEmbedInfo;
CalemEmbedSearchSelectInfo.prototype.constructor = CalemEmbedSearchSelectInfo;

CalemEmbedSearchSelectInfo.prototype.toString = function() {return "CalemEmbedSearchSelectInfo";}

/**
 * Creating the Select form
 */
CalemEmbedSearchSelectInfo.prototype.create = 
function() {
	var fm= eval(['new ', this._searchSelectFormId, 
					  "(this._parent, this._searchSelectFormId, this._id, this._searchEditFormId, this._dataModel)"].join(''));
	return fm;
}

/**
 * CalemEmbedSearchEditInfo
 */
function CalemEmbedSearchEditInfo(parent, id, dataModel, search) {
	if (arguments.length==0) return;
	CalemEmbedInfo.call(this, parent, id);
	this._dataModel=dataModel;
	this._search = search;
}

CalemEmbedSearchEditInfo.prototype = new CalemEmbedInfo;
CalemEmbedSearchEditInfo.prototype.constructor = CalemEmbedSearchEditInfo;

CalemEmbedSearchEditInfo.prototype.toString = function() {return "CalemEmbedSearchEditInfo";}

/**
 * Creating the Select form
 */
CalemEmbedSearchEditInfo.prototype.create = 
function() {
	var fmInfo=CalemJson.setJson(CalemItemDef[this._id]);
	var fm= eval(['new ', fmInfo.getController(), 
					  "(this._parent, this._id, this._dataModel, this._search)"].join(''));
	return fm;
}

CalemEmbedSearchEditInfo.prototype.instantiate = 
function(fm) {
	fm.setSearch(this._search);
}
