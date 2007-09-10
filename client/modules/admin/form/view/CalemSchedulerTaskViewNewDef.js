/*
* License Boilerplate Start
*
* License Boilerplate End
* 
* 
* Author(s): CL
*
*/ 

CalemViewDef['CalemSchedulerTaskViewNew']={
	CalemViewInfo: {
		id: 'CalemSchedulerTaskViewNew',
		type: 'CalemView',
		layout: {
		 CalemLayoutInfo: {
			tableLayout: {CalemTableLayoutInfo: {}},
			colLayout: {CalemColLayoutInfo: {colCount: 4}}, //Potentially col width definition.
			rows: [
					{CalemTrInfo: {cols: ['lb_caption']}},
					{CalemTrInfo: {cols: ['toolbar']}},
               {CalemTrInfo: {cols: ['err']}}                                                                                                             				                               				                               
				   ]
			}
		},
		itemMap : {
			CalemItemMap: {
			toolbar: {
				CalemToolBarInfo: {
					type: 'CalemToolBar',
					layout: ['CalemTbSave', 'CalemTbCancel', 'sep', 'CalemTbCustomize'],
					list: [	  					 
					{ CalemButtonInfo: {
						 id: 'CalemTbSave', 
						 customInfo: {
						  	   CalemMenuCustomInfo: {
						  	   	enabled: false,
						  	   	events: [
						  	   		{CalemEventInfo: {id: CalemEvent.DATA_VALID, func: '_enableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.DATA_INVALID, func: '_disableIt'}}
						  	   	]
						  	   }
						  }
					  }
					},
					      			
					{ CalemButtonInfo: {id: 'CalemTbCancel'}},
					
					//Add a separator
					{CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
					
					{ CalemButtonInfo: {id: 'CalemTbCustomize'}}					
				]
			} },
			'lb_caption': {
				CalemLabelInfo: {id: 'scheduler_task', className: 'CalemEditCaption'}
			},
			'err': {
				CalemFormErrorInfo: {id: 'form_error'}
			}
	}
 } //ItemMap	
}
};

