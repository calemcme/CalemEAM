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
			'/modules/vendor/bo/CalemVendorBo.js',
			
			 //Menu
         '/modules/vendor/form/CalemVendorMenuDef.js',
			
			//Vendor 
         '/modules/vendor/form/view/CalemVendorViewListDef.js',
         '/modules/vendor/form/view/CalemVendorViewLookupDef.js',
         '/modules/vendor/form/view/CalemVendorViewNewDef.js',
         '/modules/vendor/form/view/CalemVendorViewReadDef.js',
         '/modules/vendor/form/view/CalemVendorViewEditDef.js',
         '/modules/vendor/form/view/CalemVendorViewSearchDef.js',
         
         //Vendor contact
         '/modules/vendor/form/view/CalemVendorContactViewListDef.js',
         '/modules/vendor/form/view/CalemVendorContactViewNewDef.js',
         '/modules/vendor/form/view/CalemVendorContactViewReadDef.js',
         '/modules/vendor/form/view/CalemVendorContactViewEditDef.js',
         
         //FORMS         
         //vendor forms
         '/modules/vendor/form/controller/CalemVendorFormList.js',
         '/modules/vendor/form/controller/CalemVendorFormMdTab.js',
         '/modules/vendor/form/controller/CalemVendorFormRead.js',
         '/modules/vendor/form/controller/CalemVendorFormNew.js',
         '/modules/vendor/form/controller/CalemVendorFormEdit.js',
         '/modules/vendor/form/controller/CalemVendorFormLookup.js',
         
         //Vendor contact
         '/modules/vendor/form/controller/CalemVendorContactFormList.js',
         '/modules/vendor/form/controller/CalemVendorContactFormNew.js',
         '/modules/vendor/form/controller/CalemVendorContactFormRead.js',
         '/modules/vendor/form/controller/CalemVendorContactFormEdit.js',
         
         //vendor module
			'/modules/vendor/form/CalemVendorItemDef.js',
			'/modules/vendor/form/CalemVendorModuleDef.js',
			
			)
		)
);

?>
