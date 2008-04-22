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
CalemItemDef['CalemProjectFormList']={
	CalemFormInfo: {
		id: 'CalemProjectFormList',
		title: 'project_list',
		icon: 'CalemProject',
		controller: 'CalemProjectFormList',
		model: 'project', 
		view: {CalemViewRefInfo: {id: 'CalemProjectViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemProjectFormSearch'
	}
}

CalemItemDef['CalemProjectFormLookup']={
	CalemFormInfo: {
		id: 'CalemProjectFormLookup',
		title: 'project',
		icon: 'CalemProject',
		controller: 'CalemProjectFormLookup',
		model: 'project', 
		view: {CalemViewRefInfo: {id: 'CalemProjectViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemProjectFormSearch'
	}
}

CalemItemDef['CalemProjectFormNew']={
	CalemFormInfo: {
		id: 'CalemProjectFormNew',
		title: 'project',
		icon: 'CalemProject',
		controller: 'CalemProjectFormNew',
		model: 'project', 
		view: {CalemViewRefInfo: {id: 'CalemProjectViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemProjectFormEdit']={
	CalemFormInfo: {
		id: 'CalemProjectFormEdit',
		title: 'project',
		icon: 'CalemProject',
		controller: 'CalemProjectFormEdit',
		model: 'project', 
   	view: {CalemViewRefInfo: {id: 'CalemProjectViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemProjectFormRead']={
	CalemFormInfo: {
		id: 'CalemProjectFormRead',
		title: 'project',
		icon: 'CalemProject',
		controller: 'CalemProjectFormRead',
		model: 'project', 
		view: {CalemViewRefInfo: {id: 'CalemProjectViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemProjectFormSearch']={
	CalemFormInfo: {
		id: 'CalemProjectFormSearch',
		title: 'project',
		icon: 'CalemProject',
		controller: 'CalemFormSearchEdit',
		model: 'project', 
		view: {CalemViewRefInfo: {id: 'CalemProjectViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemProjectFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemProjectFormMdTab',
		title: 'project',
		icon: 'CalemProject',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_detail', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemProjectFormRead']},
					'tab_detail' : {CalemTabLayoutInfo: ['CalemSubProjectFormList', 'CalemProjectWoFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemProjectFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemSubProjectFormList', link: {CalemFieldMdInfo: {fld: 'parent_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemProjectWoFormList', link: {CalemFieldMdInfo: {fld: 'project_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemProjectFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemProjectFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemSubProjectFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemSubProjectFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
			 
			 'CalemProjectWoFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemProjectWoFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_project_main', fixed: 1}
		  },
		  
		  'tab_detail': {
		  		CalemTabInfo: {id: 'tab_project_detail'}
		  },
		  
		  'tab_wo': {
		  		CalemTabInfo: {id: 'tab_project_wo'}
		  },
		  
		  'tab_subproject': {
		  		CalemTabInfo: {id: 'tab_project_subproject'}
		  },
		  
		  'tab_depreciation': {
		  		CalemTabInfo: {id: 'tab_project_depreciation'}
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
CalemItemDef['CalemSubProjectFormList']={
	CalemFormInfo: {
		id: 'CalemSubProjectFormList',
		title: 'project',
		icon: 'CalemProject',
		controller: 'CalemSubProjectFormList',
		model: 'project', 
		view: {CalemViewRefInfo: {id: 'CalemSubProjectViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSubProjectFormNew']={
	CalemFormInfo: {
		id: 'CalemSubProjectFormNew',
		title: 'project',
		icon: 'CalemProject',
		controller: 'CalemSubProjectFormNew',
		model: 'project', 
		view: {CalemViewRefInfo: {id: 'CalemSubProjectViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSubProjectFormEdit']={
	CalemFormInfo: {
		id: 'CalemSubProjectFormEdit',
		title: 'project',
		icon: 'CalemProject',
		controller: 'CalemSubProjectFormEdit',
		model: 'project', 
   	view: {CalemViewRefInfo: {id: 'CalemSubProjectViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSubProjectFormRead']={
	CalemFormInfo: {
		id: 'CalemSubProjectFormRead',
		title: 'project',
		icon: 'CalemProject',
		controller: 'CalemSubProjectFormRead',
		model: 'project', 
		view: {CalemViewRefInfo: {id: 'CalemSubProjectViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * wo
 */
CalemItemDef['CalemProjectWoFormList']={
	CalemFormInfo: {
		id: 'CalemProjectWoFormList',
		title: 'workorder',
		icon: 'CalemProject',
		controller: 'CalemProjectWoFormList',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemProjectWoViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * type
 */
CalemItemDef['CalemProjectTypeFormList']={
	CalemFormInfo: {
		id: 'CalemProjectTypeFormList',
		title: 'project_type',
		icon: 'CalemProject',
		controller: 'CalemProjectTypeFormList',
		model: 'project_type', 
		view: {CalemViewRefInfo: {id: 'CalemProjectTypeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemProjectTypeFormSearch'
	}
}

CalemItemDef['CalemProjectTypeFormLookup']={
	CalemFormInfo: {
		id: 'CalemProjectTypeFormLookup',
		title: 'project_type',
		icon: 'CalemProject',
		controller: 'CalemProjectTypeFormLookup',
		model: 'project_type', 
		view: {CalemViewRefInfo: {id: 'CalemProjectTypeViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemProjectTypeFormSearch'
	}
}

CalemItemDef['CalemProjectTypeFormNew']={
	CalemFormInfo: {
		id: 'CalemProjectTypeFormNew',
		title: 'project_type',
		icon: 'CalemProject',
		controller: 'CalemProjectTypeFormNew',
		model: 'project_type', 
		view: {CalemViewRefInfo: {id: 'CalemProjectTypeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemProjectTypeFormEdit']={
	CalemFormInfo: {
		id: 'CalemProjectTypeFormEdit',
		title: 'project_type',
		icon: 'CalemProject',
		controller: 'CalemProjectTypeFormEdit',
		model: 'project_type', 
   	view: {CalemViewRefInfo: {id: 'CalemProjectTypeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemProjectTypeFormRead']={
	CalemFormInfo: {
		id: 'CalemProjectTypeFormRead',
		title: 'project_type',
		icon: 'CalemProject',
		controller: 'CalemProjectTypeFormRead',
		model: 'project_type', 
		view: {CalemViewRefInfo: {id: 'CalemProjectTypeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemProjectTypeFormSearch']={
	CalemFormInfo: {
		id: 'CalemProjectTypeFormSearch',
		title: 'project_type',
		icon: 'CalemProject',
		controller: 'CalemFormSearchEdit',
		model: 'project_type', 
		view: {CalemViewRefInfo: {id: 'CalemProjectTypeViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
