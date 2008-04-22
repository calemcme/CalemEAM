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

require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';

/**
 * CalemScheduleInfo - ported from front end
 */
class CalemScheduleTimeInfo {
	const MINUTE = 'm';
	const HOUR = 'h';
	
	protected $startTime;
	protected $repeat;
	protected $endTime;
	protected $selection;
	protected $minutes;
	protected $hours;
	protected $logger;
	 
	public function __construct($startTime=null, $repeat=null, $endTime=null, $selection=null, $minutes=null, $hours=null) {
		$this->startTime=$startTime;
		$this->repeat=$repeat;
		$this->endTime=$endTime;
		$this->selection=$selection;
		$this->minutes=$minutes;
		$this->hours=$hours;
	}
	
	public static function decode($val) {
		$info = $val ? base64_decode($val) : null;
		if ($info) {
			$php=CalemJson::jsonToPhp($info);
			$rtn=CalemJson::setJson($php);
		} else {
			$rtn=new CalemScheduleInfo();
		}
		return $rtn;	
	}

	//Deserialize the object
	public function setJson($obj) {
		$this->startTime=$obj['startTime'];
		$this->repeat=$obj['repeat'];
		$this->endTime=$obj['endTime'];
		$this->selection=$obj['selection'];
		$this->minutes=$obj['minutes'];
		$this->hours=$obj['hours'];
	}

	public function getStartTime() {
		return $this->startTime;
	}
	
	public function getRepeat() {
		return $this->repeat;
	}
	
	public function getEndTime() {
		return $this->endTime;
	}
	
	public function getSelection() {
		return $this->selection;
	}
	
	public function getMinutes() {
		return $this->minutes;
	}
	
	public function getHours() {
		return $this->hours;
	}
	
	public function isRepeatValid() {
		return ($this->repeat && 
		        (($this->selection == self::MINUTE && $this->minutes)
		       ||($this->selection == self::HOUR && $this->hours)));	
	}
	
	public function getNextDueTime($dueTime, $schedDay) {
		if (!$this->startTime || !$schedDay->isValid()) return null; //No date is set so don't release it
		$now=gmmktime();
		$byTime=true;
		if (!$dueTime) { //Get due time the first time
			//Do we have a start date?
			if ($schedDay->getDates() && $schedDay->getDates()->getStart()) {
				$dueDay=CalemText::parseServerDate($schedDay->getDates()->getStart());
				$dueDay=$schedDay->adjustReleaseDate($dueDay);	
			} else {//Use yesterday to find a next due day
				$yday=strtotime('1 day ago');
				$dueDay=$schedDay->getNextDueDateInFuture($yday);
			}
			if (!$dueDay) return null;
			$dueTime=CalemText::parseServerDateTime(gmdate('Y-m-d ', $dueDay) . $this->startTime);
			//Best case, we're done.
			if ($dueTime > $now) return $dueTime;
			$byTime=false;
		}
		//Fix the time portion first in case it's within today
		if ($byTime && $this->isRepeatValid()) {
			$newTime=$this->getNextDueTimeByTime($dueTime, $now);
			//Valid next time (in the future and the same day)
			if ($newTime > $now && gmdate('Y-m-d', $newTime) == gmdate('Y-m-d', $dueTime)) return $newTime;
			//Keep original date and use the new time so we don't skip days (out of $newTime)
			$dueTime=CalemText::parseServerDateTime(gmdate('Y-m-d ', $dueTime) . gmdate('H:i:s', $newTime));
		}
		//Must move day first, then use the same time
		$newTime=$schedDay->getNextDueDateInFuture($dueTime);
		if (!$newTime) return null; //Date not valid anymore.
		$newTime=CalemText::parseServerDateTime(gmdate('Y-m-d ', $newTime) . gmdate('H:i:s', $dueTime));
		return $newTime;
	}
	
	/**
	 * Move to next time
	 * There's a time range here from startTime to endTime
	 */
	public function getNextDueTimeByTime($dueTime, $now=null) {
		if (!$this->isRepeatValid()) return $dueTime; //so no time inc in this case.
		if (!$now) $now=gmmktime();
		while (true) {
			if ($this->selection == self::MINUTE) {
				$dueTime=strtotime('+' . $this->minutes . ' minutes', $dueTime);	
			} else {
				$dueTime=strtotime('+' . $this->hours . ' hours', $dueTime);
			}
			if ($this->endTime) {
				$tm=gmdate('H:i:s', $dueTime);
				if ($tm > $this->endTime) {
					$dueTime=CalemText::parseServerDateTime(gmdate('Y-m-d ', $dueTime) . $this->startTime);
					break;
				}
			}
			//if we're scheduling for today, continue the inc if it's less than now
			if (gmdate('Y-m-d', $dueTime)==gmdate('Y-m-d', $now) && $dueTime <= $now) continue;
			break;
		}
		return $dueTime;
	}
}
?>