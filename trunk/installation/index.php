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
 * This is the controller class of Calem. It's the main entrance to the
 * installation applcication.
 */ 

if (!defined('_CALEM_DIR_')) {
	define('_CALEM_DIR_', dirname(dirname(__FILE__)) . '/'); 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'etc/log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php'; //Configuration
	
	//Disable browser side cache
	//header('Cache-Control', 'no-cache');
	//Use PHP session to track installation states
	session_start();
	//Configuring log4php as part of installation
	if (!isset($_SESSION['logger'])) {
		require_once _CALEM_DIR_ . 'bin/logging/CalemLoggingSetup.php';
		try {
			CalemLoggingSetup::execute();
			$_SESSION['logger']=true;	
		} catch(Exception $e) {
			$_SESSION['logger']=false;
		}
	}
	//Get a handler on logger
	require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
	$logger=&LoggerManager::getLogger('installation');
	//Dispatch to installation controller
	require_once _CALEM_DIR_ . 'installation/form/controller/CalemInstallFront.php';
	CalemInstallFront::dispatch();
?>
