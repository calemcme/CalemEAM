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
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoPlannedLaborDbo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/schedule/CalemSchedBo.php';

class CalemWoSchedLaborDbo extends CalemWoPlannedLaborDbo {	
	
	//Business logic when data insertion is done.	
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
		if (!parent::onDataInserted($id, $baseTable, $baseData, $customTable, $customData)) return;
		$this->updateSchedUser($baseData['user_id'], $baseData['start_time'], $baseData['shift_id'], $baseData['hours']);
	}
	
	//Business logic when data deletion is done.	
	public function onDataDeleted($table, $id) {
		if (!parent::onDataDeleted($table, $id)) return false;
		$hours= (-1) * $this->row['hours'];
		$this->updateSchedUser($this->row['user_id'], $this->row['start_time'], $this->row['shift_id'], $hours);
		return true;
	}
	
	//On data updated
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		//Update labor hours first.
		parent::onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate);
		//Key fields changed - cause a real update.
		if (isset($baseUpdate['hours']) || isset($baseUpdate['user_id']) || isset($baseUpdate['start_time']) || isset($baseUpdate['shift_id'])) {
			if (!isset($baseUpdate['user_id']) && !isset($baseUpdate['start_time']) && !isset($baseUpdate['shift_id'])) {
				//optimized to change one record
				$hours = (isset($baseCurrent['hours'])? ($baseUpdate['hours']-$baseUpdate['hours']) : $baseUpdate['hours']);
				$this->updateSchedUser($baseCurrent['user_id'], $baseCurrent['start_time'], $baseCurrent['shift_id'], $hours);	
			} else {
				$currHours= (isset($baseCurrent['hours']) ? $baseCurrent['hours'] : 0);
				if ($currHours>0) {
					$hours= (-1) * $baseCurrent['hours'];
					$this->updateSchedUser($baseCurrent['user_id'], $baseCurrent['start_time'], $baseCurrent['shift_id'], $hours);	
				}
				//Update destination
				$hours=(isset($baseUpdate['hours']) ? $baseUpdate['hours'] : $currHours);
				if ($hours>0) {
					$uid=isset($baseUpdate['user_id']) ? $baseUpdate['user_id'] : $baseCurrent['user_id'];
					$startTime=isset($baseUpdate['start_time']) ? $baseUpdate['start_time'] : $baseCurrent['start_time'];
					$shiftId=isset($baseUpdate['shift_id']) ? $baseUpdate['shift_id'] : $baseCurrent['shift_id'];
					$this->updateSchedUser($uid, $startTime, $shiftId, $hours);
				}
			}
		}
	}
	
	public function getWoHourField() {
		return 'sched_labor_hours';
	}
	
	/**
	 * Update schedUser 
	 */
	public function updateSchedUser($uid, $startTime, $shiftId, $hours) {
		$schedBo=new CalemSchedBo();
		$schedBo->scheduleUser($uid, CalemText::datetimeToDate($startTime), $shiftId, $hours);
	}
}

?>