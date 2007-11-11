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
require_once _CALEM_DIR_ . 'build/CalemZipJs.php';

/**
 * DbSchema model
 */
class CalemInstSaveConfModel extends CalemInstModel {
	/**
	 * Saving configuration files
	 */
	public function validateInput() {
		/**
		 * Creating directories and build cache.
		 */
		try {
			$zipJs=new CalemZipJs();
			$tmRpt=$zipJs->execute();
		} catch (Exception $e) {
			$this->setErrorMsg("Error in creating directories and configuring cache: " . $e->getMessage());
		}
	
		$cnt="<?php \n" 
		    ."/**\n"
		    ." * DB Configuration \n"
		    ." */ \n";
		$cnt .= "\$_CALEM_dist['calem_db_name']='" . $this->getDbName() . "';\n";
	   $cnt .= "\$_CALEM_dist['calem_db_host'] = '" . $this->getDbHost() . "';\n";
	   $cnt .= "\$_CALEM_dist['calem_db_user'] = '" . $this->getUsername() . "';\n";
		$cnt .= "\$_CALEM_dist['calem_db_password'] = '" . $this->getPassword() . "';\n";
		$cnt .= "/** \n" 
		       ." * URL Configuration \n"
		       ." */\n";
		$cnt .= "\$_CALEM_dist['calem_root_uri']='" . $this->getCalemRootUri() . "';\n";
		$cnt .= "\$_CALEM_dist['calem_request_uri']='" . $this->getCalemRootUri() . "/index.php';\n";
		$cnt .= "\$_CALEM_dist['calem_soap_uri']='" . $this->getCalemRootUri() . "/CalemSoapService.php';\n";
		$cnt .= "?>\n";
		$rtn= file_put_contents(_CALEM_DIR_ . 'server/conf/calem.custom.php', $cnt);
		if (!$rtn) {
			$this->setErrorMsg("Error in saving settings to file: " . _CALEM_DIR_ . 'server/conf/calem.custom.php');
		} 
		return $rtn;
	}
}	 	
?>
