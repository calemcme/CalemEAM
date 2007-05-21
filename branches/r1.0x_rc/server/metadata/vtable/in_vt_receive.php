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
    'table_name'=>'in_vt_receive',
    'module'=>'modCalemIn',
    'cache_type'=>'memory',
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'		
    	),
    	'in_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'inventory'
    	),
    	'po_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'po',
    		'required'=>true
    	),
    	'receipt_no'=>array(
    		'type'=>'guid',
    		'required'=>true
    	),
    	'receive_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_receive_from'
    	),
    	'qty'=>array(
    		'type'=>'double',
    		'required'=>true,
    		'label'=>'qty_to_receive',
    		'minVal'=>0.001
    	),
    	'unit_cost'=>array(
    		'type'=>'sys_currency',
    		'required'=>true
    	),
    	'uom_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'uom'
    	),
    	'costcode_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'costcode',
    		'required'=>true
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
    	),
    	'tran_time'=>array(
    		'type'=>'datetime',
    		'required'=>true
    	),
    	'tran_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'required'=>true
    	),
    	'store_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'required'=>true
    	)
    )
)
?>
