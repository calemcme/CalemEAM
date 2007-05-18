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
 * CalemDesignTreeLabel
 * This is the label item.
 */
function CalemDesignTreeLabel(parent, index, text, id, info) {
	if (arguments.length==0) return;
	CalemDesignTreeItem.call(this, parent, index, text, 'CalemTreeLabel', id, info, true);
} 

CalemDesignTreeLabel.prototype = new CalemDesignTreeItem;
CalemDesignTreeLabel.prototype.constructor = CalemDesignTreeLabel;

CalemDesignTreeLabel.prototype.toString = 
function() {
	return "CalemDesignTreeLabel";
}

