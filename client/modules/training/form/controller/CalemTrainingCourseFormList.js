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
 * CalemTrainingCourseFormList
 */
function CalemTrainingCourseFormList(parent, formId, data) {
	if (arguments.length==0) return;
	CalemFormList.call(this, parent, formId, data);
}

CalemTrainingCourseFormList.prototype = new CalemFormList;
CalemTrainingCourseFormList.prototype.constructor = CalemTrainingCourseFormList;

CalemTrainingCourseFormList.prototype.toString = function() { return "CalemTrainingCourseFormList";}

/**
 * Business APIs
 */
CalemTrainingCourseFormList.prototype._getFormNewId =
function() {
    return 'CalemTrainingCourseFormNew';
} 
 
CalemTrainingCourseFormList.prototype._getFormReadId =
function() {
    return 'CalemTrainingCourseFormRead';
}  

/**
 * Deletion must be handled specially
 */
CalemTrainingCourseFormList.prototype.onDelete =
function(evt) {
	//If there're detailed records do not allow a deletion.
	var rec=CalemEvent.getItem(evt);
	CalemTrainingCourseBo.getInstance().canDelete(rec, new AjxCallback(this, this.onDeleteBoCallback, {evt: evt}));
}


