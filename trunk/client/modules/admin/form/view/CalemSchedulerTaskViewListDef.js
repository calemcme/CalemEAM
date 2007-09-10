/*
* License Boilerplate Start
*
* License Boilerplate End
* 
* 
* Author(s): CL
*
*/ 

/**
 * List views
 */
CalemViewDef['CalemSchedulerTaskViewList']={
	CalemViewInfo: {
		id: 'CalemSchedulerTaskViewList',
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
				CalemLabelInfo: {id: 'scheduler_task', className: 'CalemEditCaption'}
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
			  			   {CalemCol: {id: 'task', width: 130}}
			  			]	 
			  		} 		
		      }
			}
		} 
	}
 } //ItemMap	
}
};

