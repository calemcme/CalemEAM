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
CalemItemDef['CalemContractorFormList']={
	CalemFormInfo: {
		id: 'CalemContractorFormList',
		title: 'contractor',
		icon: 'CalemContractor',
		controller: 'CalemContractorFormList',
		model: 'contractor', 
		view: {CalemViewRefInfo: {id: 'CalemContractorViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemContractorFormSearch'
	}
}

CalemItemDef['CalemContractorFormLookup']={
	CalemFormInfo: {
		id: 'CalemContractorFormLookup',
		title: 'contractor',
		icon: 'CalemContractor',
		controller: 'CalemContractorFormLookup',
		model: 'contractor', 
		view: {CalemViewRefInfo: {id: 'CalemContractorViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemContractorFormSearch'
	}
}

CalemItemDef['CalemContractorFormNew']={
	CalemFormInfo: {
		id: 'CalemContractorFormNew',
		title: 'contractor',
		icon: 'CalemContractor',
		controller: 'CalemContractorFormNew',
		model: 'contractor', 
		view: {CalemViewRefInfo: {id: 'CalemContractorViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractorFormEdit']={
	CalemFormInfo: {
		id: 'CalemContractorFormEdit',
		title: 'contractor',
		icon: 'CalemContractor',
		controller: 'CalemContractorFormEdit',
		model: 'contractor', 
   	view: {CalemViewRefInfo: {id: 'CalemContractorViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractorFormRead']={
	CalemFormInfo: {
		id: 'CalemContractorFormRead',
		title: 'contractor',
		icon: 'CalemContractor',
		controller: 'CalemContractorFormRead',
		model: 'contractor', 
		view: {CalemViewRefInfo: {id: 'CalemContractorViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemContractorFormSearch']={
	CalemFormInfo: {
		id: 'CalemContractorFormSearch',
		title: 'contractor',
		icon: 'CalemContractor',
		controller: 'CalemFormSearchEdit',
		model: 'contractor', 
		view: {CalemViewRefInfo: {id: 'CalemContractorViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
