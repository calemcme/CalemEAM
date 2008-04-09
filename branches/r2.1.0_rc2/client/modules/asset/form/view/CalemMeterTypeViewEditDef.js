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
 

CalemViewDef['CalemMeterTypeViewEdit']={
	CalemViewInfo: {
		id: 'CalemMeterTypeViewEdit',
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
							  	   		{CalemEventInfo: {id: CalemEvent.EDIT_CHANGED, func: '_enableIt'}},
							  	   		{CalemEventInfo: {id: CalemEvent.EDIT_NO_CHANGE, func: '_disableIt'}}
							  	   	]
							  	   }
							  }
						  }
						},
								
					{ CalemButtonInfo: { id: 'CalemTbCancel'}},
					
					{CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
					
					{ CalemButtonInfo: { id: 'CalemTbCustomize'}}				
				]
			} },
			'lb_caption': {
				CalemLabelInfo: {id: 'meter_type', className: 'CalemEditCaption'}
			},
			'err': {
				CalemFormErrorInfo: {id: 'form_error'}
			}
	}
 } //ItemMap	
}
};

