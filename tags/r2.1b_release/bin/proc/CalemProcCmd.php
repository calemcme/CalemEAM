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
	if (getenv('CALEM_DIR')) {
		define('_CALEM_DIR_', getenv('CALEM_DIR'));
	} else {
		chdir('../..');
		define('_CALEM_DIR_', getcwd() . '/'); 
	}
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'etc/log4php.properties');
} 

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/modules/admin/CalemScheduler.php';

$_CALEM_procs=array(
	'countReset'=>array(
		'path'=>'server/modules/dashboard/proc/',
		'class'=>'CalemDashWoCountResetTask'
	)
);

if ($_SERVER['argc'] < 2) {
	echo "Supply one of the procs below to run the test: \n";
	foreach ($_CALEM_procs as $proc=>$data) {
		echo $proc . "\n";
	}
	return;
}

for ($i=1; $i < $_SERVER['argc']; $i++) {
	$proc=$_SERVER['argv'][$i];
	if (!$_CALEM_procs[$proc]) {
		echo "Invaid proc: " . $proc . ". Run the command without parameter to list available procs\n";
		continue;
	}
	$entry=$_CALEM_procs[$proc];
	require_once _CALEM_DIR_ . $entry['path'] . $entry['class'] . ".php";
	$cls=new $entry['class'];
	$rtn=$cls->execute();
	echo "Executed " . $proc . ", results: " . $rtn . "\n";
}
?>
