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
    'table_name'=>'in_tran',
    'module'=>'modCalemIn',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'tran_time', 'order'=>'DESC'),
    'primary_key'=>array(
    	'id'
    ),
    'indexes'=>array(
    	'idx_in_tran_in'=>array('in_id','type_id', 'voided'),
    	'idx_in_tran_checkout_to_id'=>array('checkout_to_id', 'checkout_type_id', 'voided'),
    	'idx_in_tran_receive_from'=>array('receive_from_id', 'receive_type_id', 'voided'),
    	'idx_in_tran_tran_time'=>array('tran_time')
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'note',
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'in_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'inventory'
    	),
    	'type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_tran_type',
    	),
    	'location_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_location'
    	),
    	'qty'=>array(
    		'type'=>'double'
    	),
    	'unit_cost'=>array(
    		'type'=>'sys_currency'
    	),
    	'costcode_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'costcode'
    	),
    	'checkout_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_checkout_to'
    	),
    	'checkout_to_id'=>array(
    		'type'=>'guid'
    	),
    	'receive_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_receive_from'
    	),
    	'receive_from_id'=>array(
    		'type'=>'guid'
    	),
    	'qty_available'=>array(
    		'type'=>'double'
    	),
    	'qty_orig'=>array(
    		'type'=>'double'
    	),
    	'orig_loc_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'in_location'
    	),
    	'checkout_tran_id'=>array(
    		'type'=>'guid'
    	),
    	'rent_duration'=>array(
    		'type'=>'double'
    	),
    	'rent_rate'=>array(
    		'type'=>'double'
    	),
    	'tran_total'=>array(
    		'type'=>'sys_currency'
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
    	),
    	'tran_time'=>array(
    		'type'=>'datetime'
    	),
    	'tran_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	),
    	'store_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	),
    	//Transaction voided info
    	'voided'=>array(
    		'type'=>'boolean'
    	),
    	'authorized_by_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	),
    	'void_by_id'=>array(
    		'type'=>'guid',
			'lookup'=>'users'
    	),
    	'void_time'=>array(
    		'type'=>'datetime'
    	),
    	'void_note'=>array(
    		'type'=>'varchar',
    		'length'=>76
    	),
    	'new_tran_id'=>array(
    		'type'=>'guid'
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
