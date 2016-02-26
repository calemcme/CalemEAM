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
 * CalemLayoutTreeModListRoot
 * This is the root node.
 */
function CalemLayoutTreeModListRoot(parent) {
	if (arguments.length==0) return;
	var text=CalemMsg.getMsg('module_design');
	CalemDesignTreeFormRecord.call(this, parent, text, 'CalemAclDesign');
	this._calemDropAllowed=CalemConf['view_engine']['moduleViewListDesign'].dropAllowed;
} 

CalemLayoutTreeModListRoot.prototype = new CalemDesignTreeFormRecord;
CalemLayoutTreeModListRoot.prototype.constructor = CalemLayoutTreeModListRoot;

CalemLayoutTreeModListRoot.prototype.toString = 
function() {
	return "CalemLayoutTreeModListRoot";
}

/**
 * Handling drop from view layout to the tree.
 */
CalemLayoutTreeModListRoot.prototype._onDrop =
function(srcControl, targetControl) {
	this._tree._addObject(srcControl);
	srcControl.removeMe();
   return true;
}
