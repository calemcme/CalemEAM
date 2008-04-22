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

class CalemWoDowntimeDbo extends CalemDbo {	
	//Business logic when data insertion is done.	
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
		if (!isset($baseData['hours']) || !isset($baseData['wo_id']) || !$baseData['hours']) return false;
		$this->updateDowntimeHours($baseData['wo_id'], $baseData['hours']);
		return true;
	}
	
	//Overwrite deletion to collect pm_id info.
	public function beforeDelete() {
		$this->loadRecord();
	}
	
	//Business logic when data deletion is done.	
	public function onDataDeleted($table, $id) {
		if (!$this->row['hours'] || !$this->row['wo_id']) return false;
		$hours= (-1) * $this->row['hours'];
		$this->updateDowntimeHours($this->row['wo_id'], $hours);
		return true;
	}
	
	//On data updated
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		if (!isset($baseCurrent['wo_id'])) return;
		$hours= $baseUpdate['hours']-$baseCurrent['hours'];
		if (!$hours) return;
		$this->updateDowntimeHours($baseCurrent['wo_id'], $hours);		    
	}
	
	public function updateDowntimeHours($woId, $hours) {
		$woDbo=CalemFactory::getDbo('workorder');
		//Get meter rec.
		$woRec=$woDbo->fetchById($woId);
		$fld=$this->getFieldName();
		$hours=$woRec[$fld]+$hours;
		$woDbo->setValue($fld, $hours);
		$woDbo->setIdForUpdate($woId);
		$woDbo->update();	
	}
	
	public function getFieldName() {
		return 'actual_downtime_hours';
	}
}

?>