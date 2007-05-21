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
	$pi=pathinfo(getcwd());
	define('_CALEM_DIR_', $pi['dirname'] . "/");
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'client/launchpad/CalemIncludeJsPkg.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/session/CalemSession.php';
	
	function addCustomInfo($path, $id, $subsets, $list) {
   	foreach ($subsets as $value) {
   		$list[]=array('id'=>$path . $id, 'ext'=>$value);	
   	}
   	return $list;
   }
   
	//Start handling the request.
	$logger=&LoggerManager::getLogger('JsPkgCustom');
	$sid=isset($_REQUEST['sessionId'])?$_REQUEST['sessionId']:null;
	$cont=false;
	if ($sid) {//Let's verify session validity
		$sesReload=CalemSession::load($sid);
		if ($sesReload) {//Found a valid session so let's grant access
		   $cont=true;
			if ($logger->isInfoEnabled()) $logger->info("Found the correct session: " . $sesReload->toString());
			$userRow=$sesReload->get('user');
			$lang=isset($_REQUEST[CALEM_PARAM_LANG])?$_REQUEST[CALEM_PARAM_LANG]:$_CALEM_conf['client_language'];
			$loadmode=isset($_REQUEST[CALEM_PARAM_LOAD_MODE])?$_REQUEST[CALEM_PARAM_LOAD_MODE]:$_CALEM_conf['client_js_load_mode'];
		}
	}
	if (!$cont) {
		$logger->error("sid=" . $sid . " not found, service not provided");
		die("Session is not valid, service is not provided.");
	}

	$path=_CALEM_DIR_ . 'custom/';
	$uid=$userRow['id'];
   $gid=$userRow['acl_group_id'];
   
   $bulk=array();
   //Adding personalized customization (form, view, search, modules, etc for OOB, custom, group and user)
   $vs=$_CALEM_conf['calem_cutsom_set'];
 
   //Getting groups data to load.
   $cache=CalemFactory::getDataCacheManager();
   $data=$cache->load('acl_group');
   $cacheList=array("CalemData['acl_group']=" . json_encode($data) . CALEM_LFCR);
   $parentGroups=$data['parentMap'][$gid];
   foreach ($parentGroups as $grp) {
   	$bulk=addCustomInfo($path . 'group/', $grp, $vs, $bulk);
   }
   //Add group self.
   $bulk=addCustomInfo($path . 'group/', $gid, $vs, $bulk);	
	//Add user self
   $bulk=addCustomInfo($path . 'user/', $uid, $vs, $bulk);
   //Add system customization: tables, dropdowns, and text
   $locale = (isset($lang) && strlen($lang)>0) ? '_' . $lang : '';
   $bulk=addCustomInfo($path . 'global/', 'custom.metadata', array('.js'), $bulk);
   $bulk=addCustomInfo($path . 'global/', 'custom.dropdown', array('.js'), $bulk);
   $bulk=addCustomInfo($path . 'global/', 'custom' . $locale . '.message', array('.js'), $bulk);
	$jsPkg=new CalemIncludeJsPkg();
	$jsPkg->downloadBulk($bulk, $cacheList);
?>