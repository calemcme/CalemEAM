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

/**
 * Doc MdTab.
 */
CalemItemDef['CalemDocFormMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemDocFormMdTab',
		title: 'document',
		icon: 'CalemDocument',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_doc'],
				tabMap: {
					'tab_doc': {CalemTabLayoutInfo: ['CalemDocFormRead','CalemDocAttachmentFormList']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemDocFormRead',
			      items: 
			             [{CalemFormLinkInfo: {id: 'CalemDocAttachmentFormList', link: {CalemFieldMdInfo: {fld: 'doc_id', parentFld: 'id'}}} }
			             ]
				}
		}, 
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemDocFormRead' : {CalemFormLayoutInfo: {
								 		id: 'CalemDocFormRead',
								 		fixed: true, //Move not allowed.
								 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}} }
										},
			 
			 'CalemDocAttachmentFormList' : {CalemFormLayoutInfo: {
								 		id: 'CalemDocAttachmentFormList',
								 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-1'}} }
										},
			 
		  'tab_doc': {CalemTabInfo: {id: 'tab_doc'}}
		  }
		  
		} //itemMap
	} //MdTabInfo
} 

/**
 * Doc
 */
CalemItemDef['CalemDocFormList']={
	CalemFormInfo: {
		id: 'CalemDocFormList',
		title: 'document_list',
		icon: 'CalemDoc',
		controller: 'CalemDocFormList',
		model: 'document', 
		view: {CalemViewRefInfo: {id: 'CalemDocViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemDocFormSearch'
	}
}

CalemItemDef['CalemDocFormLookup']={
	CalemFormInfo: {
		id: 'CalemDocFormLookup',
		title: 'document',
		icon: 'CalemDoc',
		controller: 'CalemDocFormLookup',
		model: 'document', 
		view: {CalemViewRefInfo: {id: 'CalemDocViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemDocFormSearch'
	}
}

CalemItemDef['CalemDocFormNew']={
	CalemFormInfo: {
		id: 'CalemDocFormNew',
		title: 'document',
		icon: 'CalemDoc',
		controller: 'CalemDocFormNew',
		model: 'document', 
		view: {CalemViewRefInfo: {id: 'CalemDocViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocFormEdit']={
	CalemFormInfo: {
		id: 'CalemDocFormEdit',
		title: 'document',
		icon: 'CalemDoc',
		controller: 'CalemDocFormEdit',
		model: 'document', 
   	view: {CalemViewRefInfo: {id: 'CalemDocViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocFormRead']={
	CalemFormInfo: {
		id: 'CalemDocFormRead',
		title: 'document',
		icon: 'CalemDoc',
		controller: 'CalemDocFormRead',
		model: 'document', 
		view: {CalemViewRefInfo: {id: 'CalemDocViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocFormSearch']={
	CalemFormInfo: {
		id: 'CalemDocFormSearch',
		title: 'document',
		icon: 'CalemDoc',
		controller: 'CalemFormSearchEdit',
		model: 'document', 
		view: {CalemViewRefInfo: {id: 'CalemDocViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Doc type
 */
CalemItemDef['CalemDocTypeFormList']={
	CalemFormInfo: {
		id: 'CalemDocTypeFormList',
		title: 'doc_type',
		icon: 'CalemDoc',
		controller: 'CalemDocTypeFormList',
		model: 'doc_type', 
		view: {CalemViewRefInfo: {id: 'CalemDocTypeViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemDocTypeFormSearch'
	}
}

CalemItemDef['CalemDocTypeFormLookup']={
	CalemFormInfo: {
		id: 'CalemDocTypeFormLookup',
		title: 'doc_type',
		icon: 'CalemDoc',
		controller: 'CalemDocTypeFormLookup',
		model: 'doc_type', 
		view: {CalemViewRefInfo: {id: 'CalemDocTypeViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemDocTypeFormSearch'
	}
}

CalemItemDef['CalemDocTypeFormNew']={
	CalemFormInfo: {
		id: 'CalemDocTypeFormNew',
		title: 'doc_type',
		icon: 'CalemDoc',
		controller: 'CalemDocTypeFormNew',
		model: 'doc_type', 
		view: {CalemViewRefInfo: {id: 'CalemDocTypeViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocTypeFormEdit']={
	CalemFormInfo: {
		id: 'CalemDocTypeFormEdit',
		title: 'doc_type',
		icon: 'CalemDoc',
		controller: 'CalemDocTypeFormEdit',
		model: 'doc_type', 
   	view: {CalemViewRefInfo: {id: 'CalemDocTypeViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocTypeFormRead']={
	CalemFormInfo: {
		id: 'CalemDocTypeFormRead',
		title: 'doc_type',
		icon: 'CalemDoc',
		controller: 'CalemDocTypeFormRead',
		model: 'doc_type', 
		view: {CalemViewRefInfo: {id: 'CalemDocTypeViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocTypeFormSearch']={
	CalemFormInfo: {
		id: 'CalemDocTypeFormSearch',
		title: 'doc_type',
		icon: 'CalemDoc',
		controller: 'CalemFormSearchEdit',
		model: 'doc_type', 
		view: {CalemViewRefInfo: {id: 'CalemDocTypeViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Doc Upload
 */
CalemItemDef['CalemDocUploadFormList']={
	CalemFormInfo: {
		id: 'CalemDocUploadFormList',
		title: 'doc_upload',
		icon: 'CalemUpload',
		controller: 'CalemDocUploadFormList',
		model: 'doc_upload', 
		view: {CalemViewRefInfo: {id: 'CalemDocUploadViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemDocUploadFormSearch'
	}
}

CalemItemDef['CalemDocUploadFormLookup']={
	CalemFormInfo: {
		id: 'CalemDocUploadFormLookup',
		title: 'doc_upload',
		icon: 'CalemUpload',
		controller: 'CalemDocUploadFormLookup',
		model: 'doc_upload', 
		view: {CalemViewRefInfo: {id: 'CalemDocUploadViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemDocUploadFormSearch'
	}
}

CalemItemDef['CalemDocUploadFormNew']={
	CalemFormInfo: {
		id: 'CalemDocUploadFormNew',
		title: 'doc_upload',
		icon: 'CalemUpload',
		controller: 'CalemDocUploadFormNew',
		model: 'doc_upload', 
		view: {CalemViewRefInfo: {id: 'CalemDocUploadViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocUploadFormEdit']={
	CalemFormInfo: {
		id: 'CalemDocUploadFormEdit',
		title: 'doc_upload',
		icon: 'CalemUpload',
		controller: 'CalemDocUploadFormEdit',
		model: 'doc_upload', 
   	view: {CalemViewRefInfo: {id: 'CalemDocUploadViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocUploadFormRead']={
	CalemFormInfo: {
		id: 'CalemDocUploadFormRead',
		title: 'doc_upload',
		icon: 'CalemUpload',
		controller: 'CalemDocUploadFormRead',
		model: 'doc_upload', 
		view: {CalemViewRefInfo: {id: 'CalemDocUploadViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocUploadFormSearch']={
	CalemFormInfo: {
		id: 'CalemDocUploadFormSearch',
		title: 'doc_upload',
		icon: 'CalemUpload',
		controller: 'CalemFormSearchEdit',
		model: 'doc_upload', 
		view: {CalemViewRefInfo: {id: 'CalemDocUploadViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

/**
 * Doc attachment
 */
CalemItemDef['CalemDocAttachmentFormList']={
	CalemFormInfo: {
		id: 'CalemDocAttachmentFormList',
		title: 'doc_attachment',
		icon: 'CalemDoc',
		controller: 'CalemDocAttachmentFormList',
		model: 'doc_attachment', 
		view: {CalemViewRefInfo: {id: 'CalemDocAttachmentViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemDocAttachmentFormSearch'
	}
}

CalemItemDef['CalemDocAttachmentFormNew']={
	CalemFormInfo: {
		id: 'CalemDocAttachmentFormNew',
		title: 'doc_attachment',
		icon: 'CalemDoc',
		controller: 'CalemDocAttachmentFormNew',
		model: 'doc_attachment', 
		view: {CalemViewRefInfo: {id: 'CalemDocAttachmentViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocAttachmentFormEdit']={
	CalemFormInfo: {
		id: 'CalemDocAttachmentFormEdit',
		title: 'doc_attachment',
		icon: 'CalemDoc',
		controller: 'CalemDocAttachmentFormEdit',
		model: 'doc_attachment', 
   	view: {CalemViewRefInfo: {id: 'CalemDocAttachmentViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDocAttachmentFormRead']={
	CalemFormInfo: {
		id: 'CalemDocAttachmentFormRead',
		title: 'doc_attachment',
		icon: 'CalemDoc',
		controller: 'CalemDocAttachmentFormRead',
		model: 'doc_attachment', 
		view: {CalemViewRefInfo: {id: 'CalemDocAttachmentViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

 
