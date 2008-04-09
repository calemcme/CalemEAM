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
			'/modules/purchase/bo/CalemPoErrorInfo.js',
			
			'/modules/purchase/bo/CalemPoBo.js',
			'/modules/purchase/bo/CalemTaxCodeBo.js',
			'/modules/purchase/bo/CalemPoAddressBo.js',
			
			 //Menu
         '/modules/purchase/form/CalemPoMenuDef.js',
         
         //purchase views
         '/modules/purchase/form/view/CalemPoViewListDef.js',
         '/modules/purchase/form/view/CalemPoMineViewListDef.js',
         '/modules/purchase/form/view/CalemPoViewLookupDef.js',
         '/modules/purchase/form/view/CalemPoViewNewDef.js',
         '/modules/purchase/form/view/CalemPoViewReadDef.js',
         '/modules/purchase/form/view/CalemPoViewEditDef.js',
         '/modules/purchase/form/view/CalemPoViewSearchDef.js',
         
         //item
         '/modules/purchase/form/view/CalemPoItemViewListDef.js',
         '/modules/purchase/form/view/CalemPoItemViewNewDef.js',
         '/modules/purchase/form/view/CalemPoItemViewEditDef.js',
         '/modules/purchase/form/view/CalemPoItemViewReadDef.js',
         
         //Add item
         '/modules/purchase/form/view/CalemPoItemAddViewLookupDef.js',
         '/modules/purchase/form/view/CalemPoItemAddViewSearchDef.js',
         //Remove item
         '/modules/purchase/form/view/CalemPoItemRemoveViewLookupDef.js',
         
         //status log
         '/modules/purchase/form/view/CalemPoStatusLogViewListDef.js',
         '/modules/purchase/form/view/CalemPoStatusLogViewReadDef.js',
         '/modules/purchase/form/view/CalemPoStatusLogNoteViewNewDef.js',
         
         //Tax 
         '/modules/purchase/form/view/CalemTaxCodeViewListDef.js',
         '/modules/purchase/form/view/CalemTaxCodeViewLookupDef.js',
         '/modules/purchase/form/view/CalemTaxCodeViewNewDef.js',
         '/modules/purchase/form/view/CalemTaxCodeViewReadDef.js',
         '/modules/purchase/form/view/CalemTaxCodeViewEditDef.js',
         '/modules/purchase/form/view/CalemTaxCodeViewSearchDef.js',
         
         //rate
         '/modules/purchase/form/view/CalemTaxRateViewListDef.js',
         '/modules/purchase/form/view/CalemTaxRateViewNewDef.js',
         '/modules/purchase/form/view/CalemTaxRateViewEditDef.js',
         '/modules/purchase/form/view/CalemTaxRateViewReadDef.js',
         
         //Address 
         '/modules/purchase/form/view/CalemPoAddressViewListDef.js',
         '/modules/purchase/form/view/CalemPoAddressViewLookupDef.js',
         '/modules/purchase/form/view/CalemPoAddressViewNewDef.js',
         '/modules/purchase/form/view/CalemPoAddressViewReadDef.js',
         '/modules/purchase/form/view/CalemPoAddressViewEditDef.js',
         '/modules/purchase/form/view/CalemPoAddressViewSearchDef.js',
         
         //Report def
		   '/modules/purchase/form/report/CalemPoReportReadDef.js',
		   '/modules/purchase/form/report/CalemPoItemReportListDef.js',
		   
		   //Report controller
		   '/modules/purchase/form/report/CalemPoReportMdTab.js',
		   '/modules/purchase/form/report/CalemPoReportRead.js',
		   '/modules/purchase/form/report/CalemPoItemReportList.js',
         
         //purchase forms
         '/modules/purchase/form/action/CalemPoFormAction.js',
         
         '/modules/purchase/form/controller/CalemPoFormList.js',
         '/modules/purchase/form/controller/CalemPoMineFormList.js',
         '/modules/purchase/form/controller/CalemPoFormMdTab.js',
         '/modules/purchase/form/controller/CalemPoFormRead.js',
         '/modules/purchase/form/controller/CalemPoFormNew.js',
         '/modules/purchase/form/controller/CalemPoFormEdit.js',
         '/modules/purchase/form/controller/CalemPoFormLookup.js',
         //item
         '/modules/purchase/form/controller/CalemPoItemFormList.js',
         '/modules/purchase/form/controller/CalemPoItemFormNew.js',
         '/modules/purchase/form/controller/CalemPoItemFormEdit.js',
         '/modules/purchase/form/controller/CalemPoItemFormRead.js',
         
         //Add item
         '/modules/purchase/form/controller/CalemPoItemAddFormLookup.js',
         //Remove item
         '/modules/purchase/form/controller/CalemPoItemRemoveFormLookup.js',
         
         //status log
         '/modules/purchase/form/controller/CalemPoStatusLogFormList.js',
         '/modules/purchase/form/controller/CalemPoStatusLogFormRead.js',
         '/modules/purchase/form/controller/CalemPoStatusLogNoteFormNew.js',
         
         //Tax
         '/modules/purchase/form/controller/CalemTaxCodeFormList.js',
         '/modules/purchase/form/controller/CalemTaxCodeFormMdTab.js',
         '/modules/purchase/form/controller/CalemTaxCodeFormRead.js',
         '/modules/purchase/form/controller/CalemTaxCodeFormNew.js',
         '/modules/purchase/form/controller/CalemTaxCodeFormEdit.js',
         '/modules/purchase/form/controller/CalemTaxCodeFormLookup.js',
         //item
         '/modules/purchase/form/controller/CalemTaxRateFormList.js',
         '/modules/purchase/form/controller/CalemTaxRateFormNew.js',
         '/modules/purchase/form/controller/CalemTaxRateFormEdit.js',
         '/modules/purchase/form/controller/CalemTaxRateFormRead.js',
         
         //PoAddress
         '/modules/purchase/form/controller/CalemPoAddressFormList.js',
         '/modules/purchase/form/controller/CalemPoAddressFormRead.js',
         '/modules/purchase/form/controller/CalemPoAddressFormNew.js',
         '/modules/purchase/form/controller/CalemPoAddressFormEdit.js',
         '/modules/purchase/form/controller/CalemPoAddressFormLookup.js',
			
         //Project module
			'/modules/purchase/form/CalemPoItemDef.js',
			'/modules/purchase/form/CalemPoModuleDef.js',
			
			)
		)
);

?>
