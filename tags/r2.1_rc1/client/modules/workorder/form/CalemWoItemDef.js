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
 * Workorder forms
 */
CalemItemDef['CalemWoFormList']={
	CalemFormInfo: {
		id: 'CalemWoFormList',
		title: 'wo_all',
		icon: 'CalemWo',
		controller: 'CalemWoFormList',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemWoFormSearch'
	}
}

CalemItemDef['CalemWoFormLookup']={
	CalemFormInfo: {
		id: 'CalemWoFormLookup',
		title: 'wo_all',
		icon: 'CalemWo',
		controller: 'CalemWoFormLookup',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemWoFormSearch'
	}
}

CalemItemDef['CalemWoFormNew']={
	CalemFormInfo: {
		id: 'CalemWoFormNew',
		title: 'workorder',
		icon: 'CalemWo',
		controller: 'CalemWoFormNew',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoFormRead']={
	CalemFormInfo: {
		id: 'CalemWoFormRead',
		title: 'workorder',
		icon: 'CalemWo',
		controller: 'CalemWoFormRead',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoFormEdit',
		title: 'workorder',
		icon: 'CalemWo',
		controller: 'CalemWoFormEdit',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoFormSearch']={
	CalemFormInfo: {
		id: 'CalemWoFormSearch',
		title: 'workorder',
		icon: 'CalemWo',
		controller: 'CalemFormSearchEdit',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemWoFormMdTab',
		title: 'workorder',
		icon: 'CalemWo',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_step', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemWoFormRead']},
					
					'tab_step' : {CalemTabLayoutInfo: ['CalemWoStepFormList','CalemWoSafetyFormList','CalemWoDocFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemWoFormRead',
			      items: 
			             [
			              //Planned
			              {CalemFormLinkInfo: {id: 'CalemWoPlannedLaborFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoPlannedToolFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoPlannedPartFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoPlannedDowntimeFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              
			              {CalemFormLinkInfo: {id: 'CalemWoDocFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoMeterFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              //Sched
			              {CalemFormLinkInfo: {id: 'CalemWoSchedLaborFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              //Used
			              {CalemFormLinkInfo: {id: 'CalemWoStepFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoSafetyFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              
			              {CalemFormLinkInfo: {id: 'CalemWoLaborFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoPartFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoToolFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoDowntimeFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },

			              {CalemFormLinkInfo: {id: 'CalemWoCommentFormList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} }
			              
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemWoFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemWoFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemWoPlannedLaborFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPlannedLaborFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoPlannedToolFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPlannedToolFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoPlannedPartFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPlannedPartFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoPlannedDowntimeFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPlannedDowntimeFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoDocFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoDocFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoMeterFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoMeterFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoSchedLaborFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoSchedLaborFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 			 
			 'CalemWoStepFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoStepFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoSafetyFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoSafetyFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
		  
		   'CalemWoLaborFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoLaborFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoToolFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoToolFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoPartFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPartFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoDowntimeFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoDowntimeFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoCommentFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoCommentFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_wo_main', fixed: 1}
		  },
		  
		  'tab_instruction': {
		  		CalemTabInfo: {id: 'tab_wo_instruction'}
		  },
		  
		  'tab_step': {
		  		CalemTabInfo: {id: 'tab_wo_step'}
		  },
		  
		  'tab_labor': {
		  		CalemTabInfo: {id: 'tab_wo_labor'}
		  },
		  
		  'tab_part': {
		  		CalemTabInfo: {id: 'tab_wo_part'}
		  },
		  
		  'tab_tool': {
		  		CalemTabInfo: {id: 'tab_wo_tool'}
		  },
		  
		  'tab_downtime': {
		  		CalemTabInfo: {id: 'tab_wo_downtime'}
		  },
		  
		  'tab_misc': {
		  		CalemTabInfo: {id: 'tab_wo_misc'}
		  },
		  
		  'tab_meter': {
		  		CalemTabInfo: {id: 'tab_wo_meter'}
		  },
		  
		  'tab_comment': {
		  		CalemTabInfo: {id: 'tab_wo_comment'}
		  },
		  
		  'tab_document': {
		  		CalemTabInfo: {id: 'tab_wo_document'}
		  },
		  
		  'tab_status': {
		  		CalemTabInfo: {id: 'tab_wo_status'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}
	             			              
/**
 * New request, my request
 */
CalemItemDef['CalemWoReqFormNew']={
	CalemFormInfo: {
		id: 'CalemWoReqFormNew',
		title: 'wo_new_req',
		icon: 'CalemWo',
		controller: 'CalemWoReqFormNew',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoReqViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoNoPmFormNew']={
	CalemFormInfo: {
		id: 'CalemWoNoPmFormNew',
		title: 'wo_new_no_pm',
		icon: 'CalemWo',
		controller: 'CalemWoNoPmFormNew',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoNoPmViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
 
CalemItemDef['CalemWoMineFormList']={
	CalemFormInfo: {
		id: 'CalemWoMineFormList',
		title: 'wo_mine',
		icon: 'CalemWo',
		controller: 'CalemWoMineFormList',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoMineViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
} 

/**
 * New from PM
 */
CalemItemDef['CalemNewWoAssetFormNew']={
	CalemFormInfo: {
		id: 'CalemNewWoAssetFormNew',
		title: 'wo_new_pm',
		icon: 'CalemWo',
		controller: 'CalemNewWoAssetFormNew',
		model: 'wo_vt_new_pm', 
		view: {CalemViewRefInfo: {id: 'CalemNewWoAssetViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
} 

CalemItemDef['CalemNewWoPmFormLookup']={
	CalemFormInfo: {
		id: 'CalemNewWoPmFormLookup',
		title: 'wo_new_pm',
		icon: 'CalemWo',
		controller: 'CalemNewWoPmFormLookup',
		model: 'wo_wt_new_pm', 
		view: {CalemViewRefInfo: {id: 'CalemPmViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPmFormSearch'
	}
} 

/**
 * Craft
 */
CalemItemDef['CalemCraftFormList']={
	CalemFormInfo: {
		id: 'CalemCraftFormList',
		title: 'craft_list',
		icon: 'CalemCraft',
		controller: 'CalemCraftFormList',
		model: 'craft', 
		view: {CalemViewRefInfo: {id: 'CalemCraftViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemCraftFormSearch'
	}
}

CalemItemDef['CalemCraftFormLookup']={
	CalemFormInfo: {
		id: 'CalemCraftFormLookup',
		title: 'craft',
		icon: 'CalemCraft',
		controller: 'CalemCraftFormLookup',
		model: 'craft', 
		view: {CalemViewRefInfo: {id: 'CalemCraftViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemCraftFormSearch'
	}
}

CalemItemDef['CalemCraftFormNew']={
	CalemFormInfo: {
		id: 'CalemCraftFormNew',
		title: 'craft',
		icon: 'CalemCraft',
		controller: 'CalemCraftFormNew',
		model: 'craft', 
		view: {CalemViewRefInfo: {id: 'CalemCraftViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemCraftFormEdit']={
	CalemFormInfo: {
		id: 'CalemCraftFormEdit',
		title: 'craft',
		icon: 'CalemCraft',
		controller: 'CalemCraftFormEdit',
		model: 'craft', 
   	view: {CalemViewRefInfo: {id: 'CalemCraftViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemCraftFormRead']={
	CalemFormInfo: {
		id: 'CalemCraftFormRead',
		title: 'craft',
		icon: 'CalemCraft',
		controller: 'CalemCraftFormRead',
		model: 'craft', 
		view: {CalemViewRefInfo: {id: 'CalemCraftViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemCraftFormSearch']={
	CalemFormInfo: {
		id: 'CalemCraftFormSearch',
		title: 'craft',
		icon: 'CalemCraft',
		controller: 'CalemFormSearchEdit',
		model: 'craft', 
		view: {CalemViewRefInfo: {id: 'CalemCraftViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Planned labor
CalemItemDef['CalemWoPlannedLaborFormList']={
	CalemFormInfo: {
		id: 'CalemWoPlannedLaborFormList',
		title: 'wo_planned_labor',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedLaborFormList',
		model: 'wo_planned_labor', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedLaborViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedLaborFormNew']={
	CalemFormInfo: {
		id: 'CalemWoPlannedLaborFormNew',
		title: 'wo_planned_labor',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedLaborFormNew',
		model: 'wo_planned_labor', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedLaborViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedLaborFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoPlannedLaborFormEdit',
		title: 'wo_planned_labor',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedLaborFormEdit',
		model: 'wo_planned_labor', 
   	view: {CalemViewRefInfo: {id: 'CalemWoPlannedLaborViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedLaborFormRead']={
	CalemFormInfo: {
		id: 'CalemWoPlannedLaborFormRead',
		title: 'wo_planned_labor',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedLaborFormRead',
		model: 'wo_planned_labor', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedLaborViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Planned part
CalemItemDef['CalemWoPlannedPartFormList']={
	CalemFormInfo: {
		id: 'CalemWoPlannedPartFormList',
		title: 'wo_planned_part',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedPartFormList',
		model: 'wo_planned_part', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedPartViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedPartFormNew']={
	CalemFormInfo: {
		id: 'CalemWoPlannedPartFormNew',
		title: 'wo_planned_part',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedPartFormNew',
		model: 'wo_planned_part', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedPartViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedPartFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoPlannedPartFormEdit',
		title: 'wo_planned_part',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedPartFormEdit',
		model: 'wo_planned_part', 
   	view: {CalemViewRefInfo: {id: 'CalemWoPlannedPartViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedPartFormRead']={
	CalemFormInfo: {
		id: 'CalemWoPlannedPartFormRead',
		title: 'wo_planned_part',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedPartFormRead',
		model: 'wo_planned_part', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedPartViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Planned tool
CalemItemDef['CalemWoPlannedToolFormList']={
	CalemFormInfo: {
		id: 'CalemWoPlannedToolFormList',
		title: 'wo_planned_tool',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedToolFormList',
		model: 'wo_planned_tool', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedToolViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedToolFormNew']={
	CalemFormInfo: {
		id: 'CalemWoPlannedToolFormNew',
		title: 'wo_planned_tool',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedToolFormNew',
		model: 'wo_planned_tool', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedToolViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedToolFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoPlannedToolFormEdit',
		title: 'wo_planned_tool',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedToolFormEdit',
		model: 'wo_planned_tool', 
   	view: {CalemViewRefInfo: {id: 'CalemWoPlannedToolViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedToolFormRead']={
	CalemFormInfo: {
		id: 'CalemWoPlannedToolFormRead',
		title: 'wo_planned_tool',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedToolFormRead',
		model: 'wo_planned_tool', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedToolViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Planned downtime
CalemItemDef['CalemWoPlannedDowntimeFormList']={
	CalemFormInfo: {
		id: 'CalemWoPlannedDowntimeFormList',
		title: 'wo_planned_downtime',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedDowntimeFormList',
		model: 'wo_planned_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedDowntimeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedDowntimeFormNew']={
	CalemFormInfo: {
		id: 'CalemWoPlannedDowntimeFormNew',
		title: 'wo_planned_downtime',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedDowntimeFormNew',
		model: 'wo_planned_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedDowntimeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedDowntimeFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoPlannedDowntimeFormEdit',
		title: 'wo_planned_downtime',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedDowntimeFormEdit',
		model: 'wo_planned_downtime', 
   	view: {CalemViewRefInfo: {id: 'CalemWoPlannedDowntimeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPlannedDowntimeFormRead']={
	CalemFormInfo: {
		id: 'CalemWoPlannedDowntimeFormRead',
		title: 'wo_planned_downtime',
		icon: 'CalemWo',
		controller: 'CalemWoPlannedDowntimeFormRead',
		model: 'wo_planned_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemWoPlannedDowntimeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Doc
CalemItemDef['CalemWoDocFormList']={
	CalemFormInfo: {
		id: 'CalemWoDocFormList',
		title: 'wo_doc',
		icon: 'CalemWo',
		controller: 'CalemWoDocFormList',
		model: 'wo_doc', 
		view: {CalemViewRefInfo: {id: 'CalemWoDocViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoDocFormNew']={
	CalemFormInfo: {
		id: 'CalemWoDocFormNew',
		title: 'wo_doc',
		icon: 'CalemWo',
		controller: 'CalemWoDocFormNew',
		model: 'wo_doc', 
		view: {CalemViewRefInfo: {id: 'CalemWoDocViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoDocFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoDocFormEdit',
		title: 'wo_doc',
		icon: 'CalemWo',
		controller: 'CalemWoDocFormEdit',
		model: 'wo_doc', 
   	view: {CalemViewRefInfo: {id: 'CalemWoDocViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoDocFormRead']={
	CalemFormInfo: {
		id: 'CalemWoDocFormRead',
		title: 'wo_doc',
		icon: 'CalemWo',
		controller: 'CalemWoDocFormRead',
		model: 'wo_doc', 
		view: {CalemViewRefInfo: {id: 'CalemWoDocViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Meter
CalemItemDef['CalemWoMeterFormList']={
	CalemFormInfo: {
		id: 'CalemWoMeterFormList',
		title: 'wo_meter',
		icon: 'CalemWo',
		controller: 'CalemWoMeterFormList',
		model: 'wo_meter', 
		view: {CalemViewRefInfo: {id: 'CalemWoMeterViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoMeterFormNew']={
	CalemFormInfo: {
		id: 'CalemWoMeterFormNew',
		title: 'wo_meter',
		icon: 'CalemWo',
		controller: 'CalemWoMeterFormNew',
		model: 'wo_meter', 
		view: {CalemViewRefInfo: {id: 'CalemWoMeterViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoMeterFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoMeterFormEdit',
		title: 'wo_meter',
		icon: 'CalemWo',
		controller: 'CalemWoMeterFormEdit',
		model: 'wo_meter', 
   	view: {CalemViewRefInfo: {id: 'CalemWoMeterViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoMeterFormRead']={
	CalemFormInfo: {
		id: 'CalemWoMeterFormRead',
		title: 'wo_meter',
		icon: 'CalemWo',
		controller: 'CalemWoMeterFormRead',
		model: 'wo_meter', 
		view: {CalemViewRefInfo: {id: 'CalemWoMeterViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Sched labor
CalemItemDef['CalemWoSchedLaborFormList']={
	CalemFormInfo: {
		id: 'CalemWoSchedLaborFormList',
		title: 'wo_sched_labor',
		icon: 'CalemWo',
		controller: 'CalemWoSchedLaborFormList',
		model: 'wo_sched_labor', 
		view: {CalemViewRefInfo: {id: 'CalemWoSchedLaborViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoSchedLaborFormNew']={
	CalemFormInfo: {
		id: 'CalemWoSchedLaborFormNew',
		title: 'wo_sched_labor',
		icon: 'CalemWo',
		controller: 'CalemWoSchedLaborFormNew',
		model: 'wo_sched_labor', 
		view: {CalemViewRefInfo: {id: 'CalemWoSchedLaborViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoSchedLaborFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoSchedLaborFormEdit',
		title: 'wo_sched_labor',
		icon: 'CalemWo',
		controller: 'CalemWoSchedLaborFormEdit',
		model: 'wo_sched_labor', 
   	view: {CalemViewRefInfo: {id: 'CalemWoSchedLaborViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoSchedLaborFormRead']={
	CalemFormInfo: {
		id: 'CalemWoSchedLaborFormRead',
		title: 'wo_sched_labor',
		icon: 'CalemWo',
		controller: 'CalemWoSchedLaborFormRead',
		model: 'wo_sched_labor', 
		view: {CalemViewRefInfo: {id: 'CalemWoSchedLaborViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Step
CalemItemDef['CalemWoStepFormList']={
	CalemFormInfo: {
		id: 'CalemWoStepFormList',
		title: 'wo_step',
		icon: 'CalemWo',
		controller: 'CalemWoStepFormList',
		model: 'wo_step', 
		view: {CalemViewRefInfo: {id: 'CalemWoStepViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoStepFormNew']={
	CalemFormInfo: {
		id: 'CalemWoStepFormNew',
		title: 'wo_step',
		icon: 'CalemWo',
		controller: 'CalemWoStepFormNew',
		model: 'wo_step', 
		view: {CalemViewRefInfo: {id: 'CalemWoStepViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoStepFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoStepFormEdit',
		title: 'wo_step',
		icon: 'CalemWo',
		controller: 'CalemWoStepFormEdit',
		model: 'wo_step', 
   	view: {CalemViewRefInfo: {id: 'CalemWoStepViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoStepFormRead']={
	CalemFormInfo: {
		id: 'CalemWoStepFormRead',
		title: 'wo_step',
		icon: 'CalemWo',
		controller: 'CalemWoStepFormRead',
		model: 'wo_step', 
		view: {CalemViewRefInfo: {id: 'CalemWoStepViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Safety
CalemItemDef['CalemWoSafetyFormList']={
	CalemFormInfo: {
		id: 'CalemWoSafetyFormList',
		title: 'wo_safety',
		icon: 'CalemWo',
		controller: 'CalemWoSafetyFormList',
		model: 'wo_safety', 
		view: {CalemViewRefInfo: {id: 'CalemWoSafetyViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoSafetyFormNew']={
	CalemFormInfo: {
		id: 'CalemWoSafetyFormNew',
		title: 'wo_safety',
		icon: 'CalemWo',
		controller: 'CalemWoSafetyFormNew',
		model: 'wo_safety', 
		view: {CalemViewRefInfo: {id: 'CalemWoSafetyViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoSafetyFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoSafetyFormEdit',
		title: 'wo_safety',
		icon: 'CalemWo',
		controller: 'CalemWoSafetyFormEdit',
		model: 'wo_safety', 
   	view: {CalemViewRefInfo: {id: 'CalemWoSafetyViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoSafetyFormRead']={
	CalemFormInfo: {
		id: 'CalemWoSafetyFormRead',
		title: 'wo_safety',
		icon: 'CalemWo',
		controller: 'CalemWoSafetyFormRead',
		model: 'wo_safety', 
		view: {CalemViewRefInfo: {id: 'CalemWoSafetyViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Comment
CalemItemDef['CalemWoCommentFormList']={
	CalemFormInfo: {
		id: 'CalemWoCommentFormList',
		title: 'wo_comment',
		icon: 'CalemWo',
		controller: 'CalemWoCommentFormList',
		model: 'wo_comment', 
		view: {CalemViewRefInfo: {id: 'CalemWoCommentViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoCommentFormNew']={
	CalemFormInfo: {
		id: 'CalemWoCommentFormNew',
		title: 'wo_comment',
		icon: 'CalemWo',
		controller: 'CalemWoCommentFormNew',
		model: 'wo_comment', 
		view: {CalemViewRefInfo: {id: 'CalemWoCommentViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoCommentFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoCommentFormEdit',
		title: 'wo_comment',
		icon: 'CalemWo',
		controller: 'CalemWoCommentFormEdit',
		model: 'wo_comment', 
   	view: {CalemViewRefInfo: {id: 'CalemWoCommentViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoCommentFormRead']={
	CalemFormInfo: {
		id: 'CalemWoCommentFormRead',
		title: 'wo_comment',
		icon: 'CalemWo',
		controller: 'CalemWoCommentFormRead',
		model: 'wo_comment', 
		view: {CalemViewRefInfo: {id: 'CalemWoCommentViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}


// labor
CalemItemDef['CalemWoLaborFormList']={
	CalemFormInfo: {
		id: 'CalemWoLaborFormList',
		title: 'wo_labor',
		icon: 'CalemWo',
		controller: 'CalemWoLaborFormList',
		model: 'wo_labor', 
		view: {CalemViewRefInfo: {id: 'CalemWoLaborViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoLaborFormNew']={
	CalemFormInfo: {
		id: 'CalemWoLaborFormNew',
		title: 'wo_labor',
		icon: 'CalemWo',
		controller: 'CalemWoLaborFormNew',
		model: 'wo_labor', 
		view: {CalemViewRefInfo: {id: 'CalemWoLaborViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoLaborFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoLaborFormEdit',
		title: 'wo_labor',
		icon: 'CalemWo',
		controller: 'CalemWoLaborFormEdit',
		model: 'wo_labor', 
   	view: {CalemViewRefInfo: {id: 'CalemWoLaborViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoLaborFormRead']={
	CalemFormInfo: {
		id: 'CalemWoLaborFormRead',
		title: 'wo_labor',
		icon: 'CalemWo',
		controller: 'CalemWoLaborFormRead',
		model: 'wo_labor', 
		view: {CalemViewRefInfo: {id: 'CalemWoLaborViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

// part
CalemItemDef['CalemWoPartFormList']={
	CalemFormInfo: {
		id: 'CalemWoPartFormList',
		title: 'wo_part',
		icon: 'CalemWo',
		controller: 'CalemWoPartFormList',
		model: 'wo_part', 
		view: {CalemViewRefInfo: {id: 'CalemWoPartViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPartFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoPartFormEdit',
		title: 'wo_part',
		icon: 'CalemWo',
		controller: 'CalemWoPartFormEdit',
		model: 'wo_part', 
   	view: {CalemViewRefInfo: {id: 'CalemWoPartViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPartFormRead']={
	CalemFormInfo: {
		id: 'CalemWoPartFormRead',
		title: 'wo_part',
		icon: 'CalemWo',
		controller: 'CalemWoPartFormRead',
		model: 'wo_part', 
		view: {CalemViewRefInfo: {id: 'CalemWoPartViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

// tool
CalemItemDef['CalemWoToolFormList']={
	CalemFormInfo: {
		id: 'CalemWoToolFormList',
		title: 'wo_tool',
		icon: 'CalemWo',
		controller: 'CalemWoToolFormList',
		model: 'wo_tool', 
		view: {CalemViewRefInfo: {id: 'CalemWoToolViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoToolFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoToolFormEdit',
		title: 'wo_tool',
		icon: 'CalemWo',
		controller: 'CalemWoToolFormEdit',
		model: 'wo_tool', 
   	view: {CalemViewRefInfo: {id: 'CalemWoToolViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoToolFormRead']={
	CalemFormInfo: {
		id: 'CalemWoToolFormRead',
		title: 'wo_tool',
		icon: 'CalemWo',
		controller: 'CalemWoToolFormRead',
		model: 'wo_tool', 
		view: {CalemViewRefInfo: {id: 'CalemWoToolViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Downtime
CalemItemDef['CalemWoDowntimeFormList']={
	CalemFormInfo: {
		id: 'CalemWoDowntimeFormList',
		title: 'asset_downtime',
		icon: 'CalemWo',
		controller: 'CalemWoDowntimeFormList',
		model: 'asset_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemWoDowntimeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoDowntimeFormNew']={
	CalemFormInfo: {
		id: 'CalemWoDowntimeFormNew',
		title: 'asset_downtime',
		icon: 'CalemWo',
		controller: 'CalemWoDowntimeFormNew',
		model: 'asset_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemWoDowntimeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoDowntimeFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoDowntimeFormEdit',
		title: 'asset_downtime',
		icon: 'CalemWo',
		controller: 'CalemWoDowntimeFormEdit',
		model: 'asset_downtime', 
   	view: {CalemViewRefInfo: {id: 'CalemWoDowntimeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoDowntimeFormRead']={
	CalemFormInfo: {
		id: 'CalemWoDowntimeFormRead',
		title: 'asset_downtime',
		icon: 'CalemWo',
		controller: 'CalemWoDowntimeFormRead',
		model: 'asset_downtime', 
		view: {CalemViewRefInfo: {id: 'CalemWoDowntimeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Transactions - parts
CalemItemDef['CalemWoPartCheckoutFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoPartCheckoutFormEdit',
		title: 'wo_vt_part_checkout',
		icon: 'CalemWo',
		controller: 'CalemWoPartCheckoutFormEdit',
		model: 'wo_vt_part_checkout', 
		view: {CalemViewRefInfo: {id: 'CalemWoPartCheckoutViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPartAddFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoPartAddFormEdit',
		title: 'wo_vt_part_checkout',
		icon: 'CalemWo',
		controller: 'CalemWoPartAddFormEdit',
		model: 'wo_vt_part_checkout', 
		view: {CalemViewRefInfo: {id: 'CalemWoPartAddViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoPartReturnFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoPartReturnFormEdit',
		title: 'wo_vt_part_return',
		icon: 'CalemWo',
		controller: 'CalemWoPartReturnFormEdit',
		model: 'wo_vt_part_return', 
		view: {CalemViewRefInfo: {id: 'CalemWoPartReturnViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//tools
CalemItemDef['CalemWoToolCheckoutFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoToolCheckoutFormEdit',
		title: 'wo_tool_checkout',
		icon: 'CalemWo',
		controller: 'CalemWoToolCheckoutFormEdit',
		model: 'wo_vt_part_checkout', 
		view: {CalemViewRefInfo: {id: 'CalemWoToolCheckoutViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoToolAddFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoToolAddFormEdit',
		title: 'wo_tool_checkout',
		icon: 'CalemWo',
		controller: 'CalemWoToolAddFormEdit',
		model: 'wo_vt_part_checkout', 
		view: {CalemViewRefInfo: {id: 'CalemWoToolAddViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoToolReturnFormEdit']={
	CalemFormInfo: {
		id: 'CalemWoToolReturnFormEdit',
		title: 'wo_tool_return',
		icon: 'CalemWo',
		controller: 'CalemWoToolReturnFormEdit',
		model: 'wo_vt_part_return', 
		view: {CalemViewRefInfo: {id: 'CalemWoToolReturnViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//meter
CalemItemDef['CalemWoMeterAddReadingFormNew']={
	CalemFormInfo: {
		id: 'CalemWoMeterAddReadingFormNew',
		title: 'wo_meter_add',
		icon: 'CalemWo',
		controller: 'CalemWoMeterAddReadingFormNew',
		model: 'meter_transaction', 
		view: {CalemViewRefInfo: {id: 'CalemWoMeterAddReadingViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoMeterReadingFormList']={
	CalemFormInfo: {
		id: 'CalemWoMeterReadingFormList',
		title: 'meter_transaction',
		icon: 'CalemWo',
		controller: 'CalemWoMeterReadingFormList',
		model: 'meter_transaction', 
		view: {CalemViewRefInfo: {id: 'CalemWoMeterReadingViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Wo status
CalemItemDef['CalemWoStatusLogFormList']={
	CalemFormInfo: {
		id: 'CalemWoStatusLogFormList',
		title: 'wo_status_log',
		icon: 'CalemWo',
		controller: 'CalemWoStatusLogFormList',
		model: 'wo_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemWoStatusLogViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoStatusLogFormRead']={
	CalemFormInfo: {
		id: 'CalemWoStatusLogFormRead',
		title: 'wo_status_log',
		icon: 'CalemWo',
		controller: 'CalemWoStatusLogFormRead',
		model: 'wo_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemWoStatusLogViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoStatusLogNoteFormNew']={
	CalemFormInfo: {
		id: 'CalemWoStatusLogNoteFormNew',
		title: 'wo_status_log',
		icon: 'CalemWo',
		controller: 'CalemWoStatusLogNoteFormNew',
		model: 'wo_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemWoStatusLogNoteViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//My assignments, requests, team requests
CalemItemDef['CalemWoMyAssignmentFormList']={
	CalemFormInfo: {
		id: 'CalemWoMyAssignmentFormList',
		title: 'wo_my_assignment',
		icon: 'CalemWo',
		controller: 'CalemWoMyAssignmentFormList',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoMyAssignmentViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemWoFormSearch'
	}
}

CalemItemDef['CalemWoMyRequestFormList']={
	CalemFormInfo: {
		id: 'CalemWoMyRequestFormList',
		title: 'wo_my_request',
		icon: 'CalemWo',
		controller: 'CalemWoMyRequestFormList',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoMyRequestViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemWoFormSearch'
	}
}

CalemItemDef['CalemWoMyTeamAssignmentFormList']={
	CalemFormInfo: {
		id: 'CalemWoMyTeamAssignmentFormList',
		title: 'wo_my_team',
		icon: 'CalemWo',
		controller: 'CalemWoMyTeamAssignmentFormList',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemWoMyTeamAssignmentViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemWoFormSearch'
	}
}

//Wo gen log
CalemItemDef['CalemWoGenLogFormList']={
	CalemFormInfo: {
		id: 'CalemWoGenLogFormList',
		title: 'wo_generation',
		icon: 'CalemWo',
		controller: 'CalemWoGenLogFormList',
		model: 'wo_generation', 
		view: {CalemViewRefInfo: {id: 'CalemWoGenLogViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemWoGenLogFormRead']={
	CalemFormInfo: {
		id: 'CalemWoGenLogFormRead',
		title: 'wo_generation',
		icon: 'CalemWo',
		controller: 'CalemWoGenLogFormRead',
		model: 'wo_generation', 
		view: {CalemViewRefInfo: {id: 'CalemWoGenLogViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}