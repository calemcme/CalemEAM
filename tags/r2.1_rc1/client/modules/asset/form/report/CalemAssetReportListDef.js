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
 * List views
 */
CalemViewDef['CalemAssetReportList']={
	CalemViewInfo: {
		id: 'CalemAssetReportList',
		type: 'CalemView',
		layout: {
			CalemLayoutInfo: {
			tableLayout: {CalemTableLayoutInfo: {width: '100%'}},
			colLayout: {CalemColLayoutInfo: {colCount: 1}}, 
			rows: [
			      {CalemTrInfo: {cols: ['lb_caption']}},
					{CalemTrInfo: {height: -2,   cols: ['toolbar']}},
					{CalemTrInfo: {height: -1,   cols: ['grid']}}
				   ]
			}
		},
		itemMap : {
			CalemItemMap: {
			'lb_caption': {
				CalemLabelInfo: {id: 'asset_report_list', className: 'CalemEditCaption'}
			},
			toolbar: {
				CalemToolBarInfo: {
					layout: ['CalemTbOpen', 'CalemTbPrint', 'CalemTbExportExcel', 'CalemTbDataRefresh', 'CalemTbSearch', 'CalemTbSearchClear', 'sep', 'CalemTbCustomize'],
					list: [
					
					{CalemButtonInfo: {id: 'CalemTbDataRefresh'}},
						  					 
					{ CalemButtonInfo: {
						 id: 'CalemTbOpen', 
						 customInfo: {
						  	   CalemMenuCustomInfo: {
						  	   	enabled: false,
						  	   	events: [
						  	   		{CalemEventInfo: {id: CalemEvent.SINGLE_SELECTION, func: '_enableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.MULTI_SELECTION, func: '_disableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.NO_SELECTION, func: '_disableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.DBL_CLICK_SELECTION, func: '_clickIt'}}
						  	   	]
						  	   }
						  }
					  }
					},
					
					{CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
					
				   { CalemButtonInfo: {
						id: 'CalemTbPrint', 
						customInfo: {CalemMenuCustomInfo: {enabled: true}} 
				     } 
					},
					
					{ CalemButtonInfo: {id: 'CalemTbExportExcel', 
						customInfo: {CalemMenuCustomInfo: {enabled: true}}  
					  }
					},
					
					{ CalemButtonInfo: { id: 'CalemTbSearch' }},
					
					{ CalemButtonInfo: {
						id: 'CalemTbSearchClear', 
						customInfo: {
						  	   CalemMenuCustomInfo: {
						  	   	enabled: false,
						  	   	events: [
						  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_APPLIED, func: '_enableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_REMOVED, func: '_disableIt'}}
						  	   	]
						  	   }
						  }
					  }  
					},
					
					{CalemButtonInfo: { id: 'CalemTbCustomize'}}
				]
			} },
			grid: {
			  CalemDataGridInfo: {
				listInfo: {
			  	   CalemListInfo: {
			  			noMaximize: true,
			  			colList: [
			  			   {CalemCol: {id: 'asset_no', width: 300}}
			  			]	 
			  		} 		
		      }
			}
		} 
	}
 } 	
}
};

