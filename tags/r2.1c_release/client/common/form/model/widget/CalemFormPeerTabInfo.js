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
 * CalemFormPeerTabInfo
 * Multi-tab form descriptors.
 */
function CalemFormPeerTabInfo() {
}

CalemFormPeerTabInfo.prototype=new CalemFormMdTabInfo;
CalemFormPeerTabInfo.prototype.constructor=CalemFormPeerTabInfo;

CalemFormPeerTabInfo.prototype.toString = function() {return "CalemFormPeerTabInfo";}
CalemFormPeerTabInfo.prototype.getClassName = function() {return "CalemFormPeerTabInfo";}

//get forms in this peerTab.
CalemFormPeerTabInfo.prototype.getFormItems=
function() {
	var rtn=new Array();
	var map=this._itemMap.getMap();
	for (var i in map) {
		if (map[i] instanceof CalemFormLayoutInfo) {
			rtn.push(map[i]);
		}
	}
	return rtn;
};


/**
 * CalemPeerTabLayoutInfo
 * Layout in original and custom layout descriptors.
 */
function CalemPeerTabLayoutInfo(tabList, tabMap) {
	if (arguments.length==0) return;
	this._tabList=tabList;
	this._tabMap=tabMap;
}

CalemPeerTabLayoutInfo.prototype=new CalemMdTabLayoutInfo;
CalemPeerTabLayoutInfo.prototype.constructor=CalemPeerTabLayoutInfo;

CalemPeerTabLayoutInfo.prototype.toString = function() {return "CalemPeerTabLayoutInfo";}
CalemPeerTabLayoutInfo.prototype.getClassName = function() {return "CalemPeerTabLayoutInfo";}

/**
 * CalemTabColLayoutInfo
 * Common interfaces for CalemTabLayoutInfo and CalemTabColLayoutInfo
 */
function CalemTabColLayoutInfo(layout) {
	if (arguments.length==0) return;
	this._layout=layout;
}

CalemTabColLayoutInfo.prototype.toString = function() {return "CalemTabColLayoutInfo";}
CalemTabColLayoutInfo.prototype.getClassName = function() {return "CalemTabColLayoutInfo";}

//Deserialize the object
CalemTabColLayoutInfo.prototype.setJson =
function(obj) {
   this._layout=CalemJson.setJsonAsArray(obj);
}

//Serialization
CalemTabColLayoutInfo.prototype.getJson =
function() {
	return ["{CalemTabColLayoutInfo: ", CalemJson.arrayToJson(this._layout), "}"].join('');
}

CalemTabColLayoutInfo.prototype.getLayout =
function() {
	return this._layout;
}

CalemTabColLayoutInfo.prototype.getColCount =
function() {
	return (this._layout ? this._layout.length : 0);
}

CalemTabColLayoutInfo.prototype.getColLayout =
function(i) {
	return (this._layout ? this._layout[i].getLayout() : null);
}

CalemTabColLayoutInfo.prototype.getCol =
function(i) {
	return (this._layout ? this._layout[i] : null);
}

//Peer tab info
/**
 * CalemPeerTabInfo
 * This is a simple tab object info.
 */
function CalemPeerTabInfo() {
}

CalemPeerTabInfo.prototype = new CalemTabInfo;
CalemPeerTabInfo.prototype.constructor = CalemPeerTabInfo;

CalemPeerTabInfo.prototype.toString = function() {return "CalemPeerTabInfo";}
CalemPeerTabInfo.prototype.getClassName = function() {return "CalemPeerTabInfo";}

//Deserialize the object
CalemPeerTabInfo.prototype.setJson =
function(obj) {
   CalemTabInfo.prototype.setJson.call(this, obj);
   this._colCount= obj.colCount;
   this._colWidth=CalemJson.setJsonAsArray(obj.colWidth);
}

//Serialization
CalemPeerTabInfo.prototype.getJson =
function() {
	return ["{CalemPeerTabInfo: {id: '", this._id, "', colCount:", this._colCount, ", fixed: ", (this._fixed ? 1 : 0), 
	  ", colWidth:", (this._colWidth ? CalemJson.arrayToJson(this._colWidth) : ''),  "}}"].join('');
}

CalemPeerTabInfo.prototype.getColCount =
function() {
	return this._colCount;
}

CalemPeerTabInfo.prototype.getColWidth =
function() {
	return this._colWidth;
}

CalemPeerTabInfo.prototype.getWidthByCol =
function(i) {
	return this._colWidth[i];
}

CalemPeerTabInfo.prototype.getLabel =
function() {
	return CalemMsg.getMsg(this._id);
}

