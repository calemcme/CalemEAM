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
 * CalemGridLayoutTree
 * This is the tree component for Grid design.
 */
function CalemGridLayoutTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemLabelLayoutTree.call(this, parent, style, className, posStyle);
} 

CalemGridLayoutTree.prototype = new CalemLabelLayoutTree;
CalemGridLayoutTree.prototype.constructor = CalemGridLayoutTree;

CalemGridLayoutTree.prototype.toString = 
function() {
	return "CalemGridLayoutTree";
}

CalemGridLayoutTree.prototype._initTree =
function() {
	CalemLabelLayoutTree.prototype._initTree.call(this);
	
	this._modelItem=this._controller.getModelItem();
	this._tableDd=this._modelItem.getTableDd();
	//Creating five category nodes.
	this._root=new CalemLayoutTreeGridRoot(this);
	//Table node
	var text=this._tableDd.getTableName();
	this._table=new CalemDesignTreeGridTable(this._root, null, text, 'CalemTable');
	//Table extended
	text=CalemMsg.getMsg('table_extension');
	this._tableExt=new CalemDesignTreeGridTable(this._root, null, text, 'CalemTableExtesion');
	//Expand tree after adding nodes
	this._root.setExpanded(true);
	//Now adding stuff to different spots of the tree.
	var customInfo=this._controller.getCustomInfo();
	this._viewInfo=this._controller.getViewInfo();
	
	this._initGridAcl(customInfo);
}

CalemGridLayoutTree.prototype._initGridAcl =
function(customInfo) {
	var acl=customInfo.getAcl().getViewAcl()._acl;
	var fields=this._tableDd.getFields();
	for (var i in fields) {
		if (!acl[i]) { //Add label
			var item=this._tableDd.getFieldInfo(i);
			this._addFieldInfo(i, item, this._tableDd.getDesignLabel(i));
		}
	}
}

CalemGridLayoutTree.prototype._addFieldInfo =
function(id, itemInfo, lb) {
	var tb= this._tableDd.isBaseField(id) ? this._table : this._tableExt;
	tb.addFieldInfo(id, itemInfo, lb);
}

/**
* Adding a control dropped on to the tree
 */
CalemGridLayoutTree.prototype._addObject =
function(obj) {
	if (obj instanceof CalemDesignTreeField) {
		this._addFieldInfo(obj.getId(), obj.getInfo(), obj.getText());
		obj.removeMe(); //Remove it from the source tree.
	}
	this.onNodeAdded(obj.getId());
	//These types are not added to tree: CalemGridDesignColRender/CalemGridDesignRowRender
} 

/**
 * Set change callback
 */
CalemGridLayoutTree.prototype.setTreeChangeCallback =
function(callback) {
	this._changeCallback=callback;
}

CalemGridLayoutTree.prototype.setCanDragCallback =
function(callback) {
	this._canDragCallback=callback;
}  

CalemGridLayoutTree.prototype.canDragStart =
function() {
	return this._canDragCallback.run();
}

CalemGridLayoutTree.prototype._onChange =
function(nodeChange) {
	this._changeCallback.run(nodeChange);
} 

/**
 * Tree node change
 */
CalemGridLayoutTree.prototype.onNodeRemoved =
function(id) {
	this._onChange({id: id, op: CalemConst._NODE_REMOVED});
} 

CalemGridLayoutTree.prototype.onNodeAdded =
function(id) {
	this._onChange({id: id, op: CalemConst._NODE_ADDED});
}
	
 