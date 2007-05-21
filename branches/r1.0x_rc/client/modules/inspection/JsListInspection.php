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
			
			 // BO
			'/modules/inspection/bo/CalemInspectionBo.js',
			
			 //Menu
         '/modules/inspection/form/CalemInspectionMenuDef.js',
         
         //inspection views
         '/modules/inspection/form/view/CalemInspectionViewListDef.js',
         '/modules/inspection/form/view/CalemInspectionViewLookupDef.js',
         '/modules/inspection/form/view/CalemInspectionViewNewDef.js',
         '/modules/inspection/form/view/CalemInspectionViewReadDef.js',
         '/modules/inspection/form/view/CalemInspectionViewEditDef.js',
         '/modules/inspection/form/view/CalemInspectionViewSearchDef.js',
         //Downtime
         '/modules/inspection/form/view/CalemInsCitationViewListDef.js',
         '/modules/inspection/form/view/CalemInsCitationViewNewDef.js',
         '/modules/inspection/form/view/CalemInsCitationViewEditDef.js',
         '/modules/inspection/form/view/CalemInsCitationViewReadDef.js',
         
         //inspection forms
         '/modules/inspection/form/controller/CalemInspectionFormList.js',
         '/modules/inspection/form/controller/CalemInspectionFormMdTab.js',
         '/modules/inspection/form/controller/CalemInspectionFormRead.js',
         '/modules/inspection/form/controller/CalemInspectionFormNew.js',
         '/modules/inspection/form/controller/CalemInspectionFormEdit.js',
         '/modules/inspection/form/controller/CalemInspectionFormLookup.js',
         //Downtime
         '/modules/inspection/form/controller/CalemInsCitationFormList.js',
         '/modules/inspection/form/controller/CalemInsCitationFormNew.js',
         '/modules/inspection/form/controller/CalemInsCitationFormEdit.js',
         '/modules/inspection/form/controller/CalemInsCitationFormRead.js',
			
         //module
			'/modules/inspection/form/CalemInspectionItemDef.js',
			'/modules/inspection/form/CalemInspectionModuleDef.js',
			
			)
		)
);

?>