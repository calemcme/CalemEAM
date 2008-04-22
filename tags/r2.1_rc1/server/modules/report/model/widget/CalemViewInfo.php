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
require_once _CALEM_DIR_ . 'server/include/util/CalemMsg.php';

/**
 * CalemViewInfo
 */
class CalemViewInfo {
	protected $id;
	protected $layout;
	protected $itemMap;

	public function setJson($obj) {
	   $this->id=$obj['id'];
	   $this->layout=CalemJson::setJson($obj['layout']);
	   $this->itemMap=CalemJson::setJson($obj['itemMap']);
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getLayout() {
		return $this->layout;
	}
	
	public function getItem($id) {
		return $this->itemMap->get($id);	}
	
	public function getItemMap() {
		return $this->itemMap;
	}
}
	
/**
 * CalemLayoutInfo
 */
class CalemLayoutInfo {
	private $tableLayout;
	private $colLayout;
	private $rows;
	
	public function setJson($obj) {
		$this->tableLayout=CalemJson::setJson($obj['tableLayout']);
		$this->colLayout=CalemJson::setJson($obj['colLayout']);
		$this->rows = CalemJson::setJsonAsArray($obj['rows']);
	}
	
	public function getColLayout() {
		return $this->colLayout;
	}
	
	public function getTableLayout() {
		return $this->tableLayout;
	}
	
	public function getRows() {
		return $this->rows;
	}
}
	
/**
 * CalemTableLayoutInfo
 */
class CalemTableLayoutInfo {	
	public function setJson($obj) {//Not useful in this case.
	}	
}
	
/**
 * CalemColLayoutInfo
 */
class CalemColLayoutInfo {
	private $colCount;
	
	public function setJson($obj) {
		$this->colCount=$obj['colCount'];
	}
	
	public function getColCount() {
		return $this->colCount;
	}
}
	
/**
 * CalemTrInfo
 */
class CalemTrInfo {
	private $cols;
	
	public function setJson($obj) {
		$this->cols=$obj['cols'];
	}
	
	public function getCols() {
		return $this->cols;
	}
}
	
/**
 * CalemItemMap
 */
class CalemItemMap {
	private $itemMap;
	
	public function setJson($obj) {
		$this->itemMap=CalemJson::setJsonByMap($obj);
	}
	
	public function get($id) {
		return $this->itemMap[$id];
	}
	
	public function getMap() {
		return $this->itemMap;
	}
}
	
/**
 * CalemLabelInfo
 */
class CalemLabelInfo {
	private $id;
	private $ccsClass;
	private $icon;
	
	public function setJson($obj) {
		$this->id=$obj['id'];
		$this->ccsClass=$obj['className'];
		$this->icon=isset($obj['icon']) ? $obj['icon'] : null;
	}
	
	//Service APIs
	public function getId() {
		return $this->id;
	}
	
	public function getCcsClass() {
		return $this->ccsClass;
	}
	
	public function getIcon() {
		return $this->icon;
	}
	
	public function getLabel() {
		return CalemMsg::getMsg($this->id);
	}
}	
/**
 * CalemFieldLabelInfo
 */
class CalemFieldLabelInfo {
	private $field;
	
	public function CalemFieldLabelInfo($fld) {
		$this->field=$fld;
	}
	
	public function setJson($obj) {
		$this->field=$obj['field'];
	}
	
	//Service APIs
	public function getField() {
		return $this->field;
	}
}
	
/**
 * CalemFieldInfo
 */
class CalemFieldInfo {
	private $field;
	
	public function CalemFieldInfo($fld) {
		$this->field=$fld;
	}
	
	public function setJson($obj) {
		$this->field=$obj['field'];
	}
	
	//Service APIs
	public function getField() {
		return $this->field;
	}
}
?>
