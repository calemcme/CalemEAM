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

require_once _CALEM_DIR_ . 'server/include/core/database/query/CalemDbExpr.php';
require_once _CALEM_DIR_ . 'server/include/core/database/query/CalemTableQuery.php';

require_once _CALEM_DIR_ . 'server/modules/report/model/datamodel/CalemRecord.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/datamodel/CalemRecordList.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/datamodel/CalemRecordListDbCache.php';

require_once _CALEM_DIR_ . 'server/modules/report/model/datamodel/CalemDataModelItem.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/datamodel/CalemDataModelItemDb.php';
 
/**
 * Constructor
 */
class CalemDataModel {
	private $logger;
	
	private $id;
	private $controller;
	private $formLink;
	private $parentRec;
	private $tableDd;

	public function CalemDataModel($id, $controller, $data=null) {
		$this->logger=&LoggerManager::getLogger('CalemDataModel');
		//Initialize
		$this->oid=$id;
		$this->controller=$controller;
		$this->tableDd=CalemFactory::getTableDd($id);
		$this->id=$this->tableDd->getTableName();
		$this->init($data);
	}
	
	/**
	 * Each model is represented by one model item.
	 */
	public function init($data) {
		if ($data) {
			if ($data['modelItem']) { //To share data model
				$this->modelItem=$data['modelItem'];
			} else {//Should fake a model item.
				$this->modelItem=$this->createModelItem($this->id);
			}
			$this->modelItem->initCurrentRecord($data['item']);
		} else {
			$this->modelItem=$this->createModelItem($this->id);
		}
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getController() {
		return $this->controller;
	}
	
	/**
	 * Creating a model item based on cache policy
	 */
	public function createModelItem($id) {
		return new CalemDataModelItemDb($id, $this);
	}
	
	public function getTableDd() {
		return $this->tableDd;
	}
	
	/**
	 * Initial data loading
	 */
	public function load() {
		$dbo=CalemFactory::getDbo($this->getId());
		$tq=$this->modelItem->getTableQuery();
		try {
			$rows=$dbo->fetchBySql($tq->getSql());
		} catch (CalemDboDataNotFoundException $ex) {
			$rows=null;	
		}
		$this->onLoadResult($rows);
	}
	
	public function loadById($id) {
		$dbo=CalemFactory::getDbo($this->id);
		try {
			$tq=$this->tableDd->buildGetOneQuery();
			$rows=$dbo->fetchBySqlParam($tq->getSql(), $id);
		} catch (CalemDboDataNotFoundException $e) {
			$rows=null;
		}
		return $rows;
	}
	
	/**
	 * Load data based on parent rec.
	 */
	public function loadByReportQuery($query) {
		if (isset($query['cid'])) {
			$rows=$this->loadById($query['cid']);	
		} else {
			
		}
		$this->onLoadResult($rows);		
	}
	
	/**
	 * Load by parent rec
	 */
	public function loadByParentRec($mRec, $minRow) {
		$this->setParentRec($mRec);
		$tq=$this->getTableQueryByParentRec();
		$dbo=CalemFactory::getDbo($this->id);
		try {
			$rows=$dbo->fetchBySql($tq->getSql());
		} catch (CalemDboDataNotFoundException $e) {
			$rows=null;
		}
		$this->onLoadResult($rows, $minRow);
	}
	
	/**
	 * Loading by a layer above
	 */
	public function onLoadResult($rows, $minRow=0) {
		$this->modelItem->onLoadResult($rows, $minRow);
	} 
	
	public function getModelItem() {
		return $this->modelItem;
	}
	
	/**
	 * Form level handling
	 */
	public function setFormLink($link) {
		$this->formLink = $link;
	}
	
	public function getFormLink() {
		return $this->formLink;
	}
	
	/**
	 * Parent rec handling
	 */
	public function setParentRec($rec) {
		$this->parentRec=$rec;
	} 
	
	public function getParentRec() {
		return $this->parentRec;
	} 
	
	/**
	 * Creating quer based on master rec
	 */
	public function getTableQueryByParentRec() {
		$tq=$this->modelItem->getTableQuery();
		//Add where clause for primary key.
		if ($this->parentRec && $this->formLink) {
			//Support link that's not id.
			$id=$this->parentRec->getField($this->formLink->getParentFld())->getRawValue();
			$val=new CalemDbString($id);
			$fld=new CalemDbField($this->id, $this->formLink->getFld())	;
			$dbExpr=new CalemDbExpr($fld, CalemDbExpr::EXPR_EQ, $val);
			$tq->setWhere($this->id, $dbExpr);
		}
		if ($this->logger->isDebugEnabled()) $this->logger->debug("table query for " . $this->id . "=" . $tq->getSql());
		return $tq;
	}
	
	/**
	 * getCurrentRecord
	 */
	public function getCurrentRecord() {
		return $this->modelItem->getCurrentRecord();
	} 
	
	public function setCurrentRecord($rec) {
		$this->modelItem->setCurrentRecord($rec);
	} 
}
?>