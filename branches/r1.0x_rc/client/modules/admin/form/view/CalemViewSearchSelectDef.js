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
CalemViewDef['CalemViewSearchSelect']={
	CalemViewInfo: {
		id: 'CalemViewSearchSelect',
		type: 'CalemView',
		layout: {
		 CalemLayoutInfo: {
			tableLayout: {CalemTableLayoutInfo: {}},
			colLayout: {CalemColLayoutInfo: {colCount: 2}}, //Potentially col width definition.
			rows: [
					{CalemTrInfo: {cols: ['lb_search_select']}},
					{CalemTrInfo: {cols: ['toolbar']}},
					{CalemTrInfo: {cols: ['lb_my_search','my_search']}},
					{CalemTrInfo: {cols: ['lb_shared_search','shared_search']}}		                               				                               
				   ]
			}
		},
		itemMap : {
			CalemItemMap: {
			toolbar: {
				CalemToolBarInfo: {
					type: 'CalemToolBar',
					layout: ['CalemTbNew', 'CalemTbCancel', 'sep', 'CalemTbRefresh'],
					list: [ 					 
					{ CalemButtonInfo: { id: 'CalemTbNew'}},
					      			
					{ CalemButtonInfo: { id: 'CalemTbCancel'}},
					
					{CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
					
					{ CalemButtonInfo: { id: 'CalemTbRefresh'}}
				]
			} } ,
			'lb_search_select': {
				CalemLabelInfo: {id: 'search_select', className: 'CalemEditCaption'}
			},
			'lb_my_search': {
				CalemLabelInfo: {id: 'my_search'}
			},
			'my_search': {
				CalemMySearchSelectInfo: {size: 20}
			},
			'lb_shared_search': {
				CalemLabelInfo: {id: 'shared_search'}
			},
			'shared_search': {
				CalemSharedSearchSelectInfo: {size: 20}
			}
	}
 } //ItemMap	
}
};

