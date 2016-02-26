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
 * This is the base toolbar class.
 */
 
/**
 * Constructor
 */
function CalemToolBarModule(parent, posInfo, tbInfo, className, posStyle, cellSpacing, cellPadding, style) {
	if (arguments.length==0) return;
	CalemToolBar.call(this, parent, posInfo, tbInfo, className, posStyle, cellSpacing, cellPadding, style);
} 

CalemToolBarModule.prototype = new CalemToolBar;
CalemToolBarModule.prototype.constructor = CalemToolBarModule;

CalemToolBarModule.prototype.toString = function() { return "CalemToolBarModule";}

CalemToolBarModule.prototype.createToolBar =
function(modInfo, listenerFactory, controller, customInfo) {
	this._defaultMenuInfo=modInfo.getDefaultMenuInfo();
	CalemToolBar.prototype.createToolBar.call(this, modInfo.getToolBar(), 
	               listenerFactory, controller, customInfo);
}

CalemToolBarModule.prototype.getDefaultMenu =
function() {
	return this._defaultMenuInfo ? this._defaultMenuInfo.getId() : null;
}

/**
 * Setup toolbar for module
 * - layout is a list of ids
 * - map is the item maps
 */
CalemToolBarModule.prototype._setupTbMapAndLayout =
function(tbInfo, customInfo) {
	var rtn=CalemToolBarModule._getMapAndLayout(tbInfo, customInfo, this._defaultMenuInfo);
	this._layout=rtn.layout;
	this._map=rtn.map;
	this._defaultMenuInfo = rtn.defaultMenu;		
}

/**
 * Check acl
 */
CalemToolBarModule.prototype._checkAcl =
function(id) {
	return (this._customInfo) ? this._customInfo.checkAcl(id) : true;
} 

/**
 * Utility function
 * @param tbInfo - toolbar info
 * @param customInfo - custom info
 * @return {map: map, layout: layout, defaultMenu: defaultMenu}
 */
CalemToolBarModule._getMapAndLayout =
function(tbInfo, customInfo, defaultMenu) {
	var map=new Object();
	var layout=[];
	//Use custom info for map and list.
	if (customInfo && customInfo.getLayout()) {
		defaultMenu=customInfo.getLayout().getDefaultMenuInfo();
		var list=customInfo.getLayout().getMenuList();
		for (var i=0; i< list.length; i++) {
			var id=list[i].getId();
			layout.push(id);
			CalemToolBarModule._addToMap(list[i], map);
		}
	} else {//No custom info
		layout=tbInfo.getLayout();
		var list=tbInfo.getList();
		for (var i=0; i< list.length; i++) {
			CalemToolBarModule._addToMap(list[i], map);
		}
	}
	return {layout: layout, map: map, defaultMenu: defaultMenu};
}

CalemToolBarModule._addToMap =
function(item, map) {
	map[item.getId()]=item;
	if (item instanceof CalemMenuInfo) {
		var list=item.getMenuList();
		if (list) {
			for (var i=0; i< list.length; i++) {
				map[list[i].getId()]=list[i];
			}
		}
	}
}