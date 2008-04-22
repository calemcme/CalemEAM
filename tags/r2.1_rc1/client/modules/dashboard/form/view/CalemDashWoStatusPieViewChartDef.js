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

CalemViewDef['CalemDashWoStatusPieViewChart']={
	CalemViewInfo: {
		id: 'CalemDashWoStatusPieViewChart',
		type: 'CalemView',
		layout: {
		 CalemLayoutInfo: {
			tableLayout: {CalemTableLayoutInfo: {}},
			colLayout: {CalemColLayoutInfo: {colCount: 1}}, //Potentially col width definition.
			rows: [
					{CalemTrInfo: {cols: ['lb_caption']}},
					{CalemTrInfo: {cols: ['toolbar']}},
               {CalemTrInfo: {height: -1, cols: ['chart_info']}}                                                                                                       				                               				                               
				   ]
			}
		},
		itemMap : {
			CalemItemMap: {
			toolbar: {
				CalemToolBarInfo: {
					type: 'CalemToolBar',
					layout: ['CalemTbDataRefresh', 'sep', 'CalemTbPrint'],
					list: [
					{CalemButtonInfo: {id: 'CalemTbDataRefresh'}},					
					{CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
					{CalemButtonInfo: {
						  id: 'CalemTbPrint',
						  customInfo: {
						  	  CalemMenuCustomInfo: {enabled: true}
						  }  
					  }		
					}
				  ]
			} },
			'lb_caption': {
				CalemLabelInfo: {id: 'dash_wo_status_pie', className: 'CalemEditCaption'}
			},
			'chart_info': {
				CalemChartPieInfo: {id: 'dash_wo_status_pie'}
			}
	}
 } //ItemMap	
}
};

