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
 * CalemUomFormList
 */
function CalemUomFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
}

CalemUomFormList.prototype = new CalemFormList;
CalemUomFormList.prototype.constructor = CalemUomFormList;

CalemUomFormList.prototype.toString = function() { return "CalemUomFormList";}

/**
 * Business APIs
 */
CalemUomFormList.prototype._getFormNewId =
function(evt) {
    return 'CalemUomFormNew';
} 

CalemUomFormList.prototype._getFormReadId =
function(evt) {	
	return 'CalemUomFormRead';
} 

/**
 * Deletion must be handled specially
 */
CalemUomFormList.prototype.onDelete =
function(evt) {
	var rec=CalemEvent.getItem(evt);
	CalemUomBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}

