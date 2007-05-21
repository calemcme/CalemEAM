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
 * Wo report
 */
CalemItemDef['CalemWoReportMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemWoReportMdTab',
		title: 'workorder',
		icon: 'CalemWo',
		controller: 'CalemReportMdTab',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemWoReportRead']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemWoReportRead',
			      items: 
			             [
			              //Planned
			              {CalemFormLinkInfo: {id: 'CalemWoPlannedLaborReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoPlannedToolReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoPlannedPartReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoPlannedDowntimeReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              
			              {CalemFormLinkInfo: {id: 'CalemWoDocReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoMeterReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              //Sched
			              {CalemFormLinkInfo: {id: 'CalemWoSchedLaborReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              //Used
			              {CalemFormLinkInfo: {id: 'CalemWoStepReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoSafetyReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              
			              {CalemFormLinkInfo: {id: 'CalemWoLaborReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoPartReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoToolReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },
			              {CalemFormLinkInfo: {id: 'CalemWoDowntimeReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} },

			              {CalemFormLinkInfo: {id: 'CalemWoCommentReportList', link: {CalemFieldMdInfo: {fld: 'wo_id', parentFld: 'id'}}} }
			              
			             ]
				}
		}, 
		itemMap : {
		  CalemItemMap :{
			 'CalemWoReportRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemWoReportRead',
			 		fixed: true,
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemWoPlannedLaborReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPlannedLaborReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoPlannedToolReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPlannedToolReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoPlannedPartReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPlannedPartReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoPlannedDowntimeReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPlannedDowntimeReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoDocReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoDocReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoMeterReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoMeterReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoSchedLaborReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoSchedLaborReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 			 
			 'CalemWoStepReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoStepReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoSafetyReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoSafetyReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
		  
		   'CalemWoLaborReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoLaborReportList',
			 	 	minRow: 3,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoToolReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoToolReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoPartReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoPartReportList',
			 	 	minRow: 2,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoDowntimeReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoDowntimeReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
			 'CalemWoCommentReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemWoCommentReportList',
			 	 	minRow: 0,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_wo_main', fixed: 1}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		}
	}
}
