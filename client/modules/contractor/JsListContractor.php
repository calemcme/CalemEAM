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
			'/modules/contractor/bo/CalemContractorBo.js',
			
			 //Menu
         '/modules/contractor/form/CalemContractorMenuDef.js',
         
         //contractor views
         '/modules/contractor/form/view/CalemContractorViewListDef.js',
         '/modules/contractor/form/view/CalemContractorViewLookupDef.js',
         '/modules/contractor/form/view/CalemContractorViewNewDef.js',
         '/modules/contractor/form/view/CalemContractorViewReadDef.js',
         '/modules/contractor/form/view/CalemContractorViewEditDef.js',
         '/modules/contractor/form/view/CalemContractorViewSearchDef.js',

         //contractor forms
         '/modules/contractor/form/controller/CalemContractorFormList.js',
         '/modules/contractor/form/controller/CalemContractorFormRead.js',
         '/modules/contractor/form/controller/CalemContractorFormNew.js',
         '/modules/contractor/form/controller/CalemContractorFormEdit.js',
         '/modules/contractor/form/controller/CalemContractorFormLookup.js',
			
         //Asset module
			'/modules/contractor/form/CalemContractorItemDef.js',
			'/modules/contractor/form/CalemContractorModuleDef.js',
			
			)
		)
);

?>