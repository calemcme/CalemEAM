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
class CalemScheduleInfo {
	protected $selection;
	protected $weekly;
	protected $weeks;
	protected $months;
	protected $days;
	protected $dates;
	
	protected $elements;
	 
	public function __construct($selection=null, $weekly=null, $weeks=null, $months=null, $dates=null, $days=null) {
		$this->selection=$selection;
		$this->weekly=$weekly;
		$this->weeks=$weeks;
		$this->months=$months;
		$this->days=$days;
		$this->dates=$dates;
		$this->init();
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
		$this->selection=$obj['selection'];
		$this->weekly=CalemJson::setJson($obj['weekly']);
		$this->weeks=CalemJson::setJson($obj['weeks']);
		$this->months=CalemJson::setJson($obj['months']);
		$this->days=CalemJson::setJson($obj['days']);
		$this->dates=CalemJson::setJson($obj['dates']);
		$this->init();
	}
	
	private function init() {
		$this->elements=array(
			'weekly'=>$this->weekly,
			'weeks'=>$this->weeks,
			'months'=>$this->months,
			'days'=>$this->days,
			'dates'=>$this->dates		
		);	
	}
	
	public function getSelection() {
		return $this->selection ? $this->selection : null;
	}
	
	public function getWeekly() {
		return $this->weekly;
	}
	
	public function getWeeks() {
		return $this->weeks;
	}
	
	public function getMonths() {
		return $this->months;
	}
	
	public function getDays() {
		return $this->days;
	}
	
	public function getDates() {
		return $this->dates;
	}
	
	public function inWeekly($dow) {
		return $this->weekly ? $this->weekly->inDow($dow) : false;
	}
	
	/**
	 * Public interfaces supported by each element.
	 */
	public function isValid() {
		return ($this->selection && $this->elements[$this->selection]
		      &&$this->elements[$this->selection]->isValid());
	}
	
	public function getNextDueDate($dt) {
		$rtn=null;
		if ($this->isValid()) {
			$ndt=	$this->elements[$this->selection]->getNextDueDate($dt);
			if ($this->isDateInRange($ndt)) {
				$rtn=$ndt;
			}
		}
		return $rtn;	
	}
	
	public function getNextDueDateInFuture($dt) {
		$rtn=null;
		if ($this->isValid()) {
			$now=gmmktime();
			while (true) {
				$dt=	$this->elements[$this->selection]->getNextDueDate($dt);
				if ($dt < $now) continue;
				else {
					$ndt=$dt;
					break;
				}
			}	
			if ($this->isDateInRange($ndt)) {
				$rtn=$ndt;
			}
		}
		return $rtn;	
	}
	
	public function adjustReleaseDate($dt) {
		return ($this->isValid() ? $this->elements[$this->selection]->adjustReleaseDate($dt) : $dt);	
	}
	
	public function isDateInRange($dt) {
		return ( !$this->dates || !$this->dates->isValid() || $this->dates->isDateInRange($dt)); 	
	}
	
	public function isDateRangePast() {
		return ($this->dates && $this->dates->isRangePast());
	}
}

/**
 * Schedule interface
 */
interface CalemScheduleInterface {
	public function isValid();
	public function getNextDueDate($dt);
	public function adjustReleaseDate($dt);	
} 
	
/**
 * Weekly
 */
class CalemScheduleWeekly implements CalemScheduleInterface {
	public static $DOW=array('dow_short_sun', 'dow_short_mon', 'dow_short_tue', 'dow_short_wed', 
						          'dow_short_thu', 'dow_short_fri', 'dow_short_sat');
	public static $DOW_MAP=array(
		'dow_short_sun'=>0, 
		'dow_short_mon'=>1, 
		'dow_short_tue'=>2, 
		'dow_short_wed'=>3, 
		'dow_short_thu'=>4, 
		'dow_short_fri'=>5, 
		'dow_short_sat'=>6
	);
							          
	protected $dows;
	
	public function __construct($arDow=null) {
		if ($arDow) {
			$this->dows=$arDow;
		} else {
			$this->dows=array();
		}
	}
	
	//Deserialize the object
	public function setJson($obj) {
		$this->dows=CalemJson::setJsonAsArray($obj);
	}
	
	public function getDows() {
		return $this->dows;
	}
	
	public function inDow($dow) {
		$rtn=false;
		if ($this->dows) {
			$rtn=(array_search($dow, $this->dows)!==false);
		}
		return $rtn;
	}
	
	/**
	 * Common APIs
	 */
	public function isValid() {
		return ($this->dows && count($this->dows)>0);	
	}
	
	/**
	 * Craw till next day slot.
	 */
	public function getNextDueDate($dt, $delta=1) {
		$rtn=null;
		for ($i=$delta; $i<=7; $i++) {
			$ndt=strtotime('+' . $i . ' day', $dt);
			$data=getdate($ndt);
			if ($this->inDow(self::$DOW[$data['wday']])) {
				$rtn=$ndt;
				break;	
			}	
		}
		return $rtn;
	}
	
