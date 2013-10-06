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
    'table_name'=>'po',
    'module'=>'modCalemPo',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'po_no', 'order'=>'DESC'),
    'dbo'=>array(
    	'path'=>'server/modules/purchase/',
    	'name'=>'CalemPoDbo',
    ),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_po'=>array(
    		'po_no'
    	)
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'po_no'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'po_no'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'status_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'po_status'
    	),
    	'state_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'po_state'
    	),
    	'buyer_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'required'=>true
    	),
    	'buyer_name'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'buyer_phone'=>array(
    		'type'=>'varchar',
    		'length'=>24
    	),
    	'po_date'=>array(
    		'type'=>'date'
    	),
    	'next_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    		'label'=>'po_next_user'
    	),
    	'next_note'=>array(
    		'type'=>'varchar',
    		'length'=>76,
    		'label'=>'po_next_note'
    	),
    	'vendor_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'vendor',
    		'required'=>true
    	),
    	'vendor_addr'=>array(
    		'type'=>'varchar',
    		'length'=>512
    	),
    	'vendor_contact_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'contact'
    	),
    	'vendor_contact_phone'=>array(
    		'type'=>'varchar',
    		'length'=>24
    	),
    	'payment_term_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'payment_term'
    	),
    	'shipping_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'shipping_type'
    	),
    	'shipping_term_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'shipping_term'
    	),
    	'shipping_addr_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'po_address',
    		'required'=>true
    	),
    	'billing_addr_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'po_address',
    		'required'=>true
    	),
    	'po_item_total'=>array(
    		'type'=>'sys_currency'
    	),
    	'tax_rate_total'=>array(
    		'type'=>'percent'
    	),
    	'tax_charge'=>array(
    		'type'=>'sys_currency'
    	),
    	'total_charge'=>array(
    		'type'=>'sys_currency'
    	),
    	'comment'=>array(
    		'type'=>'text',
    		'label'=>'po_comment'
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
