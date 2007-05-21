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
 

function CalemWoStatusLogNoteCollected(table, statusRowInsert, woRowUpdate) {
	this._table=table;
	this._statusRowInsert=statusRowInsert;
	this._woRowUpdate = woRowUpdate;
}

CalemWoStatusLogNoteCollected.prototype.toString = function() {return "CalemWoStatusLogNoteCollected";}

CalemWoStatusLogNoteCollected.prototype.onAction =
function(fm) {
	if (fm.onWoStatusLogNoteCollected) 
		fm.onWoStatusLogNoteCollected(this._table, this._statusRowInsert, this._woRowUpdate);	
}

//Wo from PM processed.
function CalemWoNewFromPmSaved(table) {
	this._table=table;
}
CalemWoNewFromPmSaved.prototype.toString = function() {return "CalemWoNewFromPmSaved";}

CalemWoNewFromPmSaved.prototype.onAction =
function(fm) {
	if (fm.onWoNewFromPmSaved) 
		fm.onWoNewFromPmSaved(this._table);	
}
