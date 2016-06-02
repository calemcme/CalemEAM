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
			'/modules/contact/bo/CalemContactBo.js',
			
			 //Menu
         '/modules/contact/form/CalemContactMenuDef.js',
         
         //contact views
         '/modules/contact/form/view/CalemContactViewListDef.js',
         '/modules/contact/form/view/CalemContactViewLookupDef.js',
         '/modules/contact/form/view/CalemContactViewNewDef.js',
         '/modules/contact/form/view/CalemContactViewReadDef.js',
         '/modules/contact/form/view/CalemContactViewEditDef.js',
         '/modules/contact/form/view/CalemContactViewSearchDef.js',

         //contact forms
         '/modules/contact/form/controller/CalemContactFormList.js',
         '/modules/contact/form/controller/CalemContactFormRead.js',
         '/modules/contact/form/controller/CalemContactFormNew.js',
         '/modules/contact/form/controller/CalemContactFormEdit.js',
         '/modules/contact/form/controller/CalemContactFormLookup.js',
			
         //Asset module
			'/modules/contact/form/CalemContactItemDef.js',
			'/modules/contact/form/CalemContactModuleDef.js',
			
			)
		)
);

?>