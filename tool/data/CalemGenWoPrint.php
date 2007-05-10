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


//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

$_CALEM_gen_data = array(
	'title'=>' === Generating WO Print ===' . "<br>",
   'regenerate'=>true,
   'overwrite'=>false,
   'dataList'=>array(
      array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoPlannedLaborViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoPlannedLaborReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoPlannedPartViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoPlannedPartReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoPlannedToolViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoPlannedToolReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoPlannedDowntimeViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoPlannedDowntimeReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoDocViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoDocReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoMeterViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoMeterReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoSchedLaborViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoSchedLaborReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoLaborViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoLaborReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoPartViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoPartReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoToolViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoToolReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoStepViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoStepReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoSafetyViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoSafetyReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoCommentViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoCommentReportListDef')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoDowntimeViewListDef'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
   			'pattern'=>'CalemWoDowntimeReportListDef')
   	),
   ),
   'file_patterns'=>array(
   	'ViewList'=>'ReportList'  
   )
);

?>
