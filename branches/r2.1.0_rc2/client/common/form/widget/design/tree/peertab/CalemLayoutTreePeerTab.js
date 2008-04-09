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
 * CalemLayoutTreePeerTab
 * This is the tab item.
 */
function CalemLayoutTreePeerTab(parent, index, text, id, info) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemFormTab', id, info, true, false);
	this._calemDropAllowed=CalemConf['view_engine']['viewPeerTabDesign'].dropAllowed;
	this._createCols();
} 

CalemLayoutTreePeerTab.prototype = new CalemDesignTreeItem;
CalemLayoutTreePeerTab.prototype.constructor = CalemLayoutTreePeerTab;

CalemLayoutTreePeerTab.prototype.toString = 
function() {
	return "CalemLayoutTreePeerTab";
}

CalemLayoutTreePeerTab.prototype._onDrop =
function(srcControl, targetControl) {
	return this._tree._addObject(this, srcControl);
}

//Label design
CalemLayoutTreePeerTab.prototype.doLabelEdit = 
function() {
	return false;
}

CalemLayoutTreePeerTab.prototype.getLabelId =
function() {
	return this._info.getId();
}

CalemLayoutTreePeerTab.prototype.onLabelChanged =
function() {
	this.setText(this._info.getLabel());
}

CalemLayoutTreePeerTab.prototype._createCols =
function() {
	this._cols=new Array();
	var cnt=this._info.getColCount();
	for (var i=0; i< cnt; i++) {
		var col=new CalemLayoutTreeCol(this, null, null, [this._id, '_', i].join(''), null, i);
		this._cols.push(col);
	}
} 

CalemLayoutTreePeerTab.prototype.getCol =
function(i) {	
	return this._cols[i];
} 

