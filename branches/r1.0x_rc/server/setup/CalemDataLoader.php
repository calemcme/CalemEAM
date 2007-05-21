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

//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/setup/CalemDataLoadConf.php';

/**
 * This class populates the database with sample data. It assumes that the
 * database is already created with SetupCalemDatabase class.
 */
define('INSERTION', 'INSERTION');
define('UPDATE', 'UPDATE');
define('IGNORE', 'IGNORE');
define('FAILED', 'FAILED');
 
class CalemDataLoader  {
	//Logger instance
	private $logger;
	//Load conf
	private $conf;
	//dbHandler
	private $dbHandler;
	//Connection
	private $conn;
	//Statistics
	private $stats;
	//resourceMgr
	private $resourceMgr;
	
	//Construct
	public function __construct() {
		$this->logger=LoggerManager::getLogger('CalemDataLoader');
		$this->dbHandler=CalemFactory::getDbHandler();
		$this->conn=$this->dbHandler->getCalemConnection();
		$this->stats=array();
		$this->resourceMgr=CalemFactory::getResourceManager();
	}

	//Loading stats
	private function incInsertion($tableDd) {
		$this->incStats($tableDd, INSERTION);
	}
	
	private function incUpdate($tableDd) {
		$this->incStats($tableDd, UPDATE);
	}
	
	private function incIgnore($tableDd) {
		$this->incStats($tableDd, IGNORE);
	}
	
	private function incFailed($tableDd) {
		$this->incStats($tableDd, FAILED);
	}
	
	private function incStats($tableDd, $key) {
		$tb=$tableDd->getTableName();
		if (!isset($this->stats[$tb])) {
			$this->stats[$tb]=array(INSERTION =>0, UPDATE=>0, IGNORE=>0);	
		}
		$this->stats[$tb][$key]++;
	}
	
	public function getStats() {
		return $this->stats;	
	}
	
	//Update record
	public function updateRecord($tableDd, $row) {
		try {
			$dbo=CalemFactory::getDbo($tableDd->getTableName());
			$dbo->setChangeBulk($row);
			$dbo->update();
			$this->incUpdate($tableDd);
		} catch (Exception $e) {
			$this->conn->rollback();
			$this->incFailed($tableDd);
		}
	}		
	
	//Load a single file
	public function loadFile($tableDd, $file) {
		@include $file;
		if (!isset($data)) {
			$this->logger->error("No data in ".$file.' - continue loading');
			return; //No data or error in getting the data.
		}
		//Going through each row
		foreach ($data as $row) { //Loop through each row
		   //@todo to create id on the fly if needed.
		   //Use CalemDbo to do the work here.
		   $dbo=CalemFactory::getDbo($tableDd->getTableName());
		   $dbo->setChangeBulk($row);
		   try {
		   	$dbo->insert();
				$this->incInsertion($tableDd);
			} catch (Exception $e) {
				$err = $dbo->getErrorInfo();
				$this->conn->rollback();
				$this->logger->warn("error in inserting '" . $tableDd->getTableName() 
						. "', error=" . var_export($err, true) 
						. ', row=' . var_export($row, true));
				if (is_a($e, 'CalemDboDuplicateKeyException') && $this->conf->getOverwrite()) {
					//Let's try update if needed
					$this->updateRecord($tableDd, $row);	
				} else {
					$this->incIgnore($tableDd);	
				}
			}
		}
	}

	//Load sample data
	public function load(CalemDataLoadConf $loadConf) {	
		$this->conf=$loadConf;	
		//Get a handle to the global config.
		global $_CALEM_conf;
		//Verify that DB has been setup
		if (!$this->dbHandler->dbExist($_CALEM_conf['calem_db_name'], $this->conn)) {
			throw new CalemException("Database " . $_CALEM_conf['calem_db_name'] 
					. " does not exit. Please configure DB first.", 0);	
		}
		$this->dbHandler->releaseDatabaseAdminConnection();
		//Get a reference to the resource manager
 		$tableMap=$this->resourceMgr->getTableMap(); //Get list of tables.
 		$tables=$tableMap->getTableMap();
	   foreach ($tables as $table) {
	   	if ($this->logger->isDebugEnabled()) {
				$this->logger->debug("Loading data for table for $table = " . $table);	
			}
	   	$tableDd=$this->resourceMgr->getTableDd($table);
	   	//Skip some tables such as dropdown
	   	if ($this->skipTable($tableDd)) continue;
	   	
			//Loading data from multiple dataset
			$files=$loadConf->getDataList($table);
			if ($this->logger->isDebugEnabled()) {
				$this->logger->debug("files for $table = " . var_export($files, true));	
			}
			foreach($files as $file) {
				$this->loadFile($tableDd, $file);
			}
	   }	
	}
	
	public function skipTable($tableDd) {
		return ($tableDd->isDropdown());
	}
	
	//Validate a single file
	public function ValidateFile($tableDd, $file, $dbo) {
		@include $file;
		if (!isset($data)) {
			$this->logger->error("No data in ".$file.' - continue validation');
			return; //No data or error in getting the data.
		}
		$localCount=count($data);
		$dbCount=$dbo->getCountBySql('select count(*) from ' . $tableDd->getTableName());
		if ($dbCount < $localCount) throw new CalemException("Failed in table: " . $tableDd->getTableName() 
		                       . ", localCount=" . $localCount . ", dbCount=" . $dbCount);
	}
	
	/**
	 * Data loading validation
	 */
	public function validate(CalemDataLoadConf $loadConf) {	
		$this->conf=$loadConf;	
		//Get a handle to the global config.
		global $_CALEM_conf;
		//Verify that DB has been setup
		if (!$this->dbHandler->dbExist($_CALEM_conf['calem_db_name'], $this->conn)) {
			throw new CalemException("Database " . $_CALEM_conf['calem_db_name'] 
					. " does not exit. Please configure DB first.", 0);	
		}
		$this->dbHandler->releaseDatabaseAdminConnection();
		//Get a reference to the resource manager
 		$tableMap=$this->resourceMgr->getTableMap(); //Get list of tables.
 		$tables=$tableMap->getTableMap();
 		//Get a dbo handle
 		$dbo = new CalemDbo();
	   foreach ($tables as $table) {
	   	if ($this->logger->isDebugEnabled()) {
				$this->logger->debug("Validating data for " . $table);	
			}
	   	$tableDd=$this->resourceMgr->getTableDd($table);
	   	//Skip some tables such as dropdown
	   	if ($this->skipTable($tableDd)) continue;
	   	
			//Loading data from multiple dataset
			$files=$loadConf->getDataList($table);
			if ($this->logger->isDebugEnabled()) {
				$this->logger->debug("files for $table = " . var_export($files, true));	
			}
			foreach($files as $file) {
				$this->validateFile($tableDd, $file, $dbo);
			}
	   }	
	}
}
?>
