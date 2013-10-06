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
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'etc/log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/util/MessageToJs.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

if ($_CALEM_conf['calem_mode']!=CALEM_DEVELOPMENT) { //Check for bulk data delivery.
	die("Operation not allowed in production mode");	
}

$logger=&LoggerManager::getLogger('JsMessages');
$lang=isset($_REQUEST['lang'])?$_REQUEST['lang']:$_CALEM_conf['client_language'];
$sufix='';
if ($lang) {
	$sufix ="_" . $lang;
}
$msgdir=_CALEM_DIR_ . 'client/lang/';
if (!isset($_CALEM_conf['client_lang_list']['CalemMsg' . $sufix.'.js'])) {
	$logger->error("Invalid language: " . $lang . ", to use default language.");	
	$sufix='';
}
$mapping=$_CALEM_conf['client_lang_list']['CalemMsg' . $sufix . ".js"];
if ($logger->isDebugEnabled()) $logger->debug("fetch messages: lang=$lang; fileset=" . var_export($mapping, true));

$data="//Messages for Calem unpacked. " . CALEM_LFCR;
foreach ($mapping as $class=>$files) {
	$data .="//Message definition for " . $class . CALEM_LFCR;
   $data .='function '. $class . '() {}' . CALEM_LFCR . CALEM_LFCR;
	foreach ($files as $file) {
		$fullname=_CALEM_DIR_ . 'client/lang/' . $file . '.properties';
		$data .= MessageToJs::fileToJs($class, $fullname);
	}
}
//Done parsing messages, now decide the output mode
//Disable browser side cache
if (!headers_sent()) {
	header('Cache-Control: no-cache');
}
CalemGzip::gzStart();
print $data;
CalemGzip::gzEndFlush(false);
?>