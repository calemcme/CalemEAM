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
 * applcication.
 */ 

if (!defined('_CALEM_DIR_')) {
	define('_CALEM_DIR_', getcwd() . '/'); 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'etc/log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php'; //Configuration
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php'; //Logger
require_once _CALEM_DIR_ . 'server/include/core/session/CalemSession.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemExit.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemMsg.php';
	
	//Disable browser side cache
	header('Cache-Control', 'no-cache');
	//Start handling the request.
	$logger=&LoggerManager::getLogger('main');
	$sid=isset($_REQUEST['sessionId'])?$_REQUEST['sessionId']:null;
	if ($logger->isDebugEnabled()) {
		require_once _CALEM_DIR_ . 'server/include/util/CalemHttpHelper.php';
		$logger->debug("sid=$sid; aid=" . $_REQUEST['aid']. ", Post data: " . CalemHttpHelper::getPostData());
	}
	$action=isset($_REQUEST['calemAction']) ? $_REQUEST['calemAction'] : null;
	//This is the only action supported so far so make it simple at this point.
	if ($action) {
		$succ=false;
		$lang=$_REQUEST[CALEM_PARAM_LANG];
		if (!$lang) $lang=$_CALEM_conf['client_language'];
		if ($action=='LoginAction') {
			setCookie('CALEM_LANG', $_REQUEST[CALEM_PARAM_LANG], time()+$_CALEM_conf['setting_cookie_expire']);
			$login_username=$_REQUEST['username'];	
			$login_password=$_REQUEST['password'];
			require_once _CALEM_DIR_ . 'server/modules/admin/soap/CalemLoginSo.php';
			$ex='';
			try {
				list($succ, $ses)=CalemLoginSo::doLogin($login_username, $login_password);
			} catch (Exception $e) {
				$ex=$e->getTraceAsString();
				$logger->error("Exception in processing login. Error msg=" . $ex);
			}
			$loginErrorText= CalemMsg::getMsg('soap_InvalidLogin');
		} else {
			$loginErrorText=CalemMsg::getMsg("login_reqd");
		}
		if (!$succ) {
			require _CALEM_DIR_ . $_CALEM_conf['noses_allowed_actions']['LoginAction'];
			//Close down logger
			CalemExit::exitCalem();
		}
		//Set the sid
		$sid=$ses->getSid();	
	}
	$hasCookie=false;
	if (!$sid) { //Check for cookie
		$calemSid=isset($_COOKIE['CALEM_SID']) ? $_COOKIE['CALEM_SID'] : null;
		if ($calemSid) {
			$hasCookie=true;
			$jsonCookie=base64_decode($calemSid);
			require_once _CALEM_DIR_ . 'server/include/JSON/JSON.php'; //Pear's JSON
			$json = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
			$phpo=$json->decode($jsonCookie);
			if ($logger->isDebugEnabled()) $logger->debug("CALEM_SID passed in: " . var_export($phpo, true));
			$sid=$phpo['sid'];	
		}
	}
	
	if ($sid) {//Let's verify session validity
		$sesReload=CalemSession::load($sid);
		if ($sesReload) {//Found a valid session so let's grant access
			$GLOBALS['calem_ses_data']=$sesReload->get('user');
			if ($logger->isInfoEnabled()) $logger->info("Found the correct session: " . $sesReload->toString());
			//setup session info.
			$si=$sesReload->get('setting');		
			$lang=$si['lang'];	
   		$theme = $si['theme'];
   		$loadmode=$si['loadmode'];
		}
	}
	//If session is valid load the application
	if ($sesReload) {
		$launch= isset($_REQUEST['aid']) ? $_CALEM_conf[$_REQUEST['aid']] : $_CALEM_conf['ses_launch_app'];
		//Place a cookie to remember the session Id.
		if (!$hasCookie) {
			$userRow=$sesReload->get('user');  
			$locale = $lang ? $lang : NULL_LOCALE; 
			$cookieValue="{sid: '" . $sid . "', gid: '" . $userRow['acl_group_id'] . "', uid: '" . $userRow['id'] . 
	                     "', uname: '" . $userRow['username'] . "', full_name: '" . $userRow['full_name'] . "', admin_type_id: '" . 
	                     $userRow['admin_type_id'] . "', locale: '" . $locale . 
	                     "', team_id: '" . $userRow['team_id'] . "'}";
			if ($logger->isDebugEnabled()) $logger->debug("Cookie set to: " . $cookieValue);	                     
			setCookie('CALEM_SID', base64_encode($cookieValue));
		}
	} else {
		if (isset($_REQUEST['aid'])) {
			$logger->error('Session expired, need to log in first, aid=' . $_REQUEST['aid']);
			die("Session expired. Please login first.");	
		}
		$action=$_CALEM_conf['default_noses_action'];
		$launch=isset($_CALEM_conf['noses_allowed_actions'][$action])
				?$_CALEM_conf['noses_allowed_actions'][$action]
				:$_CALEM_conf['noses_allowed_actions'][$_CALEM_conf['default_noses_action']];
	}
	if ($logger->isInfoEnabled()) $logger->info("Received request to launch: " . $launch . ", aid=".$_REQUEST['aid']);
	require_once _CALEM_DIR_ . $launch;				
	//Close down logger
	CalemExit::exitCalem(); 
?>
