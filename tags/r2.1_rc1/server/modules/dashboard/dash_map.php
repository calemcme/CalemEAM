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

/**
 * Dash map
 */

$_CALEM_dash=array();

$_CALEM_dash['dash_wo_orig_day']= array(
	  'path'=>'dashlet/wo_orig_day',
	  'class'=>'CalemDashWoOrigDayBo',
	  'data'=>'wo_orig_day_data.xml',
	  'settings'=>'server/modules/dashboard/settings/amline_settings.xml',
);

$_CALEM_dash['dash_wo_orig_md']= array(
	  'path'=>'dashlet/wo_orig_md',
	  'class'=>'CalemDashWoOrigMdBo',
	  'data'=>'wo_orig_md_data.xml',
	  'settings'=>'server/modules/dashboard/settings/amline_settings.xml',
);

$_CALEM_dash['dash_wo_status_pie']= array(
	  'path'=>'dashlet/wo_status_pie',
	  'class'=>'CalemDashWoStatusPieBo',
	  'data'=>'wo_status_pie_data.xml',
	  'settings'=>'server/modules/dashboard/settings/ampie_settings.xml',
);

$_CALEM_dash['dash_wo_age_pri']= array(
	  'path'=>'dashlet/wo_age_pri',
	  'class'=>'CalemDashWoAgePriBo',
	  'data'=>'wo_age_pri_data.xml',
	  'settings'=>'server/modules/dashboard/settings/amcolumn_settings_vert.xml',
);

?>
