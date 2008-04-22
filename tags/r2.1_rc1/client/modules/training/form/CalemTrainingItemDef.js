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
 * forms
 */
CalemItemDef['CalemTrainingFormList']={
	CalemFormInfo: {
		id: 'CalemTrainingFormList',
		title: 'training_list',
		icon: 'CalemTraining',
		controller: 'CalemTrainingFormList',
		model: 'training', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTrainingFormSearch'
	}
}

CalemItemDef['CalemTrainingFormLookup']={
	CalemFormInfo: {
		id: 'CalemTrainingFormLookup',
		title: 'training',
		icon: 'CalemTraining',
		controller: 'CalemTrainingFormLookup',
		model: 'training', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTrainingFormSearch'
	}
}

CalemItemDef['CalemTrainingFormNew']={
	CalemFormInfo: {
		id: 'CalemTrainingFormNew',
		title: 'training',
		icon: 'CalemTraining',
		controller: 'CalemTrainingFormNew',
		model: 'training', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingFormEdit']={
	CalemFormInfo: {
		id: 'CalemTrainingFormEdit',
		title: 'training',
		icon: 'CalemTraining',
		controller: 'CalemTrainingFormEdit',
		model: 'training', 
   	view: {CalemViewRefInfo: {id: 'CalemTrainingViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingFormRead']={
	CalemFormInfo: {
		id: 'CalemTrainingFormRead',
		title: 'training',
		icon: 'CalemTraining',
		controller: 'CalemTrainingFormRead',
		model: 'training', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingFormSearch']={
	CalemFormInfo: {
		id: 'CalemTrainingFormSearch',
		title: 'training',
		icon: 'CalemTraining',
		controller: 'CalemFormSearchEdit',
		model: 'training', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemTrainingFormMdTab',
		title: 'training',
		icon: 'CalemTraining',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_user', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemTrainingFormRead']},
					
					'tab_user' : {CalemTabLayoutInfo: ['CalemTrainingUserFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemTrainingFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemTrainingUserFormList', link: {CalemFieldMdInfo: {fld: 'training_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemTrainingFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemTrainingFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemTrainingUserFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemTrainingUserFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 12}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_training_main', fixed: 1}
		  },
		  
		  'tab_user': {
		  		CalemTabInfo: {id: 'tab_training_user'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}

/**
 * Downtime
 */
CalemItemDef['CalemTrainingUserFormList']={
	CalemFormInfo: {
		id: 'CalemTrainingUserFormList',
		title: 'training_user',
		icon: 'CalemTraining',
		controller: 'CalemTrainingUserFormList',
		model: 'training_user', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingUserViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingUserFormNew']={
	CalemFormInfo: {
		id: 'CalemTrainingUserFormNew',
		title: 'training_user',
		icon: 'CalemTraining',
		controller: 'CalemTrainingUserFormNew',
		model: 'training_user', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingUserViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingUserFormEdit']={
	CalemFormInfo: {
		id: 'CalemTrainingUserFormEdit',
		title: 'training_user',
		icon: 'CalemTraining',
		controller: 'CalemTrainingUserFormEdit',
		model: 'training_user', 
   	view: {CalemViewRefInfo: {id: 'CalemTrainingUserViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingUserFormRead']={
	CalemFormInfo: {
		id: 'CalemTrainingUserFormRead',
		title: 'training_user',
		icon: 'CalemTraining',
		controller: 'CalemTrainingUserFormRead',
		model: 'training_user', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingUserViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Certificate
 */
CalemItemDef['CalemTrainingCertificateFormList']={
	CalemFormInfo: {
		id: 'CalemTrainingCertificateFormList',
		title: 'training_certificate',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCertificateFormList',
		model: 'training_certificate', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCertificateViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTrainingCertificateFormSearch'
	}
}

CalemItemDef['CalemTrainingCertificateFormLookup']={
	CalemFormInfo: {
		id: 'CalemTrainingCertificateFormLookup',
		title: 'training_certificate',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCertificateFormLookup',
		model: 'training_certificate', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCertificateViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTrainingCertificateFormSearch'
	}
}

CalemItemDef['CalemTrainingCertificateFormNew']={
	CalemFormInfo: {
		id: 'CalemTrainingCertificateFormNew',
		title: 'training_certificate',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCertificateFormNew',
		model: 'training_certificate', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCertificateViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingCertificateFormEdit']={
	CalemFormInfo: {
		id: 'CalemTrainingCertificateFormEdit',
		title: 'training_certificate',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCertificateFormEdit',
		model: 'training_certificate', 
   	view: {CalemViewRefInfo: {id: 'CalemTrainingCertificateViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingCertificateFormRead']={
	CalemFormInfo: {
		id: 'CalemTrainingCertificateFormRead',
		title: 'training_certificate',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCertificateFormRead',
		model: 'training_certificate', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCertificateViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingCertificateFormSearch']={
	CalemFormInfo: {
		id: 'CalemTrainingCertificateFormSearch',
		title: 'training_certificate',
		icon: 'CalemTraining',
		controller: 'CalemFormSearchEdit',
		model: 'training_certificate', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCertificateViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * course type
 */
CalemItemDef['CalemTrainingCourseTypeFormList']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseTypeFormList',
		title: 'training_course_type',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseTypeFormList',
		model: 'training_course_type', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseTypeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTrainingCourseTypeFormSearch'
	}
}

CalemItemDef['CalemTrainingCourseTypeFormLookup']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseTypeFormLookup',
		title: 'training_course_type',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseTypeFormLookup',
		model: 'training_course_type', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseTypeViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTrainingCourseTypeFormSearch'
	}
}

CalemItemDef['CalemTrainingCourseTypeFormNew']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseTypeFormNew',
		title: 'training_course_type',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseTypeFormNew',
		model: 'training_course_type', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseTypeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingCourseTypeFormEdit']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseTypeFormEdit',
		title: 'training_course_type',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseTypeFormEdit',
		model: 'training_course_type', 
   	view: {CalemViewRefInfo: {id: 'CalemTrainingCourseTypeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingCourseTypeFormRead']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseTypeFormRead',
		title: 'training_course_type',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseTypeFormRead',
		model: 'training_course_type', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseTypeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingCourseTypeFormSearch']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseTypeFormSearch',
		title: 'training_course_type',
		icon: 'CalemTraining',
		controller: 'CalemFormSearchEdit',
		model: 'training_course_type', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseTypeViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * course
 */
CalemItemDef['CalemTrainingCourseFormList']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseFormList',
		title: 'training_course',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseFormList',
		model: 'training_course', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTrainingCourseFormSearch'
	}
}

CalemItemDef['CalemTrainingCourseFormLookup']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseFormLookup',
		title: 'training_course',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseFormLookup',
		model: 'training_course', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTrainingCourseFormSearch'
	}
}

CalemItemDef['CalemTrainingCourseFormNew']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseFormNew',
		title: 'training_course',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseFormNew',
		model: 'training_course', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingCourseFormEdit']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseFormEdit',
		title: 'training_course',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseFormEdit',
		model: 'training_course', 
   	view: {CalemViewRefInfo: {id: 'CalemTrainingCourseViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingCourseFormRead']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseFormRead',
		title: 'training_course',
		icon: 'CalemTraining',
		controller: 'CalemTrainingCourseFormRead',
		model: 'training_course', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTrainingCourseFormSearch']={
	CalemFormInfo: {
		id: 'CalemTrainingCourseFormSearch',
		title: 'training_course',
		icon: 'CalemTraining',
		controller: 'CalemFormSearchEdit',
		model: 'training_course', 
		view: {CalemViewRefInfo: {id: 'CalemTrainingCourseViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
