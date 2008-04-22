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
 * CalemLayoutTreeModule
 */
function CalemLayoutTreeModule(parent, index, text, id, info) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemModule', id, info, true, true);
	this._calemDropAllowed=CalemConf['view_engine']['moduleViewListDesign'].dropAllowed;
} 

CalemLayoutTreeModule.prototype = new CalemDesignTreeItem;
CalemLayoutTreeModule.prototype.constructor = CalemLayoutTreeModule;

CalemLayoutTreeModule.prototype.toString = 
function() {
	return "CalemLayoutTreeModule";
}

CalemLayoutTreeModule.prototype._onDrop =
function(srcControl, targetControl) {
	var idx=this.parent._children.indexOf(targetControl);
	new CalemLayoutTreeModule(this.parent, idx, srcControl.getText(), srcControl.getId(), srcControl.getInfo());
	srcControl.removeMe();
}

//Label design
CalemLayoutTreeModule.prototype.doLabelEdit = 
function() {
	return false;
}

CalemLayoutTreeModule.prototype.getLabelId =
function() {
	return this._id;
}

CalemLayoutTreeModule.prototype.onLabelChanged =
function() {
	this.setText(CalemMsg.getMsg(this._id));
}

