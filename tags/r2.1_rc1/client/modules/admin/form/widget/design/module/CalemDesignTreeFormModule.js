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
 * CalemDesignTreeFormModule
 * This is the root node.
 */
function CalemDesignTreeFormModule(parent) {
	if (arguments.length==0) return;
	var text=CalemMsg.getMsg('module_design');
	CalemDesignTreeFormRecord.call(this, parent, text, 'CalemModule');
	this._calemDropAllowed=CalemConf['view_engine']['moduleViewDesign'].dropAllowed;
} 

CalemDesignTreeFormModule.prototype = new CalemDesignTreeFormRecord;
CalemDesignTreeFormModule.prototype.constructor = CalemDesignTreeFormModule;

CalemDesignTreeFormModule.prototype.toString = 
function() {
	return "CalemDesignTreeFormModule";
}

/**
 * Handling drop from view layout to the tree.
 */
CalemDesignTreeFormModule.prototype._onDrop =
function(srcControl, targetControl) {
	if (srcControl instanceof CalemLayoutTreeMenuNode) {
		var items=srcControl.getItems();
		if (items) {//Move all items over first.
			for (var i=0; i< items.length; i++) {
				this._tree._addObject(items[i]);
			}
		}
		var btnInfo=srcControl.getInfo();
		this._tree._nodeRoot.addModNode(btnInfo.getId(), btnInfo, btnInfo.getTitle());
	} else {
		this._tree._addObject(srcControl);
	}
	srcControl.removeMe();
   return true;
}
