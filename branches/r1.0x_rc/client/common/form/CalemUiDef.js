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
 * Common UI class definition.
 */
function CalemMenuDef() {}

function CalemViewDef() {}
function CalemViewCustomDef() {}

function CalemItemDef() {}
CalemItemDef.REPLACE_BY_ID=0;
CalemItemDef.REPLACE_BY_ID_DATA=1;

function CalemModuleDef() {}
function CalemModuleCustomDef() {}
function CalemModListCustomDef() {}

function CalemFormDef() {}
function CalemFormCustomDef() {}

/**
 * Provides lookup based on field/controller
 */
CalemFormDef._getLookupForm =
function(tbl, fld, controller) {
	var rtn=controller.getLookupFormByFld(tbl, fld);
	if (!rtn) {
		rtn=CalemFormDef[tbl].lookup;
	}
	return rtn;
}

/**
 * Common menu definition.
 */
CalemMenuDef.FORM_LISTENER='OpenForm';
CalemMenuDef.PROC_LISTENER='OpenProc';
CalemMenuDef.RPT_LISTENER='OpenReport';

/**
 * Common module menu
 * - New
 * - Form
 * - Procedure
 * - Report
 * - Conf
 * A typical menu's attributes:
 
 CalemMenuDef['CalemNew'] = {
   id: 'CalemNew',
	title: 'menu_new',
	icon: 'CalemNew',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: DwtMenuItem.RADIO_STYLE,				   
	radioGroupId: null,
	idx: null,
	className: null,
	posStyle: null,
	onSelect: null
}; 
 */
//Modules New
CalemMenuDef['CalemModNew'] = {
	id: 'CalemModNew',
	title: 'menu_new',
	icon: 'CalemNew',
	disIcon: null,
	enabled: true,
	tooltip: null,
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: null	
};

//Modules Form
CalemMenuDef['CalemModForm'] = {
	id: 'CalemModForm',
	title: 'menu_form',
	icon: 'CalemForm',
	disIcon: null,
	tooltip: null,
	enabled: true,
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT),				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: null	
};  

//Modules Procedure
CalemMenuDef['CalemModProcedure'] = {
	id: 'CalemModProcedure',
	title: 'menu_procedure',
	icon: 'CalemProcedure',
	disIcon: null,
	tooltip: null,
	enabled: true,
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: null	
}; 

//Modules Report
CalemMenuDef['CalemModReport'] = {
	id: 'CalemModReport',
	title: 'menu_report',
	icon: 'CalemReport',
	disIcon: null,
	tooltip: null,
	enabled: true,
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: null	
};  

//Modules Configuration
CalemMenuDef['CalemModConfiguration'] = {
	id: 'CalemModConfiguration',
	title: 'menu_configuration',
	icon: 'CalemConfiguration',
	disIcon: null,
	tooltip: null,
	enabled: true,
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: null	
};  

/**
 * View's toolbar buttons
 */
// New
CalemMenuDef['CalemTbNew'] = {
	id: 'CalemTbNew',
	title: 'menu_new',
	icon: 'CalemNew',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'NewListener'}}	
};

// Open
CalemMenuDef['CalemTbOpen'] = {
	id: 'CalemTbOpen',
	title: 'menu_open',
	icon: 'CalemOpen',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'OpenListener'}}	
};

// Edit
CalemMenuDef['CalemTbEdit'] = {
	id: 'CalemTbEdit',
	title: 'menu_edit',
	icon: 'CalemEdit',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT),				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'EditListener'}}	
};

// Save
CalemMenuDef['CalemTbSave'] = {
	id: 'CalemTbSave',
	title: 'menu_save',
	icon: 'CalemSave',
	disIcon: 'CalemSaveDisabled',
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'SaveListener'}}
};

// Cancel
CalemMenuDef['CalemTbCancel'] = {
	id: 'CalemTbCancel',
	title: 'menu_cancel',
	icon: 'CalemCancel',
	disIcon: 'CalemCancelDisabled',
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'CancelListener'}}
};

