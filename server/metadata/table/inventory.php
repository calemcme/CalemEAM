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
    'table_name'=>'inventory',
    'module'=>'modCalemIn',
    'cache_type'=>'memory',
    'order_by'=>array('field'=>'in_no', 'order'=>'ASC'),
    'dbo'=>array(
    	'path'=>'server/modules/inventory/',
    	'name'=>'CalemInDbo',
    ),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_inventory'=>array('in_no')
    ),
    'indexes'=>array(
    	'idx_inventory_costcode'=>array('costcode_id')
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'in_no'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'in_no'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76,
    	),
    	'type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_type'
    	),
    	'category_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_category'
    	),
    	'stock_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_stock_type'
    	),
    	'valuation_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_valuation_type'
    	),
    	'abc_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_abc'
    	),
    	'abc_time'=>array(
    		'type'=>'datetime'
    	),
    	'uom_id'=>array(
    		'type'=>'guid',
    		'label'=>'uom_fld',
    		'lookup'=>'uom'
    	),
    	'avg_unit_cost'=>array(
    		'type'=>'double'
    	),
    	'rent_uom_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'uom'
    	),
    	'rent_rate'=>array(
    		'type'=>'double'
    	),
    	//qty
    	'qty_in_stock'=>array(
    		'type'=>'double'
    	),
    	'qty_on_order'=>array(
    		'type'=>'double'
    	),
    	'qty_reserved'=>array(
    		'type'=>'double'
    	),
    	'qty_to_order'=>array(
    		'type'=>'double'
    	),
    	//order
    	'order_gen_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_order_gen'
    	),
    	'order_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_order_type'
    	),
    	'min_level'=>array(
    		'type'=>'double'
    	),
    	'max_level'=>array(
    		'type'=>'double'
    	),
    	'reorder_point'=>array(
    		'type'=>'double'
    	),
    	'reorder_qty'=>array(
    		'type'=>'double'
    	),
    	//owner
    	'owner_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	),
    	'notification_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_notification',
    		'label'=>'in_order_notification'
    	),
    	'costcode_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'costcode'
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
