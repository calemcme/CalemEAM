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
 * This is the dbo listeners map
 */
 
//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

$_DBO_listener_map=array(
	'CalemWoDbo'=>array(
	   'onDataInserted'=>array(
	   	'dash_wo_orig_day',
	   	'dash_wo_orig_md'
	   ),
		'onDataUpdated'=>array(
			'dash_wo_orig_day',
	   	'dash_wo_orig_md'
		),
		'onDataDeleted'=>array(
			'dash_wo_orig_day',
	   	'dash_wo_orig_md'
		),
	),
	'listeners'=>array(
			'dash_wo_orig_md'=>array(
	   		'path'=>'server/modules/dashboard/dashlet/wo_orig_md',
	   		'class'=>'CalemDashWoOrigMdBo'
	   	),
	   	'dash_wo_orig_day'=>array(
				'path'=>'server/modules/dashboard/dashlet/wo_orig_day',
				'class'=>'CalemDashWoOrigDayBo'
			)		
		)		
);

//custom version of it
@include_once _CALEM_DIR_ . 'server/conf/dbo_listener_map.custom.php';
?>
