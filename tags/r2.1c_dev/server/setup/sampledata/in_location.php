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
		'location'=>'MAIN-STORE',
		'note'=>'Main store for receiving parts/tools.'
	),
	array(
		'id'=>'10001',
		'location'=>'TC-PROD',
		'parent_id'=>'10000',
		'note'=>'Production tool crib area '
	),
	array(
		'id'=>'10002',
		'location'=>'TC-PROD-S1',
		'parent_id'=>'10001',
		'note'=>'Shelf 1 of production tool crib'
	),
	array(
		'id'=>'10003',
		'location'=>'TC-PROD-L4',
		'parent_id'=>'10001',
		'note'=>'Lot 4 of production tool crib'
	),
	array(
		'id'=>'10004',
		'location'=>'MS-B3',
		'parent_id'=>'10000',
		'note'=>'Bin 3 of main store'
	)
);
?>