// Delete
CalemMenuDef['CalemTbDelete'] = {
	id: 'CalemTbDelete',
	title: 'menu_delete',
	icon: 'CalemDelete',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'DeleteListener'}}	
};

// Print
CalemMenuDef['CalemTbPrint'] = {
	id: 'CalemTbPrint',
	title: 'menu_print',
	icon: 'CalemPrint',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'PrintListener'}}
};

CalemMenuDef['CalemTbPrintCustomize'] = {
	id: 'CalemTbPrint',
	title: 'menu_print_customize',
	icon: 'CalemPrint',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'PrintCustomizeListener'}}
};

// Prev
CalemMenuDef['CalemTbPrev'] = {
	id: 'CalemTbPrev',
	title: 'menu_prev',
	icon: 'CalemPrev',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'PrevListener'}}	
};

// Next
CalemMenuDef['CalemTbNext'] = {
	id: 'CalemTbNext',
	title: 'menu_next',
	icon: 'CalemNext',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'NextListener'}}
};

// Select
CalemMenuDef['CalemTbSelect'] = {
	id: 'CalemTbSelect',
	title: 'menu_select',
	icon: 'CalemSelect',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'SelectListener'}}	
};

// Customize
CalemMenuDef['CalemTbCustomize'] = {
	id: 'CalemTbCustomize',
	title: 'menu_customize',
	icon: 'CalemCustomize',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'CustomizeListener'}}	
};

// Customize
CalemMenuDef['CalemTbDataRefresh'] = {
	id: 'CalemTbDataRefresh',
	title: 'data_refresh',
	icon: 'CalemDataRefresh',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'DataRefreshListener'}}	
};

// Reset
CalemMenuDef['CalemTbCustomizeReset'] = {
	id: 'CalemTbCustomizeReset',
	title: 'menu_customize_reset',
	icon: 'CalemCustomizeReset',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'CustomizeResetListener'}}	
};


// Search
CalemMenuDef['CalemTbSearch'] = {
	id: 'CalemTbSearch',
	title: 'menu_search',
	icon: 'CalemSearch',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'SearchListener'}}	
};


// Clear search
CalemMenuDef['CalemTbSearchClear'] = {
	id: 'CalemTbSearchClear',
	title: 'menu_search_clear',
	icon: 'CalemSearchClear',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'SearchClearListener'}}	
};

// Refresh
CalemMenuDef['CalemTbRefresh'] = {
	id: 'CalemTbRefresh',
	title: 'menu_refresh',
	icon: 'CalemRefresh',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'RefreshListener'}}	
};

// Apply
CalemMenuDef['CalemTbApply'] = {
	id: 'CalemTbApply',
	title: 'menu_apply',
	icon: 'CalemSelect',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'ApplyListener'}}
};

// Apply
CalemMenuDef['CalemTbApplySave'] = {
	id: 'CalemTbApplySave',
	title: 'menu_apply_save',
	icon: 'CalemApplySave',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT), 				   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'ApplySaveListener'}}
};


//Desktop toolbar menu
CalemMenuDef['CalemLogout'] = {
	id: 'CalemLogout',
	title: 'menu_logout',
	icon: 'CalemLogout',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT),			   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'LogoutListener'}}
};

//Desktop toolbar menu
CalemMenuDef['CalemHelp'] = {
	id: 'CalemHelp',
	title: 'menu_help',
	icon: 'CalemHelp',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT),			   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'HelpListener'}}
};

/**
 * Lookup form definition
 */
//Admin
CalemFormDef['acl_group'] = {
	lookup: 'CalemAclGroupFormLookup'
}

CalemFormDef['users'] = {
	lookup: 'CalemUserFormLookup'	
} 

CalemFormDef['team'] = {
	lookup: 'CalemTeamFormLookup'	
} 

CalemFormDef['dept'] = {
	lookup: 'CalemDeptFormLookup'	
} 

CalemFormDef['craft'] = {
	lookup: 'CalemCraftFormLookup'	
} 

