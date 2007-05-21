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
CalemItemDef['CalemInFormList']={
	CalemFormInfo: {
		id: 'CalemInFormList',
		title: 'inventory_list',
		icon: 'CalemIn',
		controller: 'CalemInFormList',
		model: 'inventory', 
		view: {CalemViewRefInfo: {id: 'CalemInViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInFormSearch'
	}
}

CalemItemDef['CalemInToolFormLookup']={
	CalemFormInfo: {
		id: 'CalemInToolFormLookup',
		title: 'inventory_tool',
		icon: 'CalemIn',
		controller: 'CalemInToolFormLookup',
		model: 'inventory', 
		view: {CalemViewRefInfo: {id: 'CalemInToolViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInFormSearch'
	}
}

CalemItemDef['CalemInFormLookup']={
	CalemFormInfo: {
		id: 'CalemInFormLookup',
		title: 'inventory',
		icon: 'CalemIn',
		controller: 'CalemInFormLookup',
		model: 'inventory', 
		view: {CalemViewRefInfo: {id: 'CalemInViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInFormSearch'
	}
}

CalemItemDef['CalemInPartFormLookup']={
	CalemFormInfo: {
		id: 'CalemInPartFormLookup',
		title: 'inventory_part',
		icon: 'CalemIn',
		controller: 'CalemInPartFormLookup',
		model: 'inventory', 
		view: {CalemViewRefInfo: {id: 'CalemInPartViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInFormSearch'
	}
}

CalemItemDef['CalemInFormNew']={
	CalemFormInfo: {
		id: 'CalemInFormNew',
		title: 'inventory',
		icon: 'CalemIn',
		controller: 'CalemInFormNew',
		model: 'inventory', 
		view: {CalemViewRefInfo: {id: 'CalemInViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInFormEdit']={
	CalemFormInfo: {
		id: 'CalemInFormEdit',
		title: 'inventory',
		icon: 'CalemIn',
		controller: 'CalemInFormEdit',
		model: 'inventory', 
   	view: {CalemViewRefInfo: {id: 'CalemInViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInFormRead']={
	CalemFormInfo: {
		id: 'CalemInFormRead',
		title: 'inventory',
		icon: 'CalemIn',
		controller: 'CalemInFormRead',
		model: 'inventory', 
		view: {CalemViewRefInfo: {id: 'CalemInViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInFormSearch']={
	CalemFormInfo: {
		id: 'CalemInFormSearch',
		title: 'inventory',
		icon: 'CalemIn',
		controller: 'CalemFormSearchEdit',
		model: 'inventory', 
		view: {CalemViewRefInfo: {id: 'CalemInViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemInFormMdTab',
		title: 'inventory',
		icon: 'CalemIn',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemInFormRead']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemInFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemInStockFormList', link: {CalemFieldMdInfo: {fld: 'in_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemInReservedFormList', link: {CalemFieldMdInfo: {fld: 'in_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemInCommentFormList', link: {CalemFieldMdInfo: {fld: 'in_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemInDocFormList', link: {CalemFieldMdInfo: {fld: 'in_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemInAuditFormList', link: {CalemFieldMdInfo: {fld: 'in_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemInVendorFormList', link: {CalemFieldMdInfo: {fld: 'in_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemInTranFormList', link: {CalemFieldMdInfo: {fld: 'in_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemInFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemInFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemInStockFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemInStockFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
			 
			 'CalemInReservedFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemInReservedFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
			 
			 'CalemInCommentFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemInCommentFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
			 
			 'CalemInDocFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemInDocFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
			 
			 'CalemInVendorFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemInVendorFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
		  
		  'CalemInAuditFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemInAuditFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
			
			'CalemInTranFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemInTranFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_in_main', fixed: 1}
		  },
		  
		  'tab_stock': {
		  		CalemTabInfo: {id: 'tab_in_stock'}
		  },
		  
		  'tab_doc': {
		  		CalemTabInfo: {id: 'tab_in_doc'}
		  },
		  
		  'tab_tran': {
		  		CalemTabInfo: {id: 'tab_in_tran'}
		  },
		  
		  'tab_misc': {
		  		CalemTabInfo: {id: 'tab_in_misc'}
		  },
		  
		  'tab_vendor': {
		  		CalemTabInfo: {id: 'tab_in_vendor'}
		  },
		  
		  'tab_reserved': {
		  		CalemTabInfo: {id: 'tab_in_reserved'}
		  },
		  
		  'tab_audit': {
		  		CalemTabInfo: {id: 'tab_in_audit'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}

/**
 * Stock
 */
CalemItemDef['CalemInStockFormList']={
	CalemFormInfo: {
		id: 'CalemInStockFormList',
		title: 'in_stock',
		icon: 'CalemIn',
		controller: 'CalemInStockFormList',
		model: 'in_stock', 
		view: {CalemViewRefInfo: {id: 'CalemInStockViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInStockFormNew']={
	CalemFormInfo: {
		id: 'CalemInStockFormNew',
		title: 'in_stock',
		icon: 'CalemIn',
		controller: 'CalemInStockFormNew',
		model: 'in_stock', 
		view: {CalemViewRefInfo: {id: 'CalemInStockViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInStockFormEdit']={
	CalemFormInfo: {
		id: 'CalemInStockFormEdit',
		title: 'in_stock',
		icon: 'CalemIn',
		controller: 'CalemInStockFormEdit',
		model: 'in_stock', 
   	view: {CalemViewRefInfo: {id: 'CalemInStockViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInStockFormRead']={
	CalemFormInfo: {
		id: 'CalemInStockFormRead',
		title: 'in_stock',
		icon: 'CalemIn',
		controller: 'CalemInStockFormRead',
		model: 'in_stock', 
		view: {CalemViewRefInfo: {id: 'CalemInStockViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Stock
 */
CalemItemDef['CalemInReservedFormList']={
	CalemFormInfo: {
		id: 'CalemInReservedFormList',
		title: 'in_reserved',
		icon: 'CalemIn',
		controller: 'CalemInReservedFormList',
		model: 'in_reserved', 
		view: {CalemViewRefInfo: {id: 'CalemInReservedViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * In comment
 */
CalemItemDef['CalemInCommentFormList']={
	CalemFormInfo: {
		id: 'CalemInCommentFormList',
		title: 'in_comment',
		icon: 'CalemIn',
		controller: 'CalemInCommentFormList',
		model: 'in_comment', 
		view: {CalemViewRefInfo: {id: 'CalemInCommentViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInCommentFormNew']={
	CalemFormInfo: {
		id: 'CalemInCommentFormNew',
		title: 'in_comment',
		icon: 'CalemIn',
		controller: 'CalemInCommentFormNew',
		model: 'in_comment', 
		view: {CalemViewRefInfo: {id: 'CalemInCommentViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInCommentFormEdit']={
	CalemFormInfo: {
		id: 'CalemInCommentFormEdit',
		title: 'in_comment',
		icon: 'CalemIn',
		controller: 'CalemInCommentFormEdit',
		model: 'in_comment', 
   	view: {CalemViewRefInfo: {id: 'CalemInCommentViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInCommentFormRead']={
	CalemFormInfo: {
		id: 'CalemInCommentFormRead',
		title: 'in_comment',
		icon: 'CalemIn',
		controller: 'CalemInCommentFormRead',
		model: 'in_comment', 
		view: {CalemViewRefInfo: {id: 'CalemInCommentViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * In doc
 */
CalemItemDef['CalemInDocFormList']={
	CalemFormInfo: {
		id: 'CalemInDocFormList',
		title: 'in_doc',
		icon: 'CalemIn',
		controller: 'CalemInDocFormList',
		model: 'in_doc', 
		view: {CalemViewRefInfo: {id: 'CalemInDocViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInDocFormNew']={
	CalemFormInfo: {
		id: 'CalemInDocFormNew',
		title: 'in_doc',
		icon: 'CalemIn',
		controller: 'CalemInDocFormNew',
		model: 'in_doc', 
		view: {CalemViewRefInfo: {id: 'CalemInDocViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInDocFormEdit']={
	CalemFormInfo: {
		id: 'CalemInDocFormEdit',
		title: 'in_doc',
		icon: 'CalemIn',
		controller: 'CalemInDocFormEdit',
		model: 'in_doc', 
   	view: {CalemViewRefInfo: {id: 'CalemInDocViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInDocFormRead']={
	CalemFormInfo: {
		id: 'CalemInDocFormRead',
		title: 'in_doc',
		icon: 'CalemIn',
		controller: 'CalemInDocFormRead',
		model: 'in_doc', 
		view: {CalemViewRefInfo: {id: 'CalemInDocViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * In audit
 */
CalemItemDef['CalemInAuditFormList']={
	CalemFormInfo: {
		id: 'CalemInAuditFormList',
		title: 'in_audit',
		icon: 'CalemIn',
		controller: 'CalemInAuditFormList',
		model: 'in_audit', 
		view: {CalemViewRefInfo: {id: 'CalemInAuditViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInAuditFormNew']={
	CalemFormInfo: {
		id: 'CalemInAuditFormNew',
		title: 'in_audit',
		icon: 'CalemIn',
		controller: 'CalemInAuditFormNew',
		model: 'in_audit', 
		view: {CalemViewRefInfo: {id: 'CalemInAuditViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInAuditFormEdit']={
	CalemFormInfo: {
		id: 'CalemInAuditFormEdit',
		title: 'in_audit',
		icon: 'CalemIn',
		controller: 'CalemInAuditFormEdit',
		model: 'in_audit', 
   	view: {CalemViewRefInfo: {id: 'CalemInAuditViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInAuditFormRead']={
	CalemFormInfo: {
		id: 'CalemInAuditFormRead',
		title: 'in_audit',
		icon: 'CalemIn',
		controller: 'CalemInAuditFormRead',
		model: 'in_audit', 
		view: {CalemViewRefInfo: {id: 'CalemInAuditViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * In vendor
 */
CalemItemDef['CalemInVendorFormList']={
	CalemFormInfo: {
		id: 'CalemInVendorFormList',
		title: 'in_vendor',
		icon: 'CalemIn',
		controller: 'CalemInVendorFormList',
		model: 'in_vendor', 
		view: {CalemViewRefInfo: {id: 'CalemInVendorViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInVendorFormNew']={
	CalemFormInfo: {
		id: 'CalemInVendorFormNew',
		title: 'in_vendor',
		icon: 'CalemIn',
		controller: 'CalemInVendorFormNew',
		model: 'in_vendor', 
		view: {CalemViewRefInfo: {id: 'CalemInVendorViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInVendorFormEdit']={
	CalemFormInfo: {
		id: 'CalemInVendorFormEdit',
		title: 'in_vendor',
		icon: 'CalemIn',
		controller: 'CalemInVendorFormEdit',
		model: 'in_vendor', 
   	view: {CalemViewRefInfo: {id: 'CalemInVendorViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInVendorFormRead']={
	CalemFormInfo: {
		id: 'CalemInVendorFormRead',
		title: 'in_vendor',
		icon: 'CalemIn',
		controller: 'CalemInVendorFormRead',
		model: 'in_vendor', 
		view: {CalemViewRefInfo: {id: 'CalemInVendorViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * In tran
 */
CalemItemDef['CalemInTranFormList']={
	CalemFormInfo: {
		id: 'CalemInTranFormList',
		title: 'in_tran',
		icon: 'CalemIn',
		controller: 'CalemInTranFormList',
		model: 'in_tran', 
		view: {CalemViewRefInfo: {id: 'CalemInTranViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInTranFormRead']={
	CalemFormInfo: {
		id: 'CalemInTranFormRead',
		title: 'in_tran',
		icon: 'CalemIn',
		controller: 'CalemInTranFormRead',
		model: 'in_tran', 
		view: {CalemViewRefInfo: {id: 'CalemInTranViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * In tran worksheet
 */
CalemItemDef['CalemInTranWorksheetFormList']={
	CalemFormInfo: {
		id: 'CalemInTranWorksheetFormList',
		title: 'in_tran_worksheet',
		icon: 'CalemIn',
		controller: 'CalemInTranWorksheetFormList',
		model: 'in_tran_worksheet', 
		view: {CalemViewRefInfo: {id: 'CalemInTranWorksheetViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * InLocation
 */
CalemItemDef['CalemInLocationFormList']={
	CalemFormInfo: {
		id: 'CalemInLocationFormList',
		title: 'in_location',
		icon: 'CalemIn',
		controller: 'CalemInLocationFormList',
		model: 'in_location', 
		view: {CalemViewRefInfo: {id: 'CalemInLocationViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInLocationFormSearch'
	}
}

CalemItemDef['CalemInLocationFormLookup']={
	CalemFormInfo: {
		id: 'CalemInLocationFormLookup',
		title: 'in_location',
		icon: 'CalemIn',
		controller: 'CalemInLocationFormLookup',
		model: 'in_location', 
		view: {CalemViewRefInfo: {id: 'CalemInLocationViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInLocationFormSearch'
	}
}

CalemItemDef['CalemInLocationFormNew']={
	CalemFormInfo: {
		id: 'CalemInLocationFormNew',
		title: 'in_location',
		icon: 'CalemIn',
		controller: 'CalemInLocationFormNew',
		model: 'in_location', 
		view: {CalemViewRefInfo: {id: 'CalemInLocationViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInLocationFormEdit']={
	CalemFormInfo: {
		id: 'CalemInLocationFormEdit',
		title: 'in_location',
		icon: 'CalemIn',
		controller: 'CalemInLocationFormEdit',
		model: 'in_location', 
   	view: {CalemViewRefInfo: {id: 'CalemInLocationViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInLocationFormRead']={
	CalemFormInfo: {
		id: 'CalemInLocationFormRead',
		title: 'in_location',
		icon: 'CalemIn',
		controller: 'CalemInLocationFormRead',
		model: 'in_location', 
		view: {CalemViewRefInfo: {id: 'CalemInLocationViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInLocationFormSearch']={
	CalemFormInfo: {
		id: 'CalemInLocationFormSearch',
		title: 'in_location',
		icon: 'CalemIn',
		controller: 'CalemFormSearchEdit',
		model: 'in_location', 
		view: {CalemViewRefInfo: {id: 'CalemInLocationViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * InType
 */
CalemItemDef['CalemInTypeFormList']={
	CalemFormInfo: {
		id: 'CalemInTypeFormList',
		title: 'in_type',
		icon: 'CalemIn',
		controller: 'CalemInTypeFormList',
		model: 'in_type', 
		view: {CalemViewRefInfo: {id: 'CalemInTypeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInTypeFormSearch'
	}
}

CalemItemDef['CalemInTypeFormLookup']={
	CalemFormInfo: {
		id: 'CalemInTypeFormLookup',
		title: 'in_type',
		icon: 'CalemIn',
		controller: 'CalemInTypeFormLookup',
		model: 'in_type', 
		view: {CalemViewRefInfo: {id: 'CalemInTypeViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInTypeFormSearch'
	}
}

CalemItemDef['CalemInTypeFormNew']={
	CalemFormInfo: {
		id: 'CalemInTypeFormNew',
		title: 'in_type',
		icon: 'CalemIn',
		controller: 'CalemInTypeFormNew',
		model: 'in_type', 
		view: {CalemViewRefInfo: {id: 'CalemInTypeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInTypeFormEdit']={
	CalemFormInfo: {
		id: 'CalemInTypeFormEdit',
		title: 'in_type',
		icon: 'CalemIn',
		controller: 'CalemInTypeFormEdit',
		model: 'in_type', 
   	view: {CalemViewRefInfo: {id: 'CalemInTypeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInTypeFormRead']={
	CalemFormInfo: {
		id: 'CalemInTypeFormRead',
		title: 'in_type',
		icon: 'CalemIn',
		controller: 'CalemInTypeFormRead',
		model: 'in_type', 
		view: {CalemViewRefInfo: {id: 'CalemInTypeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInTypeFormSearch']={
	CalemFormInfo: {
		id: 'CalemInTypeFormSearch',
		title: 'in_type',
		icon: 'CalemIn',
		controller: 'CalemFormSearchEdit',
		model: 'in_type', 
		view: {CalemViewRefInfo: {id: 'CalemInTypeViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Uom
 */
CalemItemDef['CalemUomFormList']={
	CalemFormInfo: {
		id: 'CalemUomFormList',
		title: 'uom',
		icon: 'CalemIn',
		controller: 'CalemUomFormList',
		model: 'uom', 
		view: {CalemViewRefInfo: {id: 'CalemUomViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemUomFormSearch'
	}
}

CalemItemDef['CalemUomFormLookup']={
	CalemFormInfo: {
		id: 'CalemUomFormLookup',
		title: 'uom',
		icon: 'CalemIn',
		controller: 'CalemUomFormLookup',
		model: 'uom', 
		view: {CalemViewRefInfo: {id: 'CalemUomViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemUomFormSearch'
	}
}

CalemItemDef['CalemUomFormNew']={
	CalemFormInfo: {
		id: 'CalemUomFormNew',
		title: 'uom',
		icon: 'CalemIn',
		controller: 'CalemUomFormNew',
		model: 'uom', 
		view: {CalemViewRefInfo: {id: 'CalemUomViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUomFormEdit']={
	CalemFormInfo: {
		id: 'CalemUomFormEdit',
		title: 'uom',
		icon: 'CalemIn',
		controller: 'CalemUomFormEdit',
		model: 'uom', 
   	view: {CalemViewRefInfo: {id: 'CalemUomViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUomFormRead']={
	CalemFormInfo: {
		id: 'CalemUomFormRead',
		title: 'uom',
		icon: 'CalemIn',
		controller: 'CalemUomFormRead',
		model: 'uom', 
		view: {CalemViewRefInfo: {id: 'CalemUomViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUomFormSearch']={
	CalemFormInfo: {
		id: 'CalemUomFormSearch',
		title: 'uom',
		icon: 'CalemIn',
		controller: 'CalemFormSearchEdit',
		model: 'uom', 
		view: {CalemViewRefInfo: {id: 'CalemUomViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * UomMap
 */
CalemItemDef['CalemUomMapFormList']={
	CalemFormInfo: {
		id: 'CalemUomMapFormList',
		title: 'uom_map',
		icon: 'CalemIn',
		controller: 'CalemUomMapFormList',
		model: 'uom_map', 
		view: {CalemViewRefInfo: {id: 'CalemUomMapViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemUomMapFormSearch'
	}
}

CalemItemDef['CalemUomMapFormLookup']={
	CalemFormInfo: {
		id: 'CalemUomMapFormLookup',
		title: 'uom_map',
		icon: 'CalemIn',
		controller: 'CalemUomMapFormLookup',
		model: 'uom_map', 
		view: {CalemViewRefInfo: {id: 'CalemUomMapViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemUomMapFormSearch'
	}
}

CalemItemDef['CalemUomMapFormNew']={
	CalemFormInfo: {
		id: 'CalemUomMapFormNew',
		title: 'uom_map',
		icon: 'CalemIn',
		controller: 'CalemUomMapFormNew',
		model: 'uom_map', 
		view: {CalemViewRefInfo: {id: 'CalemUomMapViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUomMapFormEdit']={
	CalemFormInfo: {
		id: 'CalemUomMapFormEdit',
		title: 'uom_map',
		icon: 'CalemIn',
		controller: 'CalemUomMapFormEdit',
		model: 'uom_map', 
   	view: {CalemViewRefInfo: {id: 'CalemUomMapViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUomMapFormRead']={
	CalemFormInfo: {
		id: 'CalemUomMapFormRead',
		title: 'uom_map',
		icon: 'CalemIn',
		controller: 'CalemUomMapFormRead',
		model: 'uom_map', 
		view: {CalemViewRefInfo: {id: 'CalemUomMapViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemUomMapFormSearch']={
	CalemFormInfo: {
		id: 'CalemUomMapFormSearch',
		title: 'uom_map',
		icon: 'CalemIn',
		controller: 'CalemFormSearchEdit',
		model: 'uom_map', 
		view: {CalemViewRefInfo: {id: 'CalemUomMapViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Checkout transactions
CalemItemDef['CalemInCheckoutLocFormEdit']={
	CalemFormInfo: {
		id: 'CalemInCheckoutLocFormEdit',
		title: 'in_vt_checkout_loc',
		icon: 'CalemInCheckout',
		controller: 'CalemInCheckoutLocFormEdit',
		model: 'in_vt_checkout_loc', 
   	view: {CalemViewRefInfo: {id: 'CalemInCheckoutLocViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
} 

CalemItemDef['CalemInReturnCheckoutToFormEdit']={
	CalemFormInfo: {
		id: 'CalemInReturnCheckoutToFormEdit',
		title: 'in_vt_return_checkout_to',
		icon: 'CalemInReturn',
		controller: 'CalemInReturnCheckoutToFormEdit',
		model: 'in_vt_return_checkout_to', 
   	view: {CalemViewRefInfo: {id: 'CalemInReturnCheckoutToViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInReturnFormList']={
	CalemFormInfo: {
		id: 'CalemInReturnFormList',
		title: 'in_checkout_tran',
		icon: 'CalemInReturn',
		controller: 'CalemInReturnFormList',
		model: 'in_tran', 
   	view: {CalemViewRefInfo: {id: 'CalemInReturnViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInReturnPartFormEdit']={
	CalemFormInfo: {
		id: 'CalemInReturnPartFormEdit',
		title: 'in_vt_return_part',
		icon: 'CalemInReturn',
		controller: 'CalemInReturnPartFormEdit',
		model: 'in_vt_return_part', 
   	view: {CalemViewRefInfo: {id: 'CalemInReturnPartViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInReturnToolFormEdit']={
	CalemFormInfo: {
		id: 'CalemInReturnToolFormEdit',
		title: 'in_vt_return_tool',
		icon: 'CalemInReturn',
		controller: 'CalemInReturnToolFormEdit',
		model: 'in_vt_return_tool', 
   	view: {CalemViewRefInfo: {id: 'CalemInReturnToolViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}


//Physical
CalemItemDef['CalemInPhysicalFormEdit']={
	CalemFormInfo: {
		id: 'CalemInPhysicalFormEdit',
		title: 'in_vt_physical',
		icon: 'CalemInPhysical',
		controller: 'CalemInPhysicalFormEdit',
		model: 'in_vt_physical', 
   	view: {CalemViewRefInfo: {id: 'CalemInPhysicalViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Move
CalemItemDef['CalemInMoveFormEdit']={
	CalemFormInfo: {
		id: 'CalemInMoveFormEdit',
		title: 'in_vt_move',
		icon: 'CalemInMove',
		controller: 'CalemInMoveFormEdit',
		model: 'in_vt_move', 
   	view: {CalemViewRefInfo: {id: 'CalemInMoveViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Check-in
CalemItemDef['CalemInCheckinFormEdit']={
	CalemFormInfo: {
		id: 'CalemInCheckinFormEdit',
		title: 'in_vt_checkin',
		icon: 'CalemInCheckin',
		controller: 'CalemInCheckinFormEdit',
		model: 'in_vt_checkin', 
   	view: {CalemViewRefInfo: {id: 'CalemInCheckinViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//Receive (three transaction steps)
CalemItemDef['CalemInReceiveSelectFormEdit']={
	CalemFormInfo: {
		id: 'CalemInReceiveSelectFormEdit',
		title: 'in_vt_receive_select',
		icon: 'CalemInReceive',
		controller: 'CalemInReceiveSelectFormEdit',
		model: 'in_vt_receive_select', 
   	view: {CalemViewRefInfo: {id: 'CalemInReceiveSelectViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInReceivePoFormEdit']={
	CalemFormInfo: {
		id: 'CalemInReceivePoFormEdit',
		title: 'in_vt_receive',
		icon: 'CalemInReceive',
		controller: 'CalemInReceivePoFormEdit',
		model: 'in_vt_receive', 
   	view: {CalemViewRefInfo: {id: 'CalemInReceivePoViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInReceiveOtherFormEdit']={
	CalemFormInfo: {
		id: 'CalemInReceiveOtherFormEdit',
		title: 'in_vt_receive',
		icon: 'CalemInReceive',
		controller: 'CalemInReceiveOtherFormEdit',
		model: 'in_vt_receive', 
   	view: {CalemViewRefInfo: {id: 'CalemInReceiveOtherViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInReceiveStockFormList']={
	CalemFormInfo: {
		id: 'CalemInReceiveStockFormList',
		title: 'in_stock',
		icon: 'CalemInReceive',
		controller: 'CalemInReceiveStockFormList',
		model: 'in_stock', 
   	view: {CalemViewRefInfo: {id: 'CalemInReceiveStockViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInReceiveQtyFormEdit']={
	CalemFormInfo: {
		id: 'CalemInReceiveQtyFormEdit',
		title: 'in_vt_receive_qty',
		icon: 'CalemInReceive',
		controller: 'CalemInReceiveQtyFormEdit',
		model: 'in_vt_receive_qty', 
   	view: {CalemViewRefInfo: {id: 'CalemInReceiveQtyViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInStockSelectFormList']={
	CalemFormInfo: {
		id: 'CalemInStockSelectFormList',
		title: 'in_stock',
		icon: 'CalemInReceive',
		controller: 'CalemInStockSelectFormList',
		model: 'in_stock', 
   	view: {CalemViewRefInfo: {id: 'CalemInStockSelectViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInCheckoutQtyFormEdit']={
	CalemFormInfo: {
		id: 'CalemInCheckoutQtyFormEdit',
		title: 'in_vt_qty_checkout',
		icon: 'CalemInReceive',
		controller: 'CalemInCheckoutQtyFormEdit',
		model: 'in_vt_qty_checkout', 
   	view: {CalemViewRefInfo: {id: 'CalemInCheckoutQtyViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

// IN order forms
CalemItemDef['CalemInOrderFormList']={
	CalemFormInfo: {
		id: 'CalemInOrderFormList',
		title: 'in_order_list',
		icon: 'CalemIn',
		controller: 'CalemInOrderFormList',
		model: 'in_order_list', 
		view: {CalemViewRefInfo: {id: 'CalemInOrderViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInFormSearch'
	}
}

CalemItemDef['CalemInOrderFormRead']={
	CalemFormInfo: {
		id: 'CalemInOrderFormRead',
		title: 'in_order_list',
		icon: 'CalemInOrder',
		controller: 'CalemInOrderFormRead',
		model: 'in_order_list', 
		view: {CalemViewRefInfo: {id: 'CalemInOrderViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInGenOrderFormNew']={
	CalemFormInfo: {
		id: 'CalemInGenOrderFormNew',
		title: 'in_tb_gen_order_req',
		icon: 'CalemInGenOrder',
		controller: 'CalemInGenOrderFormNew',
		model: 'requisition', 
		view: {CalemViewRefInfo: {id: 'CalemInGenOrderViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
