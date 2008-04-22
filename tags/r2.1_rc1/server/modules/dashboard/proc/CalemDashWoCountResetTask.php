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
if (!defined('_CALEM_DIR_')) {
	chdir('../../../..');
	define('_CALEM_DIR_', getcwd() . '/');	
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'etc/log4php.properties');
}

if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemTaskInterface.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/dashboard/dashlet/wo_orig_day/CalemDashWoOrigDayBo.php';
require_once _CALEM_DIR_ . 'server/modules/dashboard/dashlet/wo_orig_md/CalemDashWoOrigMdBo.php';

/**
 * This is the Calem table DD class.
 */
class CalemDashWoCountResetTask implements CalemTaskInterface {
	
	public function execute() {		
		$dayBo=new CalemDashWoOrigDayBo();
		$mdBo=new CalemDashWoOrigMdBo();
		$woDbo=CalemFactory::getDbo('workorder');
		$woDbo->deleteBySql('delete from dash_wo_orig_day');
		$woDbo->deleteBySql('delete from dash_wo_orig_md');
		//Now recals based on wo info
		try {
			$rows=$woDbo->fetchBySql("select * from workorder");
		} catch (CalemDboDataNotFoundException $e) {
			return "No data in workorder. WO count is reset.";	
		}
		global $_CALEM_conf;
		$lastDay=strtotime($_CALEM_conf['dash_conf']['dash_wo_orig_day']['limit'] . " day ago");
		$lastSvrDay=CalemText::getServerDatetime($lastDay);
		foreach ($rows as $row) {
			$mdBo->onDataInserted_CalemWoDbo(array('baseData'=>$row));
			if ($row['orig_time']<$lastSvrDay) continue; //Too far back not considering
			$dayBo->onDataInserted_CalemWoDbo(array('baseData'=>$row));
		}
		return "WO count updated successfully.";
	}
}
?>
