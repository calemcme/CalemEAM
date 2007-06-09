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
 * CalemFormCustomInfo
 * This object stores the custom acl and layout for a form.
 */
function CalemFormCustomInfo(id, acl, layout) {
	if (arguments.length==0) return;
	this._id=id;
	this._acl=acl;
	this._layout=layout;
}

CalemFormCustomInfo.prototype.toString = function() {return "CalemFormCustomInfo";}
CalemFormCustomInfo.prototype.getClassName = function() {return "CalemFormCustomInfo";}

//Deserialize the object
CalemFormCustomInfo.prototype.setJson =
function(obj) {
	this._id=obj.id;
   this._acl=CalemJson.setJson(obj.acl);
   this._layout= (obj.layout ? CalemJson.setJson(obj.layout) : null);
}

//Serialization
CalemFormCustomInfo.prototype.getJson =
function() {
	return ["{CalemFormCustomInfo: {id: '", this._id, "', acl: ", this._acl.getJson(), 
					", layout: ", (this._layout ? this._layout.getJson() : 'null'),"}}"].join('');
}

CalemFormCustomInfo.prototype.getId =
function() {
	return this._id;
}

CalemFormCustomInfo.prototype.getAcl =
function() {
	return this._acl;
}

CalemFormCustomInfo.prototype.getLayout =
function() {
	return this._layout;
}

CalemFormCustomInfo.prototype.setLayout =
function(layout) {
	this._layout=layout;
}

//Acl api
CalemFormCustomInfo.prototype.checkTabAcl =
function(id) {
	return (this._acl) ? this._acl.checkTabAcl(id) : true;
}

CalemFormCustomInfo.prototype.checkFormAcl =
function(id) {
	return (this._acl) ? this._acl.checkFormAcl(id) : true;
}

/**
 * CalemFormAclInfo
 */
function CalemFormAclInfo(tabAcl, formAcl) {
	if (arguments.length==0) return;
	this._tabAcl=tabAcl;
	this._formAcl=formAcl;
}

CalemFormAclInfo.prototype.toString = function() {return "CalemFormAclInfo";}
CalemFormAclInfo.prototype.getClassName = function() {return "CalemFormAclInfo";}

//Deserialize the object
CalemFormAclInfo.prototype.setJson =
function(obj) {
   this._tabAcl=new CalemAclInfo(obj.tabAcl);
   this._formAcl=new CalemAclInfo(obj.formAcl);
}

//Serialization
CalemFormAclInfo.prototype.getJson =
function() {
	return ["{CalemFormAclInfo: {tabAcl: ", this._tabAcl.getJson(), 
					", formAcl: ", this._formAcl.getJson(),"}}"].join('');
}

CalemFormAclInfo.prototype.getTabAcl =
function() {
	return this._tabAcl;
}

CalemFormAclInfo.prototype.getFormAcl =
function() {
	return this._formAcl;
}

CalemFormAclInfo.prototype.checkFormAcl =
function(id) {
	return (this._formAcl ? this._formAcl.checkAcl(id) : true);
}

CalemFormAclInfo.prototype.checkTabAcl =
function(id) {
	return (this._tabAcl ? this._tabAcl.checkAcl(id) : true);
}

/**
 * Support aggregation
 */
CalemFormAclInfo.prototype.aggregate =
function(formAcl) {
	if (formAcl._tabAcl) {
		this._tabAcl.aggregate(formAcl._tabAcl);
	}
	if (formAcl._formAcl) {
		this._formAcl.aggregate(formAcl._formAcl);
	}
}
