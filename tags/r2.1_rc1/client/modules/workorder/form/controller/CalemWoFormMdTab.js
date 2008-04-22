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
 * CalemWoFormMdTab
 */
function CalemWoFormMdTab(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormMdTab.call(this, parent, formId, data);
}

CalemWoFormMdTab.prototype = new CalemFormMdTab;
CalemWoFormMdTab.prototype.constructor = CalemWoFormMdTab;

CalemWoFormMdTab.prototype.toString = function() { return "CalemWoFormMdTab";}

/**
 * Business APIs
 */
CalemWoFormMdTab.prototype.onWoStatusLogNoteCollected =
function(table, statusRowInsert, woRowUpdate) {	
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onWoStatusLogNoteCollected(table, statusRowInsert, woRowUpdate);
} 

