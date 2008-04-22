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
 * CalemDesignTreeTabRoot
 * This is the design tree row item.
 */
function CalemDesignTreeTabRoot(parent) {
	if (arguments.length==0) return;
	var text=CalemMsg.getMsg('form_tab');
	CalemDesignTreeItem.call(this, parent, null, text, 'CalemFormTab'); //No defer.
} 

CalemDesignTreeTabRoot.prototype = new CalemDesignTreeItem;
CalemDesignTreeTabRoot.prototype.constructor = CalemDesignTreeTabRoot;

CalemDesignTreeTabRoot.prototype.toString = 
function() {
	return "CalemDesignTreeTabRoot";
}

CalemDesignTreeTabRoot.prototype.addTabInfo =
function(id, info, text) {
	var idx=this._getIndex(text);
	var item=new CalemDesignTreeTab(this, idx, text, id, info);	
}

CalemDesignTreeTabRoot.prototype.addCustomizeTabInfo =
function(id, info, text) {
	var idx=this._getIndex(text);
	var item=new CalemDesignTreeTabCustomize(this, idx, text, id, info);	
}



