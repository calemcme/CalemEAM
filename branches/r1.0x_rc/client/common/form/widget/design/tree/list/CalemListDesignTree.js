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
 * CalemListDesignTree
 * This is the tree component for List design.
 */
function CalemListDesignTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	CalemRecordDesignTree.call(this, parent, style, className, posStyle);
} 

CalemListDesignTree.prototype = new CalemRecordDesignTree;
CalemListDesignTree.prototype.constructor = CalemListDesignTree;

CalemListDesignTree.prototype.toString = 
function() {
	return "CalemListDesignTree";
}

//Use a special root node.
CalemListDesignTree.prototype._createRoot =
function() {
	return new CalemDesignTreeFormList(this);
}

/**
 * Figure out how to place fields/field labels.
 * Only fields in myAcl should be added to the tree.
 */
CalemListDesignTree.prototype._initDataItems =
function(parentAcl, myAcl, myRowMap, myCustomInfo) {	
	//Going through data items
	var fields=this._tableDd.getFields();
	for (var i in fields) {
		if (!parentAcl[i] && myAcl[i]) { //Add field.
			var item=this._tableDd.getFieldInfo(i);
			this._addFieldInfo(i, item, this._tableDd.getDesignLabel(i));
		}
	}
}

/**
* Handle field dropped from grid tree only.
 */
CalemListDesignTree.prototype._addObject =
function(obj) {
	if (obj instanceof CalemLayoutTreeGridField) {
		this._addFieldInfo(obj.getId(), obj.getInfo(), obj.getText());
		obj.removeMe();
	} else {
		CalemRecordDesignTree.prototype._addObject.call(this, obj);
		obj._parentRender.replaceWithDesignCol(obj);
	}
} 
