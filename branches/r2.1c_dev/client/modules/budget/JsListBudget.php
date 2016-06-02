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
			
			 //Budget
			 //BO
			'/modules/budget/bo/CalemBudgetErrorInfo.js',
			
			'/modules/budget/bo/CalemBudgetTitleBo.js',
			'/modules/budget/bo/CalemBudgetBo.js',
			
			 //Menu
         '/modules/budget/form/CalemBudgetMenuDef.js',
          //Views
          //Budget_title
			'/modules/budget/form/view/CalemBudgetTitleViewListDef.js',
			'/modules/budget/form/view/CalemBudgetTitleViewNewDef.js',
			'/modules/budget/form/view/CalemBudgetTitleViewEditDef.js',
			'/modules/budget/form/view/CalemBudgetTitleViewReadDef.js',
			'/modules/budget/form/view/CalemBudgetTitleViewSearchDef.js',
			//Budget
			'/modules/budget/form/view/CalemBudgetViewListDef.js',
			'/modules/budget/form/view/CalemBudgetViewNewDef.js',
			'/modules/budget/form/view/CalemBudgetViewReadDef.js',
			'/modules/budget/form/view/CalemBudgetViewEditDef.js',
			//Costcode
			'/modules/budget/form/view/CalemCostcodeViewListDef.js',
         '/modules/budget/form/view/CalemCostcodeViewLookupDef.js',
         '/modules/budget/form/view/CalemCostcodeViewNewDef.js',
         '/modules/budget/form/view/CalemCostcodeViewReadDef.js',
         '/modules/budget/form/view/CalemCostcodeViewEditDef.js',
         '/modules/budget/form/view/CalemCostcodeViewSearchDef.js',
         
         //status log
         '/modules/budget/form/view/CalemBudgetStatusLogViewListDef.js',
         '/modules/budget/form/view/CalemBudgetStatusLogViewReadDef.js',
         '/modules/budget/form/view/CalemBudgetStatusLogNoteViewNewDef.js',
			 
			 //Controllers
			'/modules/budget/form/action/CalemBudgetFormAction.js',
			
			 //Budget title
			'/modules/budget/form/controller/CalemBudgetTitleFormList.js',
			'/modules/budget/form/controller/CalemBudgetTitleFormNew.js',
			'/modules/budget/form/controller/CalemBudgetTitleFormEdit.js',
			'/modules/budget/form/controller/CalemBudgetTitleFormRead.js',
			'/modules/budget/form/controller/CalemBudgetTitleFormMdTab.js',
			 //Budget
			'/modules/budget/form/controller/CalemBudgetFormList.js',
			'/modules/budget/form/controller/CalemBudgetFormNew.js',
			'/modules/budget/form/controller/CalemBudgetFormRead.js',
			'/modules/budget/form/controller/CalemBudgetFormEdit.js',
			 //Costcode
			'/modules/budget/form/controller/CalemCostcodeFormList.js',
         '/modules/budget/form/controller/CalemCostcodeFormRead.js',
         '/modules/budget/form/controller/CalemCostcodeFormNew.js',
         '/modules/budget/form/controller/CalemCostcodeFormEdit.js',
         '/modules/budget/form/controller/CalemCostcodeFormLookup.js',
         
         //status log
         '/modules/budget/form/controller/CalemBudgetStatusLogFormList.js',
         '/modules/budget/form/controller/CalemBudgetStatusLogFormRead.js',
         '/modules/budget/form/controller/CalemBudgetStatusLogNoteFormNew.js',
			
			//ItemDef
			'/modules/budget/form/CalemBudgetItemDef.js',
			//Module
			'/modules/budget/form/CalemBudgetModuleDef.js',
			
			)
		)
);

?>