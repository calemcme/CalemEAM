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
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';

/**
 * This class provides bulk fetch service.
 */
class CalemBulkFetchSo extends CalemWsFacade {
	private $dbResult;
	private $dbo;
	
	public function __construct() {
		parent::__construct();
		$this->dbo=new CalemDbo();	
	}
	
	/**
	 * Use gzip
	 */
	public function gzipIt() {
		return true;
	}
	
 	/**
 	 * Handling the Soap BulkFetch Request
 	 * There are multiple queries in the request.
 	 * There's only one parameter that's an object and it includes all the queries.
 	 * Each entry of the param object is a query object with fields:  table, type, sql and countSql.
 	 * 
 	 */
 	public function BulkFetch() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Invoking the BulkFetch, param=" . var_export($param, true));
 		//Processing the tables
 		global $_CALEM_conf;
 		$result=array();
 		foreach ($param as $key => $query) {
 			$serverTime=gmdate($_CALEM_conf['calem_server_time_format']);
 			try {
				 $resp=call_user_func(array($this, 'handle_'.$query->type), $query, $serverTime);	
				 $resp['ftId']=$key; //This is the full table id to map back.	
				 $result[]=$resp;				
 			} catch (Exception $e) {
 				$this->logger->error("Exception in processing BulkFetch. Error msg=" . $e->getTraceAsString());
 			}
 		}
 		return $result;
 	}
 	
 	/**
 	 * Query handlers by type
 	 */
 	public function handle_GET($query, $serverTime) {
 		//Get count first
 		$countSql=$query->countSql;
 		if (isset($countSql) && strlen($countSql)>0) { //Get the count first.
 			$count=$this->dbo->getCountBySql($countSql);
 		}
 		$resp=array("table"=>$query->table, "type"=>$query->type, "serverTime"=>$serverTime, "count"=>$count, 'localTime'=>$query->localTime);
 		if (isset($count) && $count>0) {
 			$rtn=$this->fetchAndEncode($query->sql);
 		}
 		if (isset($rtn)) {
 			$resp['fields']=$rtn['fields'];
 			$resp['data']=$rtn['data'];	
 		}
 		return $resp;	
 	}
 	
 	//Doing count only
 	public function handle_GET_COUNT($query, $serverTime) {
 		//Get count first
 		$countSql=$query->countSql;
 		$count=$this->dbo->getCountBySql($countSql);
 		$resp=array("table"=>$query->table, "type"=>$query->type, "count"=>$count);
 		return $resp;	
 	}
 	
 	//Handle updated the same way as in handle_GET.
 	public function handle_UPDATED($query, $serverTime) {
 		return $this->handle_GET($query, $serverTime);	
 	}
 	
 	public function handle_DELETED($query, $serverTime) {
 		$rtn=$this->fetchAndEncode($query->sql);
 		$resp=array("table"=>$query->table, "type"=>$query->type, "serverTime"=>$serverTime, 'localTime'=>$query->localTime);
 		if (isset($rtn)) {
 			$resp['fields']=$rtn['fields'];
 			$resp['data']=$rtn['data'];	
 		}
 		return $resp;
 	}
 	
 	/**
 	 * Fetch and encode fields and data
 	 * @param $sql
 	 * @return array('fields'=>fieldsList, 'data'=>DataList)
 	 */
 	private function fetchAndEncode($sql) {
 		try {
			$rows=$this->dbo->fetchBySql($sql);
 		} catch (CalemDboDataNotFoundException $e) {
 			return null;	
 		}	
		//Let's encode $rows
		$fields=array();
		$data=array();
		$first=true;
		foreach ($rows as $row) {
			$rowData=array();
			if ($first) { //Build a field list.
			   $first=false;
				foreach ($row as $key => $value) {
					$fields[]= $key;	
					$rowData[]=$value;
				}
			} else {//Just collect data
				foreach ($row as $key => $value) {
					$rowData[]=$value;	
				}
			}
			$data[]=$rowData;	
		}
		return array('fields'=>$fields, 'data'=>$data);		
 	}	
}
