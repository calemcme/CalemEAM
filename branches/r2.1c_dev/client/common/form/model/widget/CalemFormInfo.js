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
 * CalemFormInfo
 */
function CalemFormInfo() {
}

CalemFormInfo.prototype.toString = function() {return "CalemFormInfo";}
CalemFormInfo.prototype.getClassName = function() {return "CalemFormInfo";}

//Deserialize the object
CalemFormInfo.prototype.setJson =
function(obj) {
   this._id=obj.id;
   this._title=obj.title;
   this._icon=obj.icon;
   this._controller=obj.controller;
   this._model=obj.model;
   this._view=CalemJson.setJson(obj.view);
   this._replaceType=obj.replaceType;
   this._searchFormId=obj.searchFormId;
}

CalemFormInfo.getFormInfo =
function(id) {
	return CalemJson.setJson(CalemItemDef[id]);
}

CalemFormInfo.getFormDesignText =
function(id) {
	var fmInfo=CalemFormInfo.getFormInfo(id);
	text=[fmInfo.getTitleMsg(), '-', id].join('');
	return text;
}

//Serialization
CalemFormInfo.prototype.getJson =
function() {
	return ["{CalemFormInfo: {id: '", this._id, "', title: '", this._title,"', icon: '", 
	              this._icon, "', controller: '", this._controller, "', model: '", this._model,
	              "', view: ", this._view.getJson(), ", replaceType: ", this._replaceType,
	              (this._searchFormId ? [", searchFormId: '", this._searchFormId, "'"].join('') : ''), "}}"].join('');
}

CalemFormInfo.prototype.getId =
function() {
	return this._id;
}

CalemFormInfo.prototype.getTitle =
function() {
	return this._title;
}

CalemFormInfo.prototype.getTitleMsg =
function() {
	return CalemMsg.getMsg(this._title);
}

CalemFormInfo.prototype.getIcon =
function(id) {
	return this._icon;}

CalemFormInfo.prototype.getController =
function() {
	return this._controller;
}

CalemFormInfo.prototype.getModel =
function() {
	return this._model;
}

CalemFormInfo.prototype.getView =
function() {
	return this._view;
}

CalemFormInfo.prototype.getReplaceType =
function() {
	return this._replaceType;
}

CalemFormInfo.prototype.getSearchFormId =
function() {
	return this._searchFormId;
}

/**
 * CalemViewRefInfo
 */
function CalemViewRefInfo() {
}

CalemViewRefInfo.prototype.toString = function() {return "CalemViewRefInfo";}
CalemViewRefInfo.prototype.getClassName = function() {return "CalemViewRefInfo";}

//Deserialize the object
CalemViewRefInfo.prototype.setJson =
function(obj) {
   this._id=obj.id;
   this._impl=obj.impl;
}

//Serialization
CalemViewRefInfo.prototype.getJson =
function() {
	return ["{CalemViewRefInfo: {id: '", this._id, "'",
	      (this._impl ? [", impl: '", this._impl,"'"].join('') : ''), "}}"].join('');
}

// Public APIs
CalemViewRefInfo.prototype.getId =
function() {
	return this._id;
}

CalemViewRefInfo.prototype.getImpl =
function() {
	return this._impl;
}

/**
 * CalemFormErrorInfo
 */
function CalemFormErrorInfo() {
}

CalemFormErrorInfo.prototype.toString = function() {return "CalemFormErrorInfo";}
CalemFormErrorInfo.prototype.getClassName = function() {return "CalemFormErrorInfo";}

//Deserialize the object
CalemFormErrorInfo.prototype.setJson =
function(obj) {
   this._id=obj.id;
}

//Serialization
CalemFormErrorInfo.prototype.getJson =
function() {
	return ["{CalemFormErrorInfo: {id: '", this._id, "'}}"].join('');
}

// Public APIs
CalemFormErrorInfo.prototype.getId =
function() {
	return this._id;
}

/**
 * CalemFormMdTabInfo
 * Multi-tab form descriptors.
 */
