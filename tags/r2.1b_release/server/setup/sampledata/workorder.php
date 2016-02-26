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
		'wo_no'=>'WO-001',
		'note'=>'Clean up office',
		'asset_id'=>'10000',
		'orig_time'=>'2007-09-28 12:30:00',
		'status_id'=>'wos_open',
		'origin_id'=>'woo_request',
		'priority_id'=>'wop_p4',
		'orig_user_id'=>'1002',
		'description'=>'Standard cleanup procedure.'
	),
	array(
		'id'=>'10001',
		'wo_no'=>'WO-002',
		'note'=>'Replace air filter',
		'asset_id'=>'10000',
		'orig_time'=>'2007-10-01 12:30:00',
		'status_id'=>'wos_open',
		'origin_id'=>'woo_request',
		'priority_id'=>'wop_p4',
		'orig_user_id'=>'1003',
		'description'=>'Vent cleanup before the replacement.'
	),
	array(
		'id'=>'10002',
		'wo_no'=>'WO-003',
		'note'=>'Software upgrade for security',
		'asset_id'=>'10006',
		'orig_time'=>'2007-10-02 12:30:00',
		'status_id'=>'wos_new',
		'origin_id'=>'woo_request',
		'priority_id'=>'wop_p3',
		'orig_user_id'=>'1003',
		'description'=>'Vent cleanup before the replacement.'
	),
	
	array(
		'id'=>'10003',
		'wo_no'=>'WO-004',
		'note'=>'Firmware upgrade',
		'asset_id'=>'10006',
		'orig_time'=>'2007-09-02 12:30:00',
		'status_id'=>'wos_complete',
		'origin_id'=>'woo_request',
		'priority_id'=>'wop_p2',
		'orig_user_id'=>'1002',
		'description'=>'Frequent system reboot. Suspect firmware problem.'
	),
	array(
		'id'=>'10004',
		'wo_no'=>'WO-005',
		'note'=>'Filter replacement',
		'asset_id'=>'10008',
		'orig_time'=>'2007-09-20 12:30:00',
		'status_id'=>'wos_accepted',
		'origin_id'=>'woo_request',
		'priority_id'=>'wop_p2',
		'orig_user_id'=>'1003',
		'description'=>'Vent cleanup before the replacement.'
	),
);
?>
