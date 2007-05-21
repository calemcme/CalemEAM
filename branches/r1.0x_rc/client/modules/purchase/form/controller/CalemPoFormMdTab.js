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
 * CalemPoFormMdTab
 */
function CalemPoFormMdTab(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormMdTab.call(this, parent, formId, data);
}

CalemPoFormMdTab.prototype = new CalemFormMdTab;
CalemPoFormMdTab.prototype.constructor = CalemPoFormMdTab;

CalemPoFormMdTab.prototype.toString = function() { return "CalemPoFormMdTab";}

/**
 * Business APIs
 */
CalemPoFormMdTab.prototype.onPoStatusLogNoteCollected =
function(table, statusRowInsert, reqRowUpdate) {	
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onPoStatusLogNoteCollected(table, statusRowInsert, reqRowUpdate);
} 

CalemPoFormMdTab.prototype.onPoItemAddAction =
function(table, poRec, items) {	
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onPoItemAddAction(table, poRec, items);
} 

CalemPoFormMdTab.prototype.onPoItemRemoveAction =
function(table, poRec, items) {	
	if (!this._formModel.getFormByModel(table)) return;
	this._formModel.getFormByModel(table).onPoItemRemoveAction(table, poRec, items);
} 
