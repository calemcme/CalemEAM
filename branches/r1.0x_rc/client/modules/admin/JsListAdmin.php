<?php
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
 

$_CALEM_scripts=array(
	'Calem.js'=>array(
   	'path'=>'client',
   	'files'=>array(
			
			 //Admin
			 //BO
			'/modules/admin/bo/CalemUserBo.js',
			'/modules/admin/bo/CalemAclGroupBo.js',
			'/modules/admin/bo/CalemFieldBo.js',
			'/modules/admin/bo/CalemDropdownBo.js',
			'/modules/admin/bo/CalemDeptBo.js',
			'/modules/admin/bo/CalemTeamBo.js',
			
			 //Menu
			'/modules/admin/form/CalemAdminMenuDef.js',
			 //Widget - module list
			 '/modules/admin/form/widget/design/modulelist/CalemDesignTreeModule.js',
			 '/modules/admin/form/widget/design/modulelist/CalemLayoutTreeModule.js',
			 '/modules/admin/form/widget/design/modulelist/CalemDesignTreeModListRoot.js',
			 '/modules/admin/form/widget/design/modulelist/CalemLayoutTreeModListRoot.js',
			 '/modules/admin/form/widget/design/modulelist/CalemModuleListDesignTree.js',
			 '/modules/admin/form/widget/design/modulelist/CalemModuleListLayoutTree.js',
			 // module
			 '/modules/admin/form/widget/design/module/CalemDesignTreeFormModule.js',
			 '/modules/admin/form/widget/design/module/CalemDesignTreeMenuItem.js',
			 '/modules/admin/form/widget/design/module/CalemDesignTreeMenuItemRoot.js',
			 '/modules/admin/form/widget/design/module/CalemDesignTreeMenuNode.js',
			 '/modules/admin/form/widget/design/module/CalemDesignTreeMenuNodeRoot.js',
			 
			 '/modules/admin/form/widget/design/module/CalemLayoutTreeDefaultMenu.js',
			 '/modules/admin/form/widget/design/module/CalemLayoutTreeDefaultMenuRoot.js',
			 '/modules/admin/form/widget/design/module/CalemLayoutTreeFormDesign.js',
			 '/modules/admin/form/widget/design/module/CalemLayoutTreeFormModule.js',
			 '/modules/admin/form/widget/design/module/CalemLayoutTreeLabel.js',
			 '/modules/admin/form/widget/design/module/CalemLayoutTreeMenuItem.js',
			 '/modules/admin/form/widget/design/module/CalemLayoutTreeMenuNode.js',
			 '/modules/admin/form/widget/design/module/CalemLayoutTreeSeparator.js',
			 '/modules/admin/form/widget/design/module/CalemLayoutTreeLayoutRoot.js',
			 
			 '/modules/admin/form/widget/design/module/CalemModuleDesignTree.js',
			 '/modules/admin/form/widget/design/module/CalemModuleLayoutTree.js',
			 
			 // table
			 '/modules/admin/form/widget/design/table/CalemLayoutTreeFieldCustom.js',
			 '/modules/admin/form/widget/design/table/CalemLayoutTreeTableCustom.js',
			 
			 '/modules/admin/form/widget/design/table/CalemTableDesignTree.js',
			 '/modules/admin/form/widget/design/table/CalemTableLayoutTree.js',
			 
			 //Dropdown
			 '/modules/admin/form/widget/design/dropdown/CalemLayoutTreeDropdownCustom.js',
			 '/modules/admin/form/widget/design/dropdown/CalemLayoutTreeDropdownTableCustom.js',
			 
			 '/modules/admin/form/widget/design/dropdown/CalemDropdownDesignTree.js',
			 '/modules/admin/form/widget/design/dropdown/CalemDropdownLayoutTree.js',
			 
			 //Views
			 //record design panel
			'/modules/admin/form/view/CalemViewDesignRecordPanelDef.js',
			'/modules/admin/form/view/CalemViewDesignListPanelDef.js',
			'/modules/admin/form/view/CalemViewDesignMdTabPanelDef.js',
			'/modules/admin/form/view/CalemViewDesignTablePanelDef.js',
			'/modules/admin/form/view/CalemViewDesignDropdownPanelDef.js',
			 //search select form
			'/modules/admin/form/view/CalemViewSearchSelectDef.js',

			  //User
			'/modules/admin/form/view/CalemUserViewListDef.js',
			'/modules/admin/form/view/CalemUserViewNewDef.js',
			'/modules/admin/form/view/CalemUserViewEditDef.js',
			'/modules/admin/form/view/CalemUserViewReadDef.js',
			'/modules/admin/form/view/CalemUserViewLookupDef.js',
			'/modules/admin/form/view/CalemUserViewSearchDef.js',
			'/modules/admin/form/view/CalemUserViewReadMineDef.js',
			'/modules/admin/form/view/CalemUserViewEditMineDef.js',
			//Group
			'/modules/admin/form/view/CalemAclGroupViewListDef.js',
			'/modules/admin/form/view/CalemAclGroupViewNewDef.js',
			'/modules/admin/form/view/CalemAclGroupViewEditDef.js',
			'/modules/admin/form/view/CalemAclGroupViewReadDef.js',
			'/modules/admin/form/view/CalemAclGroupViewLookupDef.js',
			'/modules/admin/form/view/CalemAclGroupViewSearchDef.js',
			
			//dept
			'/modules/admin/form/view/CalemDeptViewListDef.js',
			'/modules/admin/form/view/CalemDeptViewNewDef.js',
			'/modules/admin/form/view/CalemDeptViewEditDef.js',
			'/modules/admin/form/view/CalemDeptViewReadDef.js',
			'/modules/admin/form/view/CalemDeptViewLookupDef.js',
			'/modules/admin/form/view/CalemDeptViewSearchDef.js',
			
			//team
			'/modules/admin/form/view/CalemTeamViewListDef.js',
			'/modules/admin/form/view/CalemTeamViewNewDef.js',
			'/modules/admin/form/view/CalemTeamViewEditDef.js',
			'/modules/admin/form/view/CalemTeamViewReadDef.js',
			'/modules/admin/form/view/CalemTeamViewLookupDef.js',
			'/modules/admin/form/view/CalemTeamViewSearchDef.js',
			
			//module/form
			'/modules/admin/form/view/CalemModuleViewListDef.js',
			//table design
			'/modules/admin/form/view/CalemTableViewListDef.js',
			//Field
			'/modules/admin/form/view/CalemFieldViewNewDef.js',
			'/modules/admin/form/view/CalemFieldNameViewEditDef.js',
			'/modules/admin/form/view/CalemFieldTypeViewEditDef.js',
			
			//Dropdown design
			'/modules/admin/form/view/CalemDropdownViewListDef.js',
			//editing
			'/modules/admin/form/view/CalemDropdownViewNewDef.js',
			'/modules/admin/form/view/CalemDropdownViewEditDef.js',
			
			//Label
			'/modules/admin/form/view/CalemLabelViewEditDef.js',
			
			//View renders
			'/modules/admin/form/view/design/modulelist/CalemModuleListDesignTreeRender.js',
			'/modules/admin/form/view/design/modulelist/CalemModuleListLayoutTreeRender.js',
			'/modules/admin/form/view/design/modulelist/CalemModuleViewListDesignRender.js',
			
			'/modules/admin/form/view/design/module/CalemModuleDesignTreeRender.js',
			'/modules/admin/form/view/design/module/CalemModuleLayoutTreeRender.js',
			'/modules/admin/form/view/design/module/CalemModuleViewDesignRender.js',
			// table
			'/modules/admin/form/view/design/table/CalemTableDesignTreeRender.js',
			'/modules/admin/form/view/design/table/CalemTableLayoutTreeRender.js',
			'/modules/admin/form/view/design/table/CalemTableViewDesignRender.js',
			// dropdown
			'/modules/admin/form/view/design/dropdown/CalemDropdownDesignTreeRender.js',
			'/modules/admin/form/view/design/dropdown/CalemDropdownLayoutTreeRender.js',
			'/modules/admin/form/view/design/dropdown/CalemDropdownViewDesignRender.js',
			
			 //Controllers
			 // -- user
			'/modules/admin/form/controller/CalemUserFormList.js',
			'/modules/admin/form/controller/CalemUserFormNew.js',
			'/modules/admin/form/controller/CalemUserFormEdit.js',
			'/modules/admin/form/controller/CalemUserFormRead.js',
			'/modules/admin/form/controller/CalemUserFormLookup.js',
			'/modules/admin/form/controller/CalemUserFormReadMine.js',
			'/modules/admin/form/controller/CalemUserFormEditMine.js',
			// -- acl_group
			'/modules/admin/form/controller/CalemAclGroupFormList.js',
			'/modules/admin/form/controller/CalemAclGroupFormNew.js',
			'/modules/admin/form/controller/CalemAclGroupFormEdit.js',
			'/modules/admin/form/controller/CalemAclGroupFormRead.js',
			'/modules/admin/form/controller/CalemAclGroupFormLookup.js',
			
			// -- Dept
			'/modules/admin/form/controller/CalemDeptFormList.js',
			'/modules/admin/form/controller/CalemDeptFormNew.js',
			'/modules/admin/form/controller/CalemDeptFormEdit.js',
			'/modules/admin/form/controller/CalemDeptFormRead.js',
			'/modules/admin/form/controller/CalemDeptFormLookup.js',
			
			// -- team
			'/modules/admin/form/controller/CalemTeamFormList.js',
			'/modules/admin/form/controller/CalemTeamFormNew.js',
			'/modules/admin/form/controller/CalemTeamFormEdit.js',
			'/modules/admin/form/controller/CalemTeamFormRead.js',
			'/modules/admin/form/controller/CalemTeamFormLookup.js',
			
			// - module/form
			'/modules/admin/form/controller/CalemModuleFormList.js',
			'/modules/admin/form/controller/CalemModuleFormListDesign.js',
			'/modules/admin/form/controller/CalemModuleFormDesign.js',
			// - table design
			'/modules/admin/form/controller/CalemTableFormList.js',
			'/modules/admin/form/controller/CalemTableFormDesign.js',
			
			'/modules/admin/form/controller/CalemFieldFormNew.js',
			'/modules/admin/form/controller/CalemFieldNameFormEdit.js',
			'/modules/admin/form/controller/CalemFieldTypeFormEdit.js',
			// - dropdown design
			'/modules/admin/form/controller/CalemDropdownFormList.js',
			'/modules/admin/form/controller/CalemDropdownFormDesign.js',
			
			'/modules/admin/form/controller/CalemDropdownFormNew.js',
			'/modules/admin/form/controller/CalemDropdownFormEdit.js',
			
			'/modules/admin/form/controller/CalemLabelFormEdit.js',

			//ItemDef
			'/modules/admin/form/CalemAdminItemDef.js',
			 //Module
			'/modules/admin/form/CalemAdminModuleDef.js',
			)
		)
);

?>