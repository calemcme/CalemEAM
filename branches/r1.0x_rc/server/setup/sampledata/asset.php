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
   //General locations (100)
   array(
		'id'=>'10000',
		'asset_no'=>'100-001',
		'note'=>'Office area',
		'type_id'=>'100100',
		'priority_id'=>'as_pri_nonproduction',
		'status_id'=>'as_status_inservice',
		'category_id'=>'as_cat_location'
	),
	array(
		'id'=>'10001',
		'asset_no'=>'100-002',
		'type_id'=>'100100',
		'note'=>'Production area',
		'priority_id'=>'as_pri_production',
		'status_id'=>'as_status_inservice',
		'category_id'=>'as_cat_location',
	),
	array(
		'id'=>'10002',
		'asset_no'=>'100-003',
		'type_id'=>'100100',
		'note'=>'Warehouse and shipping area',
		'priority_id'=>'as_pri_nonproduction',
		'status_id'=>'as_status_inservice',
		'category_id'=>'as_cat_location',
	),
	array(
		'id'=>'10003',
		'asset_no'=>'100-004',
		'type_id'=>'100100',
		'note'=>'Raw material area',
		'priority_id'=>'as_pri_nonproduction',
		'status_id'=>'as_status_inservice',
		'category_id'=>'as_cat_location',
	),
	//Add two systems here (200)
	array(
		'id'=>'10004',
		'asset_no'=>'200-001',
		'type_id'=>'100200',
		'note'=>'Production system Mercury',
		'priority_id'=>'as_pri_production',
		'status_id'=>'as_status_inservice',
		'category_id'=>'as_cat_system',
		'location_id'=>'10001'
	),
	array(
		'id'=>'10005',
		'asset_no'=>'200-002',
		'type_id'=>'100200',
		'note'=>'Production system Saturn',
		'priority_id'=>'as_pri_production',
		'status_id'=>'as_status_inservice',
		'category_id'=>'as_cat_system',
		'location_id'=>'10001'
	),
	//Building asset (300)
	array(
		'id'=>'10006',
		'asset_no'=>'300-001',
		'type_id'=>'100300',
		'note'=>'Mercury console suite',
		'priority_id'=>'as_pri_production',
		'status_id'=>'as_status_inservice',
		'category_id'=>'as_cat_building',
		'location_id'=>'10001'
	),
	
	//Equipment (400)
	array(
		'id'=>'10008',
		'asset_no'=>'401-001',
		'note'=>'100 HP compressor #1',
		'priority_id'=>'as_pri_production',
		'status_id'=>'as_status_inservice',
		'parent_id'=>'10004',
		'type_id'=>'10000',
		'category_id'=>'as_cat_equipment',
		'location_id'=>'10001',
		'weight'=>767,
		'weight_uom_id'=>'10000',
		'serial_no'=>'AC-1000-4567890',
		'start_date'=>'2005-07-01',
		'purchase_date'=>'2005-06-01',
		'original_cost'=>5000,
		'manufacturer_id'=>'10000',
		'vendor_id'=>'10000',
		'warranty_start_date'=>'2005-06-01',
		'warranty_end_date'=>'2010-05-31',
		'rollup_cost'=>1,
		'costcode_id'=>'401',
		'dept_id'=>'500'
	),
	
	//Equipment (400)
	array(
		'id'=>'10009',
		'asset_no'=>'402-001',
		'note'=>'Water pump #1',
		'priority_id'=>'as_pri_production',
		'status_id'=>'as_status_inservice',
		'parent_id'=>'10004',
		'type_id'=>'10001',
		'category_id'=>'as_cat_equipment',
		'location_id'=>'10001',
		'weight'=>1000,
		'weight_uom_id'=>'10000',
		'serial_no'=>'WP-1780-7799-3F-01',
		'start_date'=>'2005-08-01',
		'purchase_date'=>'2005-07-01',
		'original_cost'=>100000,
		'manufacturer_id'=>'10000',
		'vendor_id'=>'10000',
		'warranty_start_date'=>'2005-09-01',
		'warranty_end_date'=>'2010-08-31',
		'rollup_cost'=>1,
		'costcode_id'=>'401',
		'dept_id'=>'500'
	)
);
?>
