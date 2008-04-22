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
			 // Pm
			 // ---------------
			 // BO
			'/modules/pm/bo/CalemPmBo.js',
			'/modules/pm/bo/CalemPmAssetBo.js',
			'/modules/pm/bo/CalemPmAssetMeterBo.js',
			
			 //Menu
         '/modules/pm/form/CalemPmMenuDef.js',
         
         //pm views
         '/modules/pm/form/view/CalemPmViewListDef.js',
         '/modules/pm/form/view/CalemPmViewLookupDef.js',
         '/modules/pm/form/view/CalemPmViewNewDef.js',
         '/modules/pm/form/view/CalemPmViewReadDef.js',
         '/modules/pm/form/view/CalemPmViewEditDef.js',
         '/modules/pm/form/view/CalemPmViewSearchDef.js',
         //Labor
         '/modules/pm/form/view/CalemPmLaborViewListDef.js',
         '/modules/pm/form/view/CalemPmLaborViewNewDef.js',
         '/modules/pm/form/view/CalemPmLaborViewEditDef.js',
         '/modules/pm/form/view/CalemPmLaborViewReadDef.js',
         //Tool
         '/modules/pm/form/view/CalemPmToolViewListDef.js',
         '/modules/pm/form/view/CalemPmToolViewNewDef.js',
         '/modules/pm/form/view/CalemPmToolViewEditDef.js',
         '/modules/pm/form/view/CalemPmToolViewReadDef.js',
         //Part
         '/modules/pm/form/view/CalemPmPartViewListDef.js',
         '/modules/pm/form/view/CalemPmPartViewNewDef.js',
         '/modules/pm/form/view/CalemPmPartViewEditDef.js',
         '/modules/pm/form/view/CalemPmPartViewReadDef.js',
         //Downtime
         '/modules/pm/form/view/CalemPmDowntimeViewListDef.js',
         '/modules/pm/form/view/CalemPmDowntimeViewNewDef.js',
         '/modules/pm/form/view/CalemPmDowntimeViewEditDef.js',
         '/modules/pm/form/view/CalemPmDowntimeViewReadDef.js',
         //Step
         '/modules/pm/form/view/CalemPmStepViewListDef.js',
         '/modules/pm/form/view/CalemPmStepViewNewDef.js',
         '/modules/pm/form/view/CalemPmStepViewEditDef.js',
         '/modules/pm/form/view/CalemPmStepViewReadDef.js',
         //Safety
         '/modules/pm/form/view/CalemPmSafetyViewListDef.js',
         '/modules/pm/form/view/CalemPmSafetyViewNewDef.js',
         '/modules/pm/form/view/CalemPmSafetyViewEditDef.js',
         '/modules/pm/form/view/CalemPmSafetyViewReadDef.js',
         //Doc
         '/modules/pm/form/view/CalemPmDocViewListDef.js',
         '/modules/pm/form/view/CalemPmDocViewNewDef.js',
         '/modules/pm/form/view/CalemPmDocViewEditDef.js',
         '/modules/pm/form/view/CalemPmDocViewReadDef.js',
         //Audit
         '/modules/pm/form/view/CalemPmAuditViewListDef.js',
         '/modules/pm/form/view/CalemPmAuditViewNewDef.js',
         '/modules/pm/form/view/CalemPmAuditViewEditDef.js',
         '/modules/pm/form/view/CalemPmAuditViewReadDef.js',
         //Comment
         '/modules/pm/form/view/CalemPmCommentViewListDef.js',
         '/modules/pm/form/view/CalemPmCommentViewNewDef.js',
         '/modules/pm/form/view/CalemPmCommentViewEditDef.js',
         '/modules/pm/form/view/CalemPmCommentViewReadDef.js',
         //Dependency
         '/modules/pm/form/view/CalemPmDependencyViewListDef.js',
         '/modules/pm/form/view/CalemPmDependencyViewNewDef.js',
         '/modules/pm/form/view/CalemPmDependencyViewEditDef.js',
         '/modules/pm/form/view/CalemPmDependencyViewReadDef.js',
         //Asset
         '/modules/pm/form/view/CalemPmAssetViewListDef.js',
         '/modules/pm/form/view/CalemPmAssetViewNewDef.js',
         '/modules/pm/form/view/CalemPmAssetViewEditDef.js',
         '/modules/pm/form/view/CalemPmAssetViewReadDef.js',
         
         //Meter
         '/modules/pm/form/view/CalemPmAssetMeterViewListDef.js',
         '/modules/pm/form/view/CalemPmAssetMeterViewNewDef.js',
         '/modules/pm/form/view/CalemPmAssetMeterViewEditDef.js',
         '/modules/pm/form/view/CalemPmAssetMeterViewReadDef.js',
         //Season
         '/modules/pm/form/view/CalemPmAssetSeasonViewListDef.js',
         '/modules/pm/form/view/CalemPmAssetSeasonViewNewDef.js',
         '/modules/pm/form/view/CalemPmAssetSeasonViewEditDef.js',
         '/modules/pm/form/view/CalemPmAssetSeasonViewReadDef.js',
         
			// --- forms
         //pm forms
         '/modules/pm/form/controller/CalemPmFormList.js',
         '/modules/pm/form/controller/CalemPmFormMdTab.js',
         '/modules/pm/form/controller/CalemPmFormRead.js',
         '/modules/pm/form/controller/CalemPmFormNew.js',
         '/modules/pm/form/controller/CalemPmFormEdit.js',
         '/modules/pm/form/controller/CalemPmFormLookup.js',
         //Craft
         '/modules/pm/form/controller/CalemPmLaborFormList.js',
         '/modules/pm/form/controller/CalemPmLaborFormNew.js',
         '/modules/pm/form/controller/CalemPmLaborFormEdit.js',
         '/modules/pm/form/controller/CalemPmLaborFormRead.js',
         //Tool
         '/modules/pm/form/controller/CalemPmToolFormList.js',
         '/modules/pm/form/controller/CalemPmToolFormNew.js',
         '/modules/pm/form/controller/CalemPmToolFormEdit.js',
         '/modules/pm/form/controller/CalemPmToolFormRead.js',
         //Part
         '/modules/pm/form/controller/CalemPmPartFormList.js',
         '/modules/pm/form/controller/CalemPmPartFormNew.js',
         '/modules/pm/form/controller/CalemPmPartFormEdit.js',
         '/modules/pm/form/controller/CalemPmPartFormRead.js',         
         //Downtime
         '/modules/pm/form/controller/CalemPmDowntimeFormList.js',
         '/modules/pm/form/controller/CalemPmDowntimeFormNew.js',
         '/modules/pm/form/controller/CalemPmDowntimeFormEdit.js',
         '/modules/pm/form/controller/CalemPmDowntimeFormRead.js',
         //Comment
         '/modules/pm/form/controller/CalemPmCommentFormList.js',
         '/modules/pm/form/controller/CalemPmCommentFormNew.js',
         '/modules/pm/form/controller/CalemPmCommentFormEdit.js',
         '/modules/pm/form/controller/CalemPmCommentFormRead.js',
         //Step
         '/modules/pm/form/controller/CalemPmStepFormList.js',
         '/modules/pm/form/controller/CalemPmStepFormNew.js',
         '/modules/pm/form/controller/CalemPmStepFormEdit.js',
         '/modules/pm/form/controller/CalemPmStepFormRead.js',
         //Safety
         '/modules/pm/form/controller/CalemPmSafetyFormList.js',
         '/modules/pm/form/controller/CalemPmSafetyFormNew.js',
         '/modules/pm/form/controller/CalemPmSafetyFormEdit.js',
         '/modules/pm/form/controller/CalemPmSafetyFormRead.js',
         //Doc
         '/modules/pm/form/controller/CalemPmDocFormList.js',
         '/modules/pm/form/controller/CalemPmDocFormNew.js',
         '/modules/pm/form/controller/CalemPmDocFormEdit.js',
         '/modules/pm/form/controller/CalemPmDocFormRead.js',
			//Audit
         '/modules/pm/form/controller/CalemPmAuditFormList.js',
         '/modules/pm/form/controller/CalemPmAuditFormNew.js',
         '/modules/pm/form/controller/CalemPmAuditFormEdit.js',
         '/modules/pm/form/controller/CalemPmAuditFormRead.js',
         //Dependency
         '/modules/pm/form/controller/CalemPmDependencyFormList.js',
         '/modules/pm/form/controller/CalemPmDependencyFormNew.js',
         '/modules/pm/form/controller/CalemPmDependencyFormEdit.js',
         '/modules/pm/form/controller/CalemPmDependencyFormRead.js',
         //Asset
         '/modules/pm/form/controller/CalemPmAssetFormList.js',
         '/modules/pm/form/controller/CalemPmAssetFormNew.js',
         '/modules/pm/form/controller/CalemPmAssetFormEdit.js',
         '/modules/pm/form/controller/CalemPmAssetFormRead.js',
         //Meter
         '/modules/pm/form/controller/CalemPmAssetMeterFormList.js',
         '/modules/pm/form/controller/CalemPmAssetMeterFormNew.js',
         '/modules/pm/form/controller/CalemPmAssetMeterFormEdit.js',
         '/modules/pm/form/controller/CalemPmAssetMeterFormRead.js',
         //Season
         '/modules/pm/form/controller/CalemPmAssetSeasonFormList.js',
         '/modules/pm/form/controller/CalemPmAssetSeasonFormNew.js',
         '/modules/pm/form/controller/CalemPmAssetSeasonFormEdit.js',
         '/modules/pm/form/controller/CalemPmAssetSeasonFormRead.js',
         
         //Pm module
			'/modules/pm/form/CalemPmItemDef.js',
			'/modules/pm/form/CalemPmModuleDef.js',
			
			)
		)
);

?>