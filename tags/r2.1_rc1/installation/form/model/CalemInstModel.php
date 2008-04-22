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

/**
 * Base model for installation
 */
class CalemInstModel {
	protected $controller;
	protected $cmap;
	protected $errMsg;
	protected $calemLang;
	protected $urlPrefix;
	protected $calemRootUri;
	
	public function __construct($controller) {
		$this->controller=$controller;
		$this->cmap=$controller->getControllerMap();
		$this->calemLang=$this->cmap->getCalemLang();
	}
	
	public function getTheme() {
		return (isset($_SESSION['calem_theme']) ? $_SESSION['calem_theme'] : 'calem');	
	}
	
	public function getInstallText() {
		return  $this->calemLang->getMsg('inst_title');
	}
	
	public function getProductTitle() {
		require_once _CALEM_DIR_ . 'server/modules/admin/CalemVersionBo.php';
		$vbo=new CalemVersionBo();
		return $vbo->getNewVersion()->getNote();
	}
	
	public function getCopyRightText() {
		return '&copy; 2007 CalemEAM Inc. All rights reserved.';
	}
	
	/**
	 * Common data for steps
	 */
	public function getStepListTitle() {
		return $this->calemLang->getMsg('step_list_title');
	}
	
	public function getStepList() {
		return $this->cmap->getSteps();
	}
	
	public function getCurrentStep() {
		return $this->cmap->getStepByAid($this->controller->getAid());
	}
	
	public function getStepTitle($s) {
		return $this->cmap->getStepLabel($s);	
	}
	
	public function getStepActionText() {
		return $this->calemLang->getMsg($this->getCurrentStep() . '_action');	
	}
	
	public function getStepStatus($s) {
		$rtn='off';
		if ($s==$this->getCurrentStep()) $rtn='on';
		return $rtn;
	}
	
	public function getLabel($lb) {
		return $this->calemLang->getMsg($lb);	
	}
	
	public function getErrorMsg() {
		return $this->errMsg;	
	}
	
	public function setErrorMsg($errMsg) {
		$this->errMsg = $errMsg;	
	}
	
	/**
	 * Setters
	 */
	public function setDbType($dbtype) { $_SESSION['fi_data']['fi_dbtype']=$dbtype;}
	public function setDbHost($dbhost) { $_SESSION['fi_data']['fi_dbhost']=$dbhost;}
	public function setUsername($un) { $_SESSION['fi_data']['fi_username']=$un;}
	public function setPassword($password) { $_SESSION['fi_data']['fi_password']=$password;}
	public function setDbName($db) { $_SESSION['fi_data']['fi_dbname']=$db;}
	public function setVerifyDb($db) { $_SESSION['fi_data']['fi_verifydb']=$db;}
	
	/**
	 * Admin user/password
	 */
	public function setAdminUser($un) { $_SESSION['fi_data']['fi_admin_user']=$un;}
	public function setAdminPassword($password) { $_SESSION['fi_data']['fi_admin_password']=$password;}
	
	public function getAdminUser() { return $_SESSION['fi_data']['fi_admin_user'];}
	public function getAdminPassword() { return $_SESSION['fi_data']['fi_admin_password'];}
	
	/**
	 * Getters
	 */
	public function getDbType() { return $_SESSION['fi_data']['fi_dbtype'];}
	public function getDbHost() { return $_SESSION['fi_data']['fi_dbhost'];}
	public function getUsername() { return $_SESSION['fi_data']['fi_username'];}
	public function getPassword() { return $_SESSION['fi_data']['fi_password'];}
	public function getDbName() { return $_SESSION['fi_data']['fi_dbname'];}
	public function getVerifyDb() { return $_SESSION['fi_data']['fi_verifydb'];}
	
	//DbSchema info
	public function setDbExpress($ex) {
		$_SESSION['fi_data']['fi_dbexpress']=$ex;
	}
	
	public function getDbExpress() {
		return (isset($_SESSION['fi_data']['fi_dbexpress']) ? $_SESSION['fi_data']['fi_dbexpress'] : 1);
	}
	
	/**
	 * Default is to pass validation.
	 */
	public function validateInput() {
		return true;
	}
	
	/**
	 * Get request URL
	 */
	public function getCalemUrl() {
		return $this->getUrlPrefix() . $this->getCalemRootUri() . '/index.php';
	}
	
	public function getCalemRootUri() {
		if (!$this->calemRootUri) {
			$ru=$_SERVER['REQUEST_URI'];
			$pos=strpos($ru, 'installation');
			$ru=substr($ru, 0, $pos-1); //Take out '/'
			$this->calemRootUri=$ru;
		}
		return $this->calemRootUri;
	}
	
	public function getUrlPrefix() {
		if (!$this->urlPrefix) {
			global $_CALEM_conf;
			$url= isset($_SERVER['HTTPS']) ? $_CALEM_conf['calem_host']['https'] : $_CALEM_conf['calem_host']['http'];
   		$url .= $_SERVER['HTTP_HOST'];
   		$this->urlPrefix=$url;
		}
		return $this->urlPrefix;
	}
	
	public function setLoadSample($load) {
		$_SESSION['fi_data']['fi_load_sample']=$load;	
	}
	
	public function setUpgrade($ug) {
		$_SESSION['fi_data']['fi_upgrade']=$ug;	
	}
	
	public function getLoadSample() {
		return $_SESSION['fi_data']['fi_load_sample'];	
	}
	
	public function getUpgrade() {
		return $_SESSION['fi_data']['fi_upgrade'];
	}
}	 	
?>
