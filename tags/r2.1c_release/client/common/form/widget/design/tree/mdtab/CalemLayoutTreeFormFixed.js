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
 * CalemLayoutTreeFormFixed
 * This is the form item.
 */
function CalemLayoutTreeFormFixed(parent, index, text, id, info) {
	if (arguments.length==0) return;
	text=this._getFixedText(text);
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemForm', id, info, false);
} 

CalemLayoutTreeFormFixed.prototype = new CalemDesignTreeItem;
CalemLayoutTreeFormFixed.prototype.constructor = CalemLayoutTreeFormFixed;

CalemLayoutTreeFormFixed.prototype.toString = 
function() {
	return "CalemLayoutTreeFormFixed";
}

//Label design
CalemLayoutTreeFormFixed.prototype.doLabelEdit = 
function() {
	return false;
}

CalemLayoutTreeFormFixed.prototype.getLabelId =
function() {
	return CalemFormInfo.getFormInfo(this._id).getTitle();
}

CalemLayoutTreeFormFixed.prototype.onLabelChanged =
function() {
	var text=this._getFixedText(CalemFormInfo.getFormDesignText(this._id)); 
	this.setText(text);
}

CalemLayoutTreeFormFixed.prototype._getFixedText =
function(text) {
	return [text, ' ', CalemMsg.getMsg('fixed')].join('');
}


