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
 * Dashboard peer TAB form.
 */
CalemItemDef['CalemDashFormPeerTab']={
	CalemFormPeerTabInfo: {
		id: 'CalemDashFormPeerTab',
		title: 'dash_title',
		icon: 'CalemDashboard',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//layout and itemMap.
		layout: {
			CalemPeerTabLayoutInfo: {
				tabList: ['tab_dash', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_dash': {CalemTabColLayoutInfo: [
						{CalemTabLayoutInfo: ['CalemDashWoOrigDayFormChart', 'CalemDashWoOrigMdFormChart']},
						{CalemTabLayoutInfo: ['CalemDashWoStatusPieFormChart', 'CalemDashWoAgePriFormChart']}
					]}
				}
			} },
		model: '', //No model at this level
		itemMap : { //Default layout conf.
		  CalemItemMap :{
			 'CalemDashWoOrigDayFormChart' : {CalemFormLayoutInfo: {
								 		id: 'CalemDashWoOrigDayFormChart',
								 		layout: {CalemBlockLayoutInfo: {width: '100%', rows: 12}} }
										},
			 'CalemDashWoOrigMdFormChart' : {CalemFormLayoutInfo: {
								 		id: 'CalemDashWoOrigMdFormChart',
								 		layout: {CalemBlockLayoutInfo: {width: '100%', rows: 12}} }
										},
			  'CalemDashWoStatusPieFormChart' : {CalemFormLayoutInfo: {
								 		id: 'CalemDashWoStatusPieFormChart',
								 		layout: {CalemBlockLayoutInfo: {width: '100%', rows: 12}} }
										},
			  'CalemDashWoAgePriFormChart' : {CalemFormLayoutInfo: {
								 		id: 'CalemDashWoAgePriFormChart',
								 		layout: {CalemBlockLayoutInfo: {width: '100%', rows: 12}} }
										},
			 
		    'tab_dash': {CalemPeerTabInfo: {id: 'tab_dash', fixed: 1, colCount: 2, colWidth: ['0.5', '0.5']}},
			 'CUSTOMIZE_TAB' : {CalemTabInfo: {id: 'CUSTOMIZE_TAB'}}
		  }	  
		} //itemMap
	} //PeerTab
}

CalemItemDef['CalemDashWoOrigDayFormChart']={
	CalemFormInfo: {
		id: 'CalemDashWoOrigDayFormChart',
		title: 'dash_wo_orig_day',
		icon: 'CalemDashboard',
		controller: 'CalemDashWoOrigDayFormChart',
		model: 'dash_wo_orig_day', 
		view: {CalemViewRefInfo: {id: 'CalemDashWoOrigDayViewChart'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDashWoOrigMdFormChart']={
	CalemFormInfo: {
		id: 'CalemDashWoOrigMdFormChart',
		title: 'dash_wo_orig_md',
		icon: 'CalemDashboard',
		controller: 'CalemDashWoOrigMdFormChart',
		model: 'dash_wo_orig_md', 
		view: {CalemViewRefInfo: {id: 'CalemDashWoOrigMdViewChart'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDashWoStatusPieFormChart']={
	CalemFormInfo: {
		id: 'CalemDashWoStatusPieFormChart',
		title: 'dash_wo_status_pie',
		icon: 'CalemDashboard',
		controller: 'CalemDashWoStatusPieFormChart',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemDashWoStatusPieViewChart'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}

CalemItemDef['CalemDashWoAgePriFormChart']={
	CalemFormInfo: {
		id: 'CalemDashWoAgePriFormChart',
		title: 'dash_wo_age_pri',
		icon: 'CalemDashboard',
		controller: 'CalemDashWoAgePriFormChart',
		model: 'workorder', 
		view: {CalemViewRefInfo: {id: 'CalemDashWoAgePriViewChart'}}, 
		replaceType: CalemItemDef.REPLACE_BY_ID
	}
}
