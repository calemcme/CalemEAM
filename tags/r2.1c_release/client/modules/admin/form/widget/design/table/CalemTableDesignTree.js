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
 * CalemTableDesignTree
 */
function CalemTableDesignTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemViewDesignTree.call(this, parent, style, className, posStyle);
} 

CalemTableDesignTree.prototype = new CalemViewDesignTree;
CalemTableDesignTree.prototype.constructor = CalemTableDesignTree;

CalemTableDesignTree.prototype.toString = 
function() {
	return "CalemTableDesignTree";
}

CalemTableDesignTree.prototype._initTree =
function() {
	var reg=CalemContext.getInstance().getRegistry();
	this._tableDd=reg.getTableDd(this._controller.getTableId());
	//Root is the table.
	var text=this._tableDd.getTableNameForDesign();
	this._root=new CalemDesignTreeTable(this, null, text, 'CalemTable');
	this._setupTree();
	
	//Expand tree after adding nodes
	this._root.setExpanded(true);	
}

CalemTableDesignTree.prototype._setupTree =
function() {
	var fields=this._tableDd.getBaseFields();
	for (var i in fields) {
		this._root.addFieldInfo(i, null, this._tableDd.getDesignLabel(i));
	}
}

