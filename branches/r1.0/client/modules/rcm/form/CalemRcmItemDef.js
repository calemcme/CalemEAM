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
 

CalemItemDef['CalemRcmFailureFormList']={
	CalemFormInfo: {
		id: 'CalemRcmFailureFormList',
		title: 'rcm_failure_list',
		icon: 'CalemRcm',
		controller: 'CalemRcmFailureFormList',
		model: 'rcm_failure', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFailureViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemRcmFailureFormSearch'
	}
}

CalemItemDef['CalemRcmFailureFormLookup']={
	CalemFormInfo: {
		id: 'CalemRcmFailureFormLookup',
		title: 'rcm_failure',
		icon: 'CalemRcm',
		controller: 'CalemRcmFailureFormLookup',
		model: 'rcm_failure', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFailureViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemRcmFailureFormSearch'
	}
}

CalemItemDef['CalemRcmFailureFormNew']={
	CalemFormInfo: {
		id: 'CalemRcmFailureFormNew',
		title: 'rcm_failure',
		icon: 'CalemRcm',
		controller: 'CalemRcmFailureFormNew',
		model: 'rcm_failure', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFailureViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmFailureFormRead']={
	CalemFormInfo: {
		id: 'CalemRcmFailureFormRead',
		title: 'rcm_failure',
		icon: 'CalemRcm',
		controller: 'CalemRcmFailureFormRead',
		model: 'rcm_failure', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFailureViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmFailureFormEdit']={
	CalemFormInfo: {
		id: 'CalemRcmFailureFormEdit',
		title: 'rcm_failure',
		icon: 'CalemRcm',
		controller: 'CalemRcmFailureFormEdit',
		model: 'rcm_failure', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFailureViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmFailureFormSearch']={
	CalemFormInfo: {
		id: 'CalemRcmFailureFormSearch',
		title: 'rcm_failure',
		icon: 'CalemRcm',
		controller: 'CalemFormSearchEdit',
		model: 'rcm_failure', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFailureViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmFailureFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemRcmFailureFormMdTab',
		title: 'rcm_failure',
		icon: 'CalemRcm',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_action', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemRcmFailureFormRead']},
					
					'tab_action' : {CalemTabLayoutInfo: ['CalemRcmActionFormList','CalemRcmConsequenceFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemRcmFailureFormRead',
			      items: 
			             [
			              //Planned
			              {CalemFormLinkInfo: {id: 'CalemRcmActionFormList', link: {CalemFieldMdInfo: {fld: 'failure_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemRcmConsequenceFormList', link: {CalemFieldMdInfo: {fld: 'failure_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemRcmFailureFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemRcmFailureFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemRcmActionFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemRcmActionFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemRcmConsequenceFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemRcmConsequenceFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_rcm_main', fixed: 1}
		  },
		  
		  'tab_action': {
		  		CalemTabInfo: {id: 'tab_rcm_action'}
		  },
		  
		  'tab_consequence': {
		  		CalemTabInfo: {id: 'tab_rcm_consequence'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}

/**
 * RcmTemplate
 */
CalemItemDef['CalemRcmTemplateFormList']={
	CalemFormInfo: {
		id: 'CalemRcmTemplateFormList',
		title: 'rcm_template',
		icon: 'CalemRcm',
		controller: 'CalemRcmTemplateFormList',
		model: 'rcm_template', 
		view: {CalemViewRefInfo: {id: 'CalemRcmTemplateViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemRcmTemplateFormSearch'
	}
}

CalemItemDef['CalemRcmTemplateFormLookup']={
	CalemFormInfo: {
		id: 'CalemRcmTemplateFormLookup',
		title: 'rcm_template',
		icon: 'CalemRcm',
		controller: 'CalemRcmTemplateFormLookup',
		model: 'rcm_template', 
		view: {CalemViewRefInfo: {id: 'CalemRcmTemplateViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemRcmTemplateFormSearch'
	}
}

CalemItemDef['CalemRcmTemplateFormNew']={
	CalemFormInfo: {
		id: 'CalemRcmTemplateFormNew',
		title: 'rcm_template',
		icon: 'CalemRcm',
		controller: 'CalemRcmTemplateFormNew',
		model: 'rcm_template', 
		view: {CalemViewRefInfo: {id: 'CalemRcmTemplateViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmTemplateFormEdit']={
	CalemFormInfo: {
		id: 'CalemRcmTemplateFormEdit',
		title: 'rcm_template',
		icon: 'CalemRcm',
		controller: 'CalemRcmTemplateFormEdit',
		model: 'rcm_template', 
   	view: {CalemViewRefInfo: {id: 'CalemRcmTemplateViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmTemplateFormRead']={
	CalemFormInfo: {
		id: 'CalemRcmTemplateFormRead',
		title: 'rcm_template',
		icon: 'CalemRcm',
		controller: 'CalemRcmTemplateFormRead',
		model: 'rcm_template', 
		view: {CalemViewRefInfo: {id: 'CalemRcmTemplateViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmTemplateFormSearch']={
	CalemFormInfo: {
		id: 'CalemRcmTemplateFormSearch',
		title: 'rcm_template',
		icon: 'CalemRcm',
		controller: 'CalemFormSearchEdit',
		model: 'rcm_template', 
		view: {CalemViewRefInfo: {id: 'CalemRcmTemplateViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * RcmFunction
 */
CalemItemDef['CalemRcmFunctionFormList']={
	CalemFormInfo: {
		id: 'CalemRcmFunctionFormList',
		title: 'rcm_function',
		icon: 'CalemRcm',
		controller: 'CalemRcmFunctionFormList',
		model: 'rcm_function', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFunctionViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemRcmFunctionFormSearch'
	}
}

CalemItemDef['CalemRcmFunctionFormLookup']={
	CalemFormInfo: {
		id: 'CalemRcmFunctionFormLookup',
		title: 'rcm_function',
		icon: 'CalemRcm',
		controller: 'CalemRcmFunctionFormLookup',
		model: 'rcm_function', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFunctionViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemRcmFunctionFormSearch'
	}
}

CalemItemDef['CalemRcmFunctionFormNew']={
	CalemFormInfo: {
		id: 'CalemRcmFunctionFormNew',
		title: 'rcm_function',
		icon: 'CalemRcm',
		controller: 'CalemRcmFunctionFormNew',
		model: 'rcm_function', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFunctionViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmFunctionFormEdit']={
	CalemFormInfo: {
		id: 'CalemRcmFunctionFormEdit',
		title: 'rcm_function',
		icon: 'CalemRcm',
		controller: 'CalemRcmFunctionFormEdit',
		model: 'rcm_function', 
   	view: {CalemViewRefInfo: {id: 'CalemRcmFunctionViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmFunctionFormRead']={
	CalemFormInfo: {
		id: 'CalemRcmFunctionFormRead',
		title: 'rcm_function',
		icon: 'CalemRcm',
		controller: 'CalemRcmFunctionFormRead',
		model: 'rcm_function', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFunctionViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmFunctionFormSearch']={
	CalemFormInfo: {
		id: 'CalemRcmFunctionFormSearch',
		title: 'rcm_function',
		icon: 'CalemRcm',
		controller: 'CalemFormSearchEdit',
		model: 'rcm_function', 
		view: {CalemViewRefInfo: {id: 'CalemRcmFunctionViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//RcmAction
CalemItemDef['CalemRcmActionFormList']={
	CalemFormInfo: {
		id: 'CalemRcmActionFormList',
		title: 'rcm_action',
		icon: 'CalemRcm',
		controller: 'CalemRcmActionFormList',
		model: 'rcm_action', 
		view: {CalemViewRefInfo: {id: 'CalemRcmActionViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmActionFormLookup']={
	CalemFormInfo: {
		id: 'CalemRcmActionFormLookup',
		title: 'rcm_action',
		icon: 'CalemRcm',
		controller: 'CalemRcmActionFormLookup',
		model: 'rcm_action', 
		view: {CalemViewRefInfo: {id: 'CalemRcmActionViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemRcmActionFormSearch'
	}
}

CalemItemDef['CalemRcmActionFormSearch']={
	CalemFormInfo: {
		id: 'CalemRcmActionFormSearch',
		title: 'rcm_action',
		icon: 'CalemRcm',
		controller: 'CalemFormSearchEdit',
		model: 'rcm_action', 
		view: {CalemViewRefInfo: {id: 'CalemRcmActionViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmActionFormNew']={
	CalemFormInfo: {
		id: 'CalemRcmActionFormNew',
		title: 'rcm_action',
		icon: 'CalemRcm',
		controller: 'CalemRcmActionFormNew',
		model: 'rcm_action', 
		view: {CalemViewRefInfo: {id: 'CalemRcmActionViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmActionFormEdit']={
	CalemFormInfo: {
		id: 'CalemRcmActionFormEdit',
		title: 'rcm_action',
		icon: 'CalemRcm',
		controller: 'CalemRcmActionFormEdit',
		model: 'rcm_action', 
   	view: {CalemViewRefInfo: {id: 'CalemRcmActionViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmActionFormRead']={
	CalemFormInfo: {
		id: 'CalemRcmActionFormRead',
		title: 'rcm_action',
		icon: 'CalemRcm',
		controller: 'CalemRcmActionFormRead',
		model: 'rcm_action', 
		view: {CalemViewRefInfo: {id: 'CalemRcmActionViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//RcmConsequence
CalemItemDef['CalemRcmConsequenceFormList']={
	CalemFormInfo: {
		id: 'CalemRcmConsequenceFormList',
		title: 'rcm_consequence',
		icon: 'CalemRcm',
		controller: 'CalemRcmConsequenceFormList',
		model: 'rcm_consequence', 
		view: {CalemViewRefInfo: {id: 'CalemRcmConsequenceViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmConsequenceFormNew']={
	CalemFormInfo: {
		id: 'CalemRcmConsequenceFormNew',
		title: 'rcm_consequence',
		icon: 'CalemRcm',
		controller: 'CalemRcmConsequenceFormNew',
		model: 'rcm_consequence', 
		view: {CalemViewRefInfo: {id: 'CalemRcmConsequenceViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmConsequenceFormEdit']={
	CalemFormInfo: {
		id: 'CalemRcmConsequenceFormEdit',
		title: 'rcm_consequence',
		icon: 'CalemRcm',
		controller: 'CalemRcmConsequenceFormEdit',
		model: 'rcm_consequence', 
   	view: {CalemViewRefInfo: {id: 'CalemRcmConsequenceViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmConsequenceFormRead']={
	CalemFormInfo: {
		id: 'CalemRcmConsequenceFormRead',
		title: 'rcm_consequence',
		icon: 'CalemRcm',
		controller: 'CalemRcmConsequenceFormRead',
		model: 'rcm_consequence', 
		view: {CalemViewRefInfo: {id: 'CalemRcmConsequenceViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//RcmActionPart
CalemItemDef['CalemRcmActionPartFormList']={
	CalemFormInfo: {
		id: 'CalemRcmActionPartFormList',
		title: 'rcm_action_part',
		icon: 'CalemRcm',
		controller: 'CalemRcmActionPartFormList',
		model: 'rcm_action_part', 
		view: {CalemViewRefInfo: {id: 'CalemRcmActionPartViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmActionPartFormNew']={
	CalemFormInfo: {
		id: 'CalemRcmActionPartFormNew',
		title: 'rcm_action_part',
		icon: 'CalemRcm',
		controller: 'CalemRcmActionPartFormNew',
		model: 'rcm_action_part', 
		view: {CalemViewRefInfo: {id: 'CalemRcmActionPartViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmActionPartFormEdit']={
	CalemFormInfo: {
		id: 'CalemRcmActionPartFormEdit',
		title: 'rcm_action_part',
		icon: 'CalemRcm',
		controller: 'CalemRcmActionPartFormEdit',
		model: 'rcm_action_part', 
   	view: {CalemViewRefInfo: {id: 'CalemRcmActionPartViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemRcmActionPartFormRead']={
	CalemFormInfo: {
		id: 'CalemRcmActionPartFormRead',
		title: 'rcm_action_part',
		icon: 'CalemRcm',
		controller: 'CalemRcmActionPartFormRead',
		model: 'rcm_action_part', 
		view: {CalemViewRefInfo: {id: 'CalemRcmActionPartViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
