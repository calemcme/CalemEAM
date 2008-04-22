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
 * CalemDocFormRead
 */
function CalemDocFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormRead.call(this, parent, formId, data);
}

CalemDocFormRead.prototype = new CalemFormRead;
CalemDocFormRead.prototype.constructor = CalemDocFormRead;

CalemDocFormRead.prototype.toString = function() { return "CalemDocFormRead";}

/**
 * Business APIs
 */
CalemDocFormRead.prototype._getFormNewId =
function() {
	return 'CalemDocFormNew';
} 

CalemDocFormRead.prototype._getFormEditId =
function() {
	return 'CalemDocFormEdit';
}

/**
 * Deletion must be handled specially
 */
CalemDocFormRead.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemDocBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

 
