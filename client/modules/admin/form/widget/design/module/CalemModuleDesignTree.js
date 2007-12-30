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
 * CalemModuleDesignTree
 */
function CalemModuleDesignTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemViewDesignTree.call(this, parent, style, className, posStyle);
} 

CalemModuleDesignTree.prototype = new CalemViewDesignTree;
CalemModuleDesignTree.prototype.constructor = CalemModuleDesignTree;

CalemModuleDesignTree.prototype.toString = 
function() {
	return "CalemModuleDesignTree";
}

CalemModuleDesignTree.prototype._initTree =
function() {
	//Creating two category nodes.
	this._root=this._createRoot();
	this._nodeRoot=new CalemDesignTreeMenuNodeRoot(this._root);
	this._itemRoot=new CalemDesignTreeMenuItemRoot(this._root);
	//Expand tree after adding nodes
	this._root.setExpanded(true);
	
	//Now adding stuff to different spots of the tree.
	this._modInfo=CalemCustomModuleManager.getInstance().getSysModInfo(this._controller.getModId());
	var parentCustomInfo=this._controller.getParentCustomInfo(); //Get parent's customInfo
	var myCustomInfo=this._controller.getMyCustomInfo();
	this._initAcl(parentCustomInfo, myCustomInfo);
	
}

CalemModuleDesignTree.prototype._createRoot =
function() {
	return new CalemDesignTreeFormModule(this);
}

/**
 * Add ACL info to tree
 * a) the item is in parent acl, do not add it. 
 * b) the item is in my layout, do not add it.
 * c) not a) and not b), add the item.
 */
CalemModuleDesignTree.prototype._initAcl =
function(parentCustomInfo, myCustomInfo) {
	var origRtn=CalemToolBarModule._getMapAndLayout(this._modInfo.getToolBar(), null, null);
	var cRtn=CalemToolBarModule._getMapAndLayout(this._modInfo.getToolBar(), myCustomInfo, null);
	var myMap = (myCustomInfo && myCustomInfo.getLayout()) ? cRtn.map : origRtn.map;
	
	//Going through original list.
	for (var i=0; i < origRtn.layout.length; i++) {
		var id=origRtn.layout[i];
		var item=origRtn.map[id];
		if (myMap[id] || !parentCustomInfo.checkAcl(id)) {
			if (item instanceof CalemMenuInfo) {//Check each item in the list individually.
				this._addModuleMenuList(item, myMap, parentCustomInfo);
			}
			continue;
		}
		this._addModuleItem(item, myMap, parentCustomInfo);
	}
} 

/**
 * Each menu in the menu list is individually acl-checked.
 */
CalemModuleDesignTree.prototype._addModuleMenuList =
function(item, myMap, parentCustomInfo) {
		var list=item.getMenuList();
		if (list) {//make sure we have nodes below.
			for (var i=0; i< list.length; i++) {
				var info=list[i];
				if (myMap[info.getId()] || !parentCustomInfo.checkAcl(info.getId())) continue; //apply acl/layout recursively.
				this._itemRoot.addModItem(info.getId(), info, info.getTitle());
			}
		}
}

CalemModuleDesignTree.prototype._addModuleItem =
function(item, myMap, parentCustomInfo) {
	if (item instanceof CalemMenuInfo) {
		var btnInfo=item.getMenuButton();
		this._nodeRoot.addModNode(btnInfo.getId(), btnInfo, btnInfo.getTitle());
		this._addModuleMenuList(item, myMap, parentCustomInfo);
	} else if (item instanceof CalemMenuItemInfo) {
		this._itemRoot.addModItem(item.getId(), item, item.getTitle());
	}
	//Separator, label are not handled for now.
}

//When a node is dropped from layout tree.
CalemModuleDesignTree.prototype._addObject =
function(obj) {
	var info=obj.getInfo();
	if (info instanceof CalemMenuInfo) {
		var btnInfo=info.getMenuButton();
		this._nodeRoot.addModNode(btnInfo.getId(), btnInfo, btnInfo.getTitle());
	} else if (info instanceof CalemMenuItemInfo) {
		this._itemRoot.addModItem(info.getId(), info, info.getTitle());
		//A special handler for a node removed from layout tree
		if (obj._handleLayoutRemove) {
			obj._handleLayoutRemove();
		}
	}
	//Others are ignored at this time.
	return true;
} 

/**
 * Collect Acl info here.
 */
CalemModuleDesignTree.prototype.getAclInfo =
function() {
	var acl=new Object();
	this._addAcl(this._nodeRoot, acl);
	this._addAcl(this._itemRoot, acl);
	//Set up acl
	var aclInfo=new CalemAclInfo(acl);
	return aclInfo;
}

