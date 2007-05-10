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
 * Budget views
 */
CalemViewDef['CalemUserViewLookup']={
	CalemViewInfo: {
		id: 'CalemUserViewLookup',
		type: 'CalemView',
		layout: {
			CalemLayoutInfo: {
			tableLayout: {CalemTableLayoutInfo: {width: '100%'}},
			colLayout: {CalemColLayoutInfo: {colCount: 1}}, //Potentially col width definition.
			rows: [
			      {CalemTrInfo: {cols: ['lb_caption']}},
					{CalemTrInfo: {cols: ['toolbar']}},
					{CalemTrInfo: {height: -1,   cols: ['grid']}}
				   ]
			}
		},
		itemMap : {
			CalemItemMap: {
			'lb_caption': {
				CalemLabelInfo: {id: 'users', className: 'CalemEditCaption'}
			},
			toolbar: {
				CalemToolBarInfo: {
					layout: ['CalemTbSelect', 'CalemTbCancel', 'sep', 'CalemTbCustomize'],
					list: [
				   //New
					{ CalemButtonInfo: {
						  id: 'CalemTbNew'
					  }		
					},
					
					{ CalemButtonInfo: {
						  id: 'CalemTbEdit',
						  customInfo: {
						  	  CalemMenuCustomInfo: {
						  	  	 events: [
						  	   		{CalemEventInfo: {id: CalemEvent.SINGLE_SELECTION, func: '_enableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.MULTI_SELECTION, func: '_disableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.NO_SELECTION, func: '_disableIt'}}
						  	   	]
						  	  }
						  }  
					  }		
					},		
						  					 
					{ CalemButtonInfo: {
						 id: 'CalemTbOpen', 
						 customInfo: {
						  	   CalemMenuCustomInfo: {
						  	   	enabled: false,
						  	   	events: [
						  	   		{CalemEventInfo: {id: CalemEvent.SINGLE_SELECTION, func: '_enableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.MULTI_SELECTION, func: '_disableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.NO_SELECTION, func: '_disableIt'}}
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
					//Add a separator
					{CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
				
					{ CalemButtonInfo: {
						 id: 'CalemTbSelect', 
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
					
					{ CalemButtonInfo: { id: 'CalemTbCancel'}},

               { CalemButtonInfo: {id: 'CalemTbCustomize'}} 
				]
			} },
			grid: {
			  CalemDataGridInfo: {
				listInfo: {
			  	   CalemListInfo: {
			  			noMaximize: true,
			  			colList: [
			  			   {CalemCol: {id: 'username', width: 130}},
			  			   {CalemCol: {id: 'login_allowed', width: 110}},
			  			   {CalemCol: {id: 'full_name', width: 150}},
			  			   {CalemCol: {id: 'acl_group_id', width: 150}},
			  			   {CalemCol: {id: 'admin_type_id', width: 150}}
			  			]	 
			  		} 		
		      }
			}
		} 
	}
 } //ItemMap	
}
};

