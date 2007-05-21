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

require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';
 
/**
 * CalemDataGridInfo
 */
class CalemDataGridInfo {
	private $listInfo;
	
	public function setJson($obj) {
		$this->listInfo=CalemJson::setJson($obj['listInfo']);
	}
	
	public function getListInfo() {
		return $this->listInfo;
	}
}

/**
 * CalemListInfo
 */
class CalemListInfo {
	private $colList;
	private $noMaximize;
	
	public function setJson($obj) {
		$this->noMaximize= (!isset($obj['noMaximize'])) ? true : $obj['noMaximize'];
		$this->colList=CalemJson::setJsonAsArray($obj['colList']);
	} 
	
	public function getNoMaximize() {
		return $this->noMaximize;
	}
	
	public function getColList() {
		return $this->colList;
	}
}
	
/**
 * CalemCol
 */
class CalemCol {
	private $id;
	private $width;
	
	public function setJson($obj) {
		$this->id=$obj['id'];
		$this->width=$obj['width'];
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getWidth() {
		return $this->width;
	}
	
	public function setWidth($w) {
		$this->width=$w;
	}
}
?>