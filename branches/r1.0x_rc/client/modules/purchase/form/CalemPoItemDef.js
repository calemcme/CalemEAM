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
CalemItemDef['CalemPoMineFormList']={
	CalemFormInfo: {
		id: 'CalemPoMineFormList',
		title: 'po_mine_list',
		icon: 'CalemPo',
		controller: 'CalemPoMineFormList',
		model: 'po', 
		view: {CalemViewRefInfo: {id: 'CalemPoMineViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPoFormSearch'
	}
}
 
CalemItemDef['CalemPoFormList']={
	CalemFormInfo: {
		id: 'CalemPoFormList',
		title: 'po_list',
		icon: 'CalemPo',
		controller: 'CalemPoFormList',
		model: 'po', 
		view: {CalemViewRefInfo: {id: 'CalemPoViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPoFormSearch'
	}
}

CalemItemDef['CalemPoFormLookup']={
	CalemFormInfo: {
		id: 'CalemPoFormLookup',
		title: 'po',
		icon: 'CalemPo',
		controller: 'CalemPoFormLookup',
		model: 'po', 
		view: {CalemViewRefInfo: {id: 'CalemPoViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPoFormSearch'
	}
}

CalemItemDef['CalemPoFormNew']={
	CalemFormInfo: {
		id: 'CalemPoFormNew',
		title: 'po',
		icon: 'CalemPo',
		controller: 'CalemPoFormNew',
		model: 'po', 
		view: {CalemViewRefInfo: {id: 'CalemPoViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoFormEdit']={
	CalemFormInfo: {
		id: 'CalemPoFormEdit',
		title: 'po',
		icon: 'CalemPo',
		controller: 'CalemPoFormEdit',
		model: 'po', 
   	view: {CalemViewRefInfo: {id: 'CalemPoViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoFormRead']={
	CalemFormInfo: {
		id: 'CalemPoFormRead',
		title: 'po',
		icon: 'CalemPo',
		controller: 'CalemPoFormRead',
		model: 'po', 
		view: {CalemViewRefInfo: {id: 'CalemPoViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoFormSearch']={
	CalemFormInfo: {
		id: 'CalemPoFormSearch',
		title: 'po',
		icon: 'CalemPo',
		controller: 'CalemFormSearchEdit',
		model: 'po', 
		view: {CalemViewRefInfo: {id: 'CalemPoViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemPoFormMdTab',
		title: 'po',
		icon: 'CalemPo',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_item', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemPoFormRead']},
					'tab_item' : {CalemTabLayoutInfo: ['CalemPoItemFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemPoFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemPoItemFormList', link: {CalemFieldMdInfo: {fld: 'po_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemPoFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemPoFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemPoItemFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemPoItemFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 16}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_po_main', fixed: 1}
		  },
		  
		  'tab_item': {
		  		CalemTabInfo: {id: 'tab_po_item'}
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
CalemItemDef['CalemPoItemFormList']={
	CalemFormInfo: {
		id: 'CalemPoItemFormList',
		title: 'po_item',
		icon: 'CalemPo',
		controller: 'CalemPoItemFormList',
		model: 'po_item', 
		view: {CalemViewRefInfo: {id: 'CalemPoItemViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoItemFormNew']={
	CalemFormInfo: {
		id: 'CalemPoItemFormNew',
		title: 'po_item',
		icon: 'CalemPo',
		controller: 'CalemPoItemFormNew',
		model: 'po_item', 
		view: {CalemViewRefInfo: {id: 'CalemPoItemViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoItemFormEdit']={
	CalemFormInfo: {
		id: 'CalemPoItemFormEdit',
		title: 'po_item',
		icon: 'CalemPo',
		controller: 'CalemPoItemFormEdit',
		model: 'po_item', 
   	view: {CalemViewRefInfo: {id: 'CalemPoItemViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoItemFormRead']={
	CalemFormInfo: {
		id: 'CalemPoItemFormRead',
		title: 'po_item',
		icon: 'CalemPo',
		controller: 'CalemPoItemFormRead',
		model: 'po_item', 
		view: {CalemViewRefInfo: {id: 'CalemPoItemViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoItemAddFormLookup']={
	CalemFormInfo: {
		id: 'CalemPoItemAddFormLookup',
		title: 'req_item',
		icon: 'CalemReq',
		controller: 'CalemPoItemAddFormLookup',
		model: 'req_item', 
		view: {CalemViewRefInfo: {id: 'CalemPoItemAddViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPoItemAddFormSearch'
	}
}

CalemItemDef['CalemPoItemRemoveFormLookup']={
	CalemFormInfo: {
		id: 'CalemPoItemRemoveFormLookup',
		title: 'req_item',
		icon: 'CalemReq',
		controller: 'CalemPoItemRemoveFormLookup',
		model: 'req_item', 
		view: {CalemViewRefInfo: {id: 'CalemPoItemRemoveViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPoItemAddFormSearch'
	}
}

CalemItemDef['CalemPoItemAddFormSearch']={
	CalemFormInfo: {
		id: 'CalemPoItemAddFormSearch',
		title: 'req_item',
		icon: 'CalemReq',
		controller: 'CalemFormSearchEdit',
		model: 'req_item', 
		view: {CalemViewRefInfo: {id: 'CalemPoItemAddViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Req status
CalemItemDef['CalemPoStatusLogFormList']={
	CalemFormInfo: {
		id: 'CalemPoStatusLogFormList',
		title: 'po_status_log',
		icon: 'CalemPo',
		controller: 'CalemPoStatusLogFormList',
		model: 'po_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemPoStatusLogViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoStatusLogFormRead']={
	CalemFormInfo: {
		id: 'CalemPoStatusLogFormRead',
		title: 'po_status_log',
		icon: 'CalemPo',
		controller: 'CalemPoStatusLogFormRead',
		model: 'po_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemPoStatusLogViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoStatusLogNoteFormNew']={
	CalemFormInfo: {
		id: 'CalemPoStatusLogNoteFormNew',
		title: 'po_status_log',
		icon: 'CalemPo',
		controller: 'CalemPoStatusLogNoteFormNew',
		model: 'po_status_log', 
		view: {CalemViewRefInfo: {id: 'CalemPoStatusLogNoteViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Tax code stuff
CalemItemDef['CalemTaxCodeFormList']={
	CalemFormInfo: {
		id: 'CalemTaxCodeFormList',
		title: 'tax_code_list',
		icon: 'CalemPo',
		controller: 'CalemTaxCodeFormList',
		model: 'tax_code', 
		view: {CalemViewRefInfo: {id: 'CalemTaxCodeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTaxCodeFormSearch'
	}
}

CalemItemDef['CalemTaxCodeFormLookup']={
	CalemFormInfo: {
		id: 'CalemTaxCodeFormLookup',
		title: 'tax_code_list',
		icon: 'CalemPo',
		controller: 'CalemTaxCodeFormLookup',
		model: 'tax_code', 
		view: {CalemViewRefInfo: {id: 'CalemTaxCodeViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemTaxCodeFormSearch'
	}
}

CalemItemDef['CalemTaxCodeFormNew']={
	CalemFormInfo: {
		id: 'CalemTaxCodeFormNew',
		title: 'tax_code',
		icon: 'CalemPo',
		controller: 'CalemTaxCodeFormNew',
		model: 'tax_code', 
		view: {CalemViewRefInfo: {id: 'CalemTaxCodeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTaxCodeFormEdit']={
	CalemFormInfo: {
		id: 'CalemTaxCodeFormEdit',
		title: 'tax_code',
		icon: 'CalemPo',
		controller: 'CalemTaxCodeFormEdit',
		model: 'tax_code', 
   	view: {CalemViewRefInfo: {id: 'CalemTaxCodeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTaxCodeFormRead']={
	CalemFormInfo: {
		id: 'CalemTaxCodeFormRead',
		title: 'tax_code',
		icon: 'CalemPo',
		controller: 'CalemTaxCodeFormRead',
		model: 'tax_code', 
		view: {CalemViewRefInfo: {id: 'CalemTaxCodeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTaxCodeFormSearch']={
	CalemFormInfo: {
		id: 'CalemTaxCodeFormSearch',
		title: 'tax_code',
		icon: 'CalemPo',
		controller: 'CalemFormSearchEdit',
		model: 'tax_code', 
		view: {CalemViewRefInfo: {id: 'CalemTaxCodeViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * This is the budget item definition
 */
CalemItemDef['CalemTaxRateFormList']={
	CalemFormInfo: {
		id: 'CalemTaxRateFormList',
		title: 'tax_rate',
		icon: 'CalemPo',
		controller: 'CalemTaxRateFormList',
		model: 'tax_rate', 
		view: {CalemViewRefInfo: {id: 'CalemTaxRateViewList'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTaxRateFormNew']={
	CalemFormInfo: {
		id: 'CalemTaxRateFormNew',
		title: 'tax_rate',
		icon: 'CalemPo',
		controller: 'CalemTaxRateFormNew',
		model: 'tax_rate', 
		view: {CalemViewRefInfo: {id: 'CalemTaxRateViewNew'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTaxRateFormEdit']={
	CalemFormInfo: {
		id: 'CalemTaxRateFormEdit',
		title: 'tax_rate',
		icon: 'CalemPo',
		controller: 'CalemTaxRateFormEdit',
		model: 'tax_rate', 
		view: {CalemViewRefInfo: {id: 'CalemTaxRateViewEdit'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemTaxRateFormRead']={
	CalemFormInfo: {
		id: 'CalemTaxRateFormRead',
		title: 'tax_rate',
		icon: 'CalemPo',
		controller: 'CalemTaxRateFormRead',
		model: 'tax_rate', 
		view: {CalemViewRefInfo: {id: 'CalemTaxRateViewRead'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * This is tax_rate title MD combination.
 */
CalemItemDef['CalemTaxCodeFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemTaxCodeFormMdTab',
		title: 'tax_code',
		icon: 'CalemPo',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_tax_code'],
				tabMap: {
					'tab_tax_code': {CalemTabLayoutInfo: ['CalemTaxCodeFormRead','CalemTaxRateFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemTaxCodeFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemTaxRateFormList', link: {CalemFieldMdInfo: {fld: 'tax_code_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemTaxCodeFormRead' : {CalemFormLayoutInfo: {
								 		id: 'CalemTaxCodeFormRead',
								 		fixed: true, //Move not allowed.
								 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}} }
										},
			 
			 'CalemTaxRateFormList' : {CalemFormLayoutInfo: {
								 		id: 'CalemTaxRateFormList',
								 		layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}} }
										},
			 
		  'tab_tax_code': {CalemTabInfo: {id: 'tab_tax_code'}}
		  }
		  
		} //itemMap
	} //MdTabInfo
}

/**
 * Vendor form
 */
CalemItemDef['CalemVendorFormList']={
	CalemFormInfo: {
		id: 'CalemVendorFormList',
		title: 'vendor',
		icon: 'CalemPo',
		controller: 'CalemVendorFormList',
		model: 'vendor', 
		view: {CalemViewRefInfo: {id: 'CalemVendorViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemVendorFormSearch'
	}
}

CalemItemDef['CalemVendorFormLookup']={
	CalemFormInfo: {
		id: 'CalemVendorFormLookup',
		title: 'vendor',
		icon: 'CalemPo',
		controller: 'CalemVendorFormLookup',
		model: 'vendor', 
		view: {CalemViewRefInfo: {id: 'CalemVendorViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemVendorFormSearch'
	}
}

CalemItemDef['CalemVendorFormNew']={
	CalemFormInfo: {
		id: 'CalemVendorFormNew',
		title: 'vendor',
		icon: 'CalemPo',
		controller: 'CalemVendorFormNew',
		model: 'vendor', 
		view: {CalemViewRefInfo: {id: 'CalemVendorViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemVendorFormEdit']={
	CalemFormInfo: {
		id: 'CalemVendorFormEdit',
		title: 'vendor',
		icon: 'CalemPo',
		controller: 'CalemVendorFormEdit',
		model: 'vendor', 
   	view: {CalemViewRefInfo: {id: 'CalemVendorViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemVendorFormRead']={
	CalemFormInfo: {
		id: 'CalemVendorFormRead',
		title: 'vendor',
		icon: 'CalemPo',
		controller: 'CalemVendorFormRead',
		model: 'vendor', 
		view: {CalemViewRefInfo: {id: 'CalemVendorViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemVendorFormSearch']={
	CalemFormInfo: {
		id: 'CalemVendorFormSearch',
		title: 'vendor',
		icon: 'CalemPo',
		controller: 'CalemFormSearchEdit',
		model: 'vendor', 
		view: {CalemViewRefInfo: {id: 'CalemVendorViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * PoAddress form
 */
CalemItemDef['CalemPoAddressFormList']={
	CalemFormInfo: {
		id: 'CalemPoAddressFormList',
		title: 'po_address',
		icon: 'CalemPo',
		controller: 'CalemPoAddressFormList',
		model: 'po_address', 
		view: {CalemViewRefInfo: {id: 'CalemPoAddressViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPoAddressFormSearch'
	}
}

CalemItemDef['CalemPoAddressFormLookup']={
	CalemFormInfo: {
		id: 'CalemPoAddressFormLookup',
		title: 'po_address',
		icon: 'CalemPo',
		controller: 'CalemPoAddressFormLookup',
		model: 'po_address', 
		view: {CalemViewRefInfo: {id: 'CalemPoAddressViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemPoAddressFormSearch'
	}
}

CalemItemDef['CalemPoAddressFormNew']={
	CalemFormInfo: {
		id: 'CalemPoAddressFormNew',
		title: 'po_address',
		icon: 'CalemPo',
		controller: 'CalemPoAddressFormNew',
		model: 'po_address', 
		view: {CalemViewRefInfo: {id: 'CalemPoAddressViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoAddressFormEdit']={
	CalemFormInfo: {
		id: 'CalemPoAddressFormEdit',
		title: 'po_address',
		icon: 'CalemPo',
		controller: 'CalemPoAddressFormEdit',
		model: 'po_address', 
   	view: {CalemViewRefInfo: {id: 'CalemPoAddressViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoAddressFormRead']={
	CalemFormInfo: {
		id: 'CalemPoAddressFormRead',
		title: 'po_address',
		icon: 'CalemPo',
		controller: 'CalemPoAddressFormRead',
		model: 'po_address', 
		view: {CalemViewRefInfo: {id: 'CalemPoAddressViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemPoAddressFormSearch']={
	CalemFormInfo: {
		id: 'CalemPoAddressFormSearch',
		title: 'po_address',
		icon: 'CalemPo',
		controller: 'CalemFormSearchEdit',
		model: 'po_address', 
		view: {CalemViewRefInfo: {id: 'CalemPoAddressViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