function CalemFormMdTabInfo() {
}

CalemFormMdTabInfo.prototype.toString = function() {return "CalemFormMdTabInfo";}
CalemFormMdTabInfo.prototype.getClassName = function() {return "CalemFormMdTabInfo";}

//Deserialize the object
CalemFormMdTabInfo.prototype.setJson =
function(obj) {
   this._id=obj.id;
   this._title=obj.title;
   this._icon=obj.icon;
   this._replaceType=obj.replaceType;
   this._controller=obj.controller;
   //Layout, model and itemMap
   this._layout=CalemJson.setJson(obj.layout);
   this._model=CalemJson.setJson(obj.model);
   this._itemMap=CalemJson.setJson(obj.itemMap);
}

//Serialization
CalemFormMdTabInfo.prototype.getJson =
function() {
	return ["{", this.toString(),": {id: '", this._id, "', title: '", this._title,"', icon: '", 
	              this._icon, "', replaceType: ", this._replaceType,", layout: ", this._layout.getJson(), 
	              ", model: ", (this._model ? this._model.getJson() : "''"), ", itemMap: ", this._itemMap.getJson(), "}}"].join('');
}

CalemFormMdTabInfo.prototype.getId =
function() {
	return this._id;
}

CalemFormMdTabInfo.prototype.getController =
function() {
	return this._controller;
}

CalemFormMdTabInfo.prototype.getTitle =
function() {
	return this._title;
}

CalemFormMdTabInfo.prototype.getIcon =
function(id) {
	return this._icon;
}

CalemFormMdTabInfo.prototype.getReplaceType =
function() {
	return this._replaceType;
}

CalemFormMdTabInfo.prototype.getLayout =
function() {
	return this._layout;
}

CalemFormMdTabInfo.prototype.getModel =
function() {
	return this._model;
}

CalemFormMdTabInfo.prototype.getItem =
function(id) {
	return this._itemMap.get(id);
}

CalemFormMdTabInfo.prototype.getItemMap =
function(id) {
	return this._itemMap;
}


/**
 * CalemMdTabLayoutInfo
 * Layout in original and custom layout descriptors.
 */
function CalemMdTabLayoutInfo(tabList, tabMap) {
	if (arguments.length==0) return;
	this._tabList=tabList;
	this._tabMap=tabMap;
}

CalemMdTabLayoutInfo.prototype.toString = function() {return "CalemMdTabLayoutInfo";}
CalemMdTabLayoutInfo.prototype.getClassName = function() {return "CalemMdTabLayoutInfo";}

//Deserialize the object
CalemMdTabLayoutInfo.prototype.setJson =
function(obj) {
   this._tabList=CalemJson.setJsonAsArray(obj.tabList);
   this._tabMap=CalemJson.setJsonByMap(obj.tabMap);
}

//Serialization
CalemMdTabLayoutInfo.prototype.getJson =
function() {
	return ["{", this.toString(), ": {tabList: ", CalemJson.arrayToJson(this._tabList),
	               ", tabMap: ", CalemJson.mapToJson(this._tabMap), "}}"].join('');
}

CalemMdTabLayoutInfo.prototype.getTabList =
function() {
	return this._tabList;
}

CalemMdTabLayoutInfo.prototype.getTabItem =
function(id) {
	return this._tabMap[id];
}

CalemMdTabLayoutInfo.prototype.getTabMap =
function() {
	return this._tabMap;
}

/**
 * CalemTabLayoutInfo
 * Tab layout descriptors when composing forms to make new forms.
 * Provide common service like CalemTabColLayout
 */
function CalemTabLayoutInfo(layout) {
	if (arguments.length==0) return;
	this._layout=layout;
}

CalemTabLayoutInfo.prototype.toString = function() {return "CalemTabLayoutInfo";}
CalemTabLayoutInfo.prototype.getClassName = function() {return "CalemTabLayoutInfo";}

//Deserialize the object
CalemTabLayoutInfo.prototype.setJson =
function(obj) {
   this._layout=CalemJson.setJsonAsArray(obj);
}

