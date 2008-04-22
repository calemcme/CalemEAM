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
			'/modules/asset/bo/CalemAssetBo.js',
			'/modules/asset/bo/CalemAssetMeterBo.js',
			'/modules/asset/bo/CalemAssetTypeBo.js',
			'/modules/asset/bo/CalemMeterTypeBo.js',
			
			 //Menu
         '/modules/asset/form/CalemAssetMenuDef.js',
         
         //asset views
         '/modules/asset/form/view/CalemAssetViewListDef.js',
         '/modules/asset/form/view/CalemAssetViewLookupDef.js',
         '/modules/asset/form/view/CalemAssetViewNewDef.js',
         '/modules/asset/form/view/CalemAssetViewReadDef.js',
         '/modules/asset/form/view/CalemAssetViewEditDef.js',
         '/modules/asset/form/view/CalemAssetViewSearchDef.js',
         //Downtime
         '/modules/asset/form/view/CalemAssetDowntimeViewListDef.js',
         '/modules/asset/form/view/CalemAssetDowntimeViewNewDef.js',
         '/modules/asset/form/view/CalemAssetDowntimeViewEditDef.js',
         '/modules/asset/form/view/CalemAssetDowntimeViewReadDef.js',
         //Comment
         '/modules/asset/form/view/CalemAssetCommentViewListDef.js',
         '/modules/asset/form/view/CalemAssetCommentViewNewDef.js',
         '/modules/asset/form/view/CalemAssetCommentViewEditDef.js',
         '/modules/asset/form/view/CalemAssetCommentViewReadDef.js',
         //Meter
         '/modules/asset/form/view/CalemAssetMeterViewListDef.js',
         '/modules/asset/form/view/CalemAssetMeterViewLookupDef.js',
         '/modules/asset/form/view/CalemAssetMeterViewNewDef.js',
         '/modules/asset/form/view/CalemAssetMeterViewEditDef.js',
         '/modules/asset/form/view/CalemAssetMeterViewReadDef.js',
         //Meter reading
         '/modules/asset/form/view/CalemAssetMeterReadingViewListDef.js',
         '/modules/asset/form/view/CalemAssetMeterReadingViewNewDef.js',
         '/modules/asset/form/view/CalemAssetMeterReadingViewReadDef.js',
         //meter select from wo.
         '/modules/asset/form/view/CalemAssetMeterSelectViewListDef.js',
         //Part
         '/modules/asset/form/view/CalemAssetPartViewListDef.js',
         '/modules/asset/form/view/CalemAssetPartViewNewDef.js',
         '/modules/asset/form/view/CalemAssetPartViewEditDef.js',
         '/modules/asset/form/view/CalemAssetPartViewReadDef.js',
         //Contract
         '/modules/asset/form/view/CalemAssetContractViewListDef.js',
         '/modules/asset/form/view/CalemAssetContractViewNewDef.js',
         '/modules/asset/form/view/CalemAssetContractViewEditDef.js',
         '/modules/asset/form/view/CalemAssetContractViewReadDef.js',
         //Depreciation
         '/modules/asset/form/view/CalemAssetDepreciationViewListDef.js',
         '/modules/asset/form/view/CalemAssetDepreciationViewNewDef.js',
         '/modules/asset/form/view/CalemAssetDepreciationViewEditDef.js',
         '/modules/asset/form/view/CalemAssetDepreciationViewReadDef.js',
         
         //Manufacturer
         '/modules/asset/form/view/CalemManufacturerViewListDef.js',
         '/modules/asset/form/view/CalemManufacturerViewLookupDef.js',
         '/modules/asset/form/view/CalemManufacturerViewNewDef.js',
         '/modules/asset/form/view/CalemManufacturerViewReadDef.js',
         '/modules/asset/form/view/CalemManufacturerViewEditDef.js',
         '/modules/asset/form/view/CalemManufacturerViewSearchDef.js',
         
         //asset type
         '/modules/asset/form/view/CalemAssetTypeViewListDef.js',
         '/modules/asset/form/view/CalemAssetTypeViewLookupDef.js',
         '/modules/asset/form/view/CalemAssetTypeViewNewDef.js',
         '/modules/asset/form/view/CalemAssetTypeViewReadDef.js',
         '/modules/asset/form/view/CalemAssetTypeViewEditDef.js',
         '/modules/asset/form/view/CalemAssetTypeViewSearchDef.js',
         
         //meter type
         '/modules/asset/form/view/CalemMeterTypeViewListDef.js',
         '/modules/asset/form/view/CalemMeterTypeViewLookupDef.js',
         '/modules/asset/form/view/CalemMeterTypeViewNewDef.js',
         '/modules/asset/form/view/CalemMeterTypeViewReadDef.js',
         '/modules/asset/form/view/CalemMeterTypeViewEditDef.js',
         '/modules/asset/form/view/CalemMeterTypeViewSearchDef.js',

         //Service log
		   '/modules/asset/form/view/CalemAssetServiceLogViewListDef.js',
		   '/modules/asset/form/view/CalemAssetServiceLogViewReadDef.js',
		   '/modules/asset/form/view/CalemAssetServiceLogNoteViewNewDef.js',
		   //Activity log
		   '/modules/asset/form/view/CalemAssetActivityLogViewListDef.js',
		   '/modules/asset/form/view/CalemAssetActivityLogViewReadDef.js',

		   //Child
		   '/modules/asset/form/view/CalemAssetChildViewListDef.js',
		   '/modules/asset/form/view/CalemAssetChildViewReadDef.js',
		   //LocChild log
		   '/modules/asset/form/view/CalemAssetLocChildViewListDef.js',
		   '/modules/asset/form/view/CalemAssetLocChildViewReadDef.js',

		   //Report
		   '/modules/asset/form/report/CalemAssetReportListDef.js',
		   //Report item
		   '/modules/asset/form/report/CalemAssetReportList.js',

			//form action
         '/modules/asset/form/action/CalemAssetFormAction.js',
         
         //asset forms
         '/modules/asset/form/controller/CalemAssetFormList.js',
         '/modules/asset/form/controller/CalemAssetFormMdTab.js',
         '/modules/asset/form/controller/CalemAssetFormRead.js',
         '/modules/asset/form/controller/CalemAssetFormNew.js',
         '/modules/asset/form/controller/CalemAssetFormEdit.js',
         '/modules/asset/form/controller/CalemAssetFormLookup.js',
         //Downtime
         '/modules/asset/form/controller/CalemAssetDowntimeFormList.js',
         '/modules/asset/form/controller/CalemAssetDowntimeFormNew.js',
         '/modules/asset/form/controller/CalemAssetDowntimeFormEdit.js',
         '/modules/asset/form/controller/CalemAssetDowntimeFormRead.js',
         //Comment
         '/modules/asset/form/controller/CalemAssetCommentFormList.js',
         '/modules/asset/form/controller/CalemAssetCommentFormNew.js',
         '/modules/asset/form/controller/CalemAssetCommentFormEdit.js',
         '/modules/asset/form/controller/CalemAssetCommentFormRead.js',
         //Meter
         '/modules/asset/form/controller/CalemAssetMeterFormList.js',
         '/modules/asset/form/controller/CalemAssetMeterFormLookup.js',
         '/modules/asset/form/controller/CalemAssetMeterFormNew.js',
         '/modules/asset/form/controller/CalemAssetMeterFormEdit.js',
         '/modules/asset/form/controller/CalemAssetMeterFormRead.js',
         //Meter
         '/modules/asset/form/controller/CalemAssetMeterReadingFormList.js',
         '/modules/asset/form/controller/CalemAssetMeterReadingFormNew.js',
         '/modules/asset/form/controller/CalemAssetMeterReadingFormRead.js',
         //meter select from wo.
         '/modules/asset/form/controller/CalemAssetMeterSelectFormList.js',
         
         //Part
         '/modules/asset/form/controller/CalemAssetPartFormList.js',
         '/modules/asset/form/controller/CalemAssetPartFormNew.js',
         '/modules/asset/form/controller/CalemAssetPartFormEdit.js',
         '/modules/asset/form/controller/CalemAssetPartFormRead.js',
         
         //Contract
         '/modules/asset/form/controller/CalemAssetContractFormList.js',
         '/modules/asset/form/controller/CalemAssetContractFormNew.js',
         '/modules/asset/form/controller/CalemAssetContractFormEdit.js',
         '/modules/asset/form/controller/CalemAssetContractFormRead.js',
         
         //Depreciation
         '/modules/asset/form/controller/CalemAssetDepreciationFormList.js',
         '/modules/asset/form/controller/CalemAssetDepreciationFormNew.js',
         '/modules/asset/form/controller/CalemAssetDepreciationFormEdit.js',
         '/modules/asset/form/controller/CalemAssetDepreciationFormRead.js',
         
         //Manufacturer forms
         '/modules/asset/form/controller/CalemManufacturerFormList.js',
         '/modules/asset/form/controller/CalemManufacturerFormRead.js',
         '/modules/asset/form/controller/CalemManufacturerFormNew.js',
         '/modules/asset/form/controller/CalemManufacturerFormEdit.js',
         '/modules/asset/form/controller/CalemManufacturerFormLookup.js',
         
         //asset_type forms
         '/modules/asset/form/controller/CalemAssetTypeFormList.js',
         '/modules/asset/form/controller/CalemAssetTypeFormRead.js',
         '/modules/asset/form/controller/CalemAssetTypeFormNew.js',
         '/modules/asset/form/controller/CalemAssetTypeFormEdit.js',
         '/modules/asset/form/controller/CalemAssetTypeFormLookup.js',
         
         //meter_type forms
         '/modules/asset/form/controller/CalemMeterTypeFormList.js',
         '/modules/asset/form/controller/CalemMeterTypeFormRead.js',
         '/modules/asset/form/controller/CalemMeterTypeFormNew.js',
         '/modules/asset/form/controller/CalemMeterTypeFormEdit.js',
         '/modules/asset/form/controller/CalemMeterTypeFormLookup.js',
			
         //Service log
		   '/modules/asset/form/controller/CalemAssetServiceLogFormList.js',
		   '/modules/asset/form/controller/CalemAssetServiceLogFormRead.js',
		   '/modules/asset/form/controller/CalemAssetServiceLogNoteFormNew.js',
			
		   //Activity log
		   '/modules/asset/form/controller/CalemAssetActivityLogFormList.js',
		   '/modules/asset/form/controller/CalemAssetActivityLogFormRead.js',
			
		   //Child
		   '/modules/asset/form/controller/CalemAssetChildFormList.js',
		   '/modules/asset/form/controller/CalemAssetChildFormRead.js',		   
		   //LocChild
		   '/modules/asset/form/controller/CalemAssetLocChildFormList.js',
		   '/modules/asset/form/controller/CalemAssetLocChildFormRead.js',
			
		   //Asset report
			'/modules/asset/form/controller/CalemAssetListFormList.js',
			
         //Asset module
			'/modules/asset/form/CalemAssetItemDef.js',
			'/modules/asset/form/CalemAssetModuleDef.js',
			
			)
		)
);

?>
