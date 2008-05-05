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
 * CalemDesignTreeToolBar
 * This is the toolbar node.
 */
function CalemDesignTreeToolBar(parent, index, text, imageInfo) {
	if (arguments.length==0) return;
	var text=CalemMsg.getMsg('toolbar');
	CalemDesignTreeItem.call(this, parent, null, text, 'CalemToolbar', false);
} 

CalemDesignTreeToolBar.prototype = new CalemDesignTreeItem;
CalemDesignTreeToolBar.prototype.constructor = CalemDesignTreeToolBar;

CalemDesignTreeToolBar.prototype.toString = 
function() {
	return "CalemDesignTreeToolBar";
}

/**
 * Add field
 */
CalemDesignTreeToolBar.prototype.addButton = 
function(id, info, text, image) {
	var idx=this._getIndex(text);
	var item=new CalemDesignTreeButton(this, idx, text, image, id, info);
} 

