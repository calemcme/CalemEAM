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
CalemItemDef['CalemSchedUserFormList']={
	CalemFormInfo: {
		id: 'CalemSchedUserFormList',
		title: 'sched_user',
		icon: 'CalemSched',
		controller: 'CalemSchedUserFormList',
		model: 'sched_user', 
		view: {CalemViewRefInfo: {id: 'CalemSchedUserViewList'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemSchedUserFormSearch'
	}
}

CalemItemDef['CalemSchedUserFormLookup']={
	CalemFormInfo: {
		id: 'CalemSchedUserFormLookup',
		title: 'sched_user',
		icon: 'CalemSched',
		controller: 'CalemSchedUserFormLookup',
		model: 'sched_user', 
		view: {CalemViewRefInfo: {id: 'CalemSchedUserViewLookup'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID,
		searchFormId: 'CalemSchedUserFormSearch'
	}
}

CalemItemDef['CalemSchedUserFormNew']={
	CalemFormInfo: {
		id: 'CalemSchedUserFormNew',
		title: 'sched_user',
		icon: 'CalemSched',
		controller: 'CalemSchedUserFormNew',
		model: 'sched_user', 
		view: {CalemViewRefInfo: {id: 'CalemSchedUserViewNew'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSchedUserFormEdit']={
	CalemFormInfo: {
		id: 'CalemSchedUserFormEdit',
		title: 'sched_user',
		icon: 'CalemSched',
		controller: 'CalemSchedUserFormEdit',
		model: 'sched_user', 
   	view: {CalemViewRefInfo: {id: 'CalemSchedUserViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSchedUserFormRead']={
	CalemFormInfo: {
		id: 'CalemSchedUserFormRead',
		title: 'sched_user',
		icon: 'CalemSched',
		controller: 'CalemSchedUserFormRead',
		model: 'sched_user', 
		view: {CalemViewRefInfo: {id: 'CalemSchedUserViewRead'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemSchedUserFormSearch']={
	CalemFormInfo: {
		id: 'CalemSchedUserFormSearch',
		title: 'sched_user',
		icon: 'CalemSched',
		controller: 'CalemFormSearchEdit',
		model: 'sched_user', 
		view: {CalemViewRefInfo: {id: 'CalemSchedUserViewSearch'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

//SchedByUser 
CalemItemDef['CalemSchedByUserFormEdit']={
	CalemFormInfo: {
		id: 'CalemSchedByUserFormEdit',
		title: 'sched_vt_by_user',
		icon: 'CalemSched',
		controller: 'CalemSchedByUserFormEdit',
		model: 'sched_vt_by_user', 
   	view: {CalemViewRefInfo: {id: 'CalemSchedByUserViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
} 

CalemItemDef['CalemSchedByTeamFormEdit']={
	CalemFormInfo: {
		id: 'CalemSchedByTeamFormEdit',
		title: 'sched_vt_by_team',
		icon: 'CalemSched',
		controller: 'CalemSchedByTeamFormEdit',
		model: 'sched_vt_by_team', 
   	view: {CalemViewRefInfo: {id: 'CalemSchedByTeamViewEdit'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
} 
