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

 
/**
 * This file defines the sample user data. This is a collection of rows.
 */
$data=array(
   array(
		'id'=>'10000',
		'in_id'=>'10000',
		'type_id'=>'itt_checkout',
		'location_id'=>'10000',
		'qty'=>3,
		'unit_cost'=>35,
		'costcode_id'=>'200',
		'checkout_type_id'=>'ict_asset',
		'checkout_to_id'=>'10000',
		'tran_total'=>95,
		'note'=>'Sample checkout transaction to asset',
		'tran_time'=>'2007/02/13 23:30:00',
		'store_user_id'=>'1000000'
	),
	array(
		'id'=>'10001',
		'in_id'=>'10000',
		'type_id'=>'itt_return',
		'location_id'=>'10000',
		'qty'=>3,
		'unit_cost'=>35,
		'costcode_id'=>'200',
		'checkout_type_id'=>'ict_asset',
		'checkout_to_id'=>'10000',
		'tran_total'=>95,
		'checkout_tran_id'=>'10000',
		'note'=>'Sample checkout transaction to asset',
		'tran_time'=>'2007/02/13 23:30:00',
		'store_user_id'=>'1000000'
	),
	
	array(
		'id'=>'10002',
		'in_id'=>'10002',
		'type_id'=>'itt_checkout',
		'location_id'=>'10000',
		'qty'=>1,
		'unit_cost'=>100,
		'costcode_id'=>'200',
		'checkout_type_id'=>'ict_asset',
		'checkout_to_id'=>'10000',
		'rent_rate'=>10,
		'tran_total'=>0,
		'note'=>'Tool checkout',
		'tran_time'=>'2007/02/13 23:30:00',
		'store_user_id'=>'1000000'
	),
	array(
		'id'=>'10003',
		'in_id'=>'10002',
		'type_id'=>'itt_return',
		'location_id'=>'10000',
		'qty'=>1,
		'unit_cost'=>35,
		'costcode_id'=>'200',
		'checkout_type_id'=>'ict_asset',
		'checkout_to_id'=>'10000',
		'checkout_tran_id'=>'10002',
		'rent_duration'=>3,
		'rent_rate'=>10,
		'tran_total'=>30,
		'note'=>'Sample checkout transaction to asset',
		'tran_time'=>'2007/02/13 23:30:00',
		'store_user_id'=>'1000000'
	),
	array(
		'id'=>'10004',
		'in_id'=>'10002',
		'type_id'=>'itt_move',
		'location_id'=>'10000',
		'qty'=>3,
		'unit_cost'=>35,
		'costcode_id'=>'200',
		'orig_loc_id'=>'10003',
		'checkout_type_id'=>'ict_asset',
		'checkout_to_id'=>'10000',
		'rent_rate'=>10,
		'tran_total'=>95,
		'note'=>'Sample checkout transaction to asset',
		'tran_time'=>'2007/02/13 23:30:00',
		'store_user_id'=>'1000000'
	),
	array(
		'id'=>'10005',
		'in_id'=>'10002',
		'type_id'=>'itt_physical',
		'location_id'=>'10000',
		'qty'=>3,
		'unit_cost'=>35,
		'costcode_id'=>'200',
		'qty_orig'=>5,
		'note'=>'Sample checkout transaction to asset',
		'tran_time'=>'2007/02/13 23:30:00',
		'store_user_id'=>'1000000'
	),
	array(
		'id'=>'10006',
		'in_id'=>'10002',
		'type_id'=>'itt_receive',
		'location_id'=>'10000',
		'qty'=>3,
		'unit_cost'=>35,
		'costcode_id'=>'200',
		'receive_type_id'=>'rcf_po',
		'receive_from_id'=>'10000',
		'qty_available'=>3,
		'tran_total'=>90,
		'note'=>'Sample checkout transaction to asset',
		'tran_time'=>'2007/02/13 23:30:00',
		'store_user_id'=>'1000000'
	),
	array(
		'id'=>'10007',
		'in_id'=>'10002',
		'type_id'=>'itt_return',
		'location_id'=>'10000',
		'qty'=>1,
		'unit_cost'=>30,
		'costcode_id'=>'200',
		'checkout_type_id'=>'ict_asset',
		'checkout_to_id'=>'10000',
		'checkout_tran_id'=>'10002',
		'rent_duration'=>3,
		'rent_rate'=>10,
		'tran_total'=>30,
		'note'=>'Sample checkout transaction to asset',
		'tran_time'=>'2007/02/13 23:30:00',
		'store_user_id'=>'1000000',
		'voided'=>1,
		'authorized_by_id'=>'1000000',
		'void_by_id'=>'1000000'
	),
	array(
		'id'=>'10008',
		'in_id'=>'10002',
		'type_id'=>'itt_receive',
		'location_id'=>'10000',
		'qty'=>3,
		'unit_cost'=>40,
		'costcode_id'=>'200',
		'receive_type_id'=>'rcf_po',
		'receive_from_id'=>'10001',
		'qty_available'=>3,
		'tran_total'=>120,
		'note'=>'Sample checkout transaction to asset',
		'tran_time'=>'2007/02/13 23:30:00',
		'store_user_id'=>'1000000'
	),
);
?>
