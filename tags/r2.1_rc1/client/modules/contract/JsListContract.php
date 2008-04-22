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
			'/modules/contract/bo/CalemContractBo.js',
			
			 //Menu
         '/modules/contract/form/CalemContractMenuDef.js',
         
         //Contract 
         '/modules/contract/form/view/CalemContractViewListDef.js',
         '/modules/contract/form/view/CalemContractViewLookupDef.js',
         '/modules/contract/form/view/CalemContractViewNewDef.js',
         '/modules/contract/form/view/CalemContractViewReadDef.js',
         '/modules/contract/form/view/CalemContractViewEditDef.js',
         '/modules/contract/form/view/CalemContractViewSearchDef.js',
         
         //doc
         '/modules/contract/form/view/CalemContractContactViewListDef.js',
         '/modules/contract/form/view/CalemContractContactViewNewDef.js',
         '/modules/contract/form/view/CalemContractContactViewReadDef.js',
         '/modules/contract/form/view/CalemContractContactViewEditDef.js',
         
         //contact
         '/modules/contract/form/view/CalemContractDocViewListDef.js',
         '/modules/contract/form/view/CalemContractDocViewNewDef.js',
         '/modules/contract/form/view/CalemContractDocViewReadDef.js',
         '/modules/contract/form/view/CalemContractDocViewEditDef.js',
         
         //FORMS         
         
         //contract forms
         '/modules/contract/form/controller/CalemContractFormList.js',
         '/modules/contract/form/controller/CalemContractFormMdTab.js',
         '/modules/contract/form/controller/CalemContractFormRead.js',
         '/modules/contract/form/controller/CalemContractFormNew.js',
         '/modules/contract/form/controller/CalemContractFormEdit.js',
         '/modules/contract/form/controller/CalemContractFormLookup.js',
         
         //contact
         '/modules/contract/form/controller/CalemContractContactFormList.js',
         '/modules/contract/form/controller/CalemContractContactFormNew.js',
         '/modules/contract/form/controller/CalemContractContactFormRead.js',
         '/modules/contract/form/controller/CalemContractContactFormEdit.js',
         
         //doc
         '/modules/contract/form/controller/CalemContractDocFormList.js',
         '/modules/contract/form/controller/CalemContractDocFormNew.js',
         '/modules/contract/form/controller/CalemContractDocFormRead.js',
         '/modules/contract/form/controller/CalemContractDocFormEdit.js',
        
			
         //contract module
			'/modules/contract/form/CalemContractItemDef.js',
			'/modules/contract/form/CalemContractModuleDef.js',
			
			)
		)
);

?>