//Serialization
CalemTabLayoutInfo.prototype.getJson =
function() {
	return ["{CalemTabLayoutInfo: ", CalemJson.arrayToJson(this._layout), "}"].join('');
}

CalemTabLayoutInfo.prototype.getLayout =
function(id) {
	return this._layout;
}

CalemTabLayoutInfo.prototype.getColCount =
function() {
	return 1;
}

CalemTabLayoutInfo.prototype.getColLayout =
function(i) {
	return this._layout;
}

/**
 * CalemFormLayoutInfo
 * Form layout descriptors when composing forms to make new forms.
 */
function CalemFormLayoutInfo() {
}

CalemFormLayoutInfo.prototype.toString = function() {return "CalemFormLayoutInfo";}
CalemFormLayoutInfo.prototype.getClassName = function() {return "CalemFormLayoutInfo";}

//Deserialize the object
CalemFormLayoutInfo.prototype.setJson =
function(obj) {
   this._id=obj.id;
   this._fixed=obj.fixed;
   this._layout=CalemJson.setJson(obj.layout);
}

//Serialization
CalemFormLayoutInfo.prototype.getJson =
function() {
	var fixed=(this._fixed ? ", fixed: 1" : '');
	return ["{CalemFormLayoutInfo: {id: '", this._id, "'", fixed, ", layout: ", this._layout.getJson(), "}}"].join('');
}

CalemFormLayoutInfo.prototype.getId =
function() {
	return this._id;
}

CalemFormLayoutInfo.prototype.getFixed =
function() {
	return this._fixed;
}

CalemFormLayoutInfo.prototype.getLayout =
function(id) {
	return this._layout;
}

/**
 * CalemTabInfo
 * This is a simple tab object info.
 */
function CalemTabInfo() {
}

CalemTabInfo.prototype.toString = function() {return "CalemTabInfo";}
CalemTabInfo.prototype.getClassName = function() {return "CalemTabInfo";}

//Deserialize the object
CalemTabInfo.prototype.setJson =
function(obj) {
   this._id=obj.id;
   this._fixed= obj.fixed;
}

//Serialization
CalemTabInfo.prototype.getJson =
function() {
	return ["{CalemTabInfo: {id: '", this._id, "'",
	         (this._fixed ? ", fixed: 1" : ''), "}}"].join('');
}

CalemTabInfo.prototype.getId =
function() {
	return this._id;
}

CalemTabInfo.prototype.getFixed =
function() {
	return this._fixed;
}

CalemTabInfo.prototype.getLabel =
function() {
	return CalemMsg.getMsg(this._id);
}

CalemTabInfo.prototype.getColCount =
function() {
	return 1;
}


/**
 * CalemBlockLayoutInfo
 * Block layout info.
 */
function CalemBlockLayoutInfo() {
}

CalemBlockLayoutInfo.prototype.toString = function() {return "CalemBlockLayoutInfo";}
CalemBlockLayoutInfo.prototype.getClassName = function() {return "CalemBlockLayoutInfo";}

//Deserialize the object
CalemBlockLayoutInfo.prototype.setJson =
function(obj) {
   this._width=obj.width;
   this._rows=obj.rows; //Number of rows in grid.
   this._height=obj.height;
   this._minRow=obj.minRow;
}

//Serialization
CalemBlockLayoutInfo.prototype.getJson =
function() {
	return ["{CalemBlockLayoutInfo: {width: ", CalemJson.getValue(this._width),", ",
				'minRow: ', (this._minRow ? this._minRow : 0), ', ',
				//Either rows or height but not both
				(this._rows ? ["rows: ", this._rows].join('') : ["height: ", this._height].join('')),				"}}"].join('');
}

CalemBlockLayoutInfo.prototype.getWidth =
function() {
	return this._width;
}

CalemBlockLayoutInfo.prototype.getRows =
function() {
	return this._rows;
}

CalemBlockLayoutInfo.prototype.getHeight =
function() {
	return this._height;
}

