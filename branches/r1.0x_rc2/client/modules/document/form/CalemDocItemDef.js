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

 