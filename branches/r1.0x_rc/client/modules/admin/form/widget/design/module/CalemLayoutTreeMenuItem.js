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
 * CalemLayoutTreeMenuItem
 */
function CalemLayoutTreeMenuItem(parent, index, text, id, info) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemMenu', id, info, true, true);
	this._calemDropAllowed=CalemConf['view_engine']['moduleViewDesign'].dropAllowed;
} 

CalemLayoutTreeMenuItem.prototype = new CalemDesignTreeItem;
CalemLayoutTreeMenuItem.prototype.constructor = CalemLayoutTreeMenuItem;

CalemLayoutTreeMenuItem.prototype.toString = 
function() {
	return "CalemLayoutTreeMenuItem";
}


//Move to its front.
CalemLayoutTreeMenuItem.prototype._onDrop =
function(srcControl, targetControl) {
	var idx=this.parent._children.indexOf(targetControl);
	new CalemLayoutTreeMenuItem(this.parent, idx, srcControl.getText(), srcControl.getId(), srcControl.getInfo());
	srcControl.removeMe();
}

//Move to its front.
CalemLayoutTreeMenuItem.prototype._addObject =
function(ctrl) {
	var idx=this.parent._children.indexOf(this);
	new CalemLayoutTreeMenuItem(this.parent, idx, ctrl.getText(), ctrl.getId(), ctrl.getInfo());
}

CalemLayoutTreeMenuItem.prototype._handleLayoutRemove =
function() {
	this._tree._handleLayoutRemove(this.getId());
}

//Label design
CalemLayoutTreeMenuItem.prototype.doLabelEdit = 
function() {
	return false;
}

CalemLayoutTreeMenuItem.prototype.getLabelId =
function() {
	return this._info.getDef().title;
}

CalemLayoutTreeMenuItem.prototype.onLabelChanged =
function() {
	this.setText(this._info.getTitle());
}