	//Go for next due day.
	public function adjustReleaseDate($dt) {
		return $this->getNextDueDate($dt, 0);
	}
}
	
/**
 * CalemScheduleWeeks
 */
class CalemScheduleWeeks implements CalemScheduleInterface {
	protected $freq;
	protected $dow;
	
	public function __construct($freq=null, $dow=null) {
		$this->freq=$freq;
		$this->dow=$dow;
	}
	
	//Deserialize the object
	public function setJson($obj) {
		$this->freq=$obj['freq'];
		$this->dow=$obj['dow'];
	}
	
	public function getFreq() {
		return $this->freq;
	}
	
	public function getDow() {
		return $this->dow;
	}
	
	//Interface APIs
	public function isValid() {
		return ($this->freq);	
	}
	
	public function getNextDueDate($dt) {
		$ndt=strtotime('+' . $this->freq . ' weeks', $dt);
		return $this->adjustReleaseDate($ndt);
	}
	
	public function adjustReleaseDate($dt) {
		return ($this->dow) ? CalemText::getDateByDow($dt, CalemScheduleWeekly::$DOW_MAP[$this->dow]) : $dt;
	}
}
	
/**
 * CalemScheduleMonths
 */
class CalemScheduleMonths implements CalemScheduleInterface {
	public static $WEEKNO_MAP=array(
		'schedule_w1'=>0,
		'schedule_w2'=>1,
		'schedule_w3'=>2,
		'schedule_w4'=>3,
		'schedule_w5'=>4	
	);
	
	protected $freq;
	protected $weekNo;
	protected $dow;
	
	public function __construct($freq=null, $weekNo=null, $dow=null) {
		$this->freq=$freq;
		$this->weekNo=$weekNo;
		$this->dow = $dow;
	}
	
	//Deserialize the object
	public function setJson($obj) {
		$this->freq=$obj['freq'];
		$this->weekNo=$obj['weekNo'];
		$this->dow=$obj['dow'];
	}
	
	public function getFreq() {
		return $this->freq;
	}
	
	public function getWeekNo() {
		return $this->weekNo;
	}
	
	public function getDow() {
		return $this->dow;
	}
	
	//Interface APIs
	public function isValid() {
		return ($this->freq);	
	}
	
	public function getNextDueDate($dt) {
		$ndt=strtotime('+' . $this->freq . ' month', $dt);
		return $this->adjustReleaseDate($ndt);
	}
	
	public function adjustReleaseDate($ndt) {
		if ($this->weekNo) {
			$data=getdate($ndt);
			$wk=CalemScheduleMonths::$WEEKNO_MAP[$this->weekNo];
			$d=$wk*7 + 1;
			$ndt=mktime(0,0,0, $data['mon'], $d, $data['year']);
			if ($this->dow) {
				$ndt=CalemText::getDateByDow($ndt, CalemScheduleWeekly::$DOW_MAP[$this->dow], true);
			}
		}
		return $ndt;
	}
}
	
/**
 * CalemScheduleDays
 */
class CalemScheduleDays implements CalemScheduleInterface {
	protected $freq;
	
	public function __construct($freq=null) {
		$this->freq=$freq ? $freq : 0;
	}
	
	//Deserialize the object
	public function setJson($obj) {
		$this->freq=$obj['freq'] ? $obj['freq'] : 0;
	}
	
	public function getFreq() {
		return $this->freq;
	}
	
	//Interface APIs
	public function isValid() {
		return true;	
	}
	
	public function getNextDueDate($dt) {
		$ndt=strtotime('+' . $this->freq . ' day', $dt);
		return $this->adjustReleaseDate($ndt);
	}
	
	public function adjustReleaseDate($ndt) {
		return $ndt;
	}
}
	
/**
 * CalemScheduleDates
 */
class CalemScheduleDates {
	protected $start;
	protected $end;
	
	/**
	 * yyyy-mm-dd are of the formats of start and end dates here.
	 */
	public function __construct($start=null, $end=null) {
		$this->start=$start;
		$this->end=$end;
	}
	
	//Deserialize the object
	public function setJson($obj) {
		$this->start=$obj['start'];
		$this->end=$obj['end'];
	}
	
	public function getStart() {
		return $this->start;	
	}
	
	public function getEnd() {
		return $this->end;	
	}
	
	public function isValid() {
		return ($this->start || $this->end);	
	}
	
	public function isDateInRange($dt) {
		if (!$dt) return false;
		$dtStr=date('Y-m-d', $dt);
		$rtn= ($this->start)? $dtStr >= $this->start : true;
		$rtn = $rtn ? ($this->end ? $dtStr<= $this->end : true) : $rtn;
		return $rtn;	
	}
	
	public function isRangePast() {
		$today=date('Y-m-d');
		return ($this->end ? $this->end < $today : false);
	}
}
?>
