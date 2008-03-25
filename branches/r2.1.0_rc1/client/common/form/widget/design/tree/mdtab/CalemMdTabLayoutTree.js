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
 * CalemMdTabLayoutTree
 * This is the tree component for mdtab design.
 */
function CalemMdTabLayoutTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemLabelLayoutTree.call(this, parent, style, className, posStyle);
} 

CalemMdTabLayoutTree.prototype = new CalemLabelLayoutTree;
CalemMdTabLayoutTree.prototype.constructor = CalemMdTabLayoutTree;

CalemMdTabLayoutTree.prototype.toString = 
function() {
	return "CalemMdTabLayoutTree";
}

CalemMdTabLayoutTree.prototype._initTree =
function() {
	CalemLabelLayoutTree.prototype._initTree.call(this);
	
	//Creating two category nodes.
	this._root=this._createRoot();
	//Now adding stuff to different spots of the tree.
	var customInfo=this._controller.getCustomInfo();
	this._formInfo=this._controller.getFormInfo();
	this._setupTree(customInfo);
	//Expand tree after adding nodes
	this._root.setExpanded(true);
}

CalemMdTabLayoutTree.prototype.getFormInfo =
function() {
	return this._formInfo;
}

CalemMdTabLayoutTree.prototype._createRoot =
function() {
	return new CalemLayoutTreeFormMdTab(this);
}

/**
 * Adding layout to the tree.
 */
CalemMdTabLayoutTree.prototype._setupTree =
function(customInfo) {
	//Figuring out who is in the layout.
	var layout= (customInfo && customInfo.getLayout()) ? customInfo.getLayout() : this._formInfo.getLayout();
	var tabList=layout.getTabList();
	for (var i=0; i< tabList.length; i++) {
		if (!customInfo.checkTabAcl(tabList[i])) continue;
		var tab=this._addTab(tabList[i]);
		//consider special ab.
		if (CalemViewUtil.isCustomizeTab(tabList[i])) continue;
		//Add forms to the map.
		var fmList=layout.getTabItem(tabList[i]).getLayout();		
		for (var j=0; j< fmList.length; j++) {
			var fmInfo=this._formInfo.getItem(fmList[j]);
			if (!customInfo.checkFormAcl([fmInfo])) continue;
			this._addForm(tab, fmInfo.getId(), fmInfo);
		}
	}
} 

CalemMdTabLayoutTree.prototype._addTab =
function(id) {
	var itemInfo=this._formInfo.getItem(id);
	if (CalemViewUtil.isCustomizeTab(id)) {
		return this._root.addTabCustomize(id, itemInfo, itemInfo.getLabel());
	} else if (itemInfo.getFixed()){ //Fixed tab
		return this._root.addTabFixed(id, itemInfo, itemInfo.getLabel());
	} else {
		return this._root.addTab(id, itemInfo, itemInfo.getLabel());
	}
}

CalemMdTabLayoutTree.prototype._addForm =
function(tab, id, item, text) {
	text = text || CalemFormInfo.getFormDesignText(id);
	if (item.getFixed()) {
		new CalemLayoutTreeFormFixed(tab, null, text, id, item);
	} else {
		new CalemLayoutTreeForm(tab, null, text, id, item);
	}
}

/**
* Adding a control dropped on to the tree
 */
CalemMdTabLayoutTree.prototype._addObject =
function(root, obj) {
	if (obj instanceof CalemLayoutTreeForm || obj instanceof CalemDesignTreeForm ) {
		this._addForm(root, obj.getId(), obj.getInfo(), obj.getText());
		obj.removeMe();
	}
	return true;
} 

/**
 * Collecting form layout info
 */
CalemMdTabLayoutTree.prototype.getFormLayoutInfo =
function() {
	var tabList=new Array();
	var tabMap=new Object();
	var items=this._root.getItems();
	for (var i=0; i< items.length; i++) {
		var tab=items[i];
		tabList.push(tab.getId());
		if (CalemViewUtil.isCustomizeTab(tab.getId())) continue;
		var fms=tab.getItems();
		var layout=new Array();
		for (j=0; j< fms.length; j++) {
			layout.push(fms[j].getInfo().getId());
		}
		//Now construct one item
		var item=new CalemTabLayoutInfo(layout);
		tabMap[tab.getId()]=item;
	}
	var fmInfo=new CalemMdTabLayoutInfo(tabList, tabMap);
	return fmInfo;
} 

