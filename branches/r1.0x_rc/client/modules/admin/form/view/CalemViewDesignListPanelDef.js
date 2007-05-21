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
CalemViewDef['CalemViewDesignListPanel']={
	CalemViewInfo: {
		id: 'CalemViewDesignListPanel',
		type: 'CalemView',
		layout: {
		 CalemLayoutInfo: {
			tableLayout: {CalemTableLayoutInfo: {}},
			colLayout: {CalemColLayoutInfo: {colCount: 2}}, //Potentially col width definition.
			rows: [
					{CalemTrInfo: {cols: ['lb_form_design']}},
					{CalemTrInfo: {cols: ['toolbar']}},
					{CalemTrInfo: {cols: ['lb_save_to','groups']}},												 						             
					{CalemTrInfo: {height: CalemViewUtil.H_FULL,   cols: ['tree']}}			                               				                               
				   ]
			}
		},
		itemMap : {
			CalemItemMap: {
			toolbar: {
				CalemToolBarDesignInfo: {
					type: 'CalemToolBar',
					layout: ['CalemTbSave', 'CalemTbCancel'],
					list: [ 					 
					{ CalemButtonInfo: {
						 id: 'CalemTbSave', 
						 customInfo: {
						  	   CalemMenuCustomInfo: {
						  	   	enabled: false,
						  	   	events: [
						  	   		{CalemEventInfo: {id: CalemEvent.MULTI_SELECTION, func: '_enableIt'}},
						  	   		{CalemEventInfo: {id: CalemEvent.NO_SELECTION, func: '_disableIt'}}
						  	   	]
						  	   }
						  }
					  }
					},
					
					      			
					{ CalemButtonInfo: {
						id: 'CalemTbCancel', 
						customInfo: {
						  	   CalemMenuCustomInfo: {
						  	   	enabled: true
						  	   }
						  }
					  }
					}
				]
			} } ,
			'lb_form_design': {
				CalemDesignLabelInfo: {id: 'form_design', className: 'CalemEditCaption'}
			},
			'lb_save_to': {
				CalemDesignLabelInfo: {id: 'save_to'}
			},
			'groups': {
				CalemDesignSelectInfo: {size: 1}
			},
			'tree' : {
				CalemListDesignTreeInfo: true //dummy
			}
	}
 } //ItemMap	
}
};

