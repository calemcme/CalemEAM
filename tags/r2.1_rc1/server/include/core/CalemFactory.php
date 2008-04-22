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

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';

/**
 * This is the generic class factory.
 */
 
class CalemFactory {
	
	/**
	 * DbHandler
	 */
	public static function getDbHandler() {
		return CalemFactory::getSingleton('dbHandler');
	} 
	
	/**
	 * DataCacheManager
	 */
 	public static function getDataCacheManager() {
		return CalemFactory::getSingleton('CalemDataCacheManager');
	} 
	
	/**
	 * SessionManager
	 */
 	public static function getSessionManager() {
		return CalemFactory::getSingleton('CalemSessionManager');
	} 
	/**
	 * Resource Manager singleton
	 */
	public static function getResourceManager() {
		return CalemFactory::getSingleton('CalemResourceManager');
	}
	
	/**
	 * Security BO singleton
	 */
	public static function getSecurityBo() {
		return CalemFactory::getSingleton('CalemSecurityBo');
	}
	
	//Generic handler.
	public static function getSingleton($key) {
		global $_CALEM_conf;
		require_once _CALEM_DIR_ . $_CALEM_conf[$key]['path'] . $_CALEM_conf[$key]['name'] . '.php';
		return call_user_func(array($_CALEM_conf[$key]['name'], 'getInstance'));
	}
	
	//DataBo
	public static function getDataBo($table) {
		$rsMgr = CalemFactory::getResourceManager();
		$tableDd = $rsMgr->getTableDd($table);
		$bo=$tableDd->getDataBo();
		$bo= isset($bo) ? $bo : 'CalemDataBo'; //CalemDataBo is the default.
		return CalemFactory::createInstance($bo);
	}
	
	//TableDd handy method
	public static function getTableDd($table) {
		$rsMgr = CalemFactory::getResourceManager();
		return $rsMgr->getTableDd($table);
	}
	
	/**
    * Get a dbo instance for a given table
    */
	public function getDbo($table, $row=null) {
		$rsMgr = CalemFactory::getResourceManager();
		$tableDd = $rsMgr->getTableDd($table);
		$dbo=$tableDd->getDbo();
		$dbo= isset($dbo) ? $dbo : 'CalemDbo'; //CalemDataBo is the default.
		$dboInst = CalemFactory::createInstance($dbo);
		$dboInst->initWithTableName($table, $row);
		return $dboInst;
	}
	
	public function getDboCustom($table, $row=null) { //default impl for now.
		$dbo= 'CalemDboCustom'; //CalemDataBo is the default.
		$dboInst = CalemFactory::createInstance($dbo);
		$dboInst->initWithTableName($table, $row);
		return $dboInst;
	}
	
	public function getDropdown($table) {
		$dbo= 'CalemDropdown'; 
		$dboInst = CalemFactory::createInstance($dbo);
		$dboInst->initWithTableName($table);
		return $dboInst;
	}
	
	/**
	 * Find the sql builder
	 * @param path full path of the directory, sample: '/wamp/www/calemeam/server/modules/dashboard/'
	 * @param sname - short name such as CalemDashSqlBuilder
	 * @return is the sql builder for a database such as: CalemDashSb_mysql
	 */
	public function getSb($conf) {
		$handler=self::getDbHandler();
		$fname=$conf['sname'] . '_' . $handler->getDbTypeId();
		require_once _CALEM_DIR_ . $conf['path'] . $fname . ".php";
		return new $fname;
	}
	
	public function getUidGen() {
		$dbo= 'CalemUid'; 
		$dboInst = CalemFactory::createInstance($dbo);
		return $dboInst;
	}
	
	/**
	 * Regular instance classes.
	 * @param $key - a string (name) or an array (with path and name).
	 */
	public static function createInstance($key) {
		if (!is_array($key)) {
			global $_CALEM_conf;
			$key= $_CALEM_conf[$key];
		}
		require_once _CALEM_DIR_ . $key['path'] . $key['name'] . '.php';
		return new $key['name'];
	}
}	
?>
