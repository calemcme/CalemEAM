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
CalemItemDef['CalemPmFormList']={
	CalemFormInfo: {
		id: 'CalemPmFormList',
		title: 'pm_list',
		icon: 'CalemPm',
		controller: 'CalemPmFormList',
		model: 'pm', 
		view: {CalemViewRefInfo: {id: 'CalemPmViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPmFormSearch'
	}
}

CalemItemDef['CalemPmFormLookup']={
	CalemFormInfo: {
		id: 'CalemPmFormLookup',
		title: 'pm_lookup',
		icon: 'CalemPm',
		controller: 'CalemPmFormLookup',
		model: 'pm', 
		view: {CalemViewRefInfo: {id: 'CalemPmViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPmFormSearch'
	}
}

CalemItemDef['CalemPmFormNew']={
	CalemFormInfo: {
		id: 'CalemPmFormNew',
		title: 'pm',
		icon: 'CalemPm',
		controller: 'CalemPmFormNew',
		model: 'pm', 
		view: {CalemViewRefInfo: {id: 'CalemPmViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmFormEdit',
		title: 'pm',
		icon: 'CalemPm',
		controller: 'CalemPmFormEdit',
		model: 'pm', 
   	view: {CalemViewRefInfo: {id: 'CalemPmViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmFormRead']={
	CalemFormInfo: {
		id: 'CalemPmFormRead',
		title: 'pm',
		icon: 'CalemPm',
		controller: 'CalemPmFormRead',
		model: 'pm', 
		view: {CalemViewRefInfo: {id: 'CalemPmViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmFormSearch']={
	CalemFormInfo: {
		id: 'CalemPmFormSearch',
		title: 'pm',
		icon: 'CalemPm',
		controller: 'CalemFormSearchEdit',
		model: 'pm', 
		view: {CalemViewRefInfo: {id: 'CalemPmViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemPmFormMdTab',
		title: 'pm',
		icon: 'CalemPm',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_labor', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemPmFormRead']},
					
					'tab_labor' : {CalemTabLayoutInfo: ['CalemPmLaborFormList','CalemPmDowntimeFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemPmFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemPmLaborFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmToolFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmPartFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmDowntimeFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmStepFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmSafetyFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmDocFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmAssetFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmDependencyFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmCommentFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemPmAuditFormList', link: {CalemFieldMdInfo: {fld: 'pm_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemPmFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemPmFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemPmLaborFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmLaborFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemPmToolFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmToolFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemPmPartFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmPartFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemPmDowntimeFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmDowntimeFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
		  
		  'CalemPmStepFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmStepFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			
		  'CalemPmSafetyFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmSafetyFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			'CalemPmDocFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmDocFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemPmAssetFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmAssetFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemPmDependencyFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmDependencyFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemPmAuditFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmAuditFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemPmCommentFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPmCommentFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
	 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_pm_main', fixed: 1}
		  },
		  
		  'tab_asset': {
		  		CalemTabInfo: {id: 'tab_pm_asset'}
		  },
		  
		  'tab_labor': {
		  		CalemTabInfo: {id: 'tab_pm_labor'}
		  },
		  
		  'tab_material': {
		  		CalemTabInfo: {id: 'tab_pm_material'}
		  },
		  
		  'tab_step': {
		  		CalemTabInfo: {id: 'tab_pm_step'}
		  },
		  
		  'tab_downtime': {
		  		CalemTabInfo: {id: 'tab_pm_downtime'}
		  },
		  
		  'tab_audit': {
		  		CalemTabInfo: {id: 'tab_pm_audit'}
		  },
		  
		  'tab_dependency': {
		  		CalemTabInfo: {id: 'tab_pm_dependency'}
		  },
		  
		  'tab_document': {
		  		CalemTabInfo: {id: 'tab_pm_document'}
		  },
		  
		  'tab_misc': {
		  		CalemTabInfo: {id: 'tab_asset_misc'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}

/**
 * Craft
 */
CalemItemDef['CalemPmLaborFormList']={
	CalemFormInfo: {
		id: 'CalemPmLaborFormList',
		title: 'pm_labor',
		icon: 'CalemPm',
		controller: 'CalemPmLaborFormList',
		model: 'pm_labor', 
		view: {CalemViewRefInfo: {id: 'CalemPmLaborViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmLaborFormNew']={
	CalemFormInfo: {
		id: 'CalemPmLaborFormNew',
		title: 'pm_labor',
		icon: 'CalemPm',
		controller: 'CalemPmLaborFormNew',
		model: 'pm_labor', 
		view: {CalemViewRefInfo: {id: 'CalemPmLaborViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmLaborFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmLaborFormEdit',
		title: 'pm_labor',
		icon: 'CalemPm',
		controller: 'CalemPmLaborFormEdit',
		model: 'pm_labor', 
   	view: {CalemViewRefInfo: {id: 'CalemPmLaborViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmLaborFormRead']={
	CalemFormInfo: {
		id: 'CalemPmLaborFormRead',
		title: 'pm_labor',
		icon: 'CalemPm',
		controller: 'CalemPmLaborFormRead',
		model: 'pm_labor', 
		view: {CalemViewRefInfo: {id: 'CalemPmLaborViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * PmTool
 */
CalemItemDef['CalemPmToolFormList']={
	CalemFormInfo: {
		id: 'CalemPmToolFormList',
		title: 'pm_tool',
		icon: 'CalemPm',
		controller: 'CalemPmToolFormList',
		model: 'pm_tool', 
		view: {CalemViewRefInfo: {id: 'CalemPmToolViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmToolFormNew']={
	CalemFormInfo: {
		id: 'CalemPmToolFormNew',
		title: 'pm_tool',
		icon: 'CalemPm',
		controller: 'CalemPmToolFormNew',
		model: 'pm_tool', 
		view: {CalemViewRefInfo: {id: 'CalemPmToolViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmToolFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmToolFormEdit',
		title: 'pm_tool',
		icon: 'CalemPm',
		controller: 'CalemPmToolFormEdit',
		model: 'pm_tool', 
		view: {CalemViewRefInfo: {id: 'CalemPmToolViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmToolFormRead']={
	CalemFormInfo: {
		id: 'CalemPmToolFormRead',
		title: 'pm_tool',
		icon: 'CalemPm',
		controller: 'CalemPmToolFormRead',
		model: 'pm_tool', 
		view: {CalemViewRefInfo: {id: 'CalemPmToolViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Part
 */
CalemItemDef['CalemPmPartFormList']={
	CalemFormInfo: {
		id: 'CalemPmPartFormList',
		title: 'pm_part',
		icon: 'CalemPm',
		controller: 'CalemPmPartFormList',
		model: 'pm_part', 
		view: {CalemViewRefInfo: {id: 'CalemPmPartViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmPartFormNew']={
	CalemFormInfo: {
		id: 'CalemPmPartFormNew',
		title: 'pm_part',
		icon: 'CalemPm',
		controller: 'CalemPmPartFormNew',
		model: 'pm_part', 
		view: {CalemViewRefInfo: {id: 'CalemPmPartViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmPartFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmPartFormEdit',
		title: 'pm_part',
		icon: 'CalemPm',
		controller: 'CalemPmPartFormEdit',
		model: 'pm_part', 
   	view: {CalemViewRefInfo: {id: 'CalemPmPartViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmPartFormRead']={
	CalemFormInfo: {
		id: 'CalemPmPartFormRead',
		title: 'pm_part',
		icon: 'CalemPm',
		controller: 'CalemPmPartFormRead',
		model: 'pm_part', 
		view: {CalemViewRefInfo: {id: 'CalemPmPartViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Downtime
 */
CalemItemDef['CalemPmDowntimeFormList']={
	CalemFormInfo: {
		id: 'CalemPmDowntimeFormList',
		title: 'pm_downtime',
		icon: 'CalemPm',
		controller: 'CalemPmDowntimeFormList',
		model: 'pm_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemPmDowntimeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmDowntimeFormNew']={
	CalemFormInfo: {
		id: 'CalemPmDowntimeFormNew',
		title: 'pm_downtime',
		icon: 'CalemPm',
		controller: 'CalemPmDowntimeFormNew',
		model: 'pm_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemPmDowntimeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmDowntimeFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmDowntimeFormEdit',
		title: 'pm_downtime',
		icon: 'CalemPm',
		controller: 'CalemPmDowntimeFormEdit',
		model: 'pm_downtime', 
   	view: {CalemViewRefInfo: {id: 'CalemPmDowntimeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmDowntimeFormRead']={
	CalemFormInfo: {
		id: 'CalemPmDowntimeFormRead',
		title: 'pm_downtime',
		icon: 'CalemPm',
		controller: 'CalemPmDowntimeFormRead',
		model: 'pm_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemPmDowntimeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * PmStep
 */
CalemItemDef['CalemPmStepFormList']={
	CalemFormInfo: {
		id: 'CalemPmStepFormList',
		title: 'pm_step',
		icon: 'CalemPm',
		controller: 'CalemPmStepFormList',
		model: 'pm_step', 
		view: {CalemViewRefInfo: {id: 'CalemPmStepViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmStepFormNew']={
	CalemFormInfo: {
		id: 'CalemPmStepFormNew',
		title: 'pm_step',
		icon: 'CalemPm',
		controller: 'CalemPmStepFormNew',
		model: 'pm_step', 
		view: {CalemViewRefInfo: {id: 'CalemPmStepViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmStepFormRead']={
	CalemFormInfo: {
		id: 'CalemPmStepFormRead',
		title: 'pm_step',
		icon: 'CalemPm',
		controller: 'CalemPmStepFormRead',
		model: 'pm_step', 
		view: {CalemViewRefInfo: {id: 'CalemPmStepViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmStepFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmStepFormEdit',
		title: 'pm_step',
		icon: 'CalemPm',
		controller: 'CalemPmStepFormEdit',
		model: 'pm_step', 
		view: {CalemViewRefInfo: {id: 'CalemPmStepViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
/**
 * PmSafety
 */
CalemItemDef['CalemPmSafetyFormList']={
	CalemFormInfo: {
		id: 'CalemPmSafetyFormList',
		title: 'pm_safety',
		icon: 'CalemPm',
		controller: 'CalemPmSafetyFormList',
		model: 'pm_safety', 
		view: {CalemViewRefInfo: {id: 'CalemPmSafetyViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmSafetyFormNew']={
	CalemFormInfo: {
		id: 'CalemPmSafetyFormNew',
		title: 'pm_safety',
		icon: 'CalemPm',
		controller: 'CalemPmSafetyFormNew',
		model: 'pm_safety', 
		view: {CalemViewRefInfo: {id: 'CalemPmSafetyViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmSafetyFormRead']={
	CalemFormInfo: {
		id: 'CalemPmSafetyFormRead',
		title: 'pm_safety',
		icon: 'CalemPm',
		controller: 'CalemPmSafetyFormRead',
		model: 'pm_safety', 
		view: {CalemViewRefInfo: {id: 'CalemPmSafetyViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmSafetyFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmSafetyFormEdit',
		title: 'pm_safety',
		icon: 'CalemPm',
		controller: 'CalemPmSafetyFormEdit',
		model: 'pm_safety', 
		view: {CalemViewRefInfo: {id: 'CalemPmSafetyViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * PmDoc
 */
CalemItemDef['CalemPmDocFormList']={
	CalemFormInfo: {
		id: 'CalemPmDocFormList',
		title: 'pm_doc',
		icon: 'CalemPm',
		controller: 'CalemPmDocFormList',
		model: 'pm_doc', 
		view: {CalemViewRefInfo: {id: 'CalemPmDocViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmDocFormNew']={
	CalemFormInfo: {
		id: 'CalemPmDocFormNew',
		title: 'pm_doc',
		icon: 'CalemPm',
		controller: 'CalemPmDocFormNew',
		model: 'pm_doc', 
		view: {CalemViewRefInfo: {id: 'CalemPmDocViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmDocFormRead']={
	CalemFormInfo: {
		id: 'CalemPmDocFormRead',
		title: 'pm_doc',
		icon: 'CalemPm',
		controller: 'CalemPmDocFormRead',
		model: 'pm_doc', 
		view: {CalemViewRefInfo: {id: 'CalemPmDocViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmDocFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmDocFormEdit',
		title: 'pm_doc',
		icon: 'CalemPm',
		controller: 'CalemPmDocFormEdit',
		model: 'pm_doc', 
		view: {CalemViewRefInfo: {id: 'CalemPmDocViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * PmAudit
 */
CalemItemDef['CalemPmAuditFormList']={
	CalemFormInfo: {
		id: 'CalemPmAuditFormList',
		title: 'pm_audit',
		icon: 'CalemPm',
		controller: 'CalemPmAuditFormList',
		model: 'pm_audit', 
		view: {CalemViewRefInfo: {id: 'CalemPmAuditViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAuditFormNew']={
	CalemFormInfo: {
		id: 'CalemPmAuditFormNew',
		title: 'pm_audit',
		icon: 'CalemPm',
		controller: 'CalemPmAuditFormNew',
		model: 'pm_audit', 
		view: {CalemViewRefInfo: {id: 'CalemPmAuditViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAuditFormRead']={
	CalemFormInfo: {
		id: 'CalemPmAuditFormRead',
		title: 'pm_audit',
		icon: 'CalemPm',
		controller: 'CalemPmAuditFormRead',
		model: 'pm_audit', 
		view: {CalemViewRefInfo: {id: 'CalemPmAuditViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAuditFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmAuditFormEdit',
		title: 'pm_audit',
		icon: 'CalemPm',
		controller: 'CalemPmAuditFormEdit',
		model: 'pm_audit', 
		view: {CalemViewRefInfo: {id: 'CalemPmAuditViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * PmDependency
 */
CalemItemDef['CalemPmDependencyFormList']={
	CalemFormInfo: {
		id: 'CalemPmDependencyFormList',
		title: 'pm_dependency',
		icon: 'CalemPm',
		controller: 'CalemPmDependencyFormList',
		model: 'pm_dependency', 
		view: {CalemViewRefInfo: {id: 'CalemPmDependencyViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmDependencyFormNew']={
	CalemFormInfo: {
		id: 'CalemPmDependencyFormNew',
		title: 'pm_dependency',
		icon: 'CalemPm',
		controller: 'CalemPmDependencyFormNew',
		model: 'pm_dependency', 
		view: {CalemViewRefInfo: {id: 'CalemPmDependencyViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmDependencyFormRead']={
	CalemFormInfo: {
		id: 'CalemPmDependencyFormRead',
		title: 'pm_dependency',
		icon: 'CalemPm',
		controller: 'CalemPmDependencyFormRead',
		model: 'pm_dependency', 
		view: {CalemViewRefInfo: {id: 'CalemPmDependencyViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmDependencyFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmDependencyFormEdit',
		title: 'pm_dependency',
		icon: 'CalemPm',
		controller: 'CalemPmDependencyFormEdit',
		model: 'pm_dependency', 
		view: {CalemViewRefInfo: {id: 'CalemPmDependencyViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * PmAsset
 */
CalemItemDef['CalemPmAssetFormList']={
	CalemFormInfo: {
		id: 'CalemPmAssetFormList',
		title: 'pm_asset',
		icon: 'CalemPm',
		controller: 'CalemPmAssetFormList',
		model: 'pm_asset', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAssetFormNew']={
	CalemFormInfo: {
		id: 'CalemPmAssetFormNew',
		title: 'pm_asset',
		icon: 'CalemPm',
		controller: 'CalemPmAssetFormNew',
		model: 'pm_asset', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAssetFormRead']={
	CalemFormInfo: {
		id: 'CalemPmAssetFormRead',
		title: 'pm_asset',
		icon: 'CalemPm',
		controller: 'CalemPmAssetFormRead',
		model: 'pm_asset', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAssetFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmAssetFormEdit',
		title: 'pm_asset',
		icon: 'CalemPm',
		controller: 'CalemPmAssetFormEdit',
		model: 'pm_asset', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Pm comment
 */
CalemItemDef['CalemPmCommentFormList']={
	CalemFormInfo: {
		id: 'CalemPmCommentFormList',
		title: 'pm_comment',
		icon: 'CalemPm',
		controller: 'CalemPmCommentFormList',
		model: 'pm_comment', 
		view: {CalemViewRefInfo: {id: 'CalemPmCommentViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmCommentFormNew']={
	CalemFormInfo: {
		id: 'CalemPmCommentFormNew',
		title: 'pm_comment',
		icon: 'CalemPm',
		controller: 'CalemPmCommentFormNew',
		model: 'pm_comment', 
		view: {CalemViewRefInfo: {id: 'CalemPmCommentViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmCommentFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmCommentFormEdit',
		title: 'pm_comment',
		icon: 'CalemPm',
		controller: 'CalemPmCommentFormEdit',
		model: 'pm_comment', 
   	view: {CalemViewRefInfo: {id: 'CalemPmCommentViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmCommentFormRead']={
	CalemFormInfo: {
		id: 'CalemPmCommentFormRead',
		title: 'pm_comment',
		icon: 'CalemPm',
		controller: 'CalemPmCommentFormRead',
		model: 'pm_comment', 
		view: {CalemViewRefInfo: {id: 'CalemPmCommentViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}


/**
 * Meter
 */
CalemItemDef['CalemPmAssetMeterFormList']={
	CalemFormInfo: {
		id: 'CalemPmAssetMeterFormList',
		title: 'pm_meter',
		icon: 'CalemPm',
		controller: 'CalemPmAssetMeterFormList',
		model: 'pm_meter', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetMeterViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAssetMeterFormNew']={
	CalemFormInfo: {
		id: 'CalemPmAssetMeterFormNew',
		title: 'pm_meter',
		icon: 'CalemPm',
		controller: 'CalemPmAssetMeterFormNew',
		model: 'pm_meter', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetMeterViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAssetMeterFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmAssetMeterFormEdit',
		title: 'pm_meter',
		icon: 'CalemPm',
		controller: 'CalemPmAssetMeterFormEdit',
		model: 'pm_meter', 
   	view: {CalemViewRefInfo: {id: 'CalemPmAssetMeterViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAssetMeterFormRead']={
	CalemFormInfo: {
		id: 'CalemPmAssetMeterFormRead',
		title: 'pm_meter',
		icon: 'CalemPm',
		controller: 'CalemPmAssetMeterFormRead',
		model: 'pm_meter', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetMeterViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Season
 */
CalemItemDef['CalemPmAssetSeasonFormList']={
	CalemFormInfo: {
		id: 'CalemPmAssetSeasonFormList',
		title: 'pm_season',
		icon: 'CalemPm',
		controller: 'CalemPmAssetSeasonFormList',
		model: 'pm_season', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetSeasonViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAssetSeasonFormNew']={
	CalemFormInfo: {
		id: 'CalemPmAssetSeasonFormNew',
		title: 'pm_season',
		icon: 'CalemPm',
		controller: 'CalemPmAssetSeasonFormNew',
		model: 'pm_season', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetSeasonViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAssetSeasonFormEdit']={
	CalemFormInfo: {
		id: 'CalemPmAssetSeasonFormEdit',
		title: 'pm_season',
		icon: 'CalemPm',
		controller: 'CalemPmAssetSeasonFormEdit',
		model: 'pm_season', 
   	view: {CalemViewRefInfo: {id: 'CalemPmAssetSeasonViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPmAssetSeasonFormRead']={
	CalemFormInfo: {
		id: 'CalemPmAssetSeasonFormRead',
		title: 'pm_season',
		icon: 'CalemPm',
		controller: 'CalemPmAssetSeasonFormRead',
		model: 'pm_season', 
		view: {CalemViewRefInfo: {id: 'CalemPmAssetSeasonViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}


