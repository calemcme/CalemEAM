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

require_once _CALEM_DIR_ . 'server/include/core/CalemWsFacade.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';

/**
 * This class handle data insertion.
 */
class CalemDataSo extends CalemWsFacade {
	
	public function __construct() {
		parent::__construct();	
	}
	
	/**
	 * Modify data transaction (multiple update, insert, delete passed in)
	 */
	public function ModifyDataTran() {
		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Invoking ModifyDataTran, param=" . var_export($param, true));
 		$result=array();
 		//Start a transaction
 		$dbHdlr=CalemFactory::getDbHandler();
 		$conn=$dbHdlr->getCalemConnection();
		$conn->beginTransaction();
 		if (isset($param->UpdateData)) {
 			$result['UpdateDataResponse']=$this->processUpdateData($param->UpdateData);
 			if ($result['UpdateDataResponse'][0]['status']!=0) {
 				$result['TranResponse']=$result['UpdateDataResponse'][0];
 				return $result;	
 			}	
 		}
 		
 		if (isset($param->InsertData)) {
 			$result['InsertDataResponse']=$this->processInsertData($param->InsertData);
 			if ($result['InsertDataResponse'][0]['status']!=0) {
 				$result['TranResponse']=$result['InsertDataResponse'][0];
 				return $result;	
 			}	
 		}
 			
		if (isset($param->DeleteData)) {
 			$result['DeleteDataResponse']=$this->processDeleteData($param->DeleteData);
 			if ($result['DeleteDataResponse'][0]['status']!=0) {
 				$result['TranResponse']=$result['DeleteDataResponse'][0];
 				return $result;	
 			}	
 		}
 		$result['TranResponse']=array('status'=>0);
 		$conn->commit();
 		return $result;		
	}
	
 	/**
 	 * Handle data insertion requests
 	 * This is multi-row insertion request. 
 	 */
 	public function InsertData() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Invoking InsertData, param=" . var_export($param, true));
 		return $this->processInsertData($param);
 	}
 	
 	public function processInsertData($param) {
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $row) {
 			$base=$row->base;
 			$custom=$row->custom;
 			$sql=$row->sql;
 			
 			$baseTable=$base->table;
 			$baseData=CalemJson::objToArray($base->data);
 			
 			if ($custom) {
 				$customTable=$custom->table;
 				$customData=CalemJson::objToArray($custom->data);	
 			}
 			
 			try { 			
	 			$bo=CalemFactory::getDataBo($baseTable);
	 			$feedback= $bo->insert($baseTable, $baseData, $customTable, $customData, $sql);
	 			$result[]=array('table'=>$baseTable, 'status'=>0, 'feedback'=>$feedback);
 			} catch (Exception $e) {
 				$result[]=array('table'=>$baseTable, 'status'=>400, 'errorInfo'=>$e->getErrorInfo()->getData());
 			}
 		}
 		return $result;
 	}
 	
 	/**
 	 * Handle data deletion requests
 	 * This could be multi-row request. 
 	 */
 	public function DeleteData() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Invoking DeleteData, param=" . var_export($param, true));
 		return $this->processDeleteData($param);
 	}
 	
 	public function processDeleteData($param) {
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $row) {
 			$base=$row->base;
 			$table=$base->table;
 			$id=$base->id;
 			if (isset($row->custom)) {
 				$custom= $row->custom;
 				$customTable=$custom->table;
 				$customId=$custom->zc_id;
 			}
 			try { 			
	 			$bo=CalemFactory::getDataBo($table);
	 			$feedback= $bo->delete($table, $id, $customTable, $customId);
	 			$result[]=array('table'=>$table, 'status'=>0, 'feedback'=>$feedback);
 			} catch (Exception $e) {
 				$result[]=array('table'=>$table, 'status'=>400, 'errorInfo'=>$e->getErrorInfo()->getData());
 			}
 		}
 		return $result;
 	}
 	
 	/**
 	 * Handle data update requests 
 	 * This could be a multi-row request.
 	 */
 	public function UpdateData() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Invoking UpdateData, param=" . var_export($param, true));
 		return $this->processUpdateData($param);
 	}
 	
 	public function processUpdateData($param) {
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $row) {
 			$base=$row->base;
 			$custom=$row->custom;
 			$sql=$row->sql;
 			
 			$baseTable=$base->table;
 			$baseCurrent=CalemJson::objToArray($base->current);
 			$baseUpdate=CalemJson::objToArray($base->update);
 			
 			if ($custom) {
 				$customTable=$custom->table;
 				$customCurrent=CalemJson::objToArray($custom->current);	
 				$customUpdate=CalemJson::objToArray($custom->update);
 			}

 			try { 			
	 			$bo=CalemFactory::getDataBo($baseTable);
	 			$feedback= $bo->update($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate, $sql);
	 			$result[]=array('table'=>$baseTable, 'status'=>0, 'feedback'=>$feedback);
 			} catch (CalemDboUpdateConflictException $e) {
 				$result[]=array('table'=>$baseTable, 'status'=>$e->getStatus(), 
                            'feedback'=>array('table'=>$baseTable, 'server'=>$e->getServer(), 'update'=>$baseTable, 'conflict'=>$e->getConflict()));
 			} catch (Exception $e) {
 				$result[]=array('table'=>$baseTable, 'status'=>400, 'errorInfo'=>$e->getErrorInfo()->getData());
 			}
 		}
 		return $result;
 	}
}
