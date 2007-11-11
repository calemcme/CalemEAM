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
 * Base controller for installation
 */
class CalemInstController {
	protected $cmap;
	protected $aid;
	protected $model;
	protected $view;
	
	public function __construct() {
		if (!isset($_SESSION['step_status'])) {
			$_SESSSION['step_status']=array();	
		}
		if (!isset($_SESSION['fi_data'])) {
			$_SESSION['fi_data']=array();	
		}
		if (!isset($_SESSION['fi_data']['fi_dbexpress'])) {
			$_SESSION['fi_data']['fi_dbexpress']=1;
		}
	}
	
	public function setControllerMap($cmap) {
		$this->cmap=$cmap;
		$this->init();
	}
	
	public function getControllerMap() {
		return $this->cmap;
	}
	
	public function setAid($aid) {
		$this->aid=$aid;
	}
	
	public function getAid() {
		return $this->aid;
	}
	
	public function validateInput() {
		return true;
	}
	
	/**
	 * Configuring dbinfo to be used by other db handlers
	 */
	public function setupDbInfo() {
		global $_CALEM_conf;
		$_CALEM_conf['calem_db_name'] = $_SESSION['fi_data']['fi_dbname'];
		$_CALEM_conf['calem_db_host'] = $_SESSION['fi_data']['fi_dbhost'];
		$_CALEM_conf['calem_db_user'] = $_SESSION['fi_data']['fi_username'];
		$_CALEM_conf['calem_db_password'] = $_SESSION['fi_data']['fi_password'];
	}
	
	public function setupDbAdminInfo() {
		global $_CALEM_conf;
		$_CALEM_conf['db_admin_user'] = $_SESSION['fi_data']['fi_admin_user'];
		$_CALEM_conf['db_admin_password'] = $_SESSION['fi_data']['fi_admin_password'];;
	}
	
	public function getLangSelect() {
		return $this->cmap->getLangSelect();
	}
}	 	
?>
