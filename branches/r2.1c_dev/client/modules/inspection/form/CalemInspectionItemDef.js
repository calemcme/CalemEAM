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
CalemItemDef['CalemInspectionFormList']={
	CalemFormInfo: {
		id: 'CalemInspectionFormList',
		title: 'inspection_list',
		icon: 'CalemInspection',
		controller: 'CalemInspectionFormList',
		model: 'inspection', 
		view: {CalemViewRefInfo: {id: 'CalemInspectionViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInspectionFormSearch'
	}
}

CalemItemDef['CalemInspectionFormLookup']={
	CalemFormInfo: {
		id: 'CalemInspectionFormLookup',
		title: 'inspection',
		icon: 'CalemInspection',
		controller: 'CalemInspectionFormLookup',
		model: 'inspection', 
		view: {CalemViewRefInfo: {id: 'CalemInspectionViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemInspectionFormSearch'
	}
}

CalemItemDef['CalemInspectionFormNew']={
	CalemFormInfo: {
		id: 'CalemInspectionFormNew',
		title: 'inspection',
		icon: 'CalemInspection',
		controller: 'CalemInspectionFormNew',
		model: 'inspection', 
		view: {CalemViewRefInfo: {id: 'CalemInspectionViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInspectionFormEdit']={
	CalemFormInfo: {
		id: 'CalemInspectionFormEdit',
		title: 'inspection',
		icon: 'CalemInspection',
		controller: 'CalemInspectionFormEdit',
		model: 'inspection', 
   	view: {CalemViewRefInfo: {id: 'CalemInspectionViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInspectionFormRead']={
	CalemFormInfo: {
		id: 'CalemInspectionFormRead',
		title: 'inspection',
		icon: 'CalemInspection',
		controller: 'CalemInspectionFormRead',
		model: 'inspection', 
		view: {CalemViewRefInfo: {id: 'CalemInspectionViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInspectionFormSearch']={
	CalemFormInfo: {
		id: 'CalemInspectionFormSearch',
		title: 'inspection',
		icon: 'CalemInspection',
		controller: 'CalemFormSearchEdit',
		model: 'inspection', 
		view: {CalemViewRefInfo: {id: 'CalemInspectionViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInspectionFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemInspectionFormMdTab',
		title: 'inspection',
		icon: 'CalemInspection',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'tab_citation', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemInspectionFormRead']},
					
					'tab_citation' : {CalemTabLayoutInfo: ['CalemInsCitationFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemInspectionFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemInsCitationFormList', link: {CalemFieldMdInfo: {fld: 'inspection_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemInspectionFormRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemInspectionFormRead',
			 		fixed: true, //Move not allowed.
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemInsCitationFormList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemInsCitationFormList',
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 10}}
			 	 }
			 },
			 
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_ins_main', fixed: 1}
		  },
		  
		  'tab_citation': {
		  		CalemTabInfo: {id: 'tab_ins_citation'}
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
CalemItemDef['CalemInsCitationFormList']={
	CalemFormInfo: {
		id: 'CalemInsCitationFormList',
		title: 'ins_citation',
		icon: 'CalemInspection',
		controller: 'CalemInsCitationFormList',
		model: 'ins_citation', 
		view: {CalemViewRefInfo: {id: 'CalemInsCitationViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInsCitationFormNew']={
	CalemFormInfo: {
		id: 'CalemInsCitationFormNew',
		title: 'ins_citation',
		icon: 'CalemInspection',
		controller: 'CalemInsCitationFormNew',
		model: 'ins_citation', 
		view: {CalemViewRefInfo: {id: 'CalemInsCitationViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInsCitationFormEdit']={
	CalemFormInfo: {
		id: 'CalemInsCitationFormEdit',
		title: 'ins_citation',
		icon: 'CalemInspection',
		controller: 'CalemInsCitationFormEdit',
		model: 'ins_citation', 
   	view: {CalemViewRefInfo: {id: 'CalemInsCitationViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemInsCitationFormRead']={
	CalemFormInfo: {
		id: 'CalemInsCitationFormRead',
		title: 'ins_citation',
		icon: 'CalemInspection',
		controller: 'CalemInsCitationFormRead',
		model: 'ins_citation', 
		view: {CalemViewRefInfo: {id: 'CalemInsCitationViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
