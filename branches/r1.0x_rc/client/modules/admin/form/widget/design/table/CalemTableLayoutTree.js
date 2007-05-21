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
 * CalemTableLayoutTree
 */
function CalemTableLayoutTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemViewDesignTree.call(this, parent, style, className, posStyle);
} 

CalemTableLayoutTree.prototype = new CalemViewDesignTree;
CalemTableLayoutTree.prototype.constructor = CalemTableLayoutTree;

CalemTableLayoutTree.prototype.toString = 
function() {
	return "CalemTableLayoutTree";
}

CalemTableLayoutTree.prototype._initTree =
function() {
	var reg=CalemContext.getInstance().getRegistry();
	this._tableDd=reg.getTableDd(this._controller.getTableId());
	//Root is the table.
	var text=this._tableDd.getTableNameForDesign();
	this._root=new CalemLayoutTreeTableCustom(this);
	this._setupTree();
		
	//Add a selection listener
	this.addSelectionListener(new AjxListener(this, this.onTreeSelection));
}

CalemTableLayoutTree.prototype.reRenderView =
function() {
	//Remove all nodes concerned.
	var items=this._root.getItems();
	if (items) {
		var ar=[];
		for (var i=0; i< items.length; i++) {
			ar.push(items[i]);
		}
		for (var i=0; i< ar.length; i++) {
			ar[i].dispose(); 
		}
	}
	//redo tree setup.
	this._setupTree();
}

CalemTableLayoutTree.prototype._setupTree =
function() {
	var fields=this._tableDd.getCustomFields();
	if (fields) {
		for (var i in fields) {
			this._root.addFieldInfo(i, null, this._tableDd.getDesignLabel(i));
		}
	}
	//Expand tree after adding nodes
	this._root.setExpanded(true);
}

CalemTableLayoutTree.prototype.onTreeSelection =
function(evt) {
	if (evt.detail != DwtTree.ITEM_ACTIONED) return;
	var item=evt.items[0];
	if (!item.onOptionMenu) return;
	item.onOptionMenu();
}
