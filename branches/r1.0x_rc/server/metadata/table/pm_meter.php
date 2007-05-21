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
    'table_name'=>'pm_meter',
    'module'=>'modCalemPm',
    'cache_type'=>'database',
    'primary_key'=>array(
    	'id'
    ),
    'indexes'=>array(
    	'idx_pm_meter_asset'=>array(
    		'pm_asset_id'
    	),
    	'idx_pm_meter_meter'=>array(
    		'meter_id'
    	)
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'pm_asset_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'pm_asset'
    	),
    	'meter_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset_meter',
    		'required'=>true
    	),
    	'release_by_meter'=>array(
    		'type'=>'boolean'
    	),
    	'reading_released'=>array(
    		'type'=>'double'
    	),
    	'rollover_count'=>array(
    		'type'=>'int'
    	),
    	'reading_interval'=>array(
    		'type'=>'double'
    	),
    	'copy_to_wo'=>array(
    		'type'=>'boolean'
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
