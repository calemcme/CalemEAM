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
 * CalemMdTabDesignTree
 * This is the tree component for mdtab design.
 */
function CalemMdTabDesignTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemViewDesignTree.call(this, parent, style, className, posStyle);
} 

CalemMdTabDesignTree.prototype = new CalemViewDesignTree;
CalemMdTabDesignTree.prototype.constructor = CalemMdTabDesignTree;

CalemMdTabDesignTree.prototype.toString = 
function() {
	return "CalemMdTabDesignTree";
}

CalemMdTabDesignTree.prototype._initTree =
function() {
	//Creating two category nodes.
	this._root=this._createRoot();
	//TabRoot node
	this._tabRoot=new CalemDesignTreeTabRoot(this._root);
	//FormRoot node
	this._formRoot=new CalemDesignTreeFormRoot(this._root);
	//Expand tree after adding nodes
	this._root.setExpanded(true);
	//Now adding stuff to different spots of the tree.
	var parentCustomInfo=this._controller.getParentCustomInfo(); //Get parent's customInfo
	var myCustomInfo=this._controller.getMyCustomInfo();
	this._formInfo=this._controller.getFormInfo();
	this._initAcl(parentCustomInfo, myCustomInfo);
}

CalemMdTabDesignTree.prototype._createRoot =
function() {
	return new CalemDesignTreeFormMdTab(this);
}

/**
 * Add ACL info to tree
 * a) the item is in parent acl, do not add it. 
 * b) the item is in the layout, do not add it.
 */
CalemMdTabDesignTree.prototype._initAcl =
function(parentCustomInfo, myCustomInfo) {
	//Figuring out who is in the layout.
	var layout= (myCustomInfo && myCustomInfo.getLayout()) ? myCustomInfo.getLayout() : this._formInfo.getLayout();
	var tabMap=new Object();
	var formMap=new Object();
	var tabList=layout.getTabList();
	for (var i=0; i< tabList.length; i++) {
		tabMap[tabList[i]]=true;
		//consider special tab.
		if (CalemViewUtil.isCustomizeTab(tabList[i])) continue;
		//Add forms to the map.
		var fmList=layout.getTabItem(tabList[i]).getLayout();
		for (var j=0; j< fmList.length; j++) {
			var fmId=fmList[j];
			formMap[fmId]=this._formInfo.getItem(fmId);
		}
	}
	//Now going through the original item list.
	var map=this._formInfo.getItemMap().getMap();
	for (var i in map) {
		var item=map[i];
		if (item instanceof CalemTabInfo) {//it's tab
			if (tabMap[i] || !parentCustomInfo.checkTabAcl(i)) continue;
			this._addTab(i, item);
		} else if (item instanceof CalemFormLayoutInfo) {
			if (formMap[i] || !parentCustomInfo.checkFormAcl(i)) continue;
			this._addForm(i, item)
		} else {
			//unknown item
			if (CalemDebug.isInfo()) {
				CalemDebug.info("CalemMdTabDesignTree: unknown item: "+i+", type="+item);
			}	
		}
	}
} 

CalemMdTabDesignTree.prototype._addTab =
function(id, itemInfo) {
	if (CalemViewUtil.isCustomizeTab(id)) {
		this._tabRoot.addCustomizeTabInfo(id, itemInfo, itemInfo.getLabel());
	} else {
		this._tabRoot.addTabInfo(id, itemInfo, itemInfo.getLabel());
	}
}

CalemMdTabDesignTree.prototype._addForm =
function(id, itemInfo, text) {
    text = text || CalemFormInfo.getFormDesignText(id);
	this._formRoot.addFormInfo(id, text, itemInfo);
}

/**
* Adding a control dropped on to the tree
 */
CalemMdTabDesignTree.prototype._addObject =
function(obj) {
	if (obj instanceof CalemLayoutTreeForm) {
		this._addForm(obj.getId(), obj.getInfo(), obj.getText());
	} else if (obj instanceof CalemLayoutTreeTab) {
		this._addTab(obj.getId(), obj.getInfo());
		this._addItems(obj);
	} else if (obj instanceof CalemLayoutTreeTabCustomize ) {
		this._addTab(obj.getId(), obj.getInfo());
	} 
} 

CalemMdTabDesignTree.prototype._addItems =
function(root) {
	var items=root.getItems();
	for (var i=0; i< items.length; i++) {
		this._addObject(items[i]);
	}
}

/**
 * Collect Acl info here.
 */
CalemMdTabDesignTree.prototype.getAclInfo =
function() {
	var tabAcl=new Object();
	var formAcl=new Object();
	this._addAcl(this._tabRoot, tabAcl);
	this._addAcl(this._formRoot, formAcl);
	//Set up acl
	var acl=new CalemFormAclInfo(new CalemAclInfo(tabAcl), new CalemAclInfo(formAcl));
	return acl;
}

