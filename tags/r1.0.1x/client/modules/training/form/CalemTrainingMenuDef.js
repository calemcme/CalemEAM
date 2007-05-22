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
 * Admin module menu
 */

//Modules Form

// forms
CalemMenuDef['CalemTrainingFormList'] = {
	id: 'CalemTrainingFormList',
	title: 'training',
	icon: 'CalemTraining',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

//Codes
CalemMenuDef['CalemTrainingCodes'] = {
	id: 'CalemTrainingCodes',
	title: 'training_codes',
	icon: 'CalemCodes',
	disIcon: null,
	tooltip: null,
	enabled: true,				   
	onSelect: null	
}; 

CalemMenuDef['CalemTrainingCourseTypeFormList'] = {
	id: 'CalemTrainingCourseTypeFormList',
	title: 'training_course_type',
	icon: 'CalemTraining',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemTrainingCourseFormList'] = {
	id: 'CalemTrainingCourseFormList',
	title: 'training_course',
	icon: 'CalemTraining',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemTrainingCertificateFormList'] = {
	id: 'CalemTrainingCertificateFormList',
	title: 'training_certificate',
	icon: 'CalemTraining',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};
