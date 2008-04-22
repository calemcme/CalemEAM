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
 * Contract
 */
CalemItemDef['CalemContractFormList']={
	CalemFormInfo: {
		id: 'CalemContractFormList',
		title: 'contract_list',
		icon: 'CalemContract',
		controller: 'CalemContractFormList',
		model: 'contract', 
		view: {CalemViewRefInfo: {id: 'CalemContractViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemContractFormSearch'
	}
}

CalemItemDef['CalemContractFormLookup']={
	CalemFormInfo: {
		id: 'CalemContractFormLookup',
		title: 'contract',
		icon: 'CalemContract',
		controller: 'CalemContractFormLookup',
		model: 'contract', 
		view: {CalemViewRefInfo: {id: 'CalemContractViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemContractFormSearch'
	}
}

CalemItemDef['CalemContractFormNew']={
	CalemFormInfo: {
		id: 'CalemContractFormNew',
		title: 'contract',
		icon: 'CalemContract',
		controller: 'CalemContractFormNew',
		model: 'contract', 
		view: {CalemViewRefInfo: {id: 'CalemContractViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractFormEdit']={
	CalemFormInfo: {
		id: 'CalemContractFormEdit',
		title: 'contract',
		icon: 'CalemContract',
		controller: 'CalemContractFormEdit',
		model: 'contract', 
   	view: {CalemViewRefInfo: {id: 'CalemContractViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractFormRead']={
	CalemFormInfo: {
		id: 'CalemContractFormRead',
		title: 'contract',
		icon: 'CalemContract',
		controller: 'CalemContractFormRead',
		model: 'contract', 
		view: {CalemViewRefInfo: {id: 'CalemContractViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractFormSearch']={
	CalemFormInfo: {
		id: 'CalemContractFormSearch',
		title: 'contract',
		icon: 'CalemContract',
		controller: 'CalemFormSearchEdit',
		model: 'contract', 
		view: {CalemViewRefInfo: {id: 'CalemContractViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemContractFormMdTab',
		title: 'contract',
		icon: 'CalemContract',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_misc', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemContractFormRead']},
					'tab_misc' : {CalemTabLayoutInfo: ['CalemContractContactFormList', 'CalemContractDocFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemContractFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemContractContactFormList', link: {CalemFieldMdInfo: {fld: 'contract_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemContractDocFormList', link: {CalemFieldMdInfo: {fld: 'contract_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemContractFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemContractFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemContractContactFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemContractContactFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemContractDocFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemContractDocFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_contract_main', fixed: 1}
		  },
		  
		  'tab_misc': {
		  		CalemTabInfo: {id: 'tab_contract_misc'}
		  },
		  
		  'tab_contact': {
		  		CalemTabInfo: {id: 'tab_contract_contact'}
		  },
		  
		  'tab_doc': {
		  		CalemTabInfo: {id: 'tab_contract_doc'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}

//Contract contact detail
CalemItemDef['CalemContractContactFormList']={
	CalemFormInfo: {
		id: 'CalemContractContactFormList',
		title: 'contract_contact',
		icon: 'CalemContract',
		controller: 'CalemContractContactFormList',
		model: 'contract_contact', 
		view: {CalemViewRefInfo: {id: 'CalemContractContactViewList'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractContactFormNew']={
	CalemFormInfo: {
		id: 'CalemContractContactFormNew',
		title: 'contract_contact',
		icon: 'CalemContract',
		controller: 'CalemContractContactFormNew',
		model: 'contract_contact', 
		view: {CalemViewRefInfo: {id: 'CalemContractContactViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractContactFormEdit']={
	CalemFormInfo: {
		id: 'CalemContractContactFormEdit',
		title: 'contract_contact',
		icon: 'CalemContract',
		controller: 'CalemContractContactFormEdit',
		model: 'contract_contact', 
   	view: {CalemViewRefInfo: {id: 'CalemContractContactViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractContactFormRead']={
	CalemFormInfo: {
		id: 'CalemContractContactFormRead',
		title: 'contract_contact',
		icon: 'CalemContract',
		controller: 'CalemContractContactFormRead',
		model: 'contract_contact', 
		view: {CalemViewRefInfo: {id: 'CalemContractContactViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Contract doc detail
CalemItemDef['CalemContractDocFormList']={
	CalemFormInfo: {
		id: 'CalemContractDocFormList',
		title: 'contract_doc',
		icon: 'CalemContract',
		controller: 'CalemContractDocFormList',
		model: 'contract_doc', 
		view: {CalemViewRefInfo: {id: 'CalemContractDocViewList'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractDocFormNew']={
	CalemFormInfo: {
		id: 'CalemContractDocFormNew',
		title: 'contract_doc',
		icon: 'CalemContract',
		controller: 'CalemContractDocFormNew',
		model: 'contract_doc', 
		view: {CalemViewRefInfo: {id: 'CalemContractDocViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractDocFormEdit']={
	CalemFormInfo: {
		id: 'CalemContractDocFormEdit',
		title: 'contract_doc',
		icon: 'CalemContract',
		controller: 'CalemContractDocFormEdit',
		model: 'contract_doc', 
   	view: {CalemViewRefInfo: {id: 'CalemContractDocViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractDocFormRead']={
	CalemFormInfo: {
		id: 'CalemContractDocFormRead',
		title: 'contract_doc',
		icon: 'CalemContract',
		controller: 'CalemContractDocFormRead',
		model: 'contract_doc', 
		view: {CalemViewRefInfo: {id: 'CalemContractDocViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}




