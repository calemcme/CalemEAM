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
 * Budget title forms
 */
CalemItemDef['CalemBudgetTitleFormList']={
	CalemFormInfo: {
		id: 'CalemBudgetTitleFormList',
		title: 'budget_list',
		icon: 'CalemBudget',
		controller: 'CalemBudgetTitleFormList',
		model: 'budget_title', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetTitleViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemBudgetTitleFormSearch'
	}
}

CalemItemDef['CalemBudgetTitleFormLookup']={
	CalemFormInfo: {
		id: 'CalemBudgetTitleFormLookup',
		title: 'budget_list',
		icon: 'CalemBudget',
		controller: 'CalemBudgetTitleFormLookup',
		model: 'budget_title', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetTitleViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemBudgetTitleFormSearch'
	}
}

CalemItemDef['CalemBudgetTitleFormNew']={
	CalemFormInfo: {
		id: 'CalemBudgetTitleFormNew',
		title: 'budget_title',
		icon: 'CalemBudget',
		controller: 'CalemBudgetTitleFormNew',
		model: 'budget_title', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetTitleViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemBudgetTitleFormEdit']={
	CalemFormInfo: {
		id: 'CalemBudgetTitleFormEdit',
		title: 'budget_title',
		icon: 'CalemBudget',
		controller: 'CalemBudgetTitleFormEdit',
		model: 'budget_title', 
   	view: {CalemViewRefInfo: {id: 'CalemBudgetTitleViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemBudgetTitleFormRead']={
	CalemFormInfo: {
		id: 'CalemBudgetTitleFormRead',
		title: 'budget_title',
		icon: 'CalemBudget',
		controller: 'CalemBudgetTitleFormRead',
		model: 'budget_title', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetTitleViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemBudgetTitleFormSearch']={
	CalemFormInfo: {
		id: 'CalemBudgetTitleFormSearch',
		title: 'budget_title',
		icon: 'CalemBudget',
		controller: 'CalemFormSearchEdit',
		model: 'budget_title', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetTitleViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * This is the budget item definition
 */
CalemItemDef['CalemBudgetFormList']={
	CalemFormInfo: {
		id: 'CalemBudgetFormList',
		title: 'budget',
		icon: 'CalemBudget',
		controller: 'CalemBudgetFormList',
		model: 'budget', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetViewList'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemBudgetFormNew']={
	CalemFormInfo: {
		id: 'CalemBudgetFormNew',
		title: 'budget',
		icon: 'CalemBudget',
		controller: 'CalemBudgetFormNew',
		model: 'budget', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetViewNew'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemBudgetFormEdit']={
	CalemFormInfo: {
		id: 'CalemBudgetFormEdit',
		title: 'budget',
		icon: 'CalemBudget',
		controller: 'CalemBudgetFormEdit',
		model: 'budget', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetViewEdit'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemBudgetFormRead']={
	CalemFormInfo: {
		id: 'CalemBudgetFormRead',
		title: 'budget',
		icon: 'CalemBudget',
		controller: 'CalemBudgetFormRead',
		model: 'budget', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetViewRead'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * This is budget title MD combination.
 */
CalemItemDef['CalemBudgetTitleFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemBudgetTitleFormMdTab',
		title: 'budget',
		icon: 'CalemBudget',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_budget'],
				tabMap: {
					'tab_budget': {CalemTabLayoutInfo: ['CalemBudgetTitleFormRead','CalemBudgetFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemBudgetTitleFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemBudgetFormList', link: {CalemFieldMdInfo: {fld: 'title_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemBudgetTitleFormRead' : {CalemFormLayoutInfo: {
								 		id: 'CalemBudgetTitleFormRead',
								 		fixed: true, //Move not allowed.
								 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}} }
										},
			 
			 'CalemBudgetFormList' : {CalemFormLayoutInfo: {
								 		id: 'CalemBudgetFormList',
								 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-1'}} }
										},
			 
		  'tab_budget': {CalemTabInfo: {id: 'tab_budget'}}
		  }
		  
		} //itemMap
	} //MdTabInfo
}

/**
 * Costcode form
 */
CalemItemDef['CalemCostcodeFormList']={
	CalemFormInfo: {
		id: 'CalemCostcodeFormList',
		title: 'costcode',
		icon: 'CalemBudget',
		controller: 'CalemCostcodeFormList',
		model: 'costcode', 
		view: {CalemViewRefInfo: {id: 'CalemCostcodeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemCostcodeFormSearch'
	}
}

CalemItemDef['CalemCostcodeFormLookup']={
	CalemFormInfo: {
		id: 'CalemCostcodeFormLookup',
		title: 'costcode',
		icon: 'CalemBudget',
		controller: 'CalemCostcodeFormLookup',
		model: 'costcode', 
		view: {CalemViewRefInfo: {id: 'CalemCostcodeViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemCostcodeFormSearch'
	}
}

CalemItemDef['CalemCostcodeFormNew']={
	CalemFormInfo: {
		id: 'CalemCostcodeFormNew',
		title: 'costcode',
		icon: 'CalemBudget',
		controller: 'CalemCostcodeFormNew',
		model: 'costcode', 
		view: {CalemViewRefInfo: {id: 'CalemCostcodeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemCostcodeFormEdit']={
	CalemFormInfo: {
		id: 'CalemCostcodeFormEdit',
		title: 'costcode',
		icon: 'CalemBudget',
		controller: 'CalemCostcodeFormEdit',
		model: 'costcode', 
   	view: {CalemViewRefInfo: {id: 'CalemCostcodeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemCostcodeFormRead']={
	CalemFormInfo: {
		id: 'CalemCostcodeFormRead',
		title: 'costcode',
		icon: 'CalemBudget',
		controller: 'CalemCostcodeFormRead',
		model: 'costcode', 
		view: {CalemViewRefInfo: {id: 'CalemCostcodeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemCostcodeFormSearch']={
	CalemFormInfo: {
		id: 'CalemCostcodeFormSearch',
		title: 'costcode',
		icon: 'CalemBudget',
		controller: 'CalemFormSearchEdit',
		model: 'costcode', 
		view: {CalemViewRefInfo: {id: 'CalemCostcodeViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Budget status
CalemItemDef['CalemBudgetStatusLogFormList']={
	CalemFormInfo: {
		id: 'CalemBudgetStatusLogFormList',
		title: 'budget_status_log',
		icon: 'CalemBudget',
		controller: 'CalemBudgetStatusLogFormList',
		model: 'budget_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetStatusLogViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemBudgetStatusLogFormRead']={
	CalemFormInfo: {
		id: 'CalemBudgetStatusLogFormRead',
		title: 'budget_status_log',
		icon: 'CalemBudget',
		controller: 'CalemBudgetStatusLogFormRead',
		model: 'budget_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetStatusLogViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemBudgetStatusLogNoteFormNew']={
	CalemFormInfo: {
		id: 'CalemBudgetStatusLogNoteFormNew',
		title: 'budget_status_log',
		icon: 'CalemBudget',
		controller: 'CalemBudgetStatusLogNoteFormNew',
		model: 'budget_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemBudgetStatusLogNoteViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}