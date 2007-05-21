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
CalemViewDef['CalemUserViewReadMine']={
	CalemViewInfo: {
		id: 'CalemUserViewReadMine',
		type: 'CalemView',
		layout: {
		 CalemLayoutInfo: {
			tableLayout: {CalemTableLayoutInfo: {}},
			colLayout: {CalemColLayoutInfo: {colCount: 4}}, //Potentially col width definition.
			rows: [
					{CalemTrInfo: {cols: ['lb_caption']}},
					{CalemTrInfo: {cols: ['toolbar']}},						             
					{CalemTrInfo: {cols: ['lb_communication']}},					                               				                               
					{CalemTrInfo: {cols: ['lb_address']}},
					{CalemTrInfo: {cols: ['lb_access_rights']}},
					{CalemTrInfo: {cols: ['lb_purchase']}},
					{CalemTrInfo: {cols: ['lb_last_changes']}},
					{CalemTrInfo: {cols: ['lb_job']}}					   
					]
			}
		},
		itemMap : {
			CalemItemMap: {
			toolbar: {
				CalemToolBarInfo: {
					type: 'CalemToolBar',
					layout: ['CalemTbEdit', 'sep', 'CalemTbCancel', 'sep2', 'CalemTbCustomize'],
					list: [
					
					{ CalemButtonInfo: {
						  id: 'CalemTbEdit',
						  customInfo: {
						  	  CalemMenuCustomInfo: {
						  	  	 events: [
						  	   		{CalemEventInfo: {id: CalemEvent.RECORD_POS_VALID, func: '_enableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.RECORD_POS_INVALID, func: '_disableIt'}}
						  	   	]
						  	  }
						  }  
					  }		
					},						  	   	
					
					{CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
					
					{ CalemButtonInfo: {id: 'CalemTbCancel'}},
					
					{CalemSeparator: {id: 'sep2', className: 'CalemToolBarSeparator'}},
					
					{ CalemButtonInfo: {id: 'CalemTbCustomize'}}
				]
			} },
			'lb_caption': {
				CalemLabelInfo: {id: 'user', className: 'CalemEditCaption'}
			},
			'err': {
				CalemFormErrorInfo: {id: 'form_error'}
			},
			'lb_communication': {
				CalemLabelInfo: {id: 'communication', className: 'CalemEditSection'}
			},
			'lb_address': {
				CalemLabelInfo: {id: 'address', className: 'CalemEditSection'}
			},
			'lb_access_rights': {
				CalemLabelInfo: {id: 'access_rights', className: 'CalemEditSection'}
			},
			'lb_purchase': {
				CalemLabelInfo: {id: 'purchase', className: 'CalemEditSection'}
			},
			'lb_last_changes': {
				CalemLabelInfo: {id: 'last_changes', className: 'CalemEditSection'}
			},
			'lb_job': {
				CalemLabelInfo: {id: 'job', className: 'CalemEditSection'}
			}
	}
 } //ItemMap	
}
};

