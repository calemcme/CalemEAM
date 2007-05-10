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
		chdir('../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';	

class ResourceManagerTest extends PHPUnit2_Framework_TestCase {
	
	//Test resource manager
	public function testResourceManager() {
		$resourceMgr=CalemFactory::getResourceManager();
		//Test Table DD reference
		$users=$resourceMgr->getTableDd('users');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'users table name: ' . $users->getTableName() . ' <br>';
		}
		$this->assertTrue(isset($users) && strcmp($users->getTableName(), 'users')==0);
		//Test DD
		$tableMap=&$resourceMgr->getTableMap();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'toal table count: ' . $tableMap->getCount() . ' tables<br>';
		}
		$this->assertTrue(isset($tableMap) && is_array($tableMap->getTableMap()));
	}
	
	//Test resource manager
	public function testResourceManagerGetDbo() {
		$resourceMgr=CalemFactory::getResourceManager();
		//Get dbo
		$budgetDbo=CalemFactory::getDbo('budget');
		$tableName=$budgetDbo->getTableDd()->getTableName();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'budget dbo: ' . $tableName . ' <br>';
		}
		$this->assertTrue($tableName=='budget');
		//Try exception case
		try {
			$budgetDbo=CalemFactory::getDbo('budget_exception');
			$this->assertTrue(1!=1);
		} catch (Exception $e) {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo 'Got exception: ' . $e->getMessage() . ' <br>';
			}
			$this->assertTrue($e->getMessage()=='budget_exception');
		}
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new ResourceManagerTest();
	$res->testResourceManager();
	$res->testResourceManagerGetDbo();
}
?>
