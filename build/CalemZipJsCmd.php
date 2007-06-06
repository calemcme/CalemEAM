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
 * To run Calem test one must set up the following:
 * - _CALEM_DIR_
 * - _CALEM_DIR_ . 'config/calem.php' is included already.
 */ 

/** 
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */

if (!defined('_CALEM_DIR_')) {
	if (!isset($_ENV['CALEM_DIR'])) {
	chdir('..');
	define('_CALEM_DIR_', getcwd() . '/'); 
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);	
	}
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'etc/log4php.properties');
}

require_once _CALEM_DIR_ . 'build/CalemZipMetadataJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipMessageJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipJustAjaxJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipJustCalemJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipGroupUserJs.php';
require_once _CALEM_DIR_ . 'build/CalemBuildCache.php';

require_once _CALEM_DIR_ . 'build/CalemZipCustomMetadataJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipCustomDropdownJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipCustomMessageAllJs.php';

require_once _CALEM_DIR_ . 'build/CalemConvertReportBatch.php';

$tmBuild=microtime(true);
$build= (isset($_ENV['CALEM_BUILD']) && $_ENV['CALEM_BUILD']==1);

function createDir($d, $r=DIR_WRITE_RIGHTS) {
	if (!is_dir($d)) mkdir($d, $r);	
}

// -- client directories
createDir(_CALEM_DIR_ . 'logs');

createDir(_CALEM_DIR_ . 'client/launchpad/resource');

// -- server directories
createDir(_CALEM_DIR_ . 'server/cache');
createDir(_CALEM_DIR_ . 'server/cache/data');
createDir(_CALEM_DIR_ . 'server/cache/default');
createDir(_CALEM_DIR_ . 'server/cache/session');

// -- custom directories
createDir(_CALEM_DIR_ . 'custom/global');
createDir(_CALEM_DIR_ . 'custom/global/dropdown');
createDir(_CALEM_DIR_ . 'custom/global/message');
createDir(_CALEM_DIR_ . 'custom/global/metadata');

createDir(_CALEM_DIR_ . 'custom/group/CUSTOM_SYSTEM');

createDir(_CALEM_DIR_ . 'custom/user');

// -- start deployment.
echo date("F j, Y, g:i:s a") . " - Start deployment - <br>\n";
if ($build) {
   echo " - Start merging and compressing JS scripts - <br>\n";
	$ajax=new CalemZipJustAjaxJs();
	$ajax->process();
	$calemeam=new CalemZipJustCalemJs();
	$calemeam->process();
	
	$metadata=new CalemZipMetadataJs();
	$metadata->process();
	$message=new CalemZipMessageJs();
	$message->process();
		
	$groupUser=new CalemZipGroupUserJs();
	$groupUser->package();
	
	//Global custom info
	$md=new CalemZipCustomMetadataJs();
	$md->package();
	
	$md=new CalemZipCustomDropdownJs();
	$md->package();
	
	$md=new CalemZipCustomMessageAllJs();
	$md->package();
	
	//Converting report
	$tmRpt=microtime(true);
	$rpt=new CalemConvertReportBatch();
	$countRpt=$rpt->process();
	$tmRtpTaken=microtime(true)  - $tmRpt;
	$avg= ($tmRtpTaken) / ($countRpt > 0 ? $countRpt : 1);
	echo "Report converted: count=" . $countRpt . ", time=" . $tmRtpTaken . ', avg time=' . $avg . "<br>\n";
}

//Data cache building
$cacheBuilder=new CalemBuildCache();
$cacheBuilder->buildCache();

$tmTaken=microtime(true) - $tmBuild;
echo date("F j, Y, g:i:s a") . " - Completed deploy. Time: " . $tmTaken . "<br>\n";
?>
