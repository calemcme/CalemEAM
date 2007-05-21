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
 * CalemFormInfo
 */
class CalemFormInfo {
	private $id;
	private $title;
	private $icon;
	private $controller;
	private $model;
	private $view;
	
	//Deserialize the object
	public function setJson($obj) {
	   $this->id=$obj['id'];
	   $this->title=$obj['title'];
	   $this->icon=$obj['icon'];
	   $this->controller=$obj['controller'];
	   $this->model=$obj['model'];
	   $this->view=CalemJson::setJson($obj['view']);
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getTitle() {
		return $this->title;
	}
	
	public function getTitleMsg() {
		return CalemMsg::getMsg($this->title);
	}
	
	public function getIcon() {
		return $this->icon;	}
	
	public function getController() {
		return $this->controller;
	}
	
	public function getModel() {
		return $this->model;
	}
	
	public function getView() {
		return $this->view;
	}	
}

/**
 * CalemViewRefInfo
 */
class CalemViewRefInfo {
	
	//Deserialize the object
	public function setJson($obj) {
	   $this->id=$obj['id'];
	   $this->impl=$obj['impl'];
	}
	
	// Public APIs
	public function getId() {
		return $this->id;
	}
	
	public function getImpl() {
		return $this->impl;
	}
}


/**
 * CalemFormErrorInfo
 */
class CalemFormErrorInfo {
	private $id;
	
	//Deserialize the object
	public function setJson($obj) {
	   $this->id=$obj['id'];
	}
	
	// Public APIs
	public function getId() {
		return $this->id;
	}
}
	
/**
 * CalemFormMdTabInfo
 * Multi-tab form descriptors.
 */
class CalemFormMdTabInfo {
	private $id;
	private $title;
	private $icon;
	private $controller;
	
	private $layout;
	private $model;
	private $itemMap;
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->id=$obj['id'];
	   $this->title=$obj['title'];
	   $this->icon=$obj['icon'];
	   $this->controller=$obj['controller'];
	   //Layout, model and itemMap
	   $this->layout=CalemJson::setJson($obj['layout']);
	   $this->model=CalemJson::setJson($obj['model']);
	   $this->itemMap=CalemJson::setJson($obj['itemMap']);
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getController() {
		return $this->controller;
	}
	
	public function getTitle() {
		return $this->title;
	}
	
	public function getTitleMsg() {
		return CalemMsg::getMsg($this->title);
	}
	
	public function getIcon() {
		return $this->icon;
	}
	
	public function getLayout() {
		return $this->layout;
	}
	
	public function getModel() {
		return $this->model;
	}
	
	public function getItem($id) {
		return $this->itemMap->get($id);
	}
	
	public function getItemMap() {
		return $this->itemMap;
	}
}
	
	
/**
 * CalemMdTabLayoutInfo
 * Layout in original and custom layout descriptors.
 */
class CalemMdTabLayoutInfo {
	private $tabList;
	private $tabMap;
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->tabList=CalemJson::setJsonAsArray($obj['tabList']);
	   $this->tabMap=CalemJson::setJsonByMap($obj['tabMap']);
	}
	
	public function getTabList() {
		return $this->tabList;
	}
	
	public function getTabItem($id) {
		return $this->tabMap[$id];
	}
	
	public function getTabMap() {
		return $this->tabMap;
	}
}
	
/**
 * CalemTabLayoutInfo
 * Tab layout descriptors when composing forms to make new forms.
 */
class CalemTabLayoutInfo {
	private $layout;
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->layout=CalemJson::setJsonAsArray($obj);
	}
	
	public function getLayout() {
		return $this->layout;
	}
}
	
/**
 * CalemFormLayoutInfo
 * Form layout descriptors when composing forms to make new forms.
 */
class CalemFormLayoutInfo {
	private $id;
	private $fixed;
	private $minRow;
	private $layout;
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->id=$obj['id'];
	   $this->fixed=$obj['fixed'];
	   $this->minRow=$obj['minRow'];
	   $this->layout=CalemJson::setJson($obj['layout']);
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getFixed() {
		return $this->fixed;
	}
	
	public function getLayout() {
		return $this->layout;
	}
	
	public function getMinRow() {
		return $this->minRow;
	}
}
	
/**
 * CalemTabInfo
 * This is a simple tab $object info.
 */
class CalemTabInfo{
	private $id;
	private $fixed;
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->id=$obj['id'];
	   $this->fixed= $obj['fixed'];
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getFixed() {
		return $this->fixed;
	}
	
	public function getLabel() {
		return CalemMsg::getMsg($this->id);
	}
}
	
	
/**
 * CalemBlockLayoutInfo
 * Block layout info.
 */
class CalemBlockLayoutInfo {
	private $width;
	private $rows;
	private $height;
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->width=$obj['width'];
	   $this->rows=$obj['rows']; //Number of rows in grid.
	   $this->height=$obj['height'];
	}
	
	public function getWidth() {
		return $this->width;
	}
	
	public function getRows() {
		return $this->rows;
	}
	
	public function getHeight() {
		return $this->height;
	}
}
	
	/**
	 * CalemFormModelInfo
	 * This is used for composing forms together.
	 */
class CalemFormModelInfo {
	private $master;
	private $items;
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->master=$obj['master'];
	   $this->items=CalemJson::setJsonAsArray($obj['items']);
	}
	
	public function getMaster() {
		return $this->master;
	}
	
	public function getItems() {
		return $this->items;
	}
}
	
/**
 * CalemFormLinkInfo
 * Defines how a form is linked with master form.
 */
class CalemFormLinkInfo {
	private $id;
	private $link;
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->id=$obj['id'];
	   $this->link=CalemJson::setJson($obj['link']);
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getLink() {
		return $this->link;
	}
}
	
/**
 * CalemFieldMdInfo
 * Form link field master detail info.
 */
class CalemFieldMdInfo {
	private $fld;
	private $pFld;
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->fld=$obj['fld'];
	   $this->parentFld=$obj['parentFld'];
	}
	
	public function getFld() {
		return $this->fld;
	}
	
	public function getParentFld() {
		return $this->parentFld;
	}
}
?>