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
    'table_name'=>'project',
    'module'=>'modCalemProject',
    'cache_type'=>'memory',
    'order_by'=>array('field'=>'sched_start_time', 'order'=>'ASC'),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_project_project_no'=>array(
    		'project_no'
    	)
    ),
    'indexes'=>array(
    	'idx_project_start_time'=>array(
    		'sched_start_time'
    	),
    	'idx_project_parent_id'=>array(
    		'parent_id'
    	),
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'project_no'    
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'project_no'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'parent_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'project',
    		'label'=>'parent_project'
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76,
    	),
    	'status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'project_status'
    	),
    	'priority_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'project_priority'
    	),
    	'type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'project_type',
    		'label'=>'type_project'
    	),
    	'owner_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'required'=>true
    	),
    	'sched_start_time'=>array(
    		'type'=>'datetime'
    	),
    	'sched_end_time'=>array(
    		'type'=>'datetime'
    	),
    	'actual_start_time'=>array(
    		'type'=>'datetime'
    	),
    	'actual_end_time'=>array(
    		'type'=>'datetime'
    	),
    	'sched_hours'=>array(
    		'type'=>'double'
    	),
    	'actual_hours'=>array(
    		'type'=>'double'
    	),
    	'percent_done'=>array(
    		'type'=>'percent'
    	),
    	'dept_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'dept'
    	),
    	'costcode_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'costcode'
    	),
    	'comment'=>array(
    		'type'=>'text',
    		'label'=>'project_comment'
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
