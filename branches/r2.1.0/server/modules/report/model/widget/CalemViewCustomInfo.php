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
 * CalemViewCustomInfo
 * This object stores the custom acl and layout for a view.
 */
class CalemViewCustomInfo {
	private $id;
	private $acl;
	private $layout;
	
	public function CalemViewCustomInfo($id=null, $acl=null, $layout=null) {
		$this->id=$id;
	   $this->acl=$acl;
	   $this->layout= $layout;
	}

	//Deserialize the object
	public function setJson($obj) {
		$this->id=$obj['id'];
	   $this->acl=CalemJson::setJson($obj['acl']);
	   $this->layout= ($obj['layout'] ? CalemJson::setJson($obj['layout']) : null);
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getAcl() {
		return $this->acl;
	}
	
	public function getLayout() {
		return $this->layout;
	}
	
	public function setLayout($layout) {
		$this->layout=$layout;
	}
	
	//Acl api
	public function checkViewAcl($id) {
		return ($this->acl) ? $this->acl->checkViewAcl($id) : true;
	}
}

/**
 * CalemViewAclInfo
 */
class CalemViewAclInfo {
	private $viewAcl;
	private $tbAcl;
	
	public function CalemViewAclInfo($tbAcl=null, $viewAcl=null) {
		$this->tbAcl=$tbAcl;
		$this->viewAcl=$viewAcl;	
	}
	
	//Deserialize the object
	public function setJson($obj) {
	   $this->viewAcl=new CalemAclInfo($obj['viewAcl']);
	}
	
	public function getViewAcl() {
		return $this->viewAcl;
	}
	
	public function checkViewAcl($id) {
		return ($this->viewAcl ? $this->viewAcl->checkAcl($id) : true);
	}
	
	/**
	 * Support aggregation
	 */
	public function aggregate($viewAcl) {
		if ($viewAcl->getViewAcl()) {
			$this->viewAcl->aggregate($viewAcl->getViewAcl());
		}
	}
}
	
/**
 * CalemViewLayoutInfo
 */
class CalemViewLayoutInfo {
	private $viewLayout;
	private $gridLayout;
	
	public function CalemViewLayoutInfo($tbLayout=null, $viewLayout=null, $gridLayout=null) {
		$this->viewLayout=$viewLayout;
		$this->gridLayout=$gridLayout;	
	}
	
	//Deserialize the object
	public function setJson($obj) {
	   $this->viewLayout=CalemJson::setJsonAsArray($obj['viewLayout']);
	   $this->gridLayout=CalemJson::setJson($obj['gridLayout']);
	}
	
	public function getViewLayout() {
		return $this->viewLayout;
	}
	
	public function getGridLayout() {
		return $this->gridLayout;
	}
}
?>