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
    'table_name'=>'asset_depreciation',
    'module'=>'modCalemAsset',
    'cache_type'=>'database',
    'primary_key'=>array(
    	'id'
    ),
    'order_by'=>array('field'=>'start_date', 'order'=>'DESC'),
    'indexes'=>array(
    	'idx_asset_depreciation_start'=>array('start_date'),
    	'idx_asset_depreciation'=>array('asset_id')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'asset_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset'
    	),
    	'start_date'=>array(
    		'type'=>'date',
    		'required'=>true
    	),
    	'end_date'=>array(
    		'type'=>'date',
    		'required'=>true
    	),
    	'depreciation_rate'=>array(
    		'type'=>'percent',
    		'required'=>true
    	),
    	'start_value'=>array(
    		'type'=>'sys_currency',
    		'required'=>true
    	),
    	'end_value'=>array(
    		'type'=>'sys_currency',
    		'required'=>true
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
