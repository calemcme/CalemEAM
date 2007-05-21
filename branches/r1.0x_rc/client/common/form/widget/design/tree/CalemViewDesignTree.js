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
 * CalemViewDesignTree
 * This is the tree for view design
 * <ul>
 * <li> Record view 
 * <li> List view
 * <li> Md tab view
 * </ul>
 * Note: MdView does not need a designer.
 *       Record and List View can share most of the info.
 * 		MdTabView needs a separate structure and code base for design.
 */
function CalemViewDesignTree(parent, style, className, posStyle) {
	if (arguments.length==0) return;
	style= style || DwtTree.SINGLE_STYLE;
	className = className || 'CalemViewDesignTree';
	posStyle= posStyle || DwtControl.ABSOLUTE_STYLE;
	DwtTree.call(this, parent, style, className, posStyle);
	//Capture mouse events for drag and drop
	this._setMouseEventHdlrs(false);
} 

CalemViewDesignTree.prototype = new DwtTree;
CalemViewDesignTree.prototype.constructor = CalemViewDesignTree;

CalemViewDesignTree.prototype.toString = 
function() {
	return "CalemViewDesignTree";
}

CalemViewDesignTree.prototype.initTree =
function(info, controller, dragSrc, dropTarget) {
	this._info=info;
	this._controller=controller;
	this._dragSrc=dragSrc;
	this._dropTarget=dropTarget;
	this._initTree();
}

/**
 * Tree node change
 */
CalemViewDesignTree.prototype.onNodeRemoved =
function(id) {
	//overwrite.
} 

/**
 * Collect nodes under one root node.
 */
CalemViewDesignTree.prototype._addAcl =
function(node, acl) {
	var items=node.getItems();
	for (var i=0; i< items.length; i++) {
		acl[items[i].getId()]=CalemAclInfo.NO_ACCESS;
	}
}

