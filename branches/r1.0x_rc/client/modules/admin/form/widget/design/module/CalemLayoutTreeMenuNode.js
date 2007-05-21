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
 * CalemLayoutTreeMenuNode
 */
function CalemLayoutTreeMenuNode(parent, index, text, id, info) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemFolder', id, info, true, true);
	this._calemDropAllowed=CalemConf['view_engine']['moduleViewDesign'].dropAllowed;
} 

CalemLayoutTreeMenuNode.prototype = new CalemDesignTreeItem;
CalemLayoutTreeMenuNode.prototype.constructor = CalemLayoutTreeMenuNode;

CalemLayoutTreeMenuNode.prototype.toString = 
function() {
	return "CalemLayoutTreeMenuNode";
}


//Move to its front.
CalemLayoutTreeMenuNode.prototype._onDrop =
function(srcControl, targetControl) {
	if (srcControl instanceof CalemLayoutTreeMenuNode) {//It's a node
		var idx=this.parent._children.indexOf(targetControl);
		new CalemLayoutTreeMenuNode(this.parent, idx, srcControl.getText(), srcControl.getId(), srcControl.getInfo());
	} else {//It's a menu item
		new CalemLayoutTreeMenuItem(this, null, srcControl.getText(), srcControl.getId(), srcControl.getInfo());
	}
	srcControl.removeMe();
	return true;
}

CalemLayoutTreeMenuNode.prototype.getModNodeInfo =
function() {
	var btnInfo=this.getInfo();
	var items=this.getItems();
	var menuList = [];
	if (items) {
		for (var i=0; i< items.length; i++) {
			menuList.push(items[i].getInfo());
		}
	}
	return new CalemMenuInfo(btnInfo, menuList);
}

//Label design
CalemLayoutTreeMenuNode.prototype.doLabelEdit = 
function() {
	return false;
}

CalemLayoutTreeMenuNode.prototype.getLabelId =
function() {
	return this._info.getDef().title;
}

CalemLayoutTreeMenuNode.prototype.onLabelChanged =
function() {
	this.setText(this._info.getTitle());
}

