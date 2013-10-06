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
		'asset_id'=>'10008',
		'meter_no'=>'MOTOR-1',
		'type_id'=>'10000',
		'reading_uom_id'=>'10003',
		'reading'=>23400,
		'time_taken'=>'2006/05/01 20:00:00',
		'rollup_type_id'=>'as_mrt_none',
		'rollover_reading'=>100000,
		'rollover_count'=>0,
		'note'=>'Motor #1 odometer'
	)
);
?>
