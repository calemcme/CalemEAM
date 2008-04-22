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
 * CalemLayoutTreeLayoutRoot
 */
function CalemLayoutTreeLayoutRoot(parent) {
	if (arguments.length==0) return;
	var text=CalemMsg.getMsg('module_layout');
	CalemDesignTreeFormRecord.call(this, parent, text, 'CalemLayout');
	this._calemDropAllowed=CalemConf['view_engine']['moduleViewDesign'].dropAllowed;
} 

CalemLayoutTreeLayoutRoot.prototype = new CalemDesignTreeFormRecord;
CalemLayoutTreeLayoutRoot.prototype.constructor = CalemLayoutTreeLayoutRoot;

CalemLayoutTreeLayoutRoot.prototype.toString = 
function() {
	return "CalemLayoutTreeLayoutRoot";
}


//Move to its front.
CalemLayoutTreeLayoutRoot.prototype._onDrop =
function(srcControl, targetControl) {
	if (srcControl instanceof CalemDesignTreeMenuNode) {//It's a node
		this._addModMenuNode(srcControl.getInfo());
	} else {//It's a menu item
		this._addModMenuItem(srcControl.getInfo());
	}
	srcControl.removeMe();
	return true;
}

CalemLayoutTreeLayoutRoot.prototype._addModMenuNode =
function(info) {
	return new CalemLayoutTreeMenuNode(this, null, info.getTitle(), info.getId(), info);
}

CalemLayoutTreeLayoutRoot.prototype._addModMenuItem =
function(info, parent) {
	parent = parent ? parent : this;
	return new CalemLayoutTreeMenuItem(parent, null, info.getTitle(), info.getId(), info);
}

CalemLayoutTreeLayoutRoot.prototype._addModLabel =
function(info) {
	return new CalemLayoutTreeLabel(this, null, info.getLabel(), info.getId(), info);
}

CalemLayoutTreeLayoutRoot.prototype._addModSeparator =
function(info) {
	return new CalemLayoutTreeSeparator(this, null, info.getTitle(), info.getId(), info);
}

