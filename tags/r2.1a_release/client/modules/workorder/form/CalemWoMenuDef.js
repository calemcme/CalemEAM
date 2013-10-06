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
 * Workorder module menu
 */
CalemMenuDef['CalemWoFormList'] = {
	id: 'CalemWoFormList',
	title: 'wo_all',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemNewWoAssetFormNew'] = {
	id: 'CalemNewWoAssetFormNew',
	title: 'wo_new_pm',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemWoNoPmFormNew'] = {
	id: 'CalemWoNoPmFormNew',
	title: 'wo_new_no_pm',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};


CalemMenuDef['CalemCraftFormList'] = {
	id: 'CalemCraftFormList',
	title: 'craft',
	icon: 'CalemCraft',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemWoTypeFormList'] = {
	id: 'CalemWoTypeFormList',
	title: 'wo_type',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

/**
 * New request, my requests
 */
CalemMenuDef['CalemWoReqFormNew'] = {
	id: 'CalemWoReqFormNew',
	title: 'wo_new_req',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemWoMineFormList'] = {
	id: 'CalemWoMineFormList',
	title: 'wo_mine',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};
 
CalemMenuDef['CalemTbWoNewReq'] = {
	id: 'CalemTbWoNewReq',
	title: 'wo_new_req',
	icon: 'CalemWo',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoNewReq'}}	
};

CalemMenuDef['CalemWoNewWo'] = {
	id: 'CalemWoNewWo',
	title: 'wo_new_wo',
	icon: 'CalemNew',
	disIcon: null,
	tooltip: null,
	enabled: true,				   
	onSelect: null	
}; 

CalemMenuDef['CalemWoOpenForms'] = {
	id: 'CalemWoOpenForms',
	title: 'wo_open_forms',
	icon: 'CalemOpen',
	disIcon: null,
	tooltip: null,
	enabled: true,				   
	onSelect: null	
}; 

/**
 * Parts usage
 */
CalemMenuDef['CalemTbWoPartNew'] = {
	id: 'CalemTbWoPartNew',
	title: 'wo_part_new',
	icon: 'CalemInCheckout',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoPartNew'}}	
};

CalemMenuDef['CalemTbWoPartAdd'] = {
	id: 'CalemTbWoPartAdd',
	title: 'wo_part_add',
	icon: 'CalemInCheckout',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoPartAdd'}}	
};

CalemMenuDef['CalemTbWoPartReturn'] = {
	id: 'CalemTbWoPartReturn',
	title: 'wo_part_return',
	icon: 'CalemInReturn',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoPartReturn'}}	
};

/**
 * Tools usage
 */
CalemMenuDef['CalemTbWoToolNew'] = {
	id: 'CalemTbWoToolNew',
	title: 'wo_tool_new',
	icon: 'CalemInCheckout',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoToolNew'}}	
};

CalemMenuDef['CalemTbWoToolAdd'] = {
	id: 'CalemTbWoToolAdd',
	title: 'wo_tool_add',
	icon: 'CalemInCheckout',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoToolAdd'}}	
};

CalemMenuDef['CalemTbWoToolReturn'] = {
	id: 'CalemTbWoToolReturn',
	title: 'wo_tool_return',
	icon: 'CalemInReturn',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoToolReturn'}}	
};

/**
 * Meter reading
 */
CalemMenuDef['CalemTbWoMeterNew'] = {
	id: 'CalemTbWoMeterNew',
	title: 'wo_meter_new',
	icon: 'CalemNew',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoMeterNew'}}	
};

CalemMenuDef['CalemTbWoMeterAdd'] = {
	id: 'CalemTbWoMeterAdd',
	title: 'wo_meter_add',
	icon: 'CalemNew',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoMeterAdd'}}	
};

CalemMenuDef['CalemTbWoMeterHistory'] = {
	id: 'CalemTbWoMeterHistory',
	title: 'wo_meter_history',
	icon: 'CalemOpen',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenWoMeterHistory'}}	
};

CalemMenuDef['CalemTbWoReopen'] = {
	id: 'CalemTbWoReopen',
	title: 'wo_reopen_wo',
	icon: 'CalemReopen',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'ReopenWo'}}	
};

CalemMenuDef['CalemTbWoStatusLog'] = {
	id: 'CalemTbWoStatusLog',
	title: 'wo_view_status_log',
	icon: 'CalemOpen',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'WoStatusLog'}}	
};

//My stuff
CalemMenuDef['CalemWoMyAssignmentFormList'] = {
	id: 'CalemWoMyAssignmentFormList',
	title: 'wo_my_assignment',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemWoMyRequestFormList'] = {
	id: 'CalemWoMyRequestFormList',
	title: 'wo_my_request',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemWoMyTeamAssignmentFormList'] = {
	id: 'CalemWoMyTeamAssignmentFormList',
	title: 'wo_my_team',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};


//Wo gen log
CalemMenuDef['CalemWoGenLogFormList'] = {
	id: 'CalemWoGenLogFormList',
	title: 'wo_generation',
	icon: 'CalemWo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};
