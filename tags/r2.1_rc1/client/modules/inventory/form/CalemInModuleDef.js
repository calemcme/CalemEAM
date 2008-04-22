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
 * Admin module
 */
CalemModuleDef["modCalemIn"]= {
	CalemModuleInfo: {
      id:"modCalemIn",
      icon:"CalemIn",
      defaultMenu: 'CalemInFormList',
      toolBar: {
        CalemToolBarInfo: {
        	  type: 'CalemToolBar',
        	  layout: ['modCalemIn', 'sep', 'CalemInFormList', 'CalemInOrderFormList', 'sep2', 'CalemInCodes'],
        	  list: [
	         {CalemLabelInfo: {id: 'modCalemIn', className: 'CalemModuleLabel'}},
	         
	         {CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
	         
	         {CalemMenuItemInfo: {id: 'CalemInFormList'}},
	         {CalemMenuItemInfo: {id: 'CalemInOrderFormList'}},
	         
	         {CalemSeparator: {id: 'sep2', className: 'CalemToolBarSeparator'}},
	         
	         {CalemMenuInfo: {
	      		menuButton: {CalemMenuButtonInfo: {id: 'CalemInCodes'}},
		      	menuList: [ {CalemMenuItemInfo: {id: 'CalemInLocationFormList'}},
		      			      {CalemMenuItemInfo: {id: 'CalemInTypeFormList'}},
		      	            {CalemMenuItemInfo: {id: 'CalemUomFormList'}},
		      	            {CalemMenuItemInfo: {id: 'CalemUomMapFormList'}}
		      	      ]
	      		}
	      	}
	      ] }
	}
	}
};
