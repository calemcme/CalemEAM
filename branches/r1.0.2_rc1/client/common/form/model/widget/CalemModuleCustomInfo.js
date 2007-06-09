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
 * CalemModuleCustomInfo
 * This object stores the custom acl and layout for a form.
 */
function CalemModuleCustomInfo(id, acl, layout) {
	if (arguments.length==0) return;
	this._id=id;
	this._acl=acl;
	this._layout=layout;
}

CalemModuleCustomInfo.prototype.toString = function() {return "CalemModuleCustomInfo";}
CalemModuleCustomInfo.prototype.getClassName = function() {return "CalemModuleCustomInfo";}

//Deserialize the object
CalemModuleCustomInfo.prototype.setJson =
function(obj) {
	this._id=obj.id;
   this._acl=new CalemAclInfo(obj.acl);
   this._layout= (obj.layout ? CalemJson.setJson(obj.layout) : null);
}

//Serialization
CalemModuleCustomInfo.prototype.getJson =
function() {
	return ["{CalemModuleCustomInfo: {id: '", this._id, "', acl: ", this._acl.getJson(), 
					", layout: ", (this._layout ? this._layout.getJson() : 'null'),"}}"].join('');
}

CalemModuleCustomInfo.prototype.getId =
function() {
	return this._id;
}

CalemModuleCustomInfo.prototype.getAcl =
function() {
	return this._acl;
}

CalemModuleCustomInfo.prototype.getLayout =
function() {
	return this._layout;
}

CalemModuleCustomInfo.prototype.setLayout =
function(layout) {
	this._layout=layout;
}

//Acl api
CalemModuleCustomInfo.prototype.checkAcl =
function(id) {
	return (this._acl) ? this._acl.checkAcl(id) : true;
}

// custom layout including default.
function CalemModuleLayoutInfo(defaultMenu, menuList) {
	if (arguments.length==0) return;
	this._defaultMenu=defaultMenu;
	this._menuList=menuList;
}

CalemModuleLayoutInfo.prototype.toString = function() {return "CalemModuleLayoutInfo";}

//Deserialize the object
CalemModuleLayoutInfo.prototype.setJson =
function(obj) {
	this._defaultMenu=obj.defaultMenu;
	this._menuList=CalemJson.setJsonAsArray(obj.menuList);
}

//Serialization
CalemModuleLayoutInfo.prototype.getJson =
function() {
	return ["{CalemModuleLayoutInfo: {defaultMenu: ", 
	            (this._defaultMenu ? ["'", this._defaultMenu, "'"].join('') : 'null'),
	            ", menuList: ", CalemJson.arrayToJson(this._menuList), "}}"].join('');
}

CalemModuleLayoutInfo.prototype.getDefaultMenu =
function() {
	return this._defaultMenu;
}

CalemModuleLayoutInfo.prototype.getDefaultMenuInfo = 
function() { 
	return !this._defaultMenu ? null : CalemJson.setJson({CalemMenuItemInfo: {id: this._defaultMenu}}); 
}

CalemModuleLayoutInfo.prototype.getMenuList =
function() {
	return this._menuList;
}

/**
 * CalemModListCustomInfo
 */
function CalemModListCustomInfo(acl, layout) {
	if (arguments.length==0) return;
	CalemModuleCustomInfo.call(this, this.toString(), acl, layout);
}

CalemModListCustomInfo.prototype = new CalemModuleCustomInfo;
CalemModListCustomInfo.prototype.constructor = CalemModListCustomInfo;

CalemModListCustomInfo.prototype.toString = function() {return "CalemModListCustomInfo";}

//Deserialize the object
CalemModListCustomInfo.prototype.setJson =
function(obj) {
   this._acl=new CalemAclInfo(obj.acl);
   this._layout= obj.layout; //This is module id list.
}

//Serialization
CalemModListCustomInfo.prototype.getJson =
function() {
	return ["{CalemModListCustomInfo: {acl: ", this._acl.getJson(), 
					", layout: ", (this._layout ? CalemJson.arrayToJson(this._layout) : 'null'),"}}"].join('');
}
