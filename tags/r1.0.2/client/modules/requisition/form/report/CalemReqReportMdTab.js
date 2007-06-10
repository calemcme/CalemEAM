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
 * Req report
 */
CalemItemDef['CalemReqReportMdTab']={
	CalemFormMdTabInfo: {
		id: 'CalemReqReportMdTab',
		title: 'requisition',
		icon: 'CalemReq',
		controller: 'CalemReportMdTab',
		replaceType: CalemItemDef.REPLACE_BY_ID,
		//Three portions of info: layout, model and itemMap.
		layout: {
			CalemMdTabLayoutInfo: {
				tabList: ['tab_main', 'CUSTOMIZE_TAB'],
				tabMap: {
					'tab_main': {CalemTabLayoutInfo: ['CalemReqReportRead']}
				}
			} },
		model: {
				CalemFormModelInfo: {
					master: 'CalemReqReportRead',
			      items: 
			             [
			              //Planned
			              {CalemFormLinkInfo: {id: 'CalemReqItemReportList', link: {CalemFieldMdInfo: {fld: 'req_id', parentFld: 'id'}}} }			              
			             ]
				}
		}, 
		itemMap : {
		  CalemItemMap :{
			 'CalemReqReportRead' : {
			 	CalemFormLayoutInfo: {
			 		id: 'CalemReqReportRead',
			 		fixed: true,
			 		layout: {CalemBlockLayoutInfo: {width: '100%', height: '-2'}}
			 	}
			 },
			 
			 'CalemReqItemReportList' : {
			 	 CalemFormLayoutInfo: {
			 	 	id: 'CalemReqItemReportList',
			 	 	minRow: 5,
			 	 	layout: {CalemBlockLayoutInfo: {width: '100%', rows: 8}}
			 	 }
			 },
			 
		  'tab_main': {
		  		CalemTabInfo: {id: 'tab_req_main', fixed: 1}
		  },
		  
		  'CUSTOMIZE_TAB' : {
		  		CalemTabInfo: {id: 'CUSTOMIZE_TAB'}
		  }
		  
		  }
		  
		}
	}
}
