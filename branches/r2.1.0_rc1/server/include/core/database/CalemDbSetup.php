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
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);
	
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbHandlerInterface.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';

/**
 * This is the database access object for Calem Suite. The DBO performs:
 * <ul>
 * <li> Database connection management </li>
 * <li> DDL construction based on common dd definition </li>
 * <li> DML construction based on common dd defintion </li>
 * </ul>
 * 
 */
 class CalemDbSetup {
 	//This is the logger
 	private $logger;
 	
 	//Constructor
 	public function __construct() {
 		$this->logger=&LoggerManager::getLogger('CalemDbSetup');
 	}
 	
 	/**
 	 * Generating scripts for database and user setup
 	 */
 	public function getDatabaseAndUserScript(CalemDbHandlerInterface $dbHandler, PDO $conn) {
 		global $_CALEM_conf;
 		$database=array();
 		if (!$dbHandler->dbExist($_CALEM_conf['calem_db_name'], $conn)) {
 		$database[]=$dbHandler->getCreateDatabase();
		}
 		if (!$dbHandler->userExist($_CALEM_conf['calem_db_user'], $conn)) {
 		$database[]=$dbHandler->getCreateUser();
 		$database[]=$dbHandler->getCreateGrantPrivileges();
 		}
 		return $database;
 	}
 	
 	/**
 	 * Generating scripts for schema
 	 */
 	public function getSchemaScript(CalemDbHandlerInterface $dbHandler) {
 		//Get a reference to the resource manager
 		$resourceMgr=CalemFactory::getResourceManager();
 		//Let's working on SQL scripts for each module
 		$schema=array();
 		//Generating db scripts first
 		$tbMap=$resourceMgr->getTableMap();
 		$tableMap=$tbMap->getTableMap();
	   foreach ($tableMap as $table) {
	   	$ar=$this->getTableScript($dbHandler, $table);
	   	$schema=array_merge($schema, $ar);
		} //for Each table
		return $schema;
 	}
 	
 	public function getTableScript($dbHandler, $table) {
 		$schema=array();
	   	//Get table DD
   	$tbDd=CalemFactory::getTableDd($table);
	   	//Dropdown not to store in db for this time.
   	if ($this->skipCreateInDb($tbDd)) return $schema;
	   $tbDef=$tbDd->getTableDef();
	   	//Let's create the table script first so that a table is created before its constraints
   	$schema[]=$dbHandler->getCreateTable($tbDef);
			//Next, let's add script for primary key and indexes
		foreach ($tbDef as $key => $value) {
				switch ($key) {
					case 'fields':
						break;
					case 'primary_key':
					$schema[]=$dbHandler->getCreatePrimaryKey($tbDef['table_name'],
									$tbDef['table_name'].'_'.$key, $value);
						break;
					case 'unique_indexes':
					$indexes=$tbDef['unique_indexes'];
						foreach ($indexes as $index=>$field_list) {
						$schema[]=$dbHandler->getCreateUniqueIndex($tbDef['table_name'],
											$index, $field_list);
						};
						break;
					case 'indexes':
					$indexes=$tbDef['indexes'];
						foreach ($indexes as $index=>$field_list) {
						$schema[]=$dbHandler->getCreateIndex($tbDef['table_name'],
											$index, $field_list);
						};
						break;
				}	
			} //Each category of the DD
		return $schema;
		} //for Each table
 	
 	public function skipCreateInDb($tbDd) {
 		return $tbDd->isDropdown();
 	}
 	
 	/**
 	 * Setup database and user first
 	 */
 	public function setupDatabaseAndUser(CalemDbHandlerInterface $dbHandler, PDO $conn) {
 		$sql=$this->getDatabaseAndUserScript($dbHandler, $conn);
 		if (count($sql) > 0) {
 			$this->runSqlScriptArray($conn, $sql);
 		}
 	}
 	
 	/**
 	 * Generating 
 	 */
 	public function setupSchema(CalemDbHandlerInterface $dbHandler, PDO $connection) {
 		$sql=$this->getSchemaScript($dbHandler);
 		$this->runSqlScriptArray($connection, $sql);
 	}
 	
 	/**
 	 * Executing SQL script one by one.
 	 */
 	public function runSqlScriptArray(PDO $conn, array $sqlScripts) {
 		$results='';
 		//Also need to set a time limit so we can wait till all script is completed.
 		set_time_limit(0);
 		foreach ($sqlScripts as $sql) {
 			try {
 				$conn->query($sql);
 				$results .= 'Executed sql: ' . $sql . "\n";
 			} catch (Exception $e) {
 				$this->logger->error($e->getMessage() . ', executing sql='. $sql);
 				$results .= 'Executed sql: ' .$sql . " with exception: " . $e->getMessage() ."\n";
 			}
 		}
 		return $results;
 	}
 	
 	/**
 	 * Validate that all the tables are in the database
 	 */
 	public function validate() {
 		global $_CALEM_conf;
 		$dbo=new CalemDbo();
 		$tbls=$dbo->fetchBySql("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = '" 
 	                        . $_CALEM_conf['calem_db_name'] . "'");
 		//Get tableMap
 		$resourceMgr=CalemFactory::getResourceManager();
 		$tbMap=$resourceMgr->getTableMap();
 		$tableMap=$tbMap->getTableMapNoDropdown($resourceMgr);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("tableMap count=" . count($tableMap) . ", schema count=" . count($tbls));
 		if (count($tableMap) > count($tbls)) {
 			$this->logger->error("Some tables not in database: dbCount=" . count($tbls) . ", localCount=" . count($tableMap), 0); 
 		}
		//Let's validate by name here
		$schema=array();
		foreach ($tbls as $val) {
			$schema[]=$val['table_name'];
		}
		$missing=array();
		$missingIdx=array();
		foreach ($tableMap as $table) {
			if (array_search($table, $schema)===false) {
				$missing[]=$table;	
			}
			//Verify missing index
			try {
				$idxDb=$this->getIndexByDb($table, $dbo);
				$tblDd=$resourceMgr->getTableDd($table);
				$idx=$this->getIndexByTable($tblDd);
				$ar=$this->arrayDiff($idx, $idxDb);
				if (count($ar) > 0) {
					$missingIdx = array_merge($missingIdx, $ar);
				}
			} catch (CalemDboDataNotFoundException $e) {
				continue;	
			}
		} 	
		if (count($missing)>0 || count($missingIdx) > 0)  {
			$this->logger->error("Missing items in database: missingTables=" . var_export($missing, true) . ", missingIndexes=". var_export($missingIdx, true));
			throw new CalemException("Missing tables in database: " . var_export($missing, true) . ", missinIndexes=" . var_export($missingIdx, true), 0);
		}	                                                             		                                                             
 	}
 	
 	private function arrayDiff($idx, $idxDb) {
 		$rtn=array();
 		if ($idx!=null) {
	 		foreach ($idx as $val) {
	 			if (array_search($val, $idxDb)===false) {
	 				$rtn[]=$val;
	 			}	
	 		}
	 		if ($this->logger->isDebugEnabled()) $this->logger->debug("idx=". var_export($idx, true). ", idxDb=" . var_export($idxDb, true) . ", result=" . var_export($rtn, true)); 
 		}
 		return $rtn;	
 	}
 	
 	private function getIndexByDb($table, $dbo) {
 		$idxes=$dbo->fetchBySql("show index from " . $table);
 		$rtn=array();
 		foreach ($idxes as $key=>$rec) {
 			$rtn[]=$rec['Key_name'];
 		}	
 		return $rtn;
 	}
 	
 	private function getIndexByTable($tblDd) {
 		$idx=array();
		$ar=$tblDd->getUniqueIndexes();
		if (count($ar) > 0) {
			$idx=array_merge($idx, $ar);
		}
		$ar=$tblDd->getIndexes();
		if (count($ar) > 0) {
			$idx=array_merge($idx, $ar);
		}
		return array_keys($idx);
 	}
 	
 }
