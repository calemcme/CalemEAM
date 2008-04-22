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
 * CalemRecordDesignTree
 * This is the tree component for record design.
 */
function CalemRecordDesignTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemViewDesignTree.call(this, parent, style, className, posStyle);
} 

CalemRecordDesignTree.prototype = new CalemViewDesignTree;
CalemRecordDesignTree.prototype.constructor = CalemRecordDesignTree;

CalemRecordDesignTree.prototype.toString = 
function() {
	return "CalemRecordDesignTree";
}

CalemRecordDesignTree.prototype._initTree =
function() {
	this._modelItem=this._controller.getModelItem();
	this._tableDd=this._modelItem.getTableDd();
	//Creating five category nodes.
	this._root=this._createRoot();
	//Empty row node
	this._blankRow=new CalemDesignTreeRow(this._root);
	//Toolbar node
	this._toolbar=new CalemDesignTreeToolBar(this._root);
	//Table node
	var text=this._tableDd.getTableName();
	this._table=new CalemDesignTreeTable(this._root, null, text, 'CalemTable');
	//Table extended
	text=CalemMsg.getMsg('table_extension');
	this._tableExt=new CalemDesignTreeTable(this._root, null, text, 'CalemTableExtesion');
	//Labels
	this._labelRoot=new CalemDesignTreeLabelRoot(this._root);
	//Expand tree after adding nodes
	this._root.setExpanded(true);
	//Now adding stuff to different spots of the tree.
	var parentCustomInfo=this._controller.getParentCustomInfo(); //Get parent's customInfo
	var myCustomInfo=this._controller.getMyCustomInfo();
	this._viewInfo=this._controller.getViewInfo();
	
	this._initTbAcl(parentCustomInfo, myCustomInfo);
	this._initViewAcl(parentCustomInfo, myCustomInfo);
}

CalemRecordDesignTree.prototype._createRoot =
function() {
	return new CalemDesignTreeFormRecord(this);
}

/**
 * Add ACL info to tree
 * a) the item is in parent acl, do not add it. 
 * b) the item is in my layout, do not add it.
 * c) the item is not in the original layout, do not add it.
 * d) add item to the tree.
 */
CalemRecordDesignTree.prototype._initTbAcl =
function(parentCustomInfo, myCustomInfo) {
	//Get parent acl
	var parentAcl=parentCustomInfo.getAcl().getTbAcl()._acl;
	var myAcl=myCustomInfo.getAcl().getTbAcl()._acl;
	
	var myLayout=myCustomInfo.getLayout() ? myCustomInfo.getLayout().getTbLayout() : null;
	var myLayoutMap=CalemViewUtil.getMapByList(myLayout);
	
	var origLayout=this._viewInfo.getItem('toolbar').getLayout();
	var origLayoutMap=CalemViewUtil.getMapByList(origLayout);
	
	//Now go through the original list
	var tb=this._viewInfo.getItem('toolbar');
	var list=tb.getList();
	for (var i=0; i < list.length; i++) {
		var item=list[i];
		var id=item.getId();
		if (parentAcl[id]) continue; //Hidden by parent groups
		if ((myLayout!=null && myLayoutMap[id]) || (myLayout==null && origLayoutMap[id]) ) continue; //It's in my layout.
		
		//Only button type
		if (item instanceof CalemButtonInfo) {
			this._toolbar.addButton(item.getId(), item, item.getTitle(), item.getIcon());
		}
	}	
} 

