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
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbSetup.php';

/**
 * This class tests DbSetup class by creating a test database and drop it after
 * creation.
 */
class MysqlSetupTest extends PHPUnit2_Framework_TestCase {
	
	private function dbExist($db_name, PDO $conn) {
		$exist=false;
		foreach ($conn->query('show databases', PDO::FETCH_ASSOC) as $row) {
			if ($row['Database']==$db_name) {
				$exist=true;
				break;	
			}
		}
		return $exist;
	}
	public function testMysqlSetup() {
		$logger=&LoggerManager::getLogger('testMysqlSetup');
		$dbHandler=CalemFactory::getDbHandler();
		$dbSetup=new CalemDbSetup();
		//Using a fake database for the test...
		global $_CALEM_conf;
		$backup=$_CALEM_conf['calem_db_name'];
		$userBackup=$_CALEM_conf['calem_db_user'];
		$_CALEM_conf['calem_db_name']=$backup . '_test';
		$_CALEM_conf['calem_db_user']=$userBackup . "_test";
		//Let's check if the db exists
		$conn=$dbHandler->getDatabaseAdminConnection();
		$this->assertTrue(isset($conn));
		if ($this->dbExist($_CALEM_conf['calem_db_name'], $conn)) {
			$logger->debug("db exist, so drop it first.");
			$conn->query("DROP DATABASE " . $_CALEM_conf['calem_db_name']);
		}
		$exist=$this->dbExist($_CALEM_conf['calem_db_name'], $conn);
		$this->assertTrue(!$exist);
		//Let's create database first
		$dbSetup->setupDatabaseAndUser($dbHandler, $conn);
		$logger->debug("db created.");
		$exist=$this->dbExist($_CALEM_conf['calem_db_name'], $conn);
		$this->assertTrue($exist);
		//Release the connection for admin
		$dbHandler->releaseDatabaseAdminConnection();
		//Release CalemConnection as well (from other tests)
		$dbHandler->releaseCalemConnection();
		//Let's create schema
		$conn=$dbHandler->getCalemConnection();
		$dbSetup->setupSchema($dbHandler, $conn);
		//Let's verify that workorder table is in the database
		//Adding a record to work order and select it out.
		$conn->beginTransaction();
		$inserted=$conn->exec("insert into workorder (id, wo_no) values(1, 'wo1')");
		$conn->commit();
		$logger->debug("inserted record count=". $inserted);
		$this->assertTrue($inserted==1);
		//Make sure we got this record out.
		$result=$conn->query('select count(*) from workorder where id=1');
		$cnt=$result->fetchColumn();
		$this->assertTrue($cnt==1);	
		$dbHandler->releaseCalemConnection();
		//Let's remove the database
		$conn=$dbHandler->getDatabaseAdminConnection();
		if ($this->dbExist($_CALEM_conf['calem_db_name'], $conn)) {
			$logger->debug("db exist, so drop it before test exits.");
			$conn->query("DROP USER " . $_CALEM_conf['calem_db_user'] . '@' . $_CALEM_conf['calem_db_host']);
			$conn->query("DROP DATABASE " . $_CALEM_conf['calem_db_name']);
		}
		$dbHandler->releaseDatabaseAdminConnection();
		//Make sure we restore the db name
		$_CALEM_conf['calem_db_name']=$backup;
		$_CALEM_conf['calem_db_user']=$userBackup;
		$logger->debug("MySql setup is successful!");
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new MysqlSetupTest();
	$res->testMysqlSetup();
}

?>
