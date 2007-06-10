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
    'table_name'=>'asset',
    'module'=>'modCalemAsset',
    'cache_type'=>'memory',
    'primary_key'=>array(
    	'id'
    ),
    'order_by'=>array('field'=>'asset_no', 'order'=>'ASC'),
    'unique_indexes'=>array(
    	'uidx_asset_asset_no'=>array(
    		'asset_no'
    	)
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'asset_no'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'asset_no'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76,
    	),
    	'priority_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset_priority'
    	),
    	'status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset_status'
    	),
    	'parent_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset',
    		'label'=>'parent_asset'
    	),
    	'type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset_type'
    	),
    	'template_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'rcm_template'
    	),
    	'category_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset_category'
    	),
    	'location_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset',
    		'label'=>'location_asset'
    	),
    	'weight'=>array(
    		'type'=>'double',
    	),
    	'weight_uom_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'uom'
    	),
    	'serial_no'=>array(
    		'type'=>'varchar',
    		'length'=>30
    	),
    	'owner_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	),
    	'start_date'=>array(
    		'type'=>'date',
    	),
    	'purchase_date'=>array(
    		'type'=>'date',
    	),
    	'original_cost'=>array(
    		'type'=>'sys_currency'
    	),
    	'manufacturer_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'manufacturer'
    	),
    	'vendor_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'vendor'
    	),
    	'warranty_start_date'=>array(
    		'type'=>'date',
    	),
    	'warranty_end_date'=>array(
    		'type'=>'date',
    	),
    	//maintenance
    	'maint_labor_hours'=>array(
    		'type'=>'double',
    	),
    	'maint_labor_cost'=>array(
    		'type'=>'sys_currency',
    	),
    	'maint_material_cost'=>array(
    		'type'=>'sys_currency',
    	),
    	'maint_cost'=>array(
    		'type'=>'sys_currency',
    	),
    	'rollup_cost'=>array(
    		'type'=>'boolean',
    	),
    	//Codes
    	'costcode_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'costcode'
    	),
    	'dept_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'dept'
    	),
    	'in_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'inventory'
    	),
    	'depreciation_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'depreciation_type'
    	),
    	'depreciation_start'=>array(
    		'type'=>'date'
    	),
    	'depreciation_time_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'depreciation_time'
    	),
    	'depreciation_rate'=>array(
    		'type'=>'double'
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