//Asset
CalemFormDef['asset'] = {
	lookup: 'CalemAssetFormLookup'	
} 

CalemFormDef['asset_meter'] = {
	lookup: 'CalemAssetMeterFormLookup'
}

CalemFormDef['asset_type'] = {
	lookup: 'CalemAssetTypeFormLookup'
}

CalemFormDef['meter_type'] = {
	lookup: 'CalemMeterTypeFormLookup'
}

CalemFormDef['manufacturer'] = {
	lookup: 'CalemManufacturerFormLookup'
}

//Budget
CalemFormDef['budget_title'] = {
	lookup: 'CalemBudgetTitleFormLookup'	
}

CalemFormDef['costcode'] = {
	lookup: 'CalemCostcodeFormLookup'	
} 

//Contact
CalemFormDef['contact'] = {
	lookup: 'CalemContactFormLookup'	
} 

//Contractor
CalemFormDef['contractor'] = {
	lookup: 'CalemContractorFormLookup'	
} 

//Failure
CalemFormDef['rcm_failure'] = {
	lookup: 'CalemRcmFailureFormLookup'
}

CalemFormDef['rcm_action'] = {
	lookup: 'CalemRcmActionFormLookup'
}

CalemFormDef['rcm_template'] = {
	lookup: 'CalemRcmTemplateFormLookup'
}

CalemFormDef['rcm_function'] = {
	lookup: 'CalemRcmFunctionFormLookup'
}

//inspection - no need at this time.

//Material
CalemFormDef['inventory'] = {
	lookup: 'CalemInFormLookup'
}

CalemFormDef['uom'] = {
	lookup: 'CalemUomFormLookup'
}

CalemFormDef['in_type']= {
	lookup: 'CalemInTypeFormLookup'
}

CalemFormDef['in_location']= {
	lookup: 'CalemInLocationFormLookup'
}

//pm
CalemFormDef['pm'] = {
	lookup: 'CalemPmFormLookup'	
}

//po
CalemFormDef['po'] = {
	lookup: 'CalemPoFormLookup'	
}

CalemFormDef['vendor'] = {
	lookup: 'CalemVendorFormLookup'	
}

CalemFormDef['tax_code'] = {
	lookup: 'CalemTaxCodeFormLookup'	
}

CalemFormDef['po_address'] = {
	lookup: 'CalemPoAddressFormLookup'	
}

//Project
CalemFormDef['project'] = {
	lookup: 'CalemProjectFormLookup'	
}

CalemFormDef['project_type'] = {
	lookup: 'CalemProjectTypeFormLookup'	
}

//requisition
CalemFormDef['requisition'] = {
	lookup: 'CalemReqFormLookup'	
}

//Schedule
CalemFormDef['shift'] = {
	lookup: 'CalemShiftFormLookup'
}

//Training
CalemFormDef['training_course_type'] = {
	lookup: 'CalemTrainingCourseTypeFormLookup'
}

CalemFormDef['training_course'] = {
	lookup: 'CalemTrainingCourseFormLookup'
}

CalemFormDef['training_certificate'] = {
	lookup: 'CalemTrainingCertificateFormLookup'
}

CalemFormDef['training'] = {
	lookup: 'CalemTrainingFormLookup'
}

//Workorder
CalemFormDef['workorder'] = {
	lookup: 'CalemWoFormLookup'	
}

//Contractor
CalemFormDef['contractor'] = {
	lookup: 'CalemContractorFormLookup'
}

//document
CalemFormDef['document'] = {
	lookup: 'CalemDocFormLookup'
}

//document
CalemFormDef['doc_type'] = {
	lookup: 'CalemDocTypeFormLookup'
}


/**
 * Shared search select form
 */
CalemItemDef['CalemFormSearchSelect']={
	CalemFormInfo: {
		id: 'CalemFormSearchSelect',
		title: 'menu_search', //not used
		icon: 'CalemSearch', //not used
		controller: 'CalemFormSearchSelect',
		model: '',  //not used
		view: {CalemViewRefInfo: {id: 'CalemViewSearchSelect'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
} 