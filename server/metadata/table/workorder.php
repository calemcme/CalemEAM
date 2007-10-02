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

$_CALEM_table=array(
    'table_name'=>'workorder',
    'module'=>'modCalemWo',
    'cache_type'=>'database',
    'dbo'=>array(
    	'path'=>'server/modules/workorder/',
    	'name'=>'CalemWoDbo',
    ),
    'order_by'=>array('field'=>'sched_finish_time', 'order'=>'DESC'),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_workorder_wo_no'=>array('wo_no')
    ),
    'indexes'=>array(
    	'idx_wo_sched_completion_time'=>array('sched_finish_time'),
    	'idx_wo_asset'=>array('asset_id'),
    	'idx_wo_pm'=>array('pm_id'),
    	'idx_wo_costcode'=>array('costcode_id'),
    	'idx_wo_orig_user'=>array('orig_user_id'),
    	'idx_wo_orig_user'=>array('orig_contact_id'),
    	'idx_wo_assigned_to'=>array('assigned_to_id'),
    	'idx_wo_assigned_team'=>array('assigned_team_id')
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'wo_no'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'wo_no'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'description'=>array(
    		'type'=>'text',
    		'required'=>true,
    		'label'=>'wo_description'
    	),
    	'asset_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset',
    		'required'=>true
    	),
    	'pm_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'pm'
    	),
    	'asset_note'=>array(
    		'type'=>'varchar',
    		'length'=>76
    	),
    	//Attributes
    	'category_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'wo_category'
    	),
    	'status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'wo_status'
    	),
    	'priority_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'wo_priority'
    	),
    	'resolution_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'wo_resolution'
    	),
    	'duplicate_wo_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'workorder'
    	),
    	'rcm_action_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'rcm_action'
    	),
    	'parent_wo_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'workorder'
    	),
    	//Source and assignment
    	'origin_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'wo_origin'
    	),
    	'rework_wo_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'workorder'
    	),
    	'orig_contact_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'contact'
    	),
    	'orig_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'required'=>true
    	),
    	'orig_time'=>array(
    		'type'=>'datetime',
    		'required'=>true
    	),
    	'assigned_team_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'team'
    	),
    	'assigned_to_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	),
    	'assigned_by_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	),
    	'assigned_time'=>array(
    		'type'=>'datetime'
    	),
    	
    	'time_needed'=>array(
    		'type'=>'datetime'
    	),
    	
    	//start time.
    	'planned_start_time'=>array(
    		'type'=>'datetime'
    	),
    	'sched_start_time'=>array(
    		'type'=>'datetime'
    	),
    	'sched_start_shift_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'shift'
    	),
    	'actual_start_time'=>array(
    		'type'=>'datetime'
    	),
    	'actual_start_shift_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'shift'
    	),
    	//finish time
    	'planned_finish_time'=>array(
    		'type'=>'datetime'
    	),
    	'sched_finish_time'=>array(
    		'type'=>'datetime'
    	),
    	'sched_finish_shift_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'shift'
    	),
    	'actual_finish_time'=>array(
    		'type'=>'datetime'
    	),
    	'actual_finish_shift_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'shift'
    	),
    	
    	//Other codes
    	'costcode_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'costcode'
    	),
    	'project_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'project'
    	),
    	'dept_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'dept'
    	),
  
    	//Labor hours
    	'planned_labor_hours'=>array(
    		'type'=>'double'
    	),
    	'sched_labor_hours'=>array(
    		'type'=>'double'
    	),
    	'actual_labor_hours'=>array(
    		'type'=>'double'
    	),
    	//Total cost
    	'labor_cost'=>array(
    		'type'=>'sys_currency'
    	),
    	'material_cost'=>array(
    		'type'=>'sys_currency'
    	),
    	'total_cost'=>array(
    		'type'=>'sys_currency'
    	),
    	//downtime
    	'planned_downtime_hours'=>array(
    		'type'=>'double'
    	),
    	'actual_downtime_hours'=>array(
    		'type'=>'double'
    	),
    	'modified_time'=>array(
    		'type'=>'datetime'
    	),
    	'modified_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	),
    	'created_time'=>array(
    		'type'=>'datetime'
    	),
    	'created_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	)    	
    ) //End of fields list    	
)
?>
