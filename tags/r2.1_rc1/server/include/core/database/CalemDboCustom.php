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

//required classes
require_once _CALEM_DIR_ . 'server/metadata/CalemTableDdCustom.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';

/**
 * Custom dbo impl.
 */
 class CalemDboCustom extends CalemDbo {
 	
 	/**
 	 * Internal init.
 	 */
 	private function initInternal(array $row=null) {
 		$this->tableName=$this->tableDd->getTableName();
 		$this->row=isset($row) ? $row : array(); 	
 		$this->changed=array();
 	}
 	
 	/**
 	 * Init with tableDd looked up already.
 	 */
 	public function initWithTableDd(CalemTableDd $tableDd, array $row=null) {
 		$this->tableDd = $tableDd; 
 		$this->initInternal($row);
 	}
 	
 	/**
 	 * Init with tableName only.
 	 */
 	public function initWithTableName($tableName, array $row=null) {
 		$this->tableDd = $this->resourceMgr->getTableDdCustom($tableName);
 		$this->initInternal($row);
 	} 
 	
 	public function getIdName() {
		return 'zc_id';	
	}
	
 }
 
?>
