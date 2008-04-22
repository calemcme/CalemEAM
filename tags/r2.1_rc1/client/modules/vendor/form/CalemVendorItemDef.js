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
 * Vendor
 */
CalemItemDef['CalemVendorFormList']={
	CalemFormInfo: {
		id: 'CalemVendorFormList',
		title: 'vendor_list',
		icon: 'CalemVendor',
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
		icon: 'CalemVendor',
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
		icon: 'CalemVendor',
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
		icon: 'CalemVendor',
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
		icon: 'CalemVendor',
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
		icon: 'CalemVendor',
		controller: 'CalemFormSearchEdit',
		model: 'vendor', 
		view: {CalemViewRefInfo: {id: 'CalemVendorViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemVendorFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemVendorFormMdTab',
		title: 'vendor',
		icon: 'CalemVendor',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_contact', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemVendorFormRead']},
					'tab_contact' : {CalemTabLayoutInfo: ['CalemVendorContactFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemVendorFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemVendorContactFormList', link: {CalemFieldMdInfo: {fld: 'vendor_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemVendorFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemVendorFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
		  'CalemVendorContactFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemVendorContactFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_vendor_main', fixed: 1}
		  },
		  
		  'tab_contact': {
		  		CalemTabInfo: {id: 'tab_vendor_contact'}
		  },
		  
		  'tab_misc': {
		  		CalemTabInfo: {id: 'tab_vendor_misc'}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		} //itemMap
	} //MdTabInfo
}


//Vendor contact detail
CalemItemDef['CalemVendorContactFormList']={
	CalemFormInfo: {
		id: 'CalemVendorContactFormList',
		title: 'vendor_contact',
		icon: 'CalemVendor',
		controller: 'CalemVendorContactFormList',
		model: 'vendor_contact', 
		view: {CalemViewRefInfo: {id: 'CalemVendorContactViewList'}},
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemVendorContactFormNew']={
	CalemFormInfo: {
		id: 'CalemVendorContactFormNew',
		title: 'vendor_contact',
		icon: 'CalemVendor',
		controller: 'CalemVendorContactFormNew',
		model: 'vendor_contact', 
		view: {CalemViewRefInfo: {id: 'CalemVendorContactViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemVendorContactFormEdit']={
	CalemFormInfo: {
		id: 'CalemVendorContactFormEdit',
		title: 'vendor_contact',
		icon: 'CalemVendor',
		controller: 'CalemVendorContactFormEdit',
		model: 'vendor_contact', 
   	view: {CalemViewRefInfo: {id: 'CalemVendorContactViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemVendorContactFormRead']={
	CalemFormInfo: {
		id: 'CalemVendorContactFormRead',
		title: 'vendor_contact',
		icon: 'CalemVendor',
		controller: 'CalemVendorContactFormRead',
		model: 'vendor_contact', 
		view: {CalemViewRefInfo: {id: 'CalemVendorContactViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