CalemRecordDesignTree.prototype._initViewAcl =
function(parentCustomInfo, myCustomInfo) {
	var parentAcl=parentCustomInfo.getAcl().getViewAcl()._acl;
	var myAcl=myCustomInfo.getAcl().getViewAcl()._acl;
	
	var myRows=myCustomInfo.getLayout() ? myCustomInfo.getLayout().getViewLayout() : null;
	var myRowMap=CalemViewUtil.getMapByRows(myRows);
	
	var origRows=this._viewInfo.getLayout().getRows();
	var origRowMap=CalemViewUtil.getMapByRows(origRows);
	
	//Going through the original stuff
	for (var i in origRowMap) {
		if (parentAcl[i]) continue; //parent groups hide it.
		if ((myRows!=null && myRowMap[i]) || myRows==null) continue;
	
		//Otherwise add to tree.
		var item=CalemViewUtil.getItemInfo(i, this._viewInfo, this._tableDd);
		if (item instanceof CalemLabelInfo) {
			this._labelRoot.addLabelInfo(i, item, item.getLabel());
		} else if (item instanceof CalemFieldLabelInfo) {
			if (this._tableDd.isField(item.getField())) {//Check for field existence
				this._addFieldLabelInfo(i, item, this._tableDd.getDesignLabel(item.getField()), item.getField());
			}
		} else if (item instanceof CalemFieldInfo) {
			if (this._tableDd.isField(item.getField())) {//Check for field existence
				this._addFieldInfo(i, item, this._tableDd.getDesignLabel(i));
			}
		}
	}
	this._initDataItems(parentAcl, myAcl, myRowMap, myCustomInfo);
} 

/**
 * Figure out how to place fields/field labels.
 */
CalemRecordDesignTree.prototype._initDataItems =
function(parentAcl, myAcl, myRowMap, myCustomInfo) {
	//Going through data items
	var fields=this._tableDd.getFields();
	for (var i in fields) {
		var lb=CalemViewUtil.getFieldLabel(i);
		if (!parentAcl[lb] && !myRowMap[lb]) { //Add label
			var item=this._tableDd.getFieldLabelInfo(i);
			this._addFieldLabelInfo(lb, item, this._tableDd.getDesignLabel(i), i);
		}
		if (!parentAcl[i] && !myRowMap[i]) { //Add field.
			var item=this._tableDd.getFieldInfo(i);
			this._addFieldInfo(i, item, this._tableDd.getDesignLabel(i));
		}
	}
}

CalemRecordDesignTree.prototype._addFieldInfo =
function(id, itemInfo, lb) {
	var tb= this._tableDd.isBaseField(id) ? this._table : this._tableExt;
	tb.addFieldInfo(id, itemInfo, lb);
}

CalemRecordDesignTree.prototype._addFieldLabelInfo =
function(id, itemInfo, lb, fld) {
	var tb= this._tableDd.isBaseField(fld) ? this._table : this._tableExt;
	var required=this._tableDd.isRequired(fld);
	tb.addFieldLabelInfo(id, itemInfo, lb, required);
}

/**
* Adding a control dropped on to the tree
 */
CalemRecordDesignTree.prototype._addObject =
function(obj) {
	var render=obj._parentRender;
	var item;
	var text;
	if (render instanceof CalemLabelDesignRender) {
		text=obj.getText();
		this._labelRoot.addLabelInfo(render.getId(), render.getInfo(), obj.getText());
	} else if (render instanceof CalemFieldLabelDesignRender) {
		this._addFieldLabelInfo(render.getId(), render.getInfo(), obj.getText(), render._field);
	} else if (render instanceof CalemFieldDesignRender || render instanceof CalemTextDesignRender) {
		this._addFieldInfo(render.getId(), render.getInfo(), obj.getText());
	} else if (render instanceof CalemTbDesignButtonRender) {
		this._toolbar.addButton(render.getId(), render.getInfo(), obj.getText(), obj.getImage());
	}
	//These types are not added to tree: CalemRecordDesignColRender/CalemRecordDesignRowRender
} 

/**
 * Collect Acl info here.
 * For record:
 * - toolbar acl
 * - base field/field label
 * - extended field/field label
 * - label acl
 * The last three types are lumped into one.
 */
CalemRecordDesignTree.prototype.getAclInfo =
function() {
	var tbAcl=new Object();
	var viewAcl=new Object();
	this._addAcl(this._toolbar, tbAcl);
	this._addAcl(this._table, viewAcl);
	this._addAcl(this._tableExt, viewAcl);
	this._addAcl(this._labelRoot, viewAcl);
	//Set up acl
	var acl=new CalemViewAclInfo(new CalemAclInfo(tbAcl), new CalemAclInfo(viewAcl));
	return acl;
}

