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
			
			 // ---------------
			 // Asset
			 // ---------------
			 // BO
			'/modules/document/bo/CalemDocBo.js',
			'/modules/document/bo/CalemDocTypeBo.js',
			
			 //Menu
         '/modules/document/form/CalemDocMenuDef.js',
         
         //document
         '/modules/document/form/view/CalemDocViewListDef.js',
         '/modules/document/form/view/CalemDocViewLookupDef.js',
         '/modules/document/form/view/CalemDocViewNewDef.js',
         '/modules/document/form/view/CalemDocViewReadDef.js',
         '/modules/document/form/view/CalemDocViewEditDef.js',
         '/modules/document/form/view/CalemDocViewSearchDef.js',
         
         //doc_type
         '/modules/document/form/view/CalemDocTypeViewListDef.js',
         '/modules/document/form/view/CalemDocTypeViewLookupDef.js',
         '/modules/document/form/view/CalemDocTypeViewNewDef.js',
         '/modules/document/form/view/CalemDocTypeViewReadDef.js',
         '/modules/document/form/view/CalemDocTypeViewEditDef.js',
         '/modules/document/form/view/CalemDocTypeViewSearchDef.js',
         
         //document forms
         '/modules/document/form/controller/CalemDocFormList.js',
         '/modules/document/form/controller/CalemDocFormRead.js',
         '/modules/document/form/controller/CalemDocFormNew.js',
         '/modules/document/form/controller/CalemDocFormEdit.js',
         '/modules/document/form/controller/CalemDocFormLookup.js',
         
         //doc_type forms
         '/modules/document/form/controller/CalemDocTypeFormList.js',
         '/modules/document/form/controller/CalemDocTypeFormRead.js',
         '/modules/document/form/controller/CalemDocTypeFormNew.js',
         '/modules/document/form/controller/CalemDocTypeFormEdit.js',
         '/modules/document/form/controller/CalemDocTypeFormLookup.js',
			
         //Asset module
			'/modules/document/form/CalemDocItemDef.js',
			'/modules/document/form/CalemDocModuleDef.js',
			
			)
		)
);

?>