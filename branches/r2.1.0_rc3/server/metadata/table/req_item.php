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
    'table_name'=>'req_item',
    'module'=>'modCalemReq',
    'cache_type'=>'database',
    'dbo'=>array(
    	'path'=>'server/modules/requisition/',
    	'name'=>'CalemReqItemDbo',
    ),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_requisition'=>array('req_id', 'in_id')
    ),
    'indexes'=>array(
    	'idx_req_item_in'=>array('in_id'),
    	'idx_req_item_vendor'=>array('vendor_id'),
    	'idx_req_item_po'=>array('po_id')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'req_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'requisition'
    	),
    	'in_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'inventory',
    		'required'=>true
    	),
    	'vendor_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'vendor'
    	),
    	'vendor_part_no'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'unit_cost'=>array(
    		'type'=>'sys_currency',
    		'minVal'=>0
    	),
    	'qty'=>array(
    		'type'=>'double',
    		'minVal'=>0.001,
    		'required'=>true
    	),
    	'uom_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'uom'
    	),
    	'line_cost'=>array(
    		'type'=>'sys_currency'
    	),
    	'po_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'po'
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
