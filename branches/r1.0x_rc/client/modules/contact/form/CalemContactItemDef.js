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
CalemItemDef['CalemContactFormList']={
	CalemFormInfo: {
		id: 'CalemContactFormList',
		title: 'contact',
		icon: 'CalemContact',
		controller: 'CalemContactFormList',
		model: 'contact', 
		view: {CalemViewRefInfo: {id: 'CalemContactViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemContactFormSearch'
	}
}

CalemItemDef['CalemContactFormLookup']={
	CalemFormInfo: {
		id: 'CalemContactFormLookup',
		title: 'contact',
		icon: 'CalemContact',
		controller: 'CalemContactFormLookup',
		model: 'contact', 
		view: {CalemViewRefInfo: {id: 'CalemContactViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemContactFormSearch'
	}
}

CalemItemDef['CalemContactFormNew']={
	CalemFormInfo: {
		id: 'CalemContactFormNew',
		title: 'contact',
		icon: 'CalemContact',
		controller: 'CalemContactFormNew',
		model: 'contact', 
		view: {CalemViewRefInfo: {id: 'CalemContactViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContactFormEdit']={
	CalemFormInfo: {
		id: 'CalemContactFormEdit',
		title: 'contact',
		icon: 'CalemContact',
		controller: 'CalemContactFormEdit',
		model: 'contact', 
   	view: {CalemViewRefInfo: {id: 'CalemContactViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContactFormRead']={
	CalemFormInfo: {
		id: 'CalemContactFormRead',
		title: 'contact',
		icon: 'CalemContact',
		controller: 'CalemContactFormRead',
		model: 'contact', 
		view: {CalemViewRefInfo: {id: 'CalemContactViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContactFormSearch']={
	CalemFormInfo: {
		id: 'CalemContactFormSearch',
		title: 'contact',
		icon: 'CalemContact',
		controller: 'CalemFormSearchEdit',
		model: 'contact', 
		view: {CalemViewRefInfo: {id: 'CalemContactViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
