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
CalemModuleDef["modCalemAdmin"]= {
	CalemModuleInfo: {
      id:"modCalemAdmin",
      icon:"CalemAdmin",
      defaultMenu: 'CalemUserFormList',
      toolBar: {
        CalemToolBarInfo: {
        	  type: 'CalemToolBar',
        	  layout: ['modCalemAdmin', 'sep', 'CalemUserFormReadMine', 'CalemUserFormList', 'CalemAclGroupFormList', 'CalemModAdminDataDesign', 'CalemAdminCodes', 'CalemAdminScheduler', 'CalemAdminUpgrade'],
        	  list: [
	         {CalemLabelInfo: {id: 'modCalemAdmin', className: 'CalemModuleLabel'}},
	         
	         {CalemSeparator: {id: 'sep', className: 'CalemToolBarSeparator'}},
	         
	         {CalemMenuItemInfo: {id: 'CalemUserFormReadMine'}},
	         
	         {CalemMenuItemInfo: {id: 'CalemAclGroupFormList'}},
	         
	         {CalemMenuItemInfo: {id: 'CalemUserFormList'}},
	         
	      	{CalemMenuInfo: {
	      		menuButton: {CalemMenuButtonInfo: {id: 'CalemModAdminDataDesign'}},
		      	menuList: [{CalemMenuItemInfo: {id: 'CalemTableFormList'}},
		      	       {CalemMenuItemInfo: {id: 'CalemDropdownFormList'}}
		      	      ]
	      		}
	      	},
	      	
	      	{CalemMenuInfo: {
	      		menuButton: {CalemMenuButtonInfo: {id: 'CalemAdminCodes'}},
		      	menuList: [{CalemMenuItemInfo: {id: 'CalemTeamFormList'}},
			      	       {CalemMenuItemInfo: {id: 'CalemDeptFormList'}}
			      	      ]
	      		}
	      	},
	      	
	      	{CalemMenuInfo: {
	      		menuButton: {CalemMenuButtonInfo: {id: 'CalemAdminScheduler'}},
		      	menuList: [{CalemMenuItemInfo: {id: 'CalemSchedulerTaskFormList'}},
			      	       {CalemMenuItemInfo: {id: 'CalemSchedulerJobFormList'}}
			      	      ]
	      		}
	      	},
	      	
	      	{CalemMenuInfo: {
	      		menuButton: {CalemMenuButtonInfo: {id: 'CalemAdminUpgrade'}},
		      	menuList: [{CalemMenuItemInfo: {id: 'CalemVersionUpgradeLogFormList'}}
			      	       ]
	      		}
	      	}
	      	
	      ] }
	}
	}
};
