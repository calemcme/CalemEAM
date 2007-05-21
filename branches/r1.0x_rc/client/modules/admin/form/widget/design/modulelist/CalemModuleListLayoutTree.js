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
 * CalemModuleListLayoutTree
 */
function CalemModuleListLayoutTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemLabelLayoutTree.call(this, parent, style, className, posStyle);
} 

CalemModuleListLayoutTree.prototype = new CalemLabelLayoutTree;
CalemModuleListLayoutTree.prototype.constructor = CalemModuleListLayoutTree;

CalemModuleListLayoutTree.prototype.toString = 
function() {
	return "CalemModuleListLayoutTree";
}

CalemModuleListLayoutTree.prototype._initTree =
function() {
	CalemLabelLayoutTree.prototype._initTree.call(this);
	
	//Creating two category nodes.
	this._root=this._createRoot();
	//Now adding stuff to different spots of the tree.
	var customInfo=this._controller.getCustomInfo(); 
	this._setupTree(customInfo);
	//Expand tree after adding nodes
	this._root.setExpanded(true);
}

CalemModuleListLayoutTree.prototype._createRoot =
function() {
	return new CalemLayoutTreeModListRoot(this);
}

/**
 * Adding layout to the tree.
 */
CalemModuleListLayoutTree.prototype._setupTree =
function(customInfo) {
	//Figuring out who is in the layout.
	var origLayout=CalemCustomModListManager.getInstance().getSysModList();
	var layout= (customInfo && customInfo.getLayout()) ? customInfo.getLayout() : origLayout;
	for (var i=0; i< layout.length; i++) {
		var mod=layout[i];
		if (!customInfo.checkAcl(mod)) continue;
		//add a module
		this._addModule(mod, CalemMsg.getMsg(mod));
	}
} 

CalemModuleListLayoutTree.prototype._addModule =
function(id, text) {
	new CalemLayoutTreeModule(this._root, null, text, id, null);
}

/**
 * Adding a control dropped on to the tree
 */
CalemModuleListLayoutTree.prototype._addObject =
function(obj) {
	this._addModule(obj.getId(), obj.getText());
	return true;
} 

/**
 * Collecting form layout info
 */
CalemModuleListLayoutTree.prototype.getModListInfo =
function() {
	var modList=new Array();
	var items=this._root.getItems();
	for (var i=0; i< items.length; i++) {
		var mod=items[i];
		modList.push(mod.getId());
	}
	return modList;
} 

