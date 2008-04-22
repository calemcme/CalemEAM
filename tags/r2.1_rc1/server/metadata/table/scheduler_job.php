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
    'table_name'=>'scheduler_job',
    'module'=>'modCalemAdmin',
    'cache_type'=>'memory',
    'order_by'=>array('field'=>'start_seq', 'order'=>'ASC'),
    'dbo'=>array(
    	'path'=>'server/modules/admin/',
    	'name'=>'CalemSchedulerJobDbo',
    ),
    'primary_key'=>array('id'),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'note'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'task_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'scheduler_task',
    		'required'=>true
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76,
    		'label'=>'scheduler_job_note'
    	),
    	'is_active'=>array(
    		'type'=>'boolean'
    	),
    	'start_seq'=>array(
    		'type'=>'int',
    		'default'=>0
    	),
    	'release_time'=>array(
    		'type'=>'varchar',
    		'length'=>512
    	),
    	'release_day'=>array(
    		'type'=>'varchar',
    		'length'=>1024
    	),
    	'time_due'=>array(
    		'type'=>'datetime'
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
