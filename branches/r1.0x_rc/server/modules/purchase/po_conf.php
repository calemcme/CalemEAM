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

$_CALEM_dist['po_conf']=array(
   'po_init_status'=>'po_status_new',
   'po_init_state'=>'po_state_open', 
	'po_no'=>array('prefix'=>'CPO-'),
	'default_shipping_addr'=>'po_shipping_addr',
	'default_billing_addr'=>'po_billing_addr',
	'reqItemToPoItem'=>array(
		'in_id'=>'in_id',
		'vendor_part_no'=>'vendor_part_no',
		'unit_cost'=>'unit_cost',
		'qty'=>'qty',
		'uom_id'=>'uom_id',
		'line_cost'=>'line_cost',
		'note'=>'note'		
	),
	'po_generation'=>array(
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
	'po_status_invalid_map'=>array(
		'po_status_submitted'=>array(
			'po_status_voided'=>1
		),
		'po_status_acked'=>array(
			'po_status_voided'=>1
		)
	)
);

?>
