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

require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/datamodel/CalemRecord.php';
 
/**
 * Ported from web client for report.
 * 
 */
class CalemRecordList {
	protected $tableDd;
	protected $id;
	protected $recList;
 
	public function CalemRecordList($id) {
		$this->id=$id;
		$this->recList=array();
		$this->tableDd=CalemFactory::getTableDd($this->id);
	} 
	
	/** API function */
	public function getId() {
		return $this->id;
	}
	
	public function getTableDd() {
		return $this->tableDd;
	}
	
	public function getRecord($n) {
		if ($n > count($this->recList)) return null;
		else return $this->recList[$n];
	}
	
	/**
	 * Service functions
	 */
	public function populateList($rows) {
		//Load the data synchronously.
		if ($rows) {
			foreach ($rows as $row) {
				$rec=new CalemRecord($this, $row);
				array_push($this->recList, $rec);
			}
		}
	}
	
	public function addEmptyRec($row) {
		$rec=new CalemRecord($this, $row);
		array_push($this->recList, $rec);	
	}
	
	public function getTotal() {
		return count($this->recList);
	}
	
	public function getRecList() {
		return $this->recList;
	}
}
	 
	
/**
 * CalemResultRecordList
 * This is the recordList for a query result.
 */
class CalemResultRecordList extends CalemRecordList {
	
	//Factory method
	public static function createByRawResult($id, $rows=null) {
		$recList=new CalemResultRecordList($id);
		$recList->populateList($rows);
		
		return $recList;
	} 
}
?>