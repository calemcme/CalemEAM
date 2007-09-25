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


/**
 * This file defined the configuration for this installation by 
 * combining the custom with the distributed installation. 
 */
 
//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

$_CALEM_dist['wo_conf']=array(
   'wo_new_status'=>'wos_new',  
	'wo_no'=>array('format'=>'%d'),
	'pmToWo'=>array(
		'pm_labor'=>array(
		   'target'=>'wo_planned_labor',
		   'fieldMap'=>array(
		   	'craft_id'=>'craft_id',
		   	'hours'=>'hours',
		   	'crew_size'=>'crew_size'		   
		   )
		),
		'pm_tool'=>array(
		   'target'=>'wo_planned_tool',
		   'fieldMap'=>array(
		   	'in_id'=>'in_id',
		   	'duration'=>'duration',
		   	'qty'=>'qty',
		   	'note'=>'note'		   
		   )
		),
		'pm_part'=>array(
		   'target'=>'wo_planned_part',
		   'fieldMap'=>array(
		   	'in_id'=>'in_id',
		   	'qty'=>'qty',
		   	'note'=>'note'		   
		   )
		),
		'pm_downtime'=>array(
		   'target'=>'wo_planned_downtime',
		   'fieldMap'=>array(
		   	'hours'=>'hours',
		   	'note'=>'note'		   
		   )
		),
		'pm_step'=>array(
		   'target'=>'wo_step',
		   'fieldMap'=>array(
		   	'seq'=>'seq',
		   	'description'=>'description'		   
		   )
		),
		'pm_safety'=>array(
		   'target'=>'wo_safety',
		   'fieldMap'=>array(
		   	'seq'=>'seq',
		   	'description'=>'description'		   
		   )
		),
		'pm_doc'=>array(
		   'target'=>'wo_doc',
		   'fieldMap'=>array(
		   	'seq'=>'seq',
		   	'doc_id'=>'doc_id',
		   	'note'=>'note'		   
		   )
		)
	),
	'pmAssetToWo'=>array(
		'pm_meter'=>array(
			'target'=>'wo_meter',
			'fieldMap'=>array(
				'meter_id'=>'meter_id'
			)
		)
	),
	'wo_generation'=>array(
		'semaphore_id'=>'wo_generation',
		'semaphore_ttl'=>60,
		'script_start_time'=>45,
		'script_interim_time'=>30,
		//Valid auto gen def.
		'auto_conf'=>array(
			'pm_status'=>array('pm_status_active'=>1),
			'release_type'=>array('pm_release_fixed'=>1, 'pm_release_floating'=>1),
			'schedule_type'=>array('pm_schedule_time'=>1, 'pm_schedule_meter'=>1, 'pm_schedule_timeandmeter'=>1),
			'asset_status'=>array('as_status_inservice'=>1),
		),
		//Dependency gen conf
		'dependency_conf'=>array(
			'pm_status'=>array('pm_status_active'=>1),
			'release_type'=>array('pm_release_fixed'=>1, 'pm_release_floating'=>1, 'pm_release_other'=>1),
			'schedule_type'=>array('pm_schedule_time'=>1, 'pm_schedule_meter'=>1, 'pm_schedule_timeandmeter'=>1, 'pm_schedule_other'=>1),
			'asset_status'=>array('as_status_inservice'=>1),
		),
		
		'days_ahead'=>array('days'=>35), //supporting days only for now
		'user_id'=>array('id'=>1000000),  //Option to use an Id or a username.
		'release_past_due'=>false,
		'scheduleBo'=>array(
			'name'=>'CalemWoGenScheduleBo',
			'path'=>'server/modules/workorder/'
		),
		'releaseBo'=>array(
			'name'=>'CalemWoGenReleaseBo',
			'path'=>'server/modules/workorder/'		
		),
		'depReleaseBo'=>array(
			'name'=>'CalemWoGenDepReleaseBo',
			'path'=>'server/modules/workorder/'			
		),
		'scheduleBoMap'=>array(
		   'pm_release_fixed_pm_schedule_time'=>'handleFixedByTime',
		   'pm_release_fixed_pm_schedule_meter'=>'handleFixedByMeter',
		   'pm_release_fixed_pm_schedule_timeandmeter'=>'handleFixedByTimeAndMeter',
		   'pm_release_floating_pm_schedule_time'=>'handleFloatingByTime',
		   'pm_release_floating_pm_schedule_meter'=>'handleFloatingByMeter',
		   'pm_release_floating_pm_schedule_timeandmeter'=>'handleFloatingByTimeAndMeter'
		),
		'standing_pm_sql'=>"select count(*) from workorder where pm_id=? and asset_id=? and (status_id is NULL or status_id <> 'wos_closed')",
		'release_conf'=>array(
			'wo_status'=>'wos_new',
			'hours_in_a_day'=>8
		)
	)
);

?>
