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
CalemViewDef['CalemSchedulerJobViewList']={
	CalemViewInfo: {
		id: 'CalemSchedulerJobViewList',
		type: 'CalemView',
		layout: {
			CalemLayoutInfo: {
			tableLayout: {CalemTableLayoutInfo: {width: '100%'}},
			colLayout: {CalemColLayoutInfo: {colCount: 1}}, //Potentially col width definition.
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
				CalemLabelInfo: {id: 'scheduler_job', className: 'CalemEditCaption'}
			},
			toolbar: {
				CalemToolBarInfo: {
					layout: ['CalemTbNew', 'CalemTbOpen', 'CalemTbDelete', 'sep', 'CalemTbDataRefresh', 'sep2', 'CalemTbSearch', 'CalemTbSearchClear', 'sep3', 'CalemTbCustomize'],
					list: [
				   //New
					{ CalemButtonInfo: {id: 'CalemTbNew'}},
						  					 
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
					      			
					{ CalemButtonInfo: {
						id: 'CalemTbDelete', 
						customInfo: {
						  	   CalemMenuCustomInfo: {
						  	   	enabled: false,
						  	   	events: [
						  	   		{CalemEventInfo: {id: CalemEvent.SINGLE_SELECTION, func: '_enableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.MULTI_SELECTION, func: '_enableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.NO_SELECTION, func: '_disableIt'}}
						  	   	]
						  	   }
						  }
					  }
					},
					{CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
					
					{CalemButtonInfo: { id: 'CalemTbDataRefresh'}},
					
					{CalemSeparator: {id: 'sep2', className: 'CalemToolBarSeparator'}},
				
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
					
					{CalemSeparator: {id: 'sep3', className: 'CalemToolBarSeparator'}},
					
					{CalemButtonInfo: { id: 'CalemTbCustomize'}}
				]
			} },
			grid: {
			  CalemDataGridInfo: {
				listInfo: {
			  	   CalemListInfo: {
			  			noMaximize: true,
			  			colList: [
			  			   {CalemCol: {id: 'task_id', width: 130}}
			  			]	 
			  		} 		
		      }
			}
		} 
	}
 } //ItemMap	
}
};

