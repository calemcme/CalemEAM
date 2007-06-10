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
    'table_name'=>'meter_transaction',
    'dbo'=>array(
    	'path'=>'server/modules/asset/',
    	'name'=>'CalemMeterTransactionDbo',
    ),
    'module'=>'modCalemAsset',
    'cache_type'=>'database',
    'primary_key'=>array(
    	'id'
    ),
    'order_by'=>array('field'=>'time_taken', 'order'=>'DESC'),
    'indexes'=>array(
    	'idx_meter_transaction_time'=>array('time_taken'),
    	'idx_meter_transaction'=>array('meter_id'),
    	'idx_meter_transaction_wo'=>array('wo_id')
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'id'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'meter_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset_meter'
    	),
    	'read_by_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'required'=>true
    	),
    	'time_taken'=>array(
    		'type'=>'datetime',
    		'required'=>true
    	),
    	'reading'=>array(
    		'type'=>'double',
    		'required'=>true
    	),
    	'is_rollover'=>array(
    		'type'=>'boolean'
    	),
    	'wo_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'workorder'
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
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
