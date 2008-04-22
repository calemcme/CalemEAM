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
 * CalemDesignTreeTable
 * This is the table node.
 */
function CalemDesignTreeTable(parent, index, text, imageInfo) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, index, text, imageInfo);
} 

CalemDesignTreeTable.prototype = new CalemDesignTreeItem;
CalemDesignTreeTable.prototype.constructor = CalemDesignTreeTable;

CalemDesignTreeTable.prototype.toString = 
function() {
	return "CalemDesignTreeTable";
}

/**
 * Add field label
 */
CalemDesignTreeTable.prototype.addFieldLabelInfo = 
function(id, info, text, required) {
	var idx=this._getIndex(text);
	var item=new CalemDesignTreeFieldLabel(this, idx, text, id, info, required);
} 

/**
 * Add field
 */
CalemDesignTreeTable.prototype.addFieldInfo = 
function(id, info, text) {
	var idx=this._getIndex(text);
	var item=new CalemDesignTreeField(this, idx, text, id, info);
} 