/**
 * CalemFormModelInfo
 * This is used for composing forms together.
 */
function CalemFormModelInfo() {
}

CalemFormModelInfo.prototype.toString = function() {return "CalemFormModelInfo";}
CalemFormModelInfo.prototype.getClassName = function() {return "CalemFormModelInfo";}

//Deserialize the object
CalemFormModelInfo.prototype.setJson =
function(obj) {
   this._master=obj.master;
   this._items=CalemJson.setJsonAsArray(obj.items);
}

//Serialization
CalemFormModelInfo.prototype.getJson =
function() {
	return ["{CalemFormModelInfo: {master: '", this._master, "', items: ", CalemJson.arrayToJson(this._items),"}}"].join('');
}

CalemFormModelInfo.prototype.getMaster =
function() {
	return this._master;
}

CalemFormModelInfo.prototype.getItems =
function() {
	return this._items;
}

/**
 * CalemFormLinkInfo
 * Defines how a form is linked with master form.
 */
function CalemFormLinkInfo() {
}

CalemFormLinkInfo.prototype.toString = function() {return "CalemFormLinkInfo";}
CalemFormLinkInfo.prototype.getClassName = function() {return "CalemFormLinkInfo";}

//Deserialize the object
CalemFormLinkInfo.prototype.setJson =
function(obj) {
   this._id=obj.id;
   this._link=CalemJson.setJson(obj.link);
}

//Serialization
CalemFormLinkInfo.prototype.getJson =
function() {
	return ["{CalemFormLinkInfo: {id: '", this._id, "', link: ", this._link.getJson(),"}}"].join('');
}

CalemFormLinkInfo.prototype.getId =
function() {
	return this._id;
}

CalemFormLinkInfo.prototype.getLink =
function() {
	return this._link;
}

/**
 * CalemFieldMdInfo
 * Form link field master detail info.
 */
function CalemFieldMdInfo(fld, pFld) {
	if (arguments.length==0) return;
	this._fld=fld;
	this._parentFld=pFld;
}

CalemFieldMdInfo.prototype.toString = function() {return "CalemFieldMdInfo";}
CalemFieldMdInfo.prototype.getClassName = function() {return "CalemFieldMdInfo";}

//Deserialize the object
CalemFieldMdInfo.prototype.setJson =
function(obj) {
   this._fld=obj.fld;
   this._parentFld=obj.parentFld;
}

//Serialization
CalemFieldMdInfo.prototype.getJson =
function() {
	return ["{CalemFieldMdInfo: {fld: '", this._fld, "', parentFld: '", this._parentFld,"'}}"].join('');
}

CalemFieldMdInfo.prototype.getFld =
function() {
	return this._fld;
}

CalemFieldMdInfo.prototype.getParentFld =
function() {
	return this._parentFld;
}

/**
 * CalemMdTabDesignTreeInfo
 */
function CalemMdTabDesignTreeInfo() {}

CalemMdTabDesignTreeInfo.prototype.toString = function() {return "CalemMdTabDesignTreeInfo";}
CalemMdTabDesignTreeInfo.prototype.getClassName = function() {return "CalemMdTabDesignTreeInfo";}

CalemMdTabDesignTreeInfo.prototype.setJson =
function(obj) {
}

CalemMdTabDesignTreeInfo.prototype.getJson = 
function() {
	return ["{CalemMdTabDesignTreeInfo: true}"].join('');
}

/**
 * CalemPeerTabDesignTreeInfo
 */
function CalemPeerTabDesignTreeInfo() {}

CalemPeerTabDesignTreeInfo.prototype.toString = function() {return "CalemPeerTabDesignTreeInfo";}
CalemPeerTabDesignTreeInfo.prototype.getClassName = function() {return "CalemPeerTabDesignTreeInfo";}

CalemPeerTabDesignTreeInfo.prototype.setJson =
function(obj) {
}

CalemPeerTabDesignTreeInfo.prototype.getJson = 
function() {
	return ["{CalemPeerTabDesignTreeInfo: true}"].join('');
}

