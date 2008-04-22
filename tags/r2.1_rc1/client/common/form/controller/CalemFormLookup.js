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
 * CalemFormLookup
 * This is the lookup form.
 * 
 */
function CalemFormLookup(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
	//Add select listener
	this._selectListener = new AjxListener(this, this.onSelect);
}

CalemFormLookup.prototype = new CalemFormList;
CalemFormLookup.prototype.constructor = CalemFormLookup;

CalemFormLookup.prototype.toString = function() { return "CalemFormLookup"; }

/**
 * Lookup specific functions
 */
CalemFormLookup.prototype.getSelectListener =
function() {
	return this._selectListener;
} 

CalemFormLookup.prototype.onSelect =
function(evt) {
	this._onSelect(evt);
}

CalemFormLookup.prototype._onSelect =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	this._lkupCallback.run(rec);
	//Close down lookup form.
	this._closeAndResumeParentForm();
}

/**
 * Lookup callback setup
 */
CalemFormLookup.prototype.setLkupCallback =
function(callback) {
	this._lkupCallback=callback;
} 

CalemFormLookup.prototype.setCurrentRecId =
function(id) {
	this._recId=id;
}

//Locate the item after form rendering.
CalemFormLookup.prototype._render =
function() {
	CalemFormList.prototype._render.call(this); //Render first
	if (this._recId) {
		//@todo to locate the record and highlight in data grid.
	}
}
