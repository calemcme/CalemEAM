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
 * CalemEvent
 */
function CalemEvent(type, detail) {
	if (arguments.length == 0) return;
	this._type=type;
	this._detail=detail;
	this._items=new AjxVector();
}

/**
 * Cache change event
 */
CalemEvent.CACHE_CHANGE = 'CACHE_CHANGE';

/**
 * Data model change event sent to controls when
 * records are deleted or inserted.
 */
CalemEvent.DATA_CHANGE = 'DATA_CHANGE';

/**
 * Grid selection events - used in list form
 * Used to enable grid toolbar buttons like Open, Delete, Print, etc.
 */
CalemEvent.SELECTION='SEL';
CalemEvent.SINGLE_SELECTION='SEL_1';
CalemEvent.MULTI_SELECTION='SEL_N';
CalemEvent.DBL_CLICK_SELECTION = "SEL_DC";
CalemEvent.NO_SELECTION='SEL_0'

/**
 * New or Edit form's data validation event
 * used to enable/disable buttons like Save.
 */
CalemEvent.DATA_VALID = "DATA_VALID";
CalemEvent.DATA_INVALID = "DATA_INVALID";

/**
 * Record position event.
 * Read form for enable/disable buttons like Edit, Delete, Print, Business logic
 */
CalemEvent.RECORD_POS_FIRST 		="REC_FIRST";
CalemEvent.RECORD_POS_LAST 		="REC_LAST";
CalemEvent.RECORD_POS_MID  		="REC_MID";
CalemEvent.RECORD_POS_FIRST_LAST	="REC_FIRST_LAST";
CalemEvent.RECORD_POS_VALID  		="REC_VALID"; //All above positions.
CalemEvent.RECORD_POS_INVALID  	="REC_INVALID";

/**
 * Record move event (used primarily in MD form for master form)
 * This event cause a new query and detail form updates.
 */
CalemEvent.RECORD_MOVED = "RECORD_MOVED" ;

/**
 * Record refreshed.
 */
CalemEvent.RECORD_CHANGED = "RECORD_CHANGED" ;

/**
 * Record changed event (used primarily in MD form for master form)
 * This event is a local change event for the form.
 */
CalemEvent.EDIT_CHANGED = "EDIT_CHANGED" ;

/**
 * Added another event for no record change.
 */
CalemEvent.EDIT_NO_CHANGE = "EDIT_NO_CHANGE" ;

/**
 * Search edit events
 */
CalemEvent.SEARCH_VALID = 'SEARCH_VALID'; //search is attached.
CalemEvent.SEARCH_NOT_VALID = 'SEARCH_NOT_VALID'; 
CalemEvent.SEARCH_VALID_ALL = 'SEARCH_VALID_ALL'; //search attached with search and name.
CalemEvent.SEARCH_NAME_NOT_VALID = 'SEARCH_NAME_NOT_VALID'; 

/**
 * Search applied event
 */
CalemEvent.SEARCH_APPLIED = 'SEARCH_APPLIED' ;
CalemEvent.SEARCH_REMOVED = 'SEARCH_REMOVED';

//parent rec modified
CalemEvent.PARENT_REC_MODIFIED = 'PARENT_REC_MODIFIED';

CalemEvent.prototype.toString = 
function() {
	return "CalemEvent";
}

CalemEvent.prototype.getType =
function() {
  	return this._type;
}

CalemEvent.prototype.setType =
function(type) {
  	this._type=type;
}

CalemEvent.prototype.getDetail =
function() {
  	return this._detail;
}

CalemEvent.prototype.get =
function(i) {
	return this._items.get(i);
}

CalemEvent.prototype.getItems =
function() {
	return this._items;
}

CalemEvent.prototype.setItems =
function(items) {
	this._items=items;
}

CalemEvent.prototype.add =
function(item) {
	return this._items.add(item);
}

CalemEvent.prototype.size =
function() {
	return this._items.size();
}

/**
 * Event utility functions
 */
CalemEvent.getItem =
function(evt) {
	var evData = evt.item.getData(CalemContext.DATA);
	var item= (evData && evData.event) ? evData.event.getItems().get(0) : null; 
	return item;
}

CalemEvent.getItems =
function(evt) {
	var evData = evt.item.getData(CalemContext.DATA);
	var items= (evData && evData.event) ? evData.event.getItems() : null;
	return items; 
}
