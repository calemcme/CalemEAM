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
 * CalemRcmFunctionFormRead
 */
function CalemRcmFunctionFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormRead.call(this, parent, formId, data);
}

CalemRcmFunctionFormRead.prototype = new CalemFormRead;
CalemRcmFunctionFormRead.prototype.constructor = CalemRcmFunctionFormRead;

CalemRcmFunctionFormRead.prototype.toString = function() { return "CalemRcmFunctionFormRead";}

/**
 * Business APIs
 */
CalemRcmFunctionFormRead.prototype._getFormNewId =
function() {
	return 'CalemRcmFunctionFormNew';
} 

CalemRcmFunctionFormRead.prototype._getFormEditId =
function() {
	return 'CalemRcmFunctionFormEdit';
}

/**
 * Deletion must be handled specially
 */
CalemRcmFunctionFormRead.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemRcmFunctionBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

