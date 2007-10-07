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
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemScheduleInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemScheduleTimeInfo.php';

class CalemSchedulerJobDbo extends CalemDbo {	
	//Figure out time_due
	public function beforeInsert($baseTable, $baseData, $customTable, $customData) {
		if (isset($baseData['release_day']) && isset($baseData['release_time'])) {
			$baseData['time_due']=$this->getTimeDue($baseData['release_day'], $baseData['release_time']);
		}
		return $baseData;
	}
	
	//before update
	public function beforeUpdate($baseTable, $baseCurrent, $baseUpdate) {
		if (isset($baseUpdate['release_day']) || isset($baseUpdate['release_time'])) {
			$day= isset($baseUpdate['release_day']) ? $baseUpdate['release_day'] : $baseCurrent['release_day'];
			$time=isset($baseUpdate['release_time']) ? $baseUpdate['release_time'] : $baseCurrent['release_time'];
			$baseUpdate['time_due']=$this->getTimeDue($day, $time);	
		}
		return $baseUpdate;	
	}
	
	public function getTimeDue($releaseDay, $releaseTime) {
		$tm=null;
		if ($releaseDay && $releaseTime) {
			$schedDay=CalemScheduleInfo::decode($releaseDay);
			$schedTime=CalemScheduleTimeInfo::decode($releaseTime);
			$dueTime=$schedTime->getNextDueTime(null, $schedDay);
			$tm=($dueTime) ? CalemText::getServerDateTime($dueTime) : null;	
		}
		return $tm;
	}
}
