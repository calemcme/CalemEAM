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
	if (isset($_ENV['CALEM_DIR'])) {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} else {
		chdir('../..');
		define('_CALEM_DIR_', getcwd() . '/'); 
	}
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'etc/log4php.properties');
} 

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once 'CalemUpgrade.php';

$newVid=null;
$currVid=null;
if ($_SERVER['argc'] >= 3) { //Version Ids are passed in for version upgrade.
	$newVid=$_SERVER['argv'][1];
	$currVid=$_SERVER['argv'][2];
}
$upgrade=new CalemUpgrade($newVid, $currVid);
$results=$upgrade->execute();
echo "Done upgrade. \n";
echo $results;
?>
