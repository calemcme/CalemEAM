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
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoReservedBo.php';

class CalemWoPlannedPartDbo extends CalemDbo {	
	//Business logic when data insertion is done.	
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
		if (!isset($baseData['qty']) || !$baseData['qty']) return false;
		$this->updateReserved($baseData['wo_id'], $baseData['in_id'], $baseData['qty']);
		return true;
	}
	
	//Overwrite deletion to collect pm_id info.
	public function beforeDelete() {
		$this->loadRecord();
	}
	
	//Business logic when data deletion is done.	
	public function onDataDeleted($table, $id) {
		if (!$this->row['qty']) return false;
		$qty= (-1) * $this->row['qty'];
		$this->updateReserved($this->row['wo_id'], $this->row['in_id'], $qty);
		return true;
	}
	
	//On data updated
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		$oldQty=$baseCurrent['qty'];
		$newQty= isset($baseUpdate['qty']) ? $baseUpdate['qty'] : $baseCurrent['qty'];
		if (isset($baseUpdate['in_id'])) {
			if ($oldQty) $this->updateReserved($baseCurrent['wo_id'], $baseCurrent['in_id'], (-1 * $oldQty));	
			if ($newQty) $this->updateReserved($baseCurrent['wo_id'], $baseUpdate['in_id'], $newQty);
		} else if ($oldQty != $newQty) {
			$this->updateReserved($baseCurrent['wo_id'], $baseCurrent['in_id'], ($newQty - $oldQty));	
		}		    
	}
	
	public function updateReserved($woId, $inId, $qty) {
		$rsvdBo=new CalemWoReservedBo();
		$rsvdBo->updateReservedSafe($woId, $inId, $qty);
	}
}
