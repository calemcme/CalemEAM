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
 * CalemLayoutTreeCol
 * This is the tab item.
 */
function CalemLayoutTreeCol(parent, index, text, id, info, idx) {
	if (arguments.length==0) return;
	text=[CalemMsg.getMsg('peer_tab_col'), ' ', idx].join('');
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemFormCol', id, info, false, true);
	this._calemDropAllowed=CalemConf['view_engine']['viewPeerTabDesign'].dropAllowed;
} 

CalemLayoutTreeCol.prototype = new CalemDesignTreeItem;
CalemLayoutTreeCol.prototype.constructor = CalemLayoutTreeCol;

CalemLayoutTreeCol.prototype.toString = 
function() {
	return "CalemLayoutTreeCol";
}

CalemLayoutTreeCol.prototype._onDrop =
function(srcControl, targetControl) { //Must handle it here.
	if (srcControl instanceof CalemLayoutTreeForm || srcControl instanceof CalemDesignTreeForm ) {
		new CalemLayoutTreeForm(this, null, srcControl.getText(), srcControl.getId(), srcControl.getInfo());
		srcControl.removeMe();
	}
	return true;
}

//Label design
CalemLayoutTreeCol.prototype.doLabelEdit = 
function() {
	return false;
}

CalemLayoutTreeCol.prototype.getLabelId =
function() {
	return this._info.getId();
}

CalemLayoutTreeCol.prototype.onLabelChanged =
function() {
	this.setText(this._info.getLabel());
}


