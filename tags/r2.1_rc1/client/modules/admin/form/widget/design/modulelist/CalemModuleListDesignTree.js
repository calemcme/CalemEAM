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
 * CalemModuleListDesignTree
 */
function CalemModuleListDesignTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemViewDesignTree.call(this, parent, style, className, posStyle);
} 

CalemModuleListDesignTree.prototype = new CalemViewDesignTree;
CalemModuleListDesignTree.prototype.constructor = CalemModuleListDesignTree;

CalemModuleListDesignTree.prototype.toString = 
function() {
	return "CalemModuleListDesignTree";
}

CalemModuleListDesignTree.prototype._initTree =
function() {
	//Creating two category nodes.
	this._root=this._createRoot();
	//Now adding stuff to different spots of the tree.
	var parentCustomInfo=this._controller.getParentCustomInfo(); //Get parent's customInfo
	var myCustomInfo=this._controller.getMyCustomInfo();
	this._initAcl(parentCustomInfo, myCustomInfo);
	//Expand tree after adding nodes
	this._root.setExpanded(true);
}

CalemModuleListDesignTree.prototype._createRoot =
function() {
	return new CalemDesignTreeModListRoot(this);
}

/**
 * Add ACL info to tree
 * a) the item is in parent acl, do not add it. 
 * b) the item is in my layout, do not add it.
 */
CalemModuleListDesignTree.prototype._initAcl =
function(parentCustomInfo, myCustomInfo) {
	//Figuring out who is in the layout.
	var origLayout=CalemCustomModListManager.getInstance().getSysModList();
	var myLayout= (myCustomInfo && myCustomInfo.getLayout()) ? myCustomInfo.getLayout() : origLayout;
	var myMap=CalemViewUtil.getMapByList(myLayout);
	for (var i=0; i< origLayout.length; i++) {
		var mod=origLayout[i];
		if (!parentCustomInfo.checkAcl(mod) || myMap[mod]) continue; //Not available
		this._addModule(mod, CalemMsg.getMsg(mod));
	}
} 

CalemModuleListDesignTree.prototype._addModule =
function(id, text) {
	new CalemDesignTreeModule(this._root, null, text, id, null);
}

CalemModuleListDesignTree.prototype._addObject =
function(obj) {
	this._addModule(obj.getId(), obj.getText());
	return true;
} 

/**
 * Collect Acl info here.
 */
CalemModuleListDesignTree.prototype.getAclInfo =
function() {
	var acl=new Object();
	this._addAcl(this._root, acl);
	//Set up acl
	var acl=new CalemAclInfo(acl);
	return acl;
}

