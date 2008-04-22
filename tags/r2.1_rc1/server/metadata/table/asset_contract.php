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
    'table_name'=>'asset_contract',
    'module'=>'modCalemAsset',
    'cache_type'=>'database',
    'primary_key'=>array(
    	'id'
    ),
    'order_by'=>array('field'=>'contract_id', 'order'=>'DESC'),
    'indexes'=>array(
    	'idx_asset_contract_cr'=>array('contract_id'),
    	'idx_asset_asset'=>array('asset_id')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'asset_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset',
    		'required'=>true
    	),
    	'contract_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'contract',
    		'required'=>true
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
    	),
    	'status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'contract_status'
    	),
    	'start_date'=>array(
    		'type'=>'date'
    	),
    	'end_date'=>array(
    		'type'=>'date'
    	),
    	'comment'=>array(
    	    'type'=>'text'
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
