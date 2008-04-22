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
		'id'=>'1',
		'title_id'=>'2',
		'budget'=>'Q1-2006',
		'start_date'=>'2006-01-01',
		'end_date'=>'2006-03-31',
		'budgeted'=>56000,
		'app'=>50000,
		'accounting'=>75000,
		'state_id'=>'budget_state_open'
	),
	array(
		'id'=>'2',
		'title_id'=>'2',
		'budget'=>'Q2-2006',
		'start_date'=>'2006-04-01',
		'end_date'=>'2006-06-30',
		'budgeted'=>20000,
		'app'=>15000,
		'accounting'=>17000,
		'state_id'=>'budget_state_open'
	),
	array(
		'id'=>'3',
		'title_id'=>'2',
		'budget'=>'Q3-2006',
		'start_date'=>'2006-07-01',
		'end_date'=>'2006-09-30',
		'budgeted'=>100000,
		'app'=>99000,
		'accounting'=>120000,
		'state_id'=>'budget_state_open'
	),
);
?>
