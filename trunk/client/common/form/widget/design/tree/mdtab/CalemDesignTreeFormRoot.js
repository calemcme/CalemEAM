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
 * CalemDesignTreeFormRoot
 * This is the design tree form item.
 */
function CalemDesignTreeFormRoot(parent) {
	if (arguments.length==0) return;
	var text=CalemMsg.getMsg('form');
	CalemDesignTreeItem.call(this, parent, null, text, 'CalemForm'); //No defer.
} 

CalemDesignTreeFormRoot.prototype = new CalemDesignTreeItem;
CalemDesignTreeFormRoot.prototype.constructor = CalemDesignTreeFormRoot;

CalemDesignTreeFormRoot.prototype.toString = 
function() {
	return "CalemDesignTreeFormRoot";
}

CalemDesignTreeFormRoot.prototype.addFormInfo =
function(id, text, info) {
	var idx=this._getIndex(text);
	var item=new CalemDesignTreeForm(this, idx, text, id, info);	
}



