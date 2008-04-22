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
 * CalemDataGridInfo
 */
function CalemDataGridInfo() {
}

//Required to map to a render.
CalemDataGridInfo.prototype.getClassName = function() {return 'CalemDataGridInfo';}

CalemDataGridInfo.prototype.setJson =
function(obj) {
	this._listInfo=CalemJson.setJson(obj.listInfo);
}

CalemDataGridInfo.prototype.getJson =
function(obj) {
	return ["{CalemDataGridInfo: {listInfo: ", this._listInfo.getJson(), "}}"].join('');
}

CalemDataGridInfo.prototype.getListInfo =
function() {
	return this._listInfo;
}

/**
 * CalemListInfo
 */
function CalemListInfo(colList, noMaximize) {
	this._colList=colList;
	this._noMaximize= (typeof(noMaximize)=='undefined') ? true : noMaximize;
}

CalemListInfo.prototype.setJson =
function(obj) {
	this._noMaximize= (typeof(obj.noMaximize)=='undefined') ? true : obj.noMaximize;
	this._colList=CalemJson.setJsonAsArray(obj.colList);
} 

CalemListInfo.prototype.getJson =
function() {
	return ["{CalemListInfo: {noMaximize: ", this._noMaximize, ", colList: ", 
				CalemJson.arrayToJson(this._colList), "}}"].join('');
}

CalemListInfo.prototype.getNoMaximize =
function() {
	return this._noMaximize;
}

CalemListInfo.prototype.getColList =
function() {
	return this._colList;
}

/**
 * CalemCol
 */
function CalemCol(id, width)  {
	if (arguments.length==0) return;
	this._id=id;
	this._width=width;
}

CalemCol.prototype.setJson =
function(obj) {
	this._id=obj.id;
	this._width=obj.width;
}

CalemCol.prototype.getJson =
function() {
	return ["{CalemCol: {id: '", this._id, "', width: ", this._width, "}}"].join('');
}

CalemCol.prototype.getId =
function() {
	return this._id;
}

CalemCol.prototype.getWidth =
function() {
	return this._width;
}