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
 * CalemModuleLayoutTree
 */
function CalemModuleLayoutTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemLabelLayoutTree.call(this, parent, style, className, posStyle);
} 

CalemModuleLayoutTree.prototype = new CalemLabelLayoutTree;
CalemModuleLayoutTree.prototype.constructor = CalemModuleLayoutTree;

CalemModuleLayoutTree.prototype.toString = 
function() {
	return "CalemModuleLayoutTree";
}

CalemModuleLayoutTree.prototype._initTree =
function() {
	CalemLabelLayoutTree.prototype._initTree.call(this);
	//Creating two category nodes.
	this._root=this._createRoot();
	this._designRoot=new CalemLayoutTreeFormDesign(this._root);
	this._defaultMenuRoot=new CalemLayoutTreeDefaultMenuRoot(this._root);
	this._layoutRoot=new CalemLayoutTreeLayoutRoot(this._root);
	//Expand tree after adding nodes
	this._root.setExpanded(true);
	
	//Now adding stuff to different spots of the tree.
	this._modInfo=CalemCustomModuleManager.getInstance().getSysModInfo(this._controller.getModId());
	var customInfo=this._controller.getCustomInfo();
	this._setupTree(customInfo);
}

CalemModuleLayoutTree.prototype._createRoot =
function() {
	return new CalemLayoutTreeFormModule(this);
}

/**
 * Adding layout to the tree.
 */
CalemModuleLayoutTree.prototype._setupTree =
function(customInfo) {
	var tbInfo=this._modInfo.getToolBar();
	var dm=this._modInfo.getDefaultMenuInfo();
	
	var origRtn=CalemToolBarModule._getMapAndLayout(tbInfo, null, dm);
	var cRtn=CalemToolBarModule._getMapAndLayout(tbInfo, customInfo, dm);
	var myMap, myLayout;
	var rtn= (customInfo && customInfo.getLayout()) ? cRtn : origRtn;
	
	var myMap = rtn.map
	var myLayout = rtn.layout
	dm=rtn.defaultMenu;
	if (dm) {
		this._defaultMenuRoot._addDefaultMenu(dm);
	}
		
	//Going through the list.
	for (var i=0; i < myLayout.length; i++) {
		var id=myLayout[i];
		if (!customInfo.checkAcl(id)) continue;
		var item=myMap[id];
		this._addModuleItem(item, myMap, customInfo);
	}
}
//Adding an item to layout tree. 
CalemModuleLayoutTree.prototype._addModuleItem =
function(item, myMap, customInfo) {
	if (item instanceof CalemMenuInfo) {
		var btnInfo=item.getMenuButton();
		var node=this._layoutRoot._addModMenuNode(btnInfo);
		
		var list=item.getMenuList();
		if (list) {//make sure we have nodes below.
			for (var i=0; i< list.length; i++) {
				var info=list[i];
				if (!customInfo.checkAcl(info.getId())) continue; //apply acl/layout recursively.
				this._layoutRoot._addModMenuItem(info, node);
			}
		}
	} else if (item instanceof CalemMenuItemInfo) {
		this._layoutRoot._addModMenuItem(item);
	} else if (item instanceof CalemLabelInfo) {
		this._layoutRoot._addModLabel(item);
	} else if (item instanceof CalemSeparator) {
		this._layoutRoot._addModSeparator(item);
	}
}

//Handle layout tree node removal - check for default menu
CalemModuleLayoutTree.prototype._handleLayoutRemove =
function(id) {
	this._defaultMenuRoot._handleLayoutRemove(id);
}

/**
 * Collecting module layout info
 */
CalemModuleLayoutTree.prototype.getModuleInfo =
function() {
	//Walk through the tree.
	var dm=this._defaultMenuRoot.getDefaultMenu();
	var items=this._layoutRoot.getItems();
	var list=[];
	for (var i=0; i< items.length; i++) {
		if (items[i] instanceof CalemLayoutTreeMenuNode) {
			list.push(items[i].getModNodeInfo())
		} else {
			list.push(items[i].getInfo());
		}
	}
	return new CalemModuleLayoutInfo(dm, list);
}

