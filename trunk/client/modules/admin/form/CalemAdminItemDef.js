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
 * User forms
 */
CalemItemDef['CalemUserFormList']={
	CalemFormInfo: {
		id: 'CalemUserFormList',
		title: 'users',
		icon: 'CalemUser',
		controller: 'CalemUserFormList',
		model: 'users', 
		view: {CalemViewRefInfo: {id: 'CalemUserViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemUserFormSearch'
	}
}

CalemItemDef['CalemUserFormLookup']={
	CalemFormInfo: {
		id: 'CalemUserFormLookup',
		title: 'users',
		icon: 'CalemUser',
		controller: 'CalemUserFormLookup',
		model: 'users', 
		view: {CalemViewRefInfo: {id: 'CalemUserViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemUserFormSearch'
	}
}

CalemItemDef['CalemUserFormNew']={
	CalemFormInfo: {
		id: 'CalemUserFormNew',
		title: 'users',
		icon: 'CalemUser',
		controller: 'CalemUserFormNew',
		model: 'users', 
		view: {CalemViewRefInfo: {id: 'CalemUserViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUserFormEdit']={
	CalemFormInfo: {
		id: 'CalemUserFormEdit',
		title: 'users',
		icon: 'CalemUser',
		controller: 'CalemUserFormEdit',
		model: 'users', 
   	view: {CalemViewRefInfo: {id: 'CalemUserViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUserFormEditMine']={
	CalemFormInfo: {
		id: 'CalemUserFormEditMine',
		title: 'my_account',
		icon: 'CalemUser',
		controller: 'CalemUserFormEditMine',
		model: 'users', 
   	view: {CalemViewRefInfo: {id: 'CalemUserViewEditMine'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUserFormReadMine']={
	CalemFormInfo: {
		id: 'CalemUserFormReadMine',
		title: 'my_account',
		icon: 'CalemUser',
		controller: 'CalemUserFormReadMine',
		model: 'users', 
		view: {CalemViewRefInfo: {id: 'CalemUserViewReadMine'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUserFormRead']={
	CalemFormInfo: {
		id: 'CalemUserFormRead',
		title: 'users',
		icon: 'CalemUser',
		controller: 'CalemUserFormRead',
		model: 'users', 
		view: {CalemViewRefInfo: {id: 'CalemUserViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUserFormSearch']={
	CalemFormInfo: {
		id: 'CalemUserFormSearch',
		title: 'users',
		icon: 'CalemUser',
		controller: 'CalemFormSearchEdit',
		model: 'users', 
		view: {CalemViewRefInfo: {id: 'CalemUserViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Group form
 */
CalemItemDef['CalemAclGroupFormList']={
	CalemFormInfo: {
		id: 'CalemAclGroupFormList',
		title: 'acl_group',
		icon: 'CalemGroup',
		controller: 'CalemAclGroupFormList',
		model: 'acl_group', 
		view: {CalemViewRefInfo: {id: 'CalemAclGroupViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemAclGroupFormSearch'
	}
}

CalemItemDef['CalemAclGroupFormLookup']={
	CalemFormInfo: {
		id: 'CalemAclGroupFormLookup',
		title: 'acl_group',
		icon: 'CalemGroup',
		controller: 'CalemAclGroupFormLookup',
		model: 'acl_group', 
		view: {CalemViewRefInfo: {id: 'CalemAclGroupViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemAclGroupFormSearch'
	}
}

CalemItemDef['CalemAclGroupFormNew']={
	CalemFormInfo: {
		id: 'CalemAclGroupFormNew',
		title: 'acl_group',
		icon: 'CalemGroup',
		controller: 'CalemAclGroupFormNew',
		model: 'acl_group', 
		view: {CalemViewRefInfo: {id: 'CalemAclGroupViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAclGroupFormEdit']={
	CalemFormInfo: {
		id: 'CalemAclGroupFormEdit',
		title: 'acl_group',
		icon: 'CalemGroup',
		controller: 'CalemAclGroupFormEdit',
		model: 'acl_group', 
   	view: {CalemViewRefInfo: {id: 'CalemAclGroupViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAclGroupFormRead']={
	CalemFormInfo: {
		id: 'CalemAclGroupFormRead',
		title: 'acl_group',
		icon: 'CalemGroup',
		controller: 'CalemAclGroupFormRead',
		model: 'acl_group', 
		view: {CalemViewRefInfo: {id: 'CalemAclGroupViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemAclGroupFormSearch']={
	CalemFormInfo: {
		id: 'CalemAclGroupFormSearch',
		title: 'acl_group',
		icon: 'CalemGroup',
		controller: 'CalemFormSearchEdit',
		model: 'acl_group', 
		view: {CalemViewRefInfo: {id: 'CalemAclGroupViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Access design forms
 */
CalemItemDef['CalemModuleFormList'] = {
	CalemFormInfo: {
		id: 'CalemModuleFormList',
		title: 'group_module_list',
		icon: 'CalemAclDesign',
		controller: 'CalemModuleFormList',
		model: 'vt_module_list', 
		view: {CalemViewRefInfo: {id: 'CalemModuleViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Table design
CalemItemDef['CalemTableFormList'] = {
	CalemFormInfo: {
		id: 'CalemTableFormList',
		title: 'vt_table_list',
		icon: 'CalemTableDesign',
		controller: 'CalemTableFormList',
		model: 'vt_table_list', 
		view: {CalemViewRefInfo: {id: 'CalemTableViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Field forms
CalemItemDef['CalemFieldFormNew']={
	CalemFormInfo: {
		id: 'CalemFieldFormNew',
		title: 'vt_field',
		icon: 'CalemDataDesign',
		controller: 'CalemFieldFormNew',
		model: 'vt_field', 
		view: {CalemViewRefInfo: {id: 'CalemFieldViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemFieldNameFormEdit']={
	CalemFormInfo: {
		id: 'CalemFieldNameFormEdit',
		title: 'vt_field',
		icon: 'CalemDataDesign',
		controller: 'CalemFieldNameFormEdit',
		model: 'vt_field', 
		view: {CalemViewRefInfo: {id: 'CalemFieldNameViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemFieldTypeFormEdit']={
	CalemFormInfo: {
		id: 'CalemFieldTypeFormEdit',
		title: 'vt_field',
		icon: 'CalemDataDesign',
		controller: 'CalemFieldTypeFormEdit',
		model: 'vt_field', 
		view: {CalemViewRefInfo: {id: 'CalemFieldTypeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Dropdown design
CalemItemDef['CalemDropdownFormList'] = {
	CalemFormInfo: {
		id: 'CalemDropdownFormList',
		title: 'vt_dropdown_list',
		icon: 'CalemTableDesign',
		controller: 'CalemDropdownFormList',
		model: 'vt_dropdown_list', 
		view: {CalemViewRefInfo: {id: 'CalemDropdownViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDropdownFormNew']={
	CalemFormInfo: {
		id: 'CalemDropdownFormNew',
		title: 'vt_dropdown_use',
		icon: 'CalemDataDesign',
		controller: 'CalemDropdownFormNew',
		model: 'vt_dropdown_use', 
		view: {CalemViewRefInfo: {id: 'CalemDropdownViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDropdownFormEdit']={
	CalemFormInfo: {
		id: 'CalemDropdownFormEdit',
		title: 'vt_dropdown_use',
		icon: 'CalemDataDesign',
		controller: 'CalemDropdownFormEdit',
		model: 'vt_dropdown_use', 
		view: {CalemViewRefInfo: {id: 'CalemDropdownViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemLabelFormEdit']={
	CalemFormInfo: {
		id: 'CalemLabelFormEdit',
		title: 'vt_label',
		icon: 'CalemTreeLabel',
		controller: 'CalemLabelFormEdit',
		model: 'vt_label', 
		view: {CalemViewRefInfo: {id: 'CalemLabelViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Dept forms
 */
CalemItemDef['CalemDeptFormList']={
	CalemFormInfo: {
		id: 'CalemDeptFormList',
		title: 'dept',
		icon: 'CalemAdmin',
		controller: 'CalemDeptFormList',
		model: 'dept', 
		view: {CalemViewRefInfo: {id: 'CalemDeptViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemDeptFormSearch'
	}
}

CalemItemDef['CalemDeptFormLookup']={
	CalemFormInfo: {
		id: 'CalemDeptFormLookup',
		title: 'dept',
		icon: 'CalemAdmin',
		controller: 'CalemDeptFormLookup',
		model: 'dept', 
		view: {CalemViewRefInfo: {id: 'CalemDeptViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemDeptFormSearch'
	}
}

CalemItemDef['CalemDeptFormNew']={
	CalemFormInfo: {
		id: 'CalemDeptFormNew',
		title: 'dept',
		icon: 'CalemAdmin',
		controller: 'CalemDeptFormNew',
		model: 'dept', 
		view: {CalemViewRefInfo: {id: 'CalemDeptViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDeptFormEdit']={
	CalemFormInfo: {
		id: 'CalemDeptFormEdit',
		title: 'dept',
		icon: 'CalemAdmin',
		controller: 'CalemDeptFormEdit',
		model: 'dept', 
   	view: {CalemViewRefInfo: {id: 'CalemDeptViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDeptFormRead']={
	CalemFormInfo: {
		id: 'CalemDeptFormRead',
		title: 'dept',
		icon: 'CalemAdmin',
		controller: 'CalemDeptFormRead',
		model: 'dept', 
		view: {CalemViewRefInfo: {id: 'CalemDeptViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDeptFormSearch']={
	CalemFormInfo: {
		id: 'CalemDeptFormSearch',
		title: 'dept',
		icon: 'CalemAdmin',
		controller: 'CalemFormSearchEdit',
		model: 'dept', 
		view: {CalemViewRefInfo: {id: 'CalemDeptViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Team forms
 */
CalemItemDef['CalemTeamFormList']={
	CalemFormInfo: {
		id: 'CalemTeamFormList',
		title: 'team',
		icon: 'CalemAdmin',
		controller: 'CalemTeamFormList',
		model: 'team', 
		view: {CalemViewRefInfo: {id: 'CalemTeamViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTeamFormSearch'
	}
}

CalemItemDef['CalemTeamFormLookup']={
	CalemFormInfo: {
		id: 'CalemTeamFormLookup',
		title: 'team',
		icon: 'CalemAdmin',
		controller: 'CalemTeamFormLookup',
		model: 'team', 
		view: {CalemViewRefInfo: {id: 'CalemTeamViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTeamFormSearch'
	}
}

CalemItemDef['CalemTeamFormNew']={
	CalemFormInfo: {
		id: 'CalemTeamFormNew',
		title: 'team',
		icon: 'CalemAdmin',
		controller: 'CalemTeamFormNew',
		model: 'team', 
		view: {CalemViewRefInfo: {id: 'CalemTeamViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTeamFormEdit']={
	CalemFormInfo: {
		id: 'CalemTeamFormEdit',
		title: 'team',
		icon: 'CalemAdmin',
		controller: 'CalemTeamFormEdit',
		model: 'team', 
   	view: {CalemViewRefInfo: {id: 'CalemTeamViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTeamFormRead']={
	CalemFormInfo: {
		id: 'CalemTeamFormRead',
		title: 'team',
		icon: 'CalemAdmin',
		controller: 'CalemTeamFormRead',
		model: 'team', 
		view: {CalemViewRefInfo: {id: 'CalemTeamViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTeamFormSearch']={
	CalemFormInfo: {
		id: 'CalemTeamFormSearch',
		title: 'team',
		icon: 'CalemAdmin',
		controller: 'CalemFormSearchEdit',
		model: 'team', 
		view: {CalemViewRefInfo: {id: 'CalemTeamViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Scheduler tasks
 */
CalemItemDef['CalemSchedulerTaskFormList']={
	CalemFormInfo: {
		id: 'CalemSchedulerTaskFormList',
		title: 'scheduler_task',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerTaskFormList',
		model: 'scheduler_task', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerTaskViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemSchedulerTaskFormSearch'
	}
}

CalemItemDef['CalemSchedulerTaskFormLookup']={
	CalemFormInfo: {
		id: 'CalemSchedulerTaskFormLookup',
		title: 'scheduler_task',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerTaskFormLookup',
		model: 'scheduler_task', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerTaskViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemSchedulerTaskFormSearch'
	}
}

CalemItemDef['CalemSchedulerTaskFormNew']={
	CalemFormInfo: {
		id: 'CalemSchedulerTaskFormNew',
		title: 'scheduler_task',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerTaskFormNew',
		model: 'scheduler_task', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerTaskViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSchedulerTaskFormEdit']={
	CalemFormInfo: {
		id: 'CalemSchedulerTaskFormEdit',
		title: 'scheduler_task',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerTaskFormEdit',
		model: 'scheduler_task', 
   	view: {CalemViewRefInfo: {id: 'CalemSchedulerTaskViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSchedulerTaskFormRead']={
	CalemFormInfo: {
		id: 'CalemSchedulerTaskFormRead',
		title: 'scheduler_task',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerTaskFormRead',
		model: 'scheduler_task', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerTaskViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSchedulerTaskFormSearch']={
	CalemFormInfo: {
		id: 'CalemSchedulerTaskFormSearch',
		title: 'scheduler_task',
		icon: 'CalemSchedulerTask',
		controller: 'CalemFormSearchEdit',
		model: 'scheduler_task', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerTaskViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * CalemSchedulerFormMdTab
 */
CalemItemDef['CalemSchedulerJobFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemSchedulerJobFormMdTab',
		title: 'scheduler_job',
		icon: 'CalemSchedulerTask',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_run', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemSchedulerJobFormRead']},
					'tab_run' : {CalemTabLayoutInfo: ['CalemSchedulerJobRunFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemSchedulerJobFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemSchedulerJobRunFormList', link: {CalemFieldMdInfo: {fld: 'job_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemSchedulerJobFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemSchedulerJobFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemSchedulerJobRunFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemSchedulerJobRunFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 20}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_scheduler_job_main', fixed: 1}
		  },
		  
		  'tab_run': {
		  		CalemTabInfo: {id: 'tab_scheduler_job_run'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}

/**
 * Scheduler job
 */
CalemItemDef['CalemSchedulerJobFormList']={
	CalemFormInfo: {
		id: 'CalemSchedulerJobFormList',
		title: 'scheduler_job_list',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerJobFormList',
		model: 'scheduler_job', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerJobViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemSchedulerJobFormSearch'
	}
}

CalemItemDef['CalemSchedulerJobFormNew']={
	CalemFormInfo: {
		id: 'CalemSchedulerJobFormNew',
		title: 'scheduler_job',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerJobFormNew',
		model: 'scheduler_job', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerJobViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSchedulerJobFormEdit']={
	CalemFormInfo: {
		id: 'CalemSchedulerJobFormEdit',
		title: 'scheduler_job',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerJobFormEdit',
		model: 'scheduler_job', 
   	view: {CalemViewRefInfo: {id: 'CalemSchedulerJobViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSchedulerJobFormRead']={
	CalemFormInfo: {
		id: 'CalemSchedulerJobFormRead',
		title: 'scheduler_job',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerJobFormRead',
		model: 'scheduler_job', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerJobViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSchedulerJobFormSearch']={
	CalemFormInfo: {
		id: 'CalemSchedulerJobFormSearch',
		title: 'scheduler_job',
		icon: 'CalemSchedulerTask',
		controller: 'CalemFormSearchEdit',
		model: 'scheduler_job', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerJobViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Scheduler job Run
 */
CalemItemDef['CalemSchedulerJobRunFormList']={
	CalemFormInfo: {
		id: 'CalemSchedulerJobRunFormList',
		title: 'scheduler_job_run',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerJobRunFormList',
		model: 'scheduler_job_run', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerJobRunViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemSchedulerJobRunFormSearch'
	}
}

CalemItemDef['CalemSchedulerJobRunFormRead']={
	CalemFormInfo: {
		id: 'CalemSchedulerJobRunFormRead',
		title: 'scheduler_job_run',
		icon: 'CalemSchedulerTask',
		controller: 'CalemSchedulerJobRunFormRead',
		model: 'scheduler_job_run', 
		view: {CalemViewRefInfo: {id: 'CalemSchedulerJobRunViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
