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
    'table_name'=>'wo_status_log',
    'module'=>'modCalemWo',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'created_time', 'order'=>'DESC'),
    'primary_key'=>array('id'),
    'indexes'=>array(
      'idx_wo_status_log_wo'=>array('wo_id'),
    	'idx_wo_status_log_time'=>array('created_time')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'wo_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'workorder',
    		'md'=>true
    	),
    	'to_status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'wo_status'
    	),
    	'from_status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'wo_status'
    	),
    	'changed_by_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'required'=>true
    	),   
    	'created_time'=>array(
    		'type'=>'datetime'
    	),
    	'comment'=>array(
    		'type'=>'text',
    		'required'=>true
    	)
    	 	
    ) //End of fields list    	
)
?>
