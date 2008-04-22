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
    'table_name'=>'wo_sched_labor',
    'module'=>'modCalemWo',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'start_time', 'order'=>'DESC'),
    'dbo'=>array(
    	'path'=>'server/modules/workorder/',
    	'name'=>'CalemWoSchedLaborDbo',
    ),
    'primary_key'=>array(
    	'id'
    ),
    'indexes'=>array(
      'idx_sched_labor_wo_id'=>array('wo_id'),
		'idx_sched_labor_user_id'=>array('user_id'),
		'idx_sched_labor_start'=>array('start_time'),
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'wo_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'workorder'
    	),
    	'user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'required'=>true
    	),
    	'start_time'=>array(
    		'type'=>'datetime',
    		'required'=>true
    	),
    	'shift_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'shift'
    	),
    	'hours'=>array(
    		'type'=>'double',
    		'minVal'=>0
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
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
