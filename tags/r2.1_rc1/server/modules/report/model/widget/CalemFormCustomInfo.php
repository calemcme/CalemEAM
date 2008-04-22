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
 * CalemFormCustomInfo
 * This object stores the custom acl and layout for a form.
 */
class CalemFormCustomInfo {
	private $id;
	private $acl;
	private $layout;
	
	public function CalemFormCustomInfo($id=null, $acl=null, $layout=null) {
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
	public function checkTabAcl($id) {
		return ($this->acl) ? $this->acl->checkTabAcl($id) : true;
	}
	
	public function checkFormAcl($id) {
		return ($this->acl) ? $this->acl->checkFormAcl($id) : true;
	}
}
	
/**
 * CalemFormAclInfo
 */
class CalemFormAclInfo {
	private $tabAcl;
	private $formAcl;
	
	public function CalemFormAclInfo($tabAcl=null, $formAcl=null) {
		$this->tabAcl=$tabAcl;
		$this->formAcl=$formAcl;	
	}
	
	//Deserialize the $object
	public function setJson($obj) {
	   $this->tabAcl=new CalemAclInfo($obj['tabAcl']);
	   $this->formAcl=new CalemAclInfo($obj['formAcl']);
	}
	
	public function getTabAcl() {
		return $this->tabAcl;
	}
	
	public function getFormAcl() {
		return $this->formAcl;
	}
	
	public function checkFormAcl($id) {
		return ($this->formAcl ? $this->formAcl->checkAcl($id) : true);
	}
	
	public function checkTabAcl($id) {
		return ($this->tabAcl ? $this->tabAcl->checkAcl($id) : true);
	}
	
	/**
	 * Support aggregation
	 */
	public function aggregate($formAcl) {
		if ($formAcl->getTabAcl()) {
			$this->tabAcl->aggregate($formAcl->getTabAcl()->getAcl());
		}
		if ($formAcl->getFormAcl()) {
			$this->formAcl->aggregate($formAcl->getFormAcl()->getAcl());
		}
	}
}
?>