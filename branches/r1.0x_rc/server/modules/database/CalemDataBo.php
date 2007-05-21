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

//required classes
require_once _CALEM_DIR_ . 'server/modules/database/CalemDataBoInterface.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/modules/database/CalemDataBoException.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDboUpdateConflictException.php';

/**
 * CalemDataBo
 */
 class CalemDataBo implements CalemDataBoInterface {
 	//logger
 	protected $logger;
	
 	/**
 	 * Construction of a DBO object
 	 * @param String table name of the Dbo
 	 * @param array the initial row value of the Dbo
 	 */
 	public function __construct() {	
 		$this->logger=&LoggerManager::getLogger("CalemDataBo");
 	} 	
 	
 	/**
 	 * Data insertion function - default implementation.
 	 */
 	public function insert($baseTable, $baseData, $customTable, $customData, $fetchSql=null) {
 		$dbo = CalemFactory::getDbo($baseTable);
 		$dbo->beginTransaction();
 		try {
 			$baseData=$dbo->beforeInsert($baseTable, $baseData, $customTable, $customData);
 			$dbo->setChangeBulk($baseData);
 			$dbo->insert();
 		} catch (Exception $ex) {
 			$errorInfo=$dbo->getErrorInfo();	
 			$dbo->rollback();
 			throw new CalemDataBoException($baseTable, $ex, $errorInfo);
 		}
 		//Custom fields
 		$id=$dbo->getId();
 		try{	
 			//Custom changes
 			if ($customTable) {
 				$customData['zc_id']=$id;
 				$customDbo=CalemFactory::getDboCustom($customTable);
 				$customDbo->setChangeBulk($customData);
 				$customDbo->insert();	
 			}
 		} catch (Exception $ex) {
 			$errorInfo=$customDbo->getErrorInfo();	
 			$dbo->rollback();
 			throw new CalemDataBoException($baseTable, $ex, $errorInfo);
 		}
 		//Finally commit.
 		try {
 			$dbo->onDataInserted($id, $baseTable, $baseData, $customTable, $customData);
 			$dbo->commit();
 			if ($fetchSql) {
 				//Now fetch data back.
 				$results=$dbo->fetchBySqlParam($fetchSql, array($dbo->getId()));
 			}
 			$feedback=array('table'=>$baseTable, 'data'=>$results[0]);
 		} catch(Exception $ex) {
 			$errorInfo=$dbo->getErrorInfo();	
 			$dbo->rollback();
 			throw new CalemDataBoException($baseTable, $ex, $errorInfo);
 		}
 		return $feedback;
 	}
	
	/**
	 * Delete function
	 * 
	 */
	public function delete($table, $id, $customTable, $customId, $recycle=true) {
 		$dbo = CalemFactory::getDbo($table);
 		try {
 			$dbo->beginTransaction();
 			$dbo->setId($id);
 			$dbo->beforeDelete();
 			$dbo->delete($recycle);
 			$feedback=array('table'=>$table, 'id'=>$id);
 		} catch(Exception $ex) {
 			$errorInfo=$dbo->getErrorInfo();	
 			$dbo->rollback();
 			throw new CalemDataBoException($table, $ex, $errorInfo);
 		}
 		
 		if ($customTable) {
 			try {
	 			$dboCustom=CalemFactory::getDboCustom($customTable);
	 			$dboCustom->setId($customId);
	 			$dboCustom->delete($recycle);	
 			} catch (CalemDboDataNotFoundException $dne) {
 				//Data does not exist for custom field, it's fine.
 			} catch (Exception $ex) {
 				$errorInfo=$dboCustom->getErrorInfo();	
 				$dbo->rollback();
 				throw new CalemDataBoException($table, $ex, $errorInfo);	
 			}
 		}
 		
 		//Now commit and return.
 		try {
 			$dbo->onDataDeleted($table, $id);
 			$dbo->commit();
		} catch (Exception $ex) {
			$errorInfo=$dbo->getErrorInfo();	
			$dbo->rollback();
			throw new CalemDataBoException($table, $ex, $errorInfo);	
		}
 		return $feedback;
 	}
 	
 	/**
 	 * Update function
 	 * <ul>
 	 * <li> Check for update conflict. To report back if conflict is detected.
 	 * <li> Perform update
 	 * </ul>
 	 */
 	public function update($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate, $fetchSql) {
 		//Base table first.
 		$dbo = CalemFactory::getDbo($baseTable);
 		try {
 			$dbo->beginTransaction();
 			$rsMgr=CalemFactory::getResourceManager();
 			if (count($baseUpdate)>0) {
	 			$tableDd = $rsMgr->getTableDd($baseTable);
	 			$baseUpdate=$dbo->beforeUpdate($baseTable, $baseCurrent, $baseUpdate);
	 			$this->updateOneTable($baseTable, $dbo, $baseCurrent['id'], $baseCurrent, $baseUpdate, $tableDd);
 			}
 			//custom table
 			if ($customTable && count($customUpdate) > 0) {
 				$dboCustom = CalemFactory::getDboCustom($customTable);
 				$tableDd = $rsMgr->getTableDdCustom($customTable);
 				$this->updateOneTable($customTable, $dboCustom, $baseCurrent['id'], $customCurrent, $customUpdate, $tableDd);
 			}
 		} catch (CalemDboUpdateConflictException $e) {
 			$dbo->rollback();
 			throw $e;
 		} catch (CalemDataBoException $ex) {
 			$dbo->rollback();
 			throw $ex;
 		} catch (Exception $ex) {
 			$errorInfo=$dbo->getErrorInfo();	
 			$dbo->rollback();
 			throw new CalemDataBoException($baseTable, $ex, $errorInfo);
 		}
 		try { //Re-fetch the server record after the change.
 			$dbo->onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate);
 			$dbo->commit();
 			if ($fetchSql) {
				$results=$dbo->fetchBySqlParam($fetchSql, array($baseCurrent['id']));
 			} else {
 				$results=array();
 			}
			$feedback=array('table'=>$baseTable, 'server'=>$results[0]);
 		} catch (Exception $ex) {
 			$errorInfo=$dbo->getErrorInfo();	
 			throw new CalemDataBoException($baseTable, $ex, $errorInfo);
 		}
 		return $feedback;
 	}
 	
 	public function updateOneTable($table, $dbo, $id, $current, $update, $tableDd) {
 		try {
 			//Now fetch data back.
 			$results=$dbo->fetchBySqlParam($dbo->getSqlFetchById(), array($id));
 			$server=$results[0];
 			$this->getUpdateConflict($current, $update, $server, $tableDd);
			//Prepare for update.
 			$dbo->setChangeBulk($update);
 			$dbo->setIdForUpdate($id);
 			$dbo->update(); //Update result.
 		} catch (CalemDboUpdateConflictException $e) {
 			throw $e;
 		} catch (Exception $ex) {
 			$errorInfo=$dbo->getErrorInfo();	
 			throw new CalemDataBoException($table, $ex, $errorInfo);
 		}
 	}
 	
 	/**
 	 * Check for conflict
 	 * For now only check for updated values.
 	 * Alternatively could just use timestamp to check for out of date values.
 	 */	
 	public function getUpdateConflict($current, $update, $server, $tableDd) {
 		$conflict=array();
 		foreach ($update as $key=>$value) {
 			//Normalize null values for comparison.
 			if ($tableDd->isNumericField($key)) {
 				$clientVal= isset($current[$key]) ? $current[$key] : 0;
 				$serverVal= isset($server[$key]) ? $server[$key] : 0;
 			} else {//None-numerical types.
 				$clientVal=$current[$key];
 				$serverVal=$server[$key];	
 			}	
 			if ($clientVal	!= $serverVal) {
				array_push($conflict, $key);
			}
 		}	
 		if (count($conflict) > 0) {
 			throw new CalemDboUpdateConflictException('UpdateConflict', $server, $conflict);	
 		}
 	}
 
 }
?>
