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

// User forms
CalemMenuDef['CalemUserFormList'] = {
	id: 'CalemUserFormList',
	title: 'users',
	icon: 'CalemUser',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemUserFormReadMine'] = {
	id: 'CalemUserFormReadMine',
	title: 'my_account',
	icon: 'CalemUser',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemAclGroupFormList'] = {
	id: 'CalemAclGroupFormList',
	title: 'acl_group',
	icon: 'CalemGroup',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemDeptFormList'] = {
	id: 'CalemDeptFormList',
	title: 'dept',
	icon: 'CalemGroup',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemTeamFormList'] = {
	id: 'CalemTeamFormList',
	title: 'team',
	icon: 'CalemGroup',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemAdminCodes'] = {
	id: 'CalemAdminCodes',
	title: 'admin_codes',
	icon: 'CalemAdmin',
	disIcon: null,
	enabled: true,
	tooltip: null
};

CalemMenuDef['CalemModAdminDataDesign'] = {
	id: 'CalemModDataDesign',
	title: 'data_design',
	icon: 'CalemDataDesign',
	disIcon: null,
	tooltip: null,
	enabled: true,				   
	onSelect: null	
}; 

CalemMenuDef['CalemTableFormList'] = {
	id: 'CalemTableFormList',
	title: 'table_design',
	icon: 'CalemTableDesign',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemDropdownFormList'] = {
	id: 'CalemDropdownFormList',
	title: 'dropdown_design',
	icon: 'CalemTableDesign',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemTbGroupAclDesign'] = {
	id: 'CalemTbGroupAclDesign',
	title: 'group_acl_design',
	icon: 'CalemAclDesign',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'GroupAclDesignListener'}}
};

CalemMenuDef['CalemTbCustomizeModule'] = {
	id: 'CalemTbCustomizeModule',
	title: 'module_customize',
	icon: 'CalemAclDesign',
	disIcon: null,
	enabled: false,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'CustomizeModuleListener'}}
};

CalemMenuDef['CalemTbCustomizeModuleList'] = {
	id: 'CalemTbCustomizeModuleList',
	title: 'module_list_customize',
	icon: 'CalemAclDesign',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'CustomizeModuleListListener'}}
};

CalemMenuDef['CalemTbTableDesign'] = {
	id: 'CalemTbTableDesign',
	title: 'table_customize',
	icon: 'CalemTableDesign',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'TableDesignListener'}}
};

CalemMenuDef['CalemTbTableDesign'] = {
	id: 'CalemTbTableDesign',
	title: 'table_customize',
	icon: 'CalemTableDesign',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'TableDesignListener'}}
};

CalemMenuDef['CalemTbDropdownDesign'] = {
	id: 'CalemTbDropdownDesign',
	title: 'dropdown_customize',
	icon: 'CalemTableDesign',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'DropdownDesignListener'}}
};

// scheduler
CalemMenuDef['CalemAdminScheduler'] = {
	id: 'CalemAdminScheduler',
	title: 'admin_scheduler',
	icon: 'CalemScheduler',
	disIcon: null,
	enabled: true,
	tooltip: null
};

CalemMenuDef['CalemSchedulerTaskFormList'] = {
	id: 'CalemSchedulerTaskFormList',
	title: 'scheduler_task',
	icon: 'CalemSchedulerTask',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemSchedulerJobFormList'] = {
	id: 'CalemSchedulerJobFormList',
	title: 'scheduler_job_list',
	icon: 'CalemSchedulerTask',
	disIcon: null,
	enabled: true,
	tooltip: null,  				   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};
