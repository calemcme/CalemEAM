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
/**
 * Language model
 */
class CalemInstDbInfoModel extends CalemInstModel {
	
	public function validateInput() {
		$this->setDbType($_REQUEST['fi_dbtype']);
		$this->setDbHost($_REQUEST['fi_dbhost']);
		$this->setUsername($_REQUEST['fi_username']);
		$this->setPassword($_REQUEST['fi_password']);
		$this->setDbName($_REQUEST['fi_dbname']);
		//Now validate the info to see if we can load it.
		$rtn=($this->getDbType() && $this->getDbHost()
		   && $this->getUsername() && $this->getDbName());
		if (!$rtn) {
			$this->setErrorMsg($this->calemLang->getMsg('db_info_required'));	
			$rtn=false;
		} else {//Let's try connecting to the database
			$this->controller->setupDbInfo();
			require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
			try {
				$dbHdlr=CalemFactory::getDbHandler();
				$conn=$dbHdlr->getCalemConnection();	
			} catch (Exception $e) {
				$msg=$this->calemLang->getMsg('db_info_exception') . " <br /> " . $e->getMessage();
				$GLOBALS['logger']->error("Error at CalemInstDbinfoController.validateInput: " . $e->getMessage());
				$this->setErrorMsg($msg);	
				$rtn=false;
			}
		}
		return $rtn;
	}
}	 	
?>
