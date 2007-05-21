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
 * CalemDesignTreeFormRecord
 * This is the root node.
 */
function CalemDesignTreeFormList(parent) {
	if (arguments.length==0) return;
	CalemDesignTreeFormRecord.call(this, parent);
	this._calemDropAllowed=CalemConf['view_engine']['viewListDesign'].dropAllowed;
} 

CalemDesignTreeFormList.prototype = new CalemDesignTreeFormRecord;
CalemDesignTreeFormList.prototype.constructor = CalemDesignTreeFormList;

CalemDesignTreeFormList.prototype.toString = 
function() {
	return "CalemDesignTreeFormList";
}

/**
 * Dnd interfaces
 */
CalemDesignTreeFormList.prototype._onDragEnter =
function(srcControl, targetControl) {
	return (srcControl instanceof CalemLayoutTreeGridField
	      || srcControl instanceof CalemTbButtonDesign);
}

/**
 * Handling drop from view layout to the tree.
 */
CalemDesignTreeFormList.prototype._onDrop =
function(srcControl, targetControl) {
	this._tree._addObject(srcControl);
   return true;
}
