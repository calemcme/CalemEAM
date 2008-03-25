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
			
			 //workorder
			 //BO
			'/modules/workorder/bo/CalemCraftBo.js',
			'/modules/workorder/bo/CalemWoBo.js',
			'/modules/workorder/bo/CalemWoErrorInfo.js',
			 //Menu
         '/modules/workorder/form/CalemWoMenuDef.js',
          //Views
		   
		   //Craft
         '/modules/workorder/form/view/CalemCraftViewListDef.js',
         '/modules/workorder/form/view/CalemCraftViewLookupDef.js',
         '/modules/workorder/form/view/CalemCraftViewNewDef.js',
         '/modules/workorder/form/view/CalemCraftViewReadDef.js',
         '/modules/workorder/form/view/CalemCraftViewEditDef.js',
         '/modules/workorder/form/view/CalemCraftViewSearchDef.js',
         
         //Workorder
			'/modules/workorder/form/view/CalemWoViewListDef.js',
			'/modules/workorder/form/view/CalemWoViewLookupDef.js',
			'/modules/workorder/form/view/CalemWoViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoViewEditDef.js',
		   '/modules/workorder/form/view/CalemWoViewSearchDef.js',
		   
		   '/modules/workorder/form/view/CalemWoMyAssignmentViewListDef.js',
		   '/modules/workorder/form/view/CalemWoMyRequestViewListDef.js',
		   '/modules/workorder/form/view/CalemWoMyTeamAssignmentViewListDef.js',
		   
		   //Wo req
         '/modules/workorder/form/view/CalemWoReqViewNewDef.js',
         '/modules/workorder/form/view/CalemWoNoPmViewNewDef.js',
         //New from PM
         '/modules/workorder/form/view/CalemNewWoAssetViewNewDef.js',
		   
		   //Planned labor
		   '/modules/workorder/form/view/CalemWoPlannedLaborViewListDef.js',
			'/modules/workorder/form/view/CalemWoPlannedLaborViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoPlannedLaborViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoPlannedLaborViewEditDef.js',
		   
		   //Planned Part
		   '/modules/workorder/form/view/CalemWoPlannedPartViewListDef.js',
			'/modules/workorder/form/view/CalemWoPlannedPartViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoPlannedPartViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoPlannedPartViewEditDef.js',
		   
		   //Planned Tool
		   '/modules/workorder/form/view/CalemWoPlannedToolViewListDef.js',
			'/modules/workorder/form/view/CalemWoPlannedToolViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoPlannedToolViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoPlannedToolViewEditDef.js',
		   
		   //Planned Downtime
		   '/modules/workorder/form/view/CalemWoPlannedDowntimeViewListDef.js',
			'/modules/workorder/form/view/CalemWoPlannedDowntimeViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoPlannedDowntimeViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoPlannedDowntimeViewEditDef.js',
         
         //Doc
		   '/modules/workorder/form/view/CalemWoDocViewListDef.js',
			'/modules/workorder/form/view/CalemWoDocViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoDocViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoDocViewEditDef.js',
		   
		   //Meter
		   '/modules/workorder/form/view/CalemWoMeterViewListDef.js',
			'/modules/workorder/form/view/CalemWoMeterViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoMeterViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoMeterViewEditDef.js',
		   
		   '/modules/workorder/form/view/CalemWoMeterAddReadingViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoMeterReadingViewListDef.js',
			 
			//Sched labor
		   '/modules/workorder/form/view/CalemWoSchedLaborViewListDef.js',
			'/modules/workorder/form/view/CalemWoSchedLaborViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoSchedLaborViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoSchedLaborViewEditDef.js',
		   
		   // labor
		   '/modules/workorder/form/view/CalemWoLaborViewListDef.js',
			'/modules/workorder/form/view/CalemWoLaborViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoLaborViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoLaborViewEditDef.js',
		   
		   // Part
		   '/modules/workorder/form/view/CalemWoPartCheckoutViewEditDef.js',
		   '/modules/workorder/form/view/CalemWoPartAddViewEditDef.js',
		   '/modules/workorder/form/view/CalemWoPartReturnViewEditDef.js',
		   
		   '/modules/workorder/form/view/CalemWoPartViewListDef.js',
		   '/modules/workorder/form/view/CalemWoPartViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoPartViewEditDef.js',
		   
		   // Tool
		   '/modules/workorder/form/view/CalemWoToolCheckoutViewEditDef.js',
		   '/modules/workorder/form/view/CalemWoToolAddViewEditDef.js',
		   '/modules/workorder/form/view/CalemWoToolReturnViewEditDef.js',
		   
		   '/modules/workorder/form/view/CalemWoToolViewListDef.js',
		   '/modules/workorder/form/view/CalemWoToolViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoToolViewEditDef.js',
		   
		   // Step
		   '/modules/workorder/form/view/CalemWoStepViewListDef.js',
			'/modules/workorder/form/view/CalemWoStepViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoStepViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoStepViewEditDef.js',
		   
		   // Safety
		   '/modules/workorder/form/view/CalemWoSafetyViewListDef.js',
			'/modules/workorder/form/view/CalemWoSafetyViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoSafetyViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoSafetyViewEditDef.js',
		   
		   // Comment
		   '/modules/workorder/form/view/CalemWoCommentViewListDef.js',
			'/modules/workorder/form/view/CalemWoCommentViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoCommentViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoCommentViewEditDef.js',
		   
		    // Downtime
		   '/modules/workorder/form/view/CalemWoDowntimeViewListDef.js',
			'/modules/workorder/form/view/CalemWoDowntimeViewNewDef.js',
		   '/modules/workorder/form/view/CalemWoDowntimeViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoDowntimeViewEditDef.js',
		   
		   //Wo status
		   '/modules/workorder/form/view/CalemWoStatusLogViewListDef.js',
		   '/modules/workorder/form/view/CalemWoStatusLogViewReadDef.js',
		   '/modules/workorder/form/view/CalemWoStatusLogNoteViewNewDef.js',
		   
		   //Wo generation log
		   '/modules/workorder/form/view/CalemWoGenLogViewListDef.js',
		   '/modules/workorder/form/view/CalemWoGenLogViewReadDef.js',
		   
		   //Reports
		   '/modules/workorder/form/report/CalemWoReportReadDef.js',
		   '/modules/workorder/form/report/CalemWoPlannedLaborReportListDef.js',
		   '/modules/workorder/form/report/CalemWoPlannedToolReportListDef.js',
		   '/modules/workorder/form/report/CalemWoPlannedPartReportListDef.js',
		   '/modules/workorder/form/report/CalemWoPlannedDowntimeReportListDef.js',
		   '/modules/workorder/form/report/CalemWoDocReportListDef.js',
		   '/modules/workorder/form/report/CalemWoMeterReportListDef.js',
		   '/modules/workorder/form/report/CalemWoSchedLaborReportListDef.js',
		   '/modules/workorder/form/report/CalemWoStepReportListDef.js',
		   '/modules/workorder/form/report/CalemWoSafetyReportListDef.js',
		   '/modules/workorder/form/report/CalemWoLaborReportListDef.js',
		   '/modules/workorder/form/report/CalemWoPartReportListDef.js',
		   '/modules/workorder/form/report/CalemWoToolReportListDef.js',
		   '/modules/workorder/form/report/CalemWoDowntimeReportListDef.js',
		   '/modules/workorder/form/report/CalemWoCommentReportListDef.js', 
		   
		   //Report item
		   '/modules/workorder/form/report/CalemWoReportMdTab.js',
		   '/modules/workorder/form/report/CalemWoReportRead.js',
		   '/modules/workorder/form/report/CalemWoPlannedLaborReportList.js',
		   '/modules/workorder/form/report/CalemWoPlannedToolReportList.js',
		   '/modules/workorder/form/report/CalemWoPlannedPartReportList.js',
		   '/modules/workorder/form/report/CalemWoPlannedDowntimeReportList.js',
		   '/modules/workorder/form/report/CalemWoDocReportList.js',
		   '/modules/workorder/form/report/CalemWoMeterReportList.js',
		   '/modules/workorder/form/report/CalemWoSchedLaborReportList.js',
		   '/modules/workorder/form/report/CalemWoStepReportList.js',
		   '/modules/workorder/form/report/CalemWoSafetyReportList.js',
		   '/modules/workorder/form/report/CalemWoLaborReportList.js',
		   '/modules/workorder/form/report/CalemWoPartReportList.js',
		   '/modules/workorder/form/report/CalemWoToolReportList.js',
		   '/modules/workorder/form/report/CalemWoDowntimeReportList.js',
		   '/modules/workorder/form/report/CalemWoCommentReportList.js',
		   
			 //Controllers
			'/modules/workorder/form/controller/action/CalemWoFormAction.js',
			
			//Craft forms
         '/modules/workorder/form/controller/CalemCraftFormList.js',
         '/modules/workorder/form/controller/CalemCraftFormRead.js',
         '/modules/workorder/form/controller/CalemCraftFormNew.js',
         '/modules/workorder/form/controller/CalemCraftFormEdit.js',
         '/modules/workorder/form/controller/CalemCraftFormLookup.js',
         
         //wo
         '/modules/workorder/form/controller/CalemWoFormMdTab.js',
			'/modules/workorder/form/controller/CalemWoFormList.js',
			'/modules/workorder/form/controller/CalemWoFormLookup.js',
			'/modules/workorder/form/controller/CalemWoFormNew.js',
			'/modules/workorder/form/controller/CalemWoFormRead.js',
			'/modules/workorder/form/controller/CalemWoFormEdit.js',
			
			'/modules/workorder/form/controller/CalemWoMyAssignmentFormList.js',
		   '/modules/workorder/form/controller/CalemWoMyRequestFormList.js',
		   '/modules/workorder/form/controller/CalemWoMyTeamAssignmentFormList.js',
			
			 //wo req
         '/modules/workorder/form/controller/CalemWoReqFormNew.js',
         '/modules/workorder/form/controller/CalemWoNoPmFormNew.js',
         //New from PM
         '/modules/workorder/form/controller/CalemNewWoAssetFormNew.js',
         '/modules/workorder/form/controller/CalemNewWoPmFormLookup.js',
			
			//Planned labor
		   '/modules/workorder/form/controller/CalemWoPlannedLaborFormList.js',
			'/modules/workorder/form/controller/CalemWoPlannedLaborFormNew.js',
		   '/modules/workorder/form/controller/CalemWoPlannedLaborFormRead.js',
		   '/modules/workorder/form/controller/CalemWoPlannedLaborFormEdit.js',
		   
		   //Planned Part
		   '/modules/workorder/form/controller/CalemWoPlannedPartFormList.js',
			'/modules/workorder/form/controller/CalemWoPlannedPartFormNew.js',
		   '/modules/workorder/form/controller/CalemWoPlannedPartFormRead.js',
		   '/modules/workorder/form/controller/CalemWoPlannedPartFormEdit.js',
		   
		   //Planned Tool
		   '/modules/workorder/form/controller/CalemWoPlannedToolFormList.js',
			'/modules/workorder/form/controller/CalemWoPlannedToolFormNew.js',
		   '/modules/workorder/form/controller/CalemWoPlannedToolFormRead.js',
		   '/modules/workorder/form/controller/CalemWoPlannedToolFormEdit.js',
		   
		   //Planned Downtime
		   '/modules/workorder/form/controller/CalemWoPlannedDowntimeFormList.js',
			'/modules/workorder/form/controller/CalemWoPlannedDowntimeFormNew.js',
		   '/modules/workorder/form/controller/CalemWoPlannedDowntimeFormRead.js',
		   '/modules/workorder/form/controller/CalemWoPlannedDowntimeFormEdit.js',
         
         //Doc
		   '/modules/workorder/form/controller/CalemWoDocFormList.js',
			'/modules/workorder/form/controller/CalemWoDocFormNew.js',
		   '/modules/workorder/form/controller/CalemWoDocFormRead.js',
		   '/modules/workorder/form/controller/CalemWoDocFormEdit.js',
		   
		   //Meter
		   '/modules/workorder/form/controller/CalemWoMeterFormList.js',
			'/modules/workorder/form/controller/CalemWoMeterFormNew.js',
		   '/modules/workorder/form/controller/CalemWoMeterFormRead.js',
		   '/modules/workorder/form/controller/CalemWoMeterFormEdit.js',
		   
		   '/modules/workorder/form/controller/CalemWoMeterAddReadingFormNew.js',
		   '/modules/workorder/form/controller/CalemWoMeterReadingFormList.js',
			 
			//Sched labor
		   '/modules/workorder/form/controller/CalemWoSchedLaborFormList.js',
			'/modules/workorder/form/controller/CalemWoSchedLaborFormNew.js',
		   '/modules/workorder/form/controller/CalemWoSchedLaborFormRead.js',
		   '/modules/workorder/form/controller/CalemWoSchedLaborFormEdit.js',
		   
		   // labor
		   '/modules/workorder/form/controller/CalemWoLaborFormList.js',
			'/modules/workorder/form/controller/CalemWoLaborFormNew.js',
		   '/modules/workorder/form/controller/CalemWoLaborFormRead.js',
		   '/modules/workorder/form/controller/CalemWoLaborFormEdit.js',
		   
		   // Part
		   '/modules/workorder/form/controller/CalemWoPartCheckoutFormEdit.js',
		   '/modules/workorder/form/controller/CalemWoPartAddFormEdit.js',
		   '/modules/workorder/form/controller/CalemWoPartReturnFormEdit.js',
		   
		   '/modules/workorder/form/controller/CalemWoPartFormList.js',
		   '/modules/workorder/form/controller/CalemWoPartFormRead.js',
		   '/modules/workorder/form/controller/CalemWoPartFormEdit.js',
		   
		   // Tool
		   '/modules/workorder/form/controller/CalemWoToolCheckoutFormEdit.js',
		   '/modules/workorder/form/controller/CalemWoToolAddFormEdit.js',
		   '/modules/workorder/form/controller/CalemWoToolReturnFormEdit.js',
		   
		   '/modules/workorder/form/controller/CalemWoToolFormList.js',
		   '/modules/workorder/form/controller/CalemWoToolFormRead.js',
		   '/modules/workorder/form/controller/CalemWoToolFormEdit.js',
		   
		   // Step
		   '/modules/workorder/form/controller/CalemWoStepFormList.js',
			'/modules/workorder/form/controller/CalemWoStepFormNew.js',
		   '/modules/workorder/form/controller/CalemWoStepFormRead.js',
		   '/modules/workorder/form/controller/CalemWoStepFormEdit.js',
		   
		   // Safety
		   '/modules/workorder/form/controller/CalemWoSafetyFormList.js',
			'/modules/workorder/form/controller/CalemWoSafetyFormNew.js',
		   '/modules/workorder/form/controller/CalemWoSafetyFormRead.js',
		   '/modules/workorder/form/controller/CalemWoSafetyFormEdit.js',
		   
		   // Comment
		   '/modules/workorder/form/controller/CalemWoCommentFormList.js',
			'/modules/workorder/form/controller/CalemWoCommentFormNew.js',
		   '/modules/workorder/form/controller/CalemWoCommentFormRead.js',
		   '/modules/workorder/form/controller/CalemWoCommentFormEdit.js',
		   
		   // Downtime
		   '/modules/workorder/form/controller/CalemWoDowntimeFormList.js',
			'/modules/workorder/form/controller/CalemWoDowntimeFormNew.js',
		   '/modules/workorder/form/controller/CalemWoDowntimeFormRead.js',
		   '/modules/workorder/form/controller/CalemWoDowntimeFormEdit.js',
		   
		   //Wo status
		   '/modules/workorder/form/controller/CalemWoStatusLogFormList.js',
		   '/modules/workorder/form/controller/CalemWoStatusLogFormRead.js',
		   '/modules/workorder/form/controller/CalemWoStatusLogNoteFormNew.js',
		   
		   //Wo gen log
		   '/modules/workorder/form/controller/CalemWoGenLogFormList.js',
		   '/modules/workorder/form/controller/CalemWoGenLogFormRead.js',
		   
			//ItemDef
			'/modules/workorder/form/CalemWoItemDef.js',
			//Module
			'/modules/workorder/form/CalemWoModuleDef.js',
			)
		)
);

?>