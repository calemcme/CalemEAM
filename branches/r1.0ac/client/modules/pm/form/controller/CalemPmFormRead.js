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
 * CalemPmFormRead
 */
function CalemPmFormRead(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormRead.call(this, parent, formId, data);
}

CalemPmFormRead.prototype = new CalemFormRead;
CalemPmFormRead.prototype.constructor = CalemPmFormRead;

CalemPmFormRead.prototype.toString = function() { return "CalemPmFormRead";}

/**
 * Business APIs
 */
CalemPmFormRead.prototype._getFormNewId =
function() {
	return 'CalemPmFormNew';
} 

CalemPmFormRead.prototype._getFormEditId =
function() {
	return 'CalemPmFormEdit';
}

/**
 * Deletion must be handled specially
 */
CalemPmFormRead.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemPmBo.getInstance().canDeletePm(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}
 
