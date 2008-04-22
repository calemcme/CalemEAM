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
CalemItemDef['CalemReqFormList']={
	CalemFormInfo: {
		id: 'CalemReqFormList',
		title: 'requisition_list',
		icon: 'CalemReq',
		controller: 'CalemReqFormList',
		model: 'requisition', 
		view: {CalemViewRefInfo: {id: 'CalemReqViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemReqFormSearch'
	}
}

CalemItemDef['CalemReqFormLookup']={
	CalemFormInfo: {
		id: 'CalemReqFormLookup',
		title: 'requisition',
		icon: 'CalemReq',
		controller: 'CalemReqFormLookup',
		model: 'requisition', 
		view: {CalemViewRefInfo: {id: 'CalemReqViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemReqFormSearch'
	}
}

CalemItemDef['CalemReqFormNew']={
	CalemFormInfo: {
		id: 'CalemReqFormNew',
		title: 'requisition',
		icon: 'CalemReq',
		controller: 'CalemReqFormNew',
		model: 'requisition', 
		view: {CalemViewRefInfo: {id: 'CalemReqViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemReqFormEdit']={
	CalemFormInfo: {
		id: 'CalemReqFormEdit',
		title: 'requisition',
		icon: 'CalemReq',
		controller: 'CalemReqFormEdit',
		model: 'requisition', 
   	view: {CalemViewRefInfo: {id: 'CalemReqViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemReqFormRead']={
	CalemFormInfo: {
		id: 'CalemReqFormRead',
		title: 'requisition',
		icon: 'CalemReq',
		controller: 'CalemReqFormRead',
		model: 'requisition', 
		view: {CalemViewRefInfo: {id: 'CalemReqViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemReqFormSearch']={
	CalemFormInfo: {
		id: 'CalemReqFormSearch',
		title: 'requisition',
		icon: 'CalemReq',
		controller: 'CalemFormSearchEdit',
		model: 'requisition', 
		view: {CalemViewRefInfo: {id: 'CalemReqViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemReqFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemReqFormMdTab',
		title: 'requisition',
		icon: 'CalemReq',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_item', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemReqFormRead']},
					'tab_item' : {CalemTabLayoutInfo: ['CalemReqItemFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemReqFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemReqItemFormList', link: {CalemFieldMdInfo: {fld: 'req_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemReqFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemReqFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemReqItemFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemReqItemFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 14}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_req_main', fixed: 1}
		  },
		  
		  'tab_item': {
		  		CalemTabInfo: {id: 'tab_req_item'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}

/**
 * Item
 */
CalemItemDef['CalemReqItemFormList']={
	CalemFormInfo: {
		id: 'CalemReqItemFormList',
		title: 'req_item',
		icon: 'CalemReq',
		controller: 'CalemReqItemFormList',
		model: 'req_item', 
		view: {CalemViewRefInfo: {id: 'CalemReqItemViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemReqItemFormNew']={
	CalemFormInfo: {
		id: 'CalemReqItemFormNew',
		title: 'req_item',
		icon: 'CalemReq',
		controller: 'CalemReqItemFormNew',
		model: 'req_item', 
		view: {CalemViewRefInfo: {id: 'CalemReqItemViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemReqItemFormEdit']={
	CalemFormInfo: {
		id: 'CalemReqItemFormEdit',
		title: 'req_item',
		icon: 'CalemReq',
		controller: 'CalemReqItemFormEdit',
		model: 'req_item', 
   	view: {CalemViewRefInfo: {id: 'CalemReqItemViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemReqItemFormRead']={
	CalemFormInfo: {
		id: 'CalemReqItemFormRead',
		title: 'req_item',
		icon: 'CalemReq',
		controller: 'CalemReqItemFormRead',
		model: 'req_item', 
		view: {CalemViewRefInfo: {id: 'CalemReqItemViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Req status
CalemItemDef['CalemReqStatusLogFormList']={
	CalemFormInfo: {
		id: 'CalemReqStatusLogFormList',
		title: 'req_status_log',
		icon: 'CalemReq',
		controller: 'CalemReqStatusLogFormList',
		model: 'req_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemReqStatusLogViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemReqStatusLogFormRead']={
	CalemFormInfo: {
		id: 'CalemReqStatusLogFormRead',
		title: 'req_status_log',
		icon: 'CalemReq',
		controller: 'CalemReqStatusLogFormRead',
		model: 'req_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemReqStatusLogViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemReqStatusLogNoteFormNew']={
	CalemFormInfo: {
		id: 'CalemReqStatusLogNoteFormNew',
		title: 'req_status_log',
		icon: 'CalemReq',
		controller: 'CalemReqStatusLogNoteFormNew',
		model: 'req_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemReqStatusLogNoteViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
