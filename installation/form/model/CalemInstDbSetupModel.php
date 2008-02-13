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

require_once 'CalemInstModel.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/admin/CalemVersionBo.php';

/**
 * DbSetup Model
 */
class CalemInstDbSetupModel extends CalemInstModel {
	protected $currentVersion;
	protected $newVersion;
	protected $canUpgrade;
	protected $verBo;
	protected $upgradeHdlr;
	
	public function __construct($controller) {
		parent::__construct($controller);
		$this->controller->setupDbInfo();
		$this->verBo=new CalemVersionBo();
		$this->currentVersion=$this->verBo->getCurrentVersion(false);
		$this->newVersion=$this->verBo->getNewVersion();
		$this->upgradeHdlr=$this->verBo->getUpgradeHdlr($this->newVersion, $this->currentVersion);
	}
	
	/**
	 * Info about versions and upgrade and if upgrade is available
	 */
	public function getCurrentVersionNote() {
		return ($this->currentVersion ? $this->currentVersion->getNote() : $this->calemLang->getMsg('no_version_found'));
	}
	
	public function getNewVersionNote() {
		return $this->newVersion->getNote();
	}
	
	public function getCanUpgrade() {
		return ($this->upgradeHdlr ? true : false);
	}
	
	public function validateInput() {
		$this->setLoadSample($_REQUEST['fi_load_sample']);
		$this->setUpgrade($_REQUEST['fi_upgrade']);
		$this->setVerifyDb($_REQUEST['fi_verifydb']);
		//Allow sufficient time
		set_time_limit(0);
		//Now creating DB first
		$rtn=true;
		try {
			/**
			 * Creating database tables first
			 */
			require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbSetup.php';
			$dbSetup=new CalemDbSetup();
			$dbHandler=CalemFactory::getDbHandler();
			$conn=$dbHandler->getCalemConnection();
			$dbSetup->setupSchema($dbHandler, $conn);
			//Verify db setup
			if ($this->getVerifyDb()) {
				$dbSetup->validate();
			}
			//What about upgrade
			if ($this->upgradeHdlr) {
				$GLOBALS['logger']->debug('DbSetupModel: doing an upgrade; hdlr=' . get_class($this->upgradeHdlr));
				$this->upgradeHdlr->upgrade();
			}
			//Load Init data
			require_once _CALEM_DIR_ . 'server/setup/CalemLoadInitData.php';
			$loader=new CalemLoadInitData();
			$loader->load();
			//Load sample data if set
			if ($this->getLoadSample()) {
				require_once _CALEM_DIR_ . 'server/setup/CalemLoadSampleData.php';
				$loader=new CalemLoadSampleData();
				$loader->load();
			}
		} catch (Exception $e) {
			$msg=$this->calemLang->getMsg('db_conf_exception') . " <br /> " . $e->getMessage();
			$GLOBALS['logger']->error("Error at CalemInstDbSetupController.validateInput: " . $e->getMessage());
			$this->setErrorMsg($msg);	
			$rtn=false;	
		}
		return $rtn;
	}
}	 	
?>
