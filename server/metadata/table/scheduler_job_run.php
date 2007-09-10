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
    'table_name'=>'scheduler_job_run',
    'module'=>'modCalemAdmin',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'start_time', 'order'=>'DESC'),
    'primary_key'=>array('id'),
    'indexes'=>array(
    	'idx_scheduler_job_run'=>array('start_time')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'job_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'scheduler_job',
    		'md'=>true
    	),
    	'start_time'=>array(
    		'type'=>'datetime'
    	),
    	'end_time'=>array(
    		'type'=>'datetime'
    	),
    	'time_taken'=>array(
    		'type'=>'double',
    		'label'=>'scheduler_time_taken'
    	),
    	'results'=>array(
    		'type'=>'text'
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
