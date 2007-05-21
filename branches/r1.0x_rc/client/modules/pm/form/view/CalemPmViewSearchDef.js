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
 

CalemViewDef['CalemPmViewSearch']={
	CalemViewInfo: {
		id: 'CalemPmViewSearch',
		type: 'CalemView',
		layout: {
		 CalemLayoutInfo: {
			tableLayout: {CalemTableLayoutInfo: {}},
			colLayout: {CalemColLayoutInfo: {colCount: 4}}, //Potentially col width definition.
			rows: [
					{CalemTrInfo: {cols: ['lb_caption']}},
					{CalemTrInfo: {cols: ['toolbar']}},
               {CalemTrInfo: {cols: ['err']}},		
               {CalemTrInfo: {cols: ['lb_save_search', '_save_search']}},				             

					//Last changes
					{CalemTrInfo: {cols: ['lb_last_changes']}}                                                                                                             				                               				                               
				   ]
			}
		},
		itemMap : {
			CalemItemMap: {
			toolbar: {
				CalemToolBarInfo: {
					type: 'CalemToolBar',
					layout: ['CalemTbApplySave', 'sep2', 'CalemTbApply', 'CalemTbSave',  'CalemTbCancel', 'sep', 'CalemTbCustomize'],
					list: [	
					   { CalemButtonInfo: {
							 id: 'CalemTbApplySave', 
							 customInfo: {
							  	   CalemMenuCustomInfo: {
							  	   	enabled: false,
							  	   	events: [
							  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_VALID_ALL, func: '_enableIt'}},
							  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_NOT_VALID, func: '_disableIt'}},
							  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_NAME_NOT_VALID, func: '_disableIt'}}
							  	   	]
							  	   }
							  }
						  }
						},
						
						{ CalemButtonInfo: {
							id: 'CalemTbApply', 
							customInfo: {
							  	   CalemMenuCustomInfo: {
							         enabled: false,
							         events: [
							  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_VALID, func: '_enableIt'}},
							  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_NOT_VALID, func: '_disableIt'}}
							  	   	]
							  	   }
							  }
						  }
						},
							  					 
						{ CalemButtonInfo: {
							 id: 'CalemTbSave', 
							 customInfo: {
							  	   CalemMenuCustomInfo: {
							  	   	enabled: false,
							  	   	events: [
							  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_VALID_ALL, func: '_enableIt'}},
							  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_NOT_VALID, func: '_disableIt'}},
							  	   		{CalemEventInfo: {id: CalemEvent.SEARCH_NAME_NOT_VALID, func: '_disableIt'}}
							  	   	]
							  	   }
							  }
						  }
						},
					
					
					   
					{CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},   			
					
					{ CalemButtonInfo: { id: 'CalemTbCancel'}},
					
					{CalemSeparator: {id: 'sep2', className: 'CalemToolBarSeparator'}},
					
					{ CalemButtonInfo: { id: 'CalemTbCustomize'}}
				]
			} },
			'lb_caption': {
				CalemLabelInfo: {id: 'pm', className: 'CalemEditCaption'}
			},
			'err': {
				CalemFormErrorInfo: {id: 'form_error'}
			},
			
			'lb_save_search': {
				CalemLabelInfo: {id: 'save_search', className: 'CalemEditSection'}
			},
			'_save_search': {
				CalemSearchSaveInfo: {size: 30}
			},
			'lb_last_changes': {
				CalemLabelInfo: {id: 'last_changes', className: 'CalemEditSection'}
			},
			'release_schedule': {CalemEditScheduleInfo: {field: 'release_schedule'}}
	}
 } //ItemMap	
}
};

