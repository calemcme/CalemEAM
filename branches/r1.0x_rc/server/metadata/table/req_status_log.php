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
    'table_name'=>'req_status_log',
    'module'=>'modCalemReq',
    'cache_type'=>'database',
    'primary_key'=>array(
    	'id'
    ),
    'order_by'=>array('field'=>'created_time', 'order'=>'DESC'),
    'indexes'=>array(
    	'idx_req_status_log'=>array('req_id'),
    	'idx_req_status_time'=>array('created_time')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'req_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'requisition',
    		'md'=>true
    	),
    	'from_status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'req_status'
    	), 
    	'to_status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'req_status'
    	),  
    	'from_state_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'req_state'
    	), 
    	'to_state_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'req_state'
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
