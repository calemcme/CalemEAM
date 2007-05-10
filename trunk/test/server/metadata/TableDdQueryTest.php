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
		chdir('../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	}  
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';	
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';	
require_once _CALEM_DIR_ . 'server/metadata/CalemTableMap.php';

class TableDdQueryTest extends PHPUnit2_Framework_TestCase {

	public function testCraftQuery() {                          
		$rscMgr=CalemFactory::getResourceManager();
		$cDd=$rscMgr->getTableDd('craft');
		$tq=$cDd->buildGetAllQuery();
		$sql=$tq->getSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'query sql for craft: ' . var_export($sql, true) . "<br>";
		}
		$this->assertTrue(strpos($sql, ' LEFT JOIN ')>0
						&& strpos($sql, ' users1.username ')>0
						&& strpos($sql, ' users2.username ')>0
						&& strpos($sql, ' craft ')>0);
	}
	
	public function testWoTableQuery() {                          
		$rscMgr=CalemFactory::getResourceManager();
		$cDd=$rscMgr->getTableDd('workorder');
		$tq=$cDd->buildGetAllQuery();
		$sql=$tq->getSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'query sql for wo: ' . var_export($sql, true) . "<br>";
		}
		$this->assertTrue(strpos($sql, ' LEFT JOIN ')>0
						&& strpos($sql, ' users16.username ')>0
						&& strpos($sql, ' project')>0
						&& strpos($sql, ' pm')>0);
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new TableDdQueryTest();
	$res->testCraftQuery();
	$res->testWoTableQuery();
}
?>
