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

$_CALEM_dist['req_conf']=array(
   'req_init_status'=>'req_status_new',
   'req_init_state'=>'req_state_open', 
   'req_init_on_po'=>'req_on_po_none',
	'req_no'=>array('prefix'=>''),
	'req_on_po_no_change_fields'=>array(
		'qty'=>true,
		'uom_id'=>true
	),
	'req_generation'=>array(
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
		)
	),
	'req_status_invalid_map'=>array(
	)
);
?>
