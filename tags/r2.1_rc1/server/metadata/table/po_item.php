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
    'table_name'=>'po_item',
    'module'=>'modCalemPo',
    'cache_type'=>'database',
    'dbo'=>array(
    	'path'=>'server/modules/purchase/',
    	'name'=>'CalemPoItemDbo',
    ),
    'order_by'=>array('field'=>'line_no', 'order'=>'ASC'),
    'primary_key'=>array(
    	'id'
    ),
    'indexes'=>array(
    	'idx_po_items_po'=>array('po_id'),
    	'idx_po_items_in'=>array('in_id'),
    	'idx_po_items_line_no'=>array('line_no')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'line_no'=>array(
    		'type'=>'int',
    		'required'=>true
    	),
    	'po_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'po'
    	),
    	'in_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'inventory',
    		'required'=>true
    	),
    	'vendor_part_no'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
    	),
    	'unit_cost'=>array(
    		'type'=>'sys_currency'
    	),
    	'qty'=>array(
    		'type'=>'double'
    	),
    	'qty_received'=>array(
    		'type'=>'double'
    	),
    	'uom_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'uom'
    	),
    	'due_date'=>array(
    		'type'=>'date'
    	),
    	'line_cost'=>array(
    		'type'=>'sys_currency'
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
