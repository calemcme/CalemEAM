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
//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbSetup.php';

/**
 * This class creates Calem database.
 */
class CalemCreateSchema  {
	private $logger; //Logger handle
	
	public function __construct() {
		$this->logger=&LoggerManager::getLogger('SetupCalemDatabase');
	}

	//Setup Calem DB schema
	public function setupDatabase() {
		$dbHandler=CalemFactory::getDbHandler();
		$dbSetup=new CalemDbSetup();
		//Using a fake database for the test...
		global $_CALEM_conf;
		//Let's check if the db exists
		$conn=$dbHandler->getDatabaseAdminConnection();
		try {
			//Will not drop a db by code
			if (!$dbHandler->dbExist($_CALEM_conf['calem_db_name'], $conn)) {
				$dbSetup->setupDatabaseAndUser($dbHandler, $conn);
			}
			
			//Release the connection for admin
			$dbHandler->releaseDatabaseAdminConnection();
			//Let's create schema
			$conn=$dbHandler->getCalemConnection();
			$dbSetup->setupSchema($dbHandler, $conn);
			//Let's verify that workorder table is in the database
			//Adding a record to work order and select it out.
			$conn->beginTransaction();
			$inserted=$conn->exec("insert into workorder (id, wo_no) values('1111111111-test', 'wo1')");
			$conn->commit();
			//Make sure we delete this record
			$conn->beginTransaction();
			$deleted=$conn->exec("delete from workorder where id='1111111111-test'");
			$conn->commit();
			if ($inserted==$deleted && $inserted==1) {
				$this->logger->info("setupCalemDatabase is complete. Database is successfully created");
			} else {
				throw new Exception("Error in validating database setup. workorder inserted=".$inserted . ", deleted=". $deleted);	
			}
		} catch (Exception $e) {
			$this->logger->error("Error in setting up db, error=" . $e->getMessage() );
		}
	}
	
	//Validation after db creation
	public function validate() {
		$dbSetup=new CalemDbSetup();
		$dbSetup->validate();
	}
}
?>
