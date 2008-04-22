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

require_once _CALEM_DIR_ . 'server/modules/report/controller/CalemReportController.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/formmodel/CalemFormModel.php';
require_once _CALEM_DIR_ . 'server/modules/report/render/mdtab/CalemReportMdTabRender.php';

/**
 * CalemFormMdTab
 * This is multi-tab form controller.
 * 
 */
class CalemReportMdTab extends CalemReportController { 
	private $formModel;
	
	/**
	 * Data model factory method
	 */
	public function createDataModel() {
		$this->formModel=new CalemFormModel($this->formInfo->getModel(), $this);	
	}
	
	public function getDataModel() {
		return $this->formModel;
	}
	
	/**
	 * Share the same ViewMdTab
	 */
	public function createRender() {
		$customInfo=$this->getCustomInfo();
		$this->render=new CalemReportMdTabRender($this->formInfo->getId(), $this->formInfo, $this, $customInfo);
	}
	
	
	
	/**
	 * To prepare data fetch functions for one call.
	 */
	public function loadMasterData() {
		$this->formModel->loadMasterData($this->query);
	} 
	
	public function getMasterRecList() {
		return $this->formModel->getMasterRecList();
	}
	
	/**
	 * Form def services
	 */
	public function getFormModel() {
		return $this->formModel;
	}
	
	/**
	 * get custom info
	 */
	public function getCustomInfo() {
		return CalemCustomFormManager::getInstance()->getFullCustomInfo($this->formInfo->getId(), $this->getDesignTarget()); 
	} 
	
	public function getFormInfo() {
		return $this->formInfo;
	}
	
	/**
	 * Render report
	 */
	public function render() {
		$doc='';
		$this->loadMasterData();
		$recList=$this->formModel->getMasterRecList();
		for ($i=0; $i< $recList->getTotal(); $i++) {
			$mRec=$recList->getRecord($i);
			$doc .= $this->render->render($mRec);	
		}
		return $doc;
	}	 
}
?>