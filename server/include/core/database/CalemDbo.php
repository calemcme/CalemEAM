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

//required classes
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDboInterface.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';

//Exceptions for this class
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDboDuplicateKeyException.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDboDataNotFoundException.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDboNoDataException.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDboDeletionException.php';

/**
 * This is base database object (Dbo). Dbo services will provide:
 * <ul>
 * <li> DD information
 * <li> Database operations
 * </ul>
 */
 class CalemDbo implements CalemDboInterface {
 	//logger
 	protected $logger;
 	//Table definition
 	protected $tableDd;
 	protected $tableName;
 	//dbHandler
 	protected $dbHandler;
 	//Calem connection
 	protected $conn;
 	//Resource manager instance
 	protected $resourceMgr;
 	
 	/**
 	 * Each dbo has at least: a) row fieldName and value array; b) changed array
 	 * of fieldName and changed flag.
 	 */
 	protected $changed;
 	protected $row; 	
 	
	//The most recent errorInfo
	protected $errorInfo;
 	
 	/**
 	 * Construction of a DBO object
 	 * @param String table name of the Dbo
 	 * @param array the initial row value of the Dbo
 	 */
 	public function __construct() {	
 		$this->logger=&LoggerManager::getLogger("CalemDbo");
 		$this->dbHandler=CalemFactory::getDbHandler();
 		$this->conn=$this->dbHandler->getCalemConnection();
 		$this->resourceMgr = CalemFactory::getResourceManager();
 	}
 	
 	/**
 	 * Internal init.
 	 */
 	private function initInternal(array $row=null) {
 		$this->tableName=$this->tableDd->getTableName();
 		$this->row=isset($row) ? $row : array(); 	
 		$this->changed=array();
 	}
 	
 	/**
 	 * Init with tableDd looked up already.
 	 */
 	public function initWithTableDd(CalemTableDd $tableDd, array $row=null) {
 		$this->tableDd = $tableDd; 
 		$this->initInternal($row);
 	}
 	
 	/**
 	 * Init with tableName only.
 	 */
 	public function initWithTableName($tableName, array $row=null) {
 		$this->tableDd = $this->resourceMgr->getTableDd($tableName);
 		$this->initInternal($row);
 	}
 	
 	public function getTableDd() {
 		return $this->tableDd;	
 	}
 	
 	//Reset row and got rid of changes
 	public function resetRow($row) {
 		$this->row=$row;	
		$this->clearChanges();
 	}
 	
 	public function clearChanges() {
 		$this->changed=array();
 	}
 	
 	//Row setter and getter
	public function setChangeBulk($bulkChange, $clearChanges=true) {
		if ($clearChanges) $this->clearChanges();
		foreach($bulkChange as $key=>$value) {
			$this->setValue($key, $value);	
		}
	}
	
	public function setChangeBulkNoClear($bulkChange) {
		$this->setChangeBulk($bulkChange, false);
	}
	
	//Getter functions
	public function getRow() {
		return $this->row;	
	}
	
	public function getId() {
		return isset($this->row[$this->getIdName()]) ? $this->row[$this->getIdName()] : null;
	}
	public function setId($id) {
		$this->setValue($this->getIdName(), $id);
	}
	
	public function setIdForUpdate($id) {
		$this->setValue($this->getIdName(), $id, false);
	}
	
	public function getIdName() {
		return 'id';	
	}
	
	//Change it to date string only
	public function datetimeToDate($datetime) {
		$idx=strpos($datetime, ' ');
		return ($idx!==false) ? substr($datetime, 0, $idx) : $datetime;
	}
	
	/**
	 * Added a test of changed for loading data with modified and created info.
	 */
	public function setCreatedId($uid) {
		if ($this->tableDd->isField('created_id') && !$this->isChanged('created_id')) {
			$this->setValue('created_id',$uid);
		}
	}
	
	public function setModifiedId($uid) {
		if ($this->tableDd->isField('modified_id') && !$this->isChanged('modified_id')) {
			$this->setValue('modified_id', $uid);
		}
	}
	
	//Track changes
	private function setModifiedTime() {
		if ($this->tableDd->isField('modified_time') && !$this->isChanged('modified_time')) {
			$this->setValue('modified_time', $this->getCurrentGmtTime());
		} 
	}
	
	//Track changes
	private function setCreatedTime() {
		if ($this->tableDd->isField('created_time') && !$this->isChanged('created_time')) {
			$this->setValue('created_time', $this->getCurrentGmtTime());
		}
	}
	
	public function getUserId() {
		global $_CALEM_conf;
		$uid= isset($GLOBALS['calem_ses_data']['id']) ? $GLOBALS['calem_ses_data']['id'] : $_CALEM_conf['calem_default_userId'];
		return $uid;
	}
	
	//Current GMT time
	public function getCurrentGmtTime() {
		global $_CALEM_conf;
		return gmdate($_CALEM_conf['calem_datetime_format']);
	}
	
	//Generate a unique id for id field
	private function generateId() {
		$idn=$this->getIdName();
		if ($this->tableDd->isField($idn) && (!isset($this->row[$idn])||!$this->changed[$idn]) ) {
			$this->setId($this->getUid());
		}
	}
	
	//also unset changed
	public function unsetId() {
		$idn=$this->getIdName();
		if ($this->tableDd->isField($idn)) {
			unset($this->row[$idn]);	
			unset($this->changed[$idn]);
		}
	}
	
	public function getUid() {
		$uidObj=CalemFactory::getUidGen();
		return $uidObj->getUid();
	}
 	
 	//Field setter helper function
	public function setValue($name, $value, $flag=true) {
		$this->row[$name]=$value;
		$this->changed[$name]=$flag;
	}	
	
	public function getValue($name) {
		return (isset($this->row[$name]) ? $this->row[$name] : null);
	}	
	
	//Is field changed?
	protected function isChanged($name) {
		return (isset($this->changed[$name]) ? $this->changed[$name]: false);
	}
	
	//Bind all changes
	protected function bindChanges($stmt) {
		$i=1;
		foreach ($this->changed as $key=>$value) {
			if (!$value) continue; //Do not include items that are not changed.
			$val=($this->row[$key]===null || $this->row[$key]==='') ? null : $this->row[$key];
			$stmt->bindValue($i++, $val);
		}
	}
	
	//insert sql
	public function getInsertSql() {
		//Construct insert stmt.
		$insert='insert into ' . $this->tableName . ' ( ';
		$sql='values (';
		$first=true;
		foreach ($this->changed as $key=>$value) {
			if (!$value) continue;
			if ($first) {
            $insert .= ' ' . $key;
            $sql .= ' ?';
            $first=false;
         } else {
            $insert .= ', ' . $key;
            $sql .=', ?';  
         }
		}
      $insert .= ') '. $sql . ')';
      return $insert;
	}
	
	/**
	 * Adding a new record to DB
	 */
	public function insert() {
		//Checking data in the $row
		$total=count($this->changed);
		if ($total==0) {
			$this->logger->error("table=".$this->tableDd->getTableName().", id=". (isset($this->row[$this->getIdName()]) ? $this->row[$this->getIdName()] : 'null') . ", no change is made, save is ignored.");
			throw new CalemDboNoDataException($this->tableDd->getTableName());
		}
		//Generate a unique id
		$this->generateId();
		//Let's set the timestamp properly
		$this->setCreatedId($this->getUserId());
		$this->setModifiedId($this->getUserId());
		$this->setCreatedTime();
		$this->setModifiedTime();
		//Assume default values have been taken care of.
		//Construct insert stmt.
		$sql=$this->getInsertSql();
		//Prepare the stmt
		$stmt=$this->conn->prepare($sql);
		$this->bindChanges($stmt);
		$this->conn->beginTransaction();
		try {
			$stmt->execute();
			$this->conn->commit();
		} catch (Exception $e) {
			$this->errorInfo=$stmt->errorInfo();
		   $this->logger->error("Insert exception: " . $e->getMessage() . ", errorInfo: " . var_export($stmt->errorInfo(), true));
		   $this->logErrorDebug($sql);
			if ($this->dbHandler->isKeyViolation($stmt->errorCode())) {
				throw new CalemDboDuplicateKeyException($e->getMessage());	
			} else { //Other exceptions - leave to the clients.
				throw $e;
			}	
		}
		return $this->getId();
	}
	
  /**
   * Before insert
   */
  public function beforeInsert($baseTable, $baseData, $customTable, $customData) {
  		return $baseData;
  }
	
	/**
	 * Default handler after data insertion
	 */
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
	}
	
	public function beforeDelete() {
	}
	
	public function onDataDeleted($table, $id) {
	}
	
	public function beforeUpdate($baseTable, $baseCurrent, $baseUpdate) {
		return $baseUpdate;
	}
	
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
	} 
	
	/**
	 * Update sql with where clause.
	 */
	public function getUpdateSql() {
		$first=true;
      $sql="update " . $this->tableName . ' set ';
      foreach ($this->changed as $field=>$value) {
      	if (!$value) continue;
         if ($first) {
            $sql .= ' ' . $field . ' = ?';
            $first=false;
         } else {
            $sql .= ', ' . $field . ' = ?';  
         }
      }
      //Use id as the key to update this record
      $sql .= ' where ' . $this->getIdName() . " = '" . $this->getId() . "'";
      return $sql;
	}
	
	/**
	 * log error msg details
	 */
	private function logErrorDebug($sql) {
		if ($this->logger->isDebugEnabled()) {
			$this->logger->debug("errorInfo=" . var_export($this->errorInfo, true) 
			. ", sql=" . $sql . ", changes=" . var_export($this->changed, true) . ", row=" . var_export($this->row, true));
		}
	}
	
	/**
	 * Save changes of current record to database
	 */
	public function update() {
		$total=count($this->changed);
		if ($total==0) {
			$this->logger->error("table=".$this->tableDd->getTableName(). ", no changes were found, request ignored.");
			throw new CalemDboNoDataException($this->tableDd->getTableName());
		}
		//Let's set the timestamp properly
		$this->setModifiedId($this->getUserId());
		$this->setModifiedTime();
		$sql=$this->getUpdateSql();
		//Prepare the stmt
		$stmt=$this->conn->prepare($sql);
		$this->bindChanges($stmt);
		$this->conn->beginTransaction();
		try {
			$stmt->execute();
			$this->conn->commit();
		} catch (Exception $e) {
			$this->errorInfo=$stmt->errorInfo();
		   $this->logger->error("Update exception: " . $e->getMessage() . ", errorInfo: " . var_export($stmt->errorInfo(), true));
		   $this->logErrorDebug($sql);
			if ($this->dbHandler->isKeyViolation($stmt->errorCode())) {
				throw new CalemDboDuplicateKeyException($e->getMessage());	
			} else { //Other exceptions - leave to the clients.
				throw $e;
			}		
		}			
	}
	
	//Provide the last DB error info
	public function getErrorInfo() {
		return $this->errorInfo;
	}
	
	/**
	 * Fetch functions by SQL directly.
	 */
	public function fetchBySql($sql, $firstRec=false) {
		$stmt=$this->conn->prepare($sql);
		return $this->_fetchBySql($stmt, $sql, $firstRec);
	}	
	
	public function fetchById($id) {
		$rows=$this->fetchBySqlParam($this->getSqlFetchById(), $id);
		return $rows[0];
	}
	
	public function loadRecord() {//$id should have been populated.
		if (!$this->getId()) {
			$this->logger->error("table=".$this->tableDd->getTableName(). ", no id defined, request ignored.");
			throw new CalemDboNoDataException($this->tableDd->getTableName());
		}
		$this->row = $this->fetchById($this->getId());
	}
	
	public function loadRecordById($id) {//$id should have been populated.
		if (!$id) {
			$this->logger->error("table=".$this->tableDd->getTableName(). ", no id defined, request ignored.");
			throw new CalemDboNoDataException($this->tableDd->getTableName());
		}
		$this->row = $this->fetchById($id);
	}
	
	/**
	 * Core fetch function
	 */
	protected function _fetchBySql($stmt, $sql, $firstRec=false) {
		$stmt->execute();
		$rows=null;
		while ($row=$stmt->fetch()) {
			$rows[]=$row;
			if ($firstRec) break;
		}
		if ($rows==null) { //No data found
			throw new CalemDboDataNotFoundException($sql);
		}
		return $rows;	
	}	
	
	/**
	 * Fetch by params
	 */
	public function fetchBySqlParam($sql, $param) {
		if ($this->logger->isDebugEnabled()) $this->logger->debug("fetchBySqlParam: " . $sql . ", param=" . var_export($param, true));
		$stmt=$this->_prepareStatement($sql, $param);
		return $this->_fetchBySql($stmt, $sql);	
	}
	
	/**
	 * getCountBySqlParam
	 */
	public function getCountBySqlParam($sql, $param) {
		$rows=$this->fetchBySqlParam($sql, $param);
		return current($rows[0]);
	}
	
	/**
	 * getCountByRecordId
	 */
	public function getCountByRecordId($id) {
		return $this->getCountBySqlParam("select count(*) from " . $this->tableName . " where " . $this->getIdName() . "=?", $id);	
	}
	
	public function getCountBySql($sql) {
		$rows=$this->fetchBySql($sql);
		$count=current($rows[0]);
		return $count;	
	} 
	
	/**
	 * Param preparation
	 */
	protected function _prepareStatement($sql, $param) {
		$stmt=$this->conn->prepare($sql);
		$i=1;
		if (is_array($param)) {
			foreach ($param as $val) {
				$stmt->bindValue($i++, $val);
			}
		} else {
			$stmt->bindValue($i, $param);	
		}	
		return $stmt;	
	}
	
	/**
	 * Insert by SQL directly
	 */
	public function insertBySql($sql) {
		//Prepare the stmt
		$stmt=$this->conn->prepare($sql);
		$this->conn->beginTransaction();
		try {
			$stmt->execute();
			$this->conn->commit();
		} catch (Exception $e) {
			$this->errorInfo=$stmt->errorInfo();
		   $this->logger->error("Insert exception: " . $e->getMessage() . ", errorInfo: " . var_export($stmt->errorInfo(), true));
		   $this->logErrorDebug($sql);
			if ($this->dbHandler->isKeyViolation($stmt->errorCode())) {
				throw new CalemDboDuplicateKeyException($e->getMessage());	
			} else { //Other exceptions - leave to the clients.
				throw $e;
			}	
		} //Catch block.			
	}
	
	/**
	 * Update by sql param
	 */
	public function updateBySqlParam($sql, $param) {
		if ($this->logger->isDebugEnabled()) $this->logger->debug("updateBySqlParam: " . $sql . ", param=" . var_export($param, true));
		$stmt=$this->_prepareStatement($sql, $param);
		return $this->_updateBySql($stmt, $sql);	
	}
	
	/**
	 * Update By Sql directly
	 */
	public function updateBySql($sql) {
		//Prepare the stmt
		$stmt=$this->conn->prepare($sql);
		$this->_updateBySql($stmt, $sql);	
	}
	
	/**
	 * Core update function
	 */
	public function _updateBySql($stmt, $sql) {
		$this->conn->beginTransaction();
		try {
			$stmt->execute();
			$this->conn->commit();
		} catch (Exception $e) {
			$this->errorInfo=$stmt->errorInfo();
		   $this->logger->error("Update exception: " . $e->getMessage() . ", errorInfo: " . var_export($stmt->errorInfo(), true));
		   $this->logErrorDebug($sql);
			if ($this->dbHandler->isKeyViolation($stmt->errorCode())) {
				throw new CalemDboDuplicateKeyException($e->getMessage());	
			} else { //Other exceptions - leave to the clients.
				throw $e;
			}		
		}	//catch block		
	}
	
	/**
	 * FetchSqlById
	 */
	public function getSqlFetchById() {
		return 'select * from ' . $this->tableName . ' where ' . $this->getIdName() . '=?';
	}
	
	public function getSqlDeleteById() {
		return 'delete from ' . $this->tableName . ' where ' . $this->getIdName() . '=?';
	}
	
	/**
	 * delete current record - optionally placing in recycle-bin.
	 */	
	public function delete($recycle=false) {
		if ( $this->getId()==null ) {
			$this->logger->error("table=".$this->tableDd->getTableName(). ", no id defined, request ignored.");
			throw new CalemDboNoDataException($this->tableDd->getTableName());
		}
		$this->deleteById($this->getId(), $recycle);
	}
	
	public function deleteById($id, $recycle=false) {
		$sql=$this->getSqlDeleteById();
		$stmt=$this->_prepareStatement($sql, $id);
		$this->_deleteBySql($stmt, $sql, $recycle);
	}
	
	public function deleteBySql($sql, $recycle=false) {
		$stmt=$this->conn->prepare($sql);
		$this->_deleteBySql($stmt, $sql);
	}
	
	public function deleteBySqlParam($sql, $param, $recycle=false) {
		$stmt=$this->_prepareStatement($sql, $param);
		$this->_deleteBySql($stmt, $sql, $recycle);
	}
	
	public function _deleteBySql($stmt, $sql, $recycle=false) {
		if ($recycle) { //Fetch data first.
			$rows = $this->fetchBySqlParam($this->getSqlFetchById(), $this->getId());
		}
		$this->conn->beginTransaction();
		try {
			$stmt->execute();
			//add to recycle-bin
			if ($recycle) {
				$rbDbo=CalemFactory::getDbo("recycle_bin");
				$rbDbo->setDeletedInfo($this->tableName, $rows[0], $this->getIdName());
				$rbDbo->setDescription('CalemDbo');
				$rbDbo->insert();	
			}			
			$this->conn->commit();
		} catch (CalemDboDuplicateKeyException $dk) {
			throw $dk;
		} catch (Exception $e) {
			$this->errorInfo=$stmt->errorInfo();
			$this->logger->error("Deletion exception: " . $e->getMessage() . ", errorInfo: " . var_export($stmt->errorInfo(), true));
			$this->logErrorDebug($sql);
			throw new CalemDboDeletionException($e->getMessage());	
		}	
	}
		
	/**
	 * Execute DDL
	 */
	public function executeDDL($sql) {
		$this->executeBySql($sql);
	}
	
	public function executeBySql($sql) {
		$stmt=$this->conn->prepare($sql);
		$this->_executeBySql($stmt, $sql);
	}
	
	public function executeBySqlParam($sql, $param) {
		if ($this->logger->isDebugEnabled()) $this->logger->debug("Execute Sql: " . $sql . ", param=" . var_export($param, true));
		$stmt=$this->_prepareStatement($sql, $param);
		$this->_executeBySql($stmt, $sql);
	}

	public function _executeBySql($stmt, $sql) {
		try {
			$stmt->execute();
		} catch (Exception $e) {
			$this->errorInfo=$stmt->errorInfo();
		   $this->logger->error("Execute exception: " . $e->getMessage() . ", errorInfo: " . var_export($stmt->errorInfo(), true));
		   $this->logErrorDebug($sql);
			if ($this->dbHandler->isKeyViolation($stmt->errorCode())) {
				throw new CalemDboDuplicateKeyException($e->getMessage());	
			} else { //Other exceptions - leave to the clients.
				throw $e;
			}		
		}	//catch block		
	}	
	
	/**
	 * Transactions
	 */
   public function beginTransaction() {
   	$this->conn->beginTransaction();	
   }
   
   public function rollback() {
   	$this->conn->rollback();
   }
   
   public function commit() {
   	$this->conn->commit();
   }

	public function inTransaction() {
		return $this->conn->inTransaction();	
	}
 
 }
 
?>
