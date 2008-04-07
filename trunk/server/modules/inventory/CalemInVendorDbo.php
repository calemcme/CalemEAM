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

//Base CalemDao
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';

class CalemInVendorDbo extends CalemDbo {	
	//Business logic when data insertion is done.	
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
		if (!isset($baseData['is_primary']) || !$baseData['is_primary']) return;
		$this->updateVendorPrimary($baseData['in_id'], $baseData['vendor_id']);
	}
	
	//On data updated
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		if (!isset($baseUpdate['is_primary']) || !$baseUpdate['is_primary']) return;
		$vendId= isset($baseUpdate['vendor_id']) ? $baseUpdate['vendor_id'] : $baseCurrent['vendor_id'];
		$this->updateVendorPrimary($baseCurrent['in_id'], $vendId);		    
	}
	
	public function updateVendorPrimary($inId, $vendId) {
		$this->updateBySqlParam('update in_vendor set is_primary=0 where in_id=? and vendor_id <> ?', array($inId, $vendId));
	}
}

?>