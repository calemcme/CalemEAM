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
    'table_name'=>'in_vendor',
    'module'=>'modCalemIn',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'vendor_id', 'order'=>'ASC'),
    'dbo'=>array(
    	'path'=>'server/modules/inventory/',
    	'name'=>'CalemInVendorDbo',
    ),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_in_vendor'=>array('in_id', 'vendor_id')
    ),
    'indexes'=>array(
    	'idx_in_vendor_vendor'=>array('vendor_id')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'in_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'inventory'
    	),
    	'vendor_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'vendor',
    		'required'=>true
    	),
    	'vendor_part_no'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'is_primary'=>array(
    		'type'=>'boolean'
    	),
    	'uom_id'=>array(
    		'type'=>'guid',
    		'label'=>'uom_fld',
    		'lookup'=>'uom'
    	),
       	'unit_cost'=>array(
    		'type'=>'sys_currency'
    	),
    	'lead_time_days'=>array(
    		'type'=>'double'
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
