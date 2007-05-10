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
require_once _CALEM_DIR_ . 'server/include/util/CalemReportUtil.php';

require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemCustomInfoManager.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemEmbedInfo.php';

require_once _CALEM_DIR_ . 'server/modules/report/model/datamodel/CalemDataModel.php';

/**
 * CalemForm - ported for report
 */
class CalemReportController {
	protected $logger;
	
	protected $id;
	protected $mod;
	protected $query;
	protected $formInfo;
	
	protected $dataModel;
	protected $modelItem;
	
	protected $dataLoaded;
	
	protected $render;
	 
	public function CalemReportController() {
		$this->logger=&LoggerManager::getLogger('CalemReportController');
	}
	
	public function init($id, $mod, $query) {
		$this->id=$id;
		$this->mod=$mod;
		$this->query=$query;
		$this->formInfo=CalemReportUtil::getReportById($this->id, $this->mod);	
		//Initializing data model
		$this->createDataModel();
		//Init render
		$this->createRender();
	}
	
	/**
	 * Data model factory method
	 */
	public function createDataModel() {	
		$mdId=$this->formInfo->getModel();
		$this->dataModel=new CalemDataModel($mdId, $this);
		$this->modelItem=$this->dataModel->getModelItem();
	}
	
	// Go directly to the render
	public function createRender() {
		$vId=$this->formInfo->getView()->getId();
		$vInfo=CalemReportUtil::getReportDefById($vId, $this->mod);
		$this->render=$this->_createRender($vId, $vInfo);
	}
	
	public function getRender() {
		return $this->render;
	}
	
	/**
	 * Data loaded by this form
	 */
	public function onDataLoaded() {
		$this->dataLoaded=true;
	}

	/**
	 * Form def services
	 */
	public function getFormInfo() {
		return $this->formInfo;
	} 
	
	public function getDataModel() {
		return $this->dataModel;
	}
	
	public function getModelItem() {
		return $this->modelItem;
	}
	 
	public function getId() {
		return $this->id;
	}
	
	public function getTitle() {
		return CalemMsg::getMsg($this->formInfo->getTitle());
	} 
	
	public function getIcon() {
		return $this->formInfo->getIcon();
	} 
	
	public function getViewId() {
		return $this->formInfo->getView()->getId();
	}
	
	public function getReportRender($itemInfo) {
		global $_CALEM_conf;
		$renders=$_CALEM_conf['report_conf']['reportRender'];
		$rtn=$renders[get_class($itemInfo)];
		if (!$rtn) {
			$this->logger->error("Unable to find render for item: " . get_class($itemInfo));
		}
		return $rtn;
	}
	
	public function getFieldRender($normType) {
		global $_CALEM_conf;
		$fldRenders=$_CALEM_conf['report_conf']['reportRender']['FieldRenders'];
		if (isset($fldRenders[$normType])) {
			$rtn=$fldRenders[$normType];
		} else if (isset($fldRenders['default'])) {
			$rtn=$fldRenders['default'];
		} else {
			$rtn=null;
			$this->logger->error("Unable to find render for field type: " . $normType);
		}
		return $rtn;
	}
	
	/**
	 * Form dependency management
	 */
	public function setFormLink($link) {
		$this->dataModel->setFormLink($link);	
	} 
	
	public function getCurrentRecord() {
		return $this->dataModel->getCurrentRecord();
	}
	
	public function setParentRec($masterRec) {
		$this->dataModel->setParentRec($masterRec);
	}
	
	public function getParentRec() {
		return $this->dataModel->getParentRec();
	}
	
	public function getFormQueryByParentRec() {
		return $this->dataModel->getTableQueryByParentRec();
	}
	
	public function setCurrentRecord($rec) {
		return $this->dataModel->setCurrentRecord($rec);	
	}
	
	/**
	 * Built-in filter support at list form
	 */
	public function initQueryByForm($tblQuery) {
		return $tblQuery;
	}
	
	public function getCustomInfo() {
		return CalemCustomViewManager::getInstance()->getFullCustomInfo($this->getViewId(), $this->getDesignTarget()); 
	}
	
	public function getDesignTarget () {
	    return CalemDesignTargetInfo::getReportDesignTarget();
	} 
	
	/**
	 * Report query format:
	 * a) 'cid' -> a single record by this id.
	 */
	public function loadByReportQuery($query) {
		$this->dataModel->loadByReportQuery($query);
	}
	
	public function loadByParentRec($mRec, $minRow=0) {
		$this->dataModel->loadByParentRec($mRec, $minRow);
	}
	/**
	 * Render report for formModel - all initialized.
	 */
	public function renderReport() {
		return $this->render->render($this->getCustomInfo());	
	}	 
	
	//Get report title
	public function getReportTitle() {
		return $this->formInfo->getTitleMsg();
	}
	
	/**
	 * Load data
	 */
	public function loadData() {
		$this->dataModel->load();
	}	 
	
	/**
	 * Load data and render report
	 */
	public function render() {
		$this->loadData();
		return $this->renderReport();	
	}	 
	
}
?>