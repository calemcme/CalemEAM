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
    'table_name'=>'wo_generation',
    'module'=>'modCalemWo',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'modified_time', 'order'=>'DESC'),
    'primary_key'=>array(
    	'id'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'wo_gen_status'
    	),
    	'to_date'=>array(
    		'type'=>'date'
    	),
    	'wo_count'=>array(
    		'type'=>'int'
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
    	),
    	'modified_time'=>array(
    		'type'=>'datetime',
    		'label'=>'wogen_end_time'
    	),
    	'created_time'=>array(
    		'type'=>'datetime',
    		'label'=>'wogen_start_time'
    	),
    	'created_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'label'=>'wogen_user_id'
    	)    	
    ) //End of fields list    	
)
?>
