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
 * CalemLayoutTreeTab
 * This is the tab item.
 */
function CalemLayoutTreeTab(parent, index, text, id, info) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemFormTab', id, info, true, true);
	this._calemDropAllowed=CalemConf['view_engine']['viewMdTabDesign'].dropAllowed;
} 

CalemLayoutTreeTab.prototype = new CalemDesignTreeItem;
CalemLayoutTreeTab.prototype.constructor = CalemLayoutTreeTab;

CalemLayoutTreeTab.prototype.toString = 
function() {
	return "CalemLayoutTreeTab";
}

CalemLayoutTreeTab.prototype._onDrop =
function(srcControl, targetControl) {
	return this._tree._addObject(this, srcControl);
}

//Label design
CalemLayoutTreeTab.prototype.doLabelEdit = 
function() {
	return false;
}

CalemLayoutTreeTab.prototype.getLabelId =
function() {
	return this._info.getId();
}

CalemLayoutTreeTab.prototype.onLabelChanged =
function() {
	this.setText(this._info.getLabel());
}


