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
 

//PO status change log
function CalemPoStatusLogNoteCollected(table, statusRowInsert, poRowUpdate) {
	this._table=table;
	this._statusRowInsert=statusRowInsert;
	this._poRowUpdate = poRowUpdate;
}

CalemPoStatusLogNoteCollected.prototype.toString = function() {return "CalemPoStatusLogNoteCollected";}

CalemPoStatusLogNoteCollected.prototype.onAction =
function(fm) {
	if (fm.onPoStatusLogNoteCollected) 
		fm.onPoStatusLogNoteCollected(this._table, this._statusRowInsert, this._poRowUpdate);	
}

//PO item add action
function CalemPoItemAddAction(table, poRec, items) {
	this._table=table;
	this._poRec=poRec;
	this._items=items;
}

CalemPoItemAddAction.prototype.toString = function() {return "CalemPoItemAddAction";}

CalemPoItemAddAction.prototype.onAction =
function(fm) {
	if (fm.onPoItemAddAction) 
		fm.onPoItemAddAction(this._table, this._poRec, this._items);	
}

//PO item remove action
function CalemPoItemRemoveAction(table, poRec, items) {
	this._table=table;
	this._poRec=poRec;
	this._items=items;
}

CalemPoItemRemoveAction.prototype.toString = function() {return "CalemPoItemRemoveAction";}

CalemPoItemRemoveAction.prototype.onAction =
function(fm) {
	if (fm.onPoItemRemoveAction) 
		fm.onPoItemRemoveAction(this._table, this._poRec, this._items);	
}
