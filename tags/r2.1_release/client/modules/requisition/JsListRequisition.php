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
			'/modules/requisition/bo/CalemReqErrorInfo.js',
			
			'/modules/requisition/bo/CalemReqBo.js',
			'/modules/requisition/bo/CalemReqItemBo.js',
			
			 //Menu
         '/modules/requisition/form/CalemReqMenuDef.js',
         
         //requisition views
         '/modules/requisition/form/view/CalemReqViewListDef.js',
         '/modules/requisition/form/view/CalemReqViewLookupDef.js',
         '/modules/requisition/form/view/CalemReqViewNewDef.js',
         '/modules/requisition/form/view/CalemReqViewReadDef.js',
         '/modules/requisition/form/view/CalemReqViewEditDef.js',
         '/modules/requisition/form/view/CalemReqViewSearchDef.js',
         //item
         '/modules/requisition/form/view/CalemReqItemViewListDef.js',
         '/modules/requisition/form/view/CalemReqItemViewNewDef.js',
         '/modules/requisition/form/view/CalemReqItemViewEditDef.js',
         '/modules/requisition/form/view/CalemReqItemViewReadDef.js',
         
         //status log
         '/modules/requisition/form/view/CalemReqStatusLogViewListDef.js',
         '/modules/requisition/form/view/CalemReqStatusLogViewReadDef.js',
         '/modules/requisition/form/view/CalemReqStatusLogNoteViewNewDef.js',
         
         //Reports
		   '/modules/requisition/form/report/CalemReqReportReadDef.js',
		   '/modules/requisition/form/report/CalemReqItemReportListDef.js',
		   
		   //Report item
		   '/modules/requisition/form/report/CalemReqReportMdTab.js',
		   '/modules/requisition/form/report/CalemReqReportRead.js',
		   '/modules/requisition/form/report/CalemReqItemReportList.js',
         
         //requisition forms
         '/modules/requisition/form/action/CalemReqFormAction.js',
         
         '/modules/requisition/form/controller/CalemReqFormList.js',
         '/modules/requisition/form/controller/CalemReqFormMdTab.js',
         '/modules/requisition/form/controller/CalemReqFormRead.js',
         '/modules/requisition/form/controller/CalemReqFormNew.js',
         '/modules/requisition/form/controller/CalemReqFormEdit.js',
         '/modules/requisition/form/controller/CalemReqFormLookup.js',
         //item
         '/modules/requisition/form/controller/CalemReqItemFormList.js',
         '/modules/requisition/form/controller/CalemReqItemFormNew.js',
         '/modules/requisition/form/controller/CalemReqItemFormEdit.js',
         '/modules/requisition/form/controller/CalemReqItemFormRead.js',
         
         //status log
         '/modules/requisition/form/controller/CalemReqStatusLogFormList.js',
         '/modules/requisition/form/controller/CalemReqStatusLogFormRead.js',
         '/modules/requisition/form/controller/CalemReqStatusLogNoteFormNew.js',
			
         //Project module
			'/modules/requisition/form/CalemReqItemDef.js',
			'/modules/requisition/form/CalemReqModuleDef.js',
			
			)
		)
);

?>