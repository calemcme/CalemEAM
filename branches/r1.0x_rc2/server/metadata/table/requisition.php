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
    'table_name'=>'requisition',
    'module'=>'modCalemReq',
    'cache_type'=>'database',
    'dbo'=>array(
    	'path'=>'server/modules/requisition/',
    	'name'=>'CalemReqDbo',
    ),
    'order_by'=>array('field'=>'due_date', 'order'=>'DESC'),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_requisition'=>array(
    		'req_no'
    	)
    ),
    'indexes'=>array(
    	'uidx_req_due_date'=>array('due_date')
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'req_no'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'req_no'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'description'=>array(
    		'type'=>'text'
    	),
    	'priority_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'req_priority'
    	),
    	'status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'req_status'
    	),
    	'req_on_po_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'req_on_po'
    	),
    	'source_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'req_source'
    	),
    	'state_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'req_state'
    	),
    	'due_date'=>array(
    		'type'=>'date',
    		'required'=>true
    	),
    	'shipping_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'shipping_type'
    	),
    	'wo_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'workorder'
    	),
    	'request_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'required'=>true
    	),
    	'request_time'=>array(
    		'type'=>'datetime',
    		'required'=>true
    	),
    	'req_total'=>array(
    		'type'=>'sys_currency'
    	),
    	'costcode_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'costcode'
    	),
    	'dept_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'dept'
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
