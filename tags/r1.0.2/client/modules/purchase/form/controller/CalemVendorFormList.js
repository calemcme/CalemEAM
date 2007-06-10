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
 * CalemVendorFormList
 */
function CalemVendorFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
}

CalemVendorFormList.prototype = new CalemFormList;
CalemVendorFormList.prototype.constructor = CalemVendorFormList;

CalemVendorFormList.prototype.toString = function() { return "CalemVendorFormList";}

/**
 * Business APIs
 */
CalemVendorFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemVendorFormNew';
} 

CalemVendorFormList.prototype._getFormReadId =
function(evt) {	
	return 'CalemVendorFormRead';
} 

/**
 * Deletion must be handled specially
 */
CalemVendorFormList.prototype.onDelete =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	CalemVendorBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

