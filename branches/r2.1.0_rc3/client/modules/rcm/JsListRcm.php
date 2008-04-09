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
			
			 //RCM
			 
			 //BO
			'/modules/rcm/bo/CalemRcmFailureBo.js',
			'/modules/rcm/bo/CalemRcmTemplateBo.js',
			'/modules/rcm/bo/CalemRcmFunctionBo.js',
			'/modules/rcm/bo/CalemRcmActionBo.js',
			 //Menu
         '/modules/rcm/form/CalemRcmMenuDef.js',
         
          //Views
		   
		   //RcmTemplate
         '/modules/rcm/form/view/CalemRcmTemplateViewListDef.js',
         '/modules/rcm/form/view/CalemRcmTemplateViewLookupDef.js',
         '/modules/rcm/form/view/CalemRcmTemplateViewNewDef.js',
         '/modules/rcm/form/view/CalemRcmTemplateViewReadDef.js',
         '/modules/rcm/form/view/CalemRcmTemplateViewEditDef.js',
         '/modules/rcm/form/view/CalemRcmTemplateViewSearchDef.js',
         
         //RcmFunction
         '/modules/rcm/form/view/CalemRcmFunctionViewListDef.js',
         '/modules/rcm/form/view/CalemRcmFunctionViewLookupDef.js',
         '/modules/rcm/form/view/CalemRcmFunctionViewNewDef.js',
         '/modules/rcm/form/view/CalemRcmFunctionViewReadDef.js',
         '/modules/rcm/form/view/CalemRcmFunctionViewEditDef.js',
         '/modules/rcm/form/view/CalemRcmFunctionViewSearchDef.js',
         
         
         //Failure
			'/modules/rcm/form/view/CalemRcmFailureViewListDef.js',
			'/modules/rcm/form/view/CalemRcmFailureViewLookupDef.js',
			'/modules/rcm/form/view/CalemRcmFailureViewNewDef.js',
		   '/modules/rcm/form/view/CalemRcmFailureViewReadDef.js',
		   '/modules/rcm/form/view/CalemRcmFailureViewEditDef.js',
		   '/modules/rcm/form/view/CalemRcmFailureViewSearchDef.js',
		   
		   //RcmAction
		   '/modules/rcm/form/view/CalemRcmActionViewListDef.js',
		   '/modules/rcm/form/view/CalemRcmActionViewLookupDef.js',
			'/modules/rcm/form/view/CalemRcmActionViewNewDef.js',
		   '/modules/rcm/form/view/CalemRcmActionViewReadDef.js',
		   '/modules/rcm/form/view/CalemRcmActionViewEditDef.js',
		   '/modules/rcm/form/view/CalemRcmActionViewSearchDef.js',
		   
		   //RcmConsequence
		   '/modules/rcm/form/view/CalemRcmConsequenceViewListDef.js',
			'/modules/rcm/form/view/CalemRcmConsequenceViewNewDef.js',
		   '/modules/rcm/form/view/CalemRcmConsequenceViewReadDef.js',
		   '/modules/rcm/form/view/CalemRcmConsequenceViewEditDef.js',
		   
		   //RcmPart
		   '/modules/rcm/form/view/CalemRcmActionPartViewListDef.js',
			'/modules/rcm/form/view/CalemRcmActionPartViewNewDef.js',
		   '/modules/rcm/form/view/CalemRcmActionPartViewReadDef.js',
		   '/modules/rcm/form/view/CalemRcmActionPartViewEditDef.js',
		   
			 //Controllers
			
			//RcmTemplate forms
         '/modules/rcm/form/controller/CalemRcmTemplateFormList.js',
         '/modules/rcm/form/controller/CalemRcmTemplateFormRead.js',
         '/modules/rcm/form/controller/CalemRcmTemplateFormNew.js',
         '/modules/rcm/form/controller/CalemRcmTemplateFormEdit.js',
         '/modules/rcm/form/controller/CalemRcmTemplateFormLookup.js',
         
         //RcmFunction forms
         '/modules/rcm/form/controller/CalemRcmFunctionFormList.js',
         '/modules/rcm/form/controller/CalemRcmFunctionFormRead.js',
         '/modules/rcm/form/controller/CalemRcmFunctionFormNew.js',
         '/modules/rcm/form/controller/CalemRcmFunctionFormEdit.js',
         '/modules/rcm/form/controller/CalemRcmFunctionFormLookup.js',
         
         //Failure
         '/modules/rcm/form/controller/CalemRcmFailureFormMdTab.js',
			'/modules/rcm/form/controller/CalemRcmFailureFormList.js',
			'/modules/rcm/form/controller/CalemRcmFailureFormLookup.js',
			'/modules/rcm/form/controller/CalemRcmFailureFormNew.js',
			'/modules/rcm/form/controller/CalemRcmFailureFormRead.js',
			'/modules/rcm/form/controller/CalemRcmFailureFormEdit.js',
			
			//Action
		   '/modules/rcm/form/controller/CalemRcmActionFormList.js',
		   '/modules/rcm/form/controller/CalemRcmActionFormLookup.js',
			'/modules/rcm/form/controller/CalemRcmActionFormNew.js',
		   '/modules/rcm/form/controller/CalemRcmActionFormRead.js',
		   '/modules/rcm/form/controller/CalemRcmActionFormEdit.js',
		   
		   //Consequence
		   '/modules/rcm/form/controller/CalemRcmConsequenceFormList.js',
			'/modules/rcm/form/controller/CalemRcmConsequenceFormNew.js',
		   '/modules/rcm/form/controller/CalemRcmConsequenceFormRead.js',
		   '/modules/rcm/form/controller/CalemRcmConsequenceFormEdit.js',
		   
		   //Part
		   '/modules/rcm/form/controller/CalemRcmActionPartFormList.js',
			'/modules/rcm/form/controller/CalemRcmActionPartFormNew.js',
		   '/modules/rcm/form/controller/CalemRcmActionPartFormRead.js',
		   '/modules/rcm/form/controller/CalemRcmActionPartFormEdit.js',
					
			//ItemDef
			'/modules/rcm/form/CalemRcmItemDef.js',
			//Module
			'/modules/rcm/form/CalemRcmModuleDef.js',
			)
		)
);

?>