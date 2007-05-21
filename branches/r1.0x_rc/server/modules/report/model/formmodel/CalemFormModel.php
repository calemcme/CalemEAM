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

require_once _CALEM_DIR_ . 'server/modules/report/CalemReportMap.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemReportUtil.php';
 
/**
 * CalemFormModel
 * @data includes a record, and optionally a model.
 */
class CalemFormModel {
	private $masterItem;
	private $modelInfo;
	private $controller;
	private $forms;
	private $formsByModel;
		 
	public function CalemFormModel($model, $controller) {
		$this->modelInfo=$model;
		$this->controller=$controller;

		//Model internal data
		$this->forms=array();
		$this->formsByModel=array(); //For propagating query results.
		//Internal init
		$this->init();
	}
	
	//Build up the form model first.
	public function init() {
		$this->masterItem=$this->modelInfo->getMaster();
		$this->addFormItem($this->masterItem);
		$items=$this->modelInfo->getItems();
	   if ($items) {
	   	foreach ($items as $item) {
	   		$this->addFormItem($item->getId(), $item->getLink());
	   	}
	   } 
	}
	
	//Add a form item
	public function addFormItem($fmId, $link=null) {
		$fm=CalemReportMap::getController($fmId);
		if ($link) {//Build up link relationship between forms.
			$fm->setFormLink($link);
		}
		$this->forms[$fmId]=$fm;
		$model=$fm->getDataModel();
		$this->formsByModel[$model->getId()]=$fm;
	}
	
	/**
	 * LoadMaster data
	 */
	public function loadMasterData($query) {
		$this->forms[$this->masterItem]->loadByReportQuery($query);	
	}	
	
	public function getMasterRecList() {
		return $this->forms[$this->masterItem]->getModelItem()->getRecordList();	
	}
	
	/**
	 * Render by masterRec
	 */
	public function render($fmId, $mRec, $minRow=0) {
		$doc='';
		if ($fmId==$this->masterItem) {
			$this->forms[$fmId]->setCurrentRecord($mRec);
			$doc = $this->forms[$fmId]->renderReport();	
		} else {
			$this->forms[$fmId]->loadByParentRec($mRec, $minRow);
			$recList=$this->forms[$fmId]->getModelItem()->getRecordList();
			if ($recList->getTotal()>0) {
				$doc = $this->forms[$fmId]->renderReport();
			}	
		}
		return $doc;	 
	}
	
	public function getForm($id) {
		return $this->forms[$id];
	}
	
	public function getFormByModel($modelId) {
		return $this->formsByModel[$modelId];
	}
}
?>