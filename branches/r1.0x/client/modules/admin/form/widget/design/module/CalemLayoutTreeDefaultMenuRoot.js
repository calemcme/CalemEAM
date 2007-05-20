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
 * CalemLayoutTreeDefaultMenuRoot
 * This is the root node.
 */
function CalemLayoutTreeDefaultMenuRoot(parent) {
	if (arguments.length==0) return;
	var text=CalemMsg.getMsg('default_menu');
	CalemDesignTreeFormRecord.call(this, parent, text, 'CalemMenu');
	this._calemDropAllowed=CalemConf['view_engine']['moduleViewDesign'].dropAllowed;
} 

CalemLayoutTreeDefaultMenuRoot.prototype = new CalemDesignTreeFormRecord;
CalemLayoutTreeDefaultMenuRoot.prototype.constructor = CalemLayoutTreeDefaultMenuRoot;

CalemLayoutTreeDefaultMenuRoot.prototype.toString = 
function() {
	return "CalemLayoutTreeDefaultMenuRoot";
}

/**
 * It's a copy function.
 */
CalemLayoutTreeDefaultMenuRoot.prototype._onDrop =
function(srcControl, targetControl) {
	var items=this.getItems();
	if (items && items.length > 0) {//Swap current item with srcControl.
		items[0].removeMe();
	} 
	this._addObject(srcControl);
   return true;
}

//This is a menuItem
CalemLayoutTreeDefaultMenuRoot.prototype._addObject =
function(control) {
	this._addDefaultMenu(control.getInfo());
}

//This is a menuItem
CalemLayoutTreeDefaultMenuRoot.prototype._addDefaultMenu =
function(info) {
	new CalemLayoutTreeDefaultMenu(this, null, info.getTitle(), info.getId(), info);
}

//Remove default menu when its shadow menu is moved off the layout tree.
CalemLayoutTreeDefaultMenuRoot.prototype._handleLayoutRemove =
function(id) {
	var items=this.getItems();
	if (items && items.length > 0) {
		if (items[0].getId() == id) items[0].removeMe();
	}
}

CalemLayoutTreeDefaultMenuRoot.prototype.getDefaultMenu =
function() {
	var items=this.getItems();
	return (items && items.length>0) ? items[0].getId() : null;
}