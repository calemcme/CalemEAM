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
 * This file defined the configuration for this installation by 
 * combining the custom with the distributed installation. 
 */
 
//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

$_CALEM_dist['dash_conf']=array(
	'decimal_sep'=>'.',
   'title_holder'=>'_CALEM_TITLE_',
   'decimal_holder'=>'_DECIMAL_SEP_',
	'gzip'=>true,
	'forceload'=>'forceload',
	'ttl'=>3600, //1 hr by default
	'dash_wo_orig_day'=>array(
		'limit'=>62,
		'graph_attrs'=>array(
			'woo_request'=>' axis="left" color="0xAB3C49" ',
			'woo_pm'=>' axis="left" color="0x3CAB3C" ',
			'woo_rework'=>' axis="left" color="0x4E4141" ',
			'woo_other'=>' axis="left" color="0x4C49BA" '		
		),
		'graph_attrs_default'=>' axis="left" ',
	),
	'dash_wo_status_pie'=>array(
		'ttl'=>600
	),
	'dash_wo_age_pri'=>array(
		'excludeStats'=>" ('wos_complete', 'wos_accepted', 'wos_reopen', 'wos_closed')",
		'ranges'=>array(
			7, 14, 21, 28
		),
		'series'=>array(
			'wo_age_pri_1w_less', 'wo_age_pri_1w', 'wo_age_pri_2w', 'wo_age_pri_3w', 'wo_age_pri_4w'
		),
		'nullPri'=>'wo_pri_null'
	),
	'sb'=>array(
		'path'=>'server/modules/dashboard/',
		'sname'=>'CalemDashSb'
	)
);

?>
