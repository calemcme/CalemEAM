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
 * CalemLayoutTreeGridField
 * This is the field item.
 */
function CalemLayoutTreeGridField(parent, index, text, id, info) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemTreeField', id, info, true);
} 

CalemLayoutTreeGridField.prototype = new CalemDesignTreeItem;
CalemLayoutTreeGridField.prototype.constructor = CalemLayoutTreeGridField;

CalemLayoutTreeGridField.prototype.toString = 
function() {
	return "CalemLayoutTreeGridField";
}

CalemLayoutTreeGridField.prototype._onDragStart = 
function() {
	return this._tree.canDragStart(this._id);
}

//Label design
CalemLayoutTreeGridField.prototype.doLabelEdit = 
function() {
	return false;
}

CalemLayoutTreeGridField.prototype.getLabelId =
function() {
	return this._id;
}

CalemLayoutTreeGridField.prototype.onLabelChanged =
function() {
	var dd=this._tree._controller.getModelItem().getTableDd();
	this.setText(dd.getDesignLabel(this._id));
}