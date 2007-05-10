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
 * CalemDesignTreeItem
 * This is the design tree item
 */
function CalemDesignTreeItem(parent, index, text, imageInfo, id, info, dragable, dropable) {
	if (arguments.length==0) return;
	DwtTreeItem.call(this, parent, index, text, imageInfo);
	this._id=id;
	this._info=info;
	if (dragable) this.setDragSource(this._tree._dragSrc);
	if (dropable) this.setDropTarget(this._tree._dropTarget);
} 

CalemDesignTreeItem.prototype = new DwtTreeItem;
CalemDesignTreeItem.prototype.constructor = CalemDesignTreeItem;

CalemDesignTreeItem.prototype.toString = 
function() {
	return "CalemDesignTreeItem";
}

/**
 * Common functions.
 */
CalemDesignTreeItem.prototype.getId =
function() {
	return this._id;
} 
 
CalemDesignTreeItem.prototype.getInfo =
function() {
	return this._info;
} 

CalemDesignTreeItem.prototype.render =
function(parentEl) {
	//Overwrite.
}

/**
 * Dnd interfaces
 */
CalemDesignTreeItem.prototype._onDragEnter =
function(srcControl, targetControl) {
	var rtn=false;
	var allowed=this._calemDropAllowed[this.toString()]; //Use toString to get the class name.
	//It's either render or DwtTreeItem.
	var dropId= srcControl._parentRender ? srcControl._parentRender.toString() : srcControl.toString();
	rtn = (allowed && allowed[dropId]);
	return rtn;
}

/**
 * Find the index to place a text
 */
CalemDesignTreeItem.prototype._getIndex =
function(text) {
	var items=this.getItems();
	var index=items.length;
	for (var i=0; i< items.length; i++) {
		var t1=items[i].getText(); // || items[i]._textParam; //In case node is not initialized. @todo - to evaluate performance and finalize later.
		if (text <= t1) {
			index=i;
			break;
		}
	}
	return index;
}

/**
 * Remove the tree item
 */
CalemDesignTreeItem.prototype.removeMe =
function() {
	var id=this._id;
	this.dispose();
	this._tree.onNodeRemoved(id);
} 
 
