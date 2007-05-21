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
 
/**
 * CalemModelItem is the data model for a form.
 * It listens for events from UI and cache store.
 */
class CalemDataModelItem {
	protected $id;
	protected $model;
	protected $tableDd;
	protected $tableQuery;
	protected $recList;
	
	public function __construct($id, $model) {		
		$this->id=$id;
		$this->model=$model;
		//Get a reference to tableDd.
		$this->tableDd=$model->getTableDd();
	} 	
	
	public function getTableDd() {
		return $this->tableDd;
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getTableName() {
		return $this->tableDd->getTableName();
	}
	
	public function getTableQuery() {
		if (!$this->tableQuery) $this->setTableQuery();
		return $this->tableQuery;
	}
	
	public function setTableQuery($tblQuery=null) {
		if (!$tblQuery) {
			$tblQuery=$this->getDefaultQuery(); 
		}
		//Initialize query at two levels (form and item)
		$tblQuery = $this->initQueryByModelItem($tblQuery);
		$this->tableQuery = $this->model->getController()->initQueryByForm($tblQuery);
	}
	
	public function getDefaultQuery () {
		return $this->tableDd->buildGetAllQuery();
	}
	
	public function initQueryByModelItem($tblQuery) {
		return $tblQuery;
	}
	
	public function getRecordList() {
		return $this->recList;
	}
	
	/**
	 * It's already handled by sub-classes.
	 */
	public function onLoadResult($rows, $minRow) {
		if (!$rows) {//Empty result.
			$this->recList=$this->createEmptyRecList();
		} else {
			$this->recList=$this->createRecList($rows);
		} 
		
		if ($this->recList->getTotal() < $minRow) {
			$this->populateRows($minRow - $this->recList->getTotal());	
		}
		if ($this->recList->getTotal() > 0) {
			$this->currentRec = $this->recList->getRecord(0);
		} else {
			$this->setCurrentRecNull();
		}	
	}
	
	public function populateRows($nRow) {
		for ($i=0; $i< $nRow; $i++) {
			$this->recList->addEmptyRec(array('id'=>EMPTY_REC));
		}		
	}
	
	public function setCurrentRecNull() {
		$this->currentRec=null;	
	}
	
	public function getCurrentRecord() {
		return $this->currentRec;
	}
	
	public function setCurrentRecord($rec) {
		$this->currentRec = $rec;
	}
	
	/**
	 * Create an empty record list if there's no one yet.
	 * Note: init as a none-cache recList assuming ordering is not performed here (in read view).
	 */
	public function initCurrentRecord($rec) {
		if (!$this->recList) {
			$this->recList=$this->createEmptyRecList();
			$this->recList->add($rec);
		} 
		//Set current record
		$this->setCurrentRecord($rec);
	}
}
?>