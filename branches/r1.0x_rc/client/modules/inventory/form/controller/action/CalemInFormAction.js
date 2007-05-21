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
 * Close IN Receive form all the way.
 */
function CalemInReceiveDoneAction() {
}

CalemInReceiveDoneAction.prototype.toString = function() {return "CalemInReceiveDoneAction";}

CalemInReceiveDoneAction.prototype.onAction =
function(fm) {
	if (fm.onInReceiveDoneAction) fm.onInReceiveDoneAction();	
}

//InTranDoneAction
function CalemInTranDoneAction() {
}

CalemInTranDoneAction.prototype.toString = function() {return "CalemInTranDoneAction";}

CalemInTranDoneAction.prototype.onAction =
function(fm) {
	if (fm.onInTranDoneAction) fm.onInTranDoneAction();	
}

//Collect default info for order request.
function CalemInGenOrderReqInfoCollected(table, reqRow, inRow) {
	this._table=table;
	this._reqRow=reqRow;
	this._inRow = inRow;
}

CalemInGenOrderReqInfoCollected.prototype.toString = function() {return "CalemInGenOrderReqInfoCollected";}

CalemInGenOrderReqInfoCollected.prototype.onAction =
function(fm) {
	if (fm.onInGenOrderReqInfoCollected) 
		fm.onInGenOrderReqInfoCollected(this._table, this._reqRow, this._inRow);	
}
