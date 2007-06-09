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
 * CalemLayoutTreeFormMdTab
 * This is the root node.
 */
function CalemLayoutTreeFormMdTab(parent) {
	if (arguments.length==0) return;
	CalemDesignTreeFormRecord.call(this, parent);
	this._calemDropAllowed=CalemConf['view_engine']['viewMdTabDesign'].dropAllowed;
} 

CalemLayoutTreeFormMdTab.prototype = new CalemDesignTreeFormRecord;
CalemLayoutTreeFormMdTab.prototype.constructor = CalemLayoutTreeFormMdTab;

CalemLayoutTreeFormMdTab.prototype.toString = 
function() {
	return "CalemLayoutTreeFormMdTab";
}

/**
 * Handling drop from view layout to the tree.
 */
CalemLayoutTreeFormMdTab.prototype._onDrop =
function(srcControl, targetControl) {
	if (srcControl instanceof CalemDesignTreeTab) {
		this.addTab(srcControl.getId(), srcControl.getInfo(), srcControl.getText());
		srcControl.removeMe();
	} else if (srcControl instanceof CalemDesignTreeTabCustomize) {
		this.addTabCustomize(srcControl.getId(), srcControl.getInfo(), srcControl.getText());
		srcControl.removeMe();
	}
   return true;
}

/**
 * Tab adding functions
 */
CalemLayoutTreeFormMdTab.prototype.addTabCustomize =
function(id, info, text) {
	var item=new CalemLayoutTreeTabCustomize(this, null, text, id, info);
	return item;
} 


CalemLayoutTreeFormMdTab.prototype.addTabFixed =
function(id, info, text) {
	var item=new CalemLayoutTreeTabFixed(this, null, text, id, info);
	return item;
} 

CalemLayoutTreeFormMdTab.prototype.addTab =
function(id, info, text) {
	var item=new CalemLayoutTreeTab(this, null, text, id, info);
	return item;
} 