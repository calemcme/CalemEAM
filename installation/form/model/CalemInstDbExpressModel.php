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
class CalemInstDbExpressModel extends CalemInstModel {

	public function validateInput() {
		$this->setDbType($_REQUEST['fi_dbtype']);
		$this->setDbHost($_REQUEST['fi_dbhost']);
		
		$this->setAdminUser($_REQUEST['fi_admin_user']);
		$this->setAdminPassword($_REQUEST['fi_admin_password']);
		
		$this->setDbHost($_REQUEST['fi_dbhost']);
		$this->setUsername($_REQUEST['fi_username']);
		$this->setPassword($_REQUEST['fi_password']);
		$this->setDbName($_REQUEST['fi_dbname']);
		$this->setLoadSample($_REQUEST['fi_load_sample']);
		//Now validate the info to see if we can load it.
		$rtn=($this->getDbType() && $this->getDbHost()
		   && $this->getUsername() && $this->getDbName()
		   && $this->getAdminUser());
		if (!$rtn) {
			$this->setErrorMsg($this->calemLang->getMsg('db_info_required'));	
			return false;
		}
		//Allow sufficient time
		set_time_limit(0);
		//Start DB setup
		$rtn=true;
		try {
			//Connecting as Admin first
			$this->controller->setupDbAdminInfo();
			$dbHandler=CalemFactory::getDbHandler();
			$conn=$dbHandler->getDatabaseAdminConnection();
			//Get database setup class.
			require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbSetup.php';
			$dbSetup=new CalemDbSetup();
			//Prepare db info for setup.
			$this->controller->setupDbInfo();
			/**
			 * First let's create user and database
			 */
			$dbSetup->setupDatabaseAndUser($dbHandler, $conn);
			//Release the connection for admin
			$dbHandler->releaseDatabaseAdminConnection();
			/**
			 * Next, creating database tables first
			 */
			$conn=$dbHandler->getCalemConnection();
			$dbSetup->setupSchema($dbHandler, $conn);
			$dbSetup->validate();

			//Upgrade if applicable
			if ($this->upgradeHdlr) {
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
	
	public function getUpgradeHdlr() {
		$vBo=new CalemVersionBo();
		$cv=$vBo->getCurrentVersion(false);
		$nv=$vBo->getNewVersion();
		return $vBo->getUpgradeHdlr($nv, $cv);
	}
}	 	
?>
