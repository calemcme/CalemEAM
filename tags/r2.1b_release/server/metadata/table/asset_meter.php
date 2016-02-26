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
    'table_name'=>'asset_meter',
    'module'=>'modCalemAsset',
    'cache_type'=>'database',
    'primary_key'=>array(
    	'id'
    ),
    'order_by'=>array('field'=>'meter_no', 'order'=>'ASC'),
    'indexes'=>array(
    	'idx_asset_meter_meter_no'=>array('meter_no'),
    	'idx_asset_meter'=>array('asset_id')
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'meter_no'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'asset_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset'
    	),
    	'meter_no'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'meter_type'
    	),
    	'reading_uom_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'uom'
    	),
    	'reading'=>array(
    		'type'=>'double'
    	),
    	'is_rollover'=>array(
    		'type'=>'boolean'
    	),
    	'time_taken'=>array(
    		'type'=>'datetime'
    	),
    	'rollup_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'meter_rollup_type'
    	),
    	'rollover_reading'=>array(
    		'type'=>'double'
    	),
    	'rollover_count'=>array(
    		'type'=>'int'
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
