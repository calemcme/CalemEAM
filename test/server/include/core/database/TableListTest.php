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
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */ 

//Note that PHPUnit2 must be on the include path for it to work.
require_once 'PHPUnit2/Framework/TestCase.php';

if (!defined('_CALEM_DIR_')) {
	if (!isset($_ENV['CALEM_DIR'])) {
		chdir('../../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';	
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';	

/**
 * This class verifies Mysql error code for:
 * - duplication of keys or unique constraints: a) from deletion; b) from
 * 	modification
 */
class TableListTest extends PHPUnit2_Framework_TestCase {
	//Test table list
	public function testTableList() {
		$dbHandler=	CalemFactory::getDbHandler();
		$tables=$dbHandler->getDbTables();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			$vs=var_export($tables, true);
			echo "tables:", $vs, '<br>';
		}
		$this->assertTrue(is_array($tables) && count($tables)>0);
		//Make sure that all module tables are in the database
		global $_CALEM_conf;
		$modules=$_CALEM_conf['modules'];
		foreach ($modules as $module) {
			$dd=_CALEM_DIR_ . 'server/modules/'.$module.'/dd.php';
			if (!is_file($dd)) continue;
			require $dd;
			foreach ($_CALEM_dd as $table) {
				$this->assertTrue(in_array($table, $tables));
			}	
		}
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new TableListTest();
	$res->testTableList();
}
?>
