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

 
/** 
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */ 

//Note that PHPUnit2 must be on the include path for it to work.
require_once 'PHPUnit2/Framework/TestCase.php';

if (!defined('_CALEM_DIR_')) {
	if (!isset($_ENV['CALEM_DIR'])) {
		chdir('../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	}  
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/modules/pm/CalemPmScheduleBo.php';

class PmScheduleBoTest extends PHPUnit2_Framework_TestCase {
	
	public function testEmptySchedBo() {
		$schedBo=new CalemPmScheduleBo('');
		$this->assertTrue(!$schedBo->isValid());
		
		$schedBo=new CalemPmScheduleBo(null);
		$this->assertTrue(!$schedBo->isValid());
	}	
	
	public function testWeeklyEmpty() {
		$schedBo=new CalemPmScheduleBo('');
		$dt=$schedBo->getNextDueDate(mktime());
		$this->assertTrue(!$dt);
	}	
	
	public function testWeeklyDate() {
		$txt="{CalemScheduleInfo: {selection: 'weekly'" . 
  			  ", weekly: {CalemScheduleWeekly: ['dow_short_wed']}" . 
	        ", dates:  {CalemScheduleDates: {start: '2007-04-07', end: '2007-09-08'}}" . 
	        "}}";
	   $et=base64_encode($txt);
	   $schedBo=new CalemPmScheduleBo($et);
	   $schedInfo=$schedBo->getScheduleInfo();
	   $dows=$schedInfo->getWeekly()->getDows();
	   $this->assertTrue($schedInfo->getSelection()=='weekly'
	                  && $dows[0]=='dow_short_wed');
	   //Make it the same day
	   $dt=mktime(0, 0, 0, 4, 4, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
	   $this->assertTrue($ndt==$dt);
	   
	   //Make it before the date
	   $dt=mktime(0, 0, 0, 4, 2, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
		$data=getdate($ndt);
	   $this->assertTrue($data['year']==2007 && $data['mday']==4 && $data['mon']==4);
	   
	   //Make it past the date
	   $dt=mktime(0, 0, 0, 4, 5, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
		$data=getdate($ndt);
	   $this->assertTrue($data['year']==2007 && $data['mday']==11 && $data['mon']==4);
	}	
	
	public function testWeeksDate() {
		$txt="{CalemScheduleInfo: {selection: 'weeks'" . 
  			  ", weeks: {CalemScheduleWeeks: {freq: 3, dow: 'dow_short_fri'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '2007-04-07', end: '2007-09-08'}}" . 
	        "}}";
	   $et=base64_encode($txt);
	   $schedBo=new CalemPmScheduleBo($et);
	   $schedInfo=$schedBo->getScheduleInfo();
	   $this->assertTrue($schedInfo->getSelection()=='weeks'
	                  && $schedInfo->getWeeks()->getFreq()==3
	                  && $schedInfo->getWeeks()->getDow()=='dow_short_fri');
	                  
	   //same dow
	   $dt=mktime(0, 0, 0, 4, 6, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
	   $data=getdate($ndt);
	   $this->assertTrue($data['mday']==27 && $data['mon']==4 && $data['year']==2007);
	   
	   //Make it before the date
	   $dt=mktime(0, 0, 0, 4, 2, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
		$data=getdate($ndt);
	   $this->assertTrue($data['year']==2007 && $data['mday']==27 && $data['mon']==4);
	   
	   //Make it past the date
	   $dt=mktime(0, 0, 0, 4, 7, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
		$data=getdate($ndt);
	   $this->assertTrue($data['year']==2007 && $data['mday']==27 && $data['mon']==4);
	}	
	
	public function testMonthsNoWeekNo() {
		$txt="{CalemScheduleInfo: {selection: 'months'" . 
  			  ", months: {CalemScheduleMonths: {freq: 3, dow: 'dow_short_fri'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '2007-04-07', end: '2007-09-08'}}" . 
	        "}}";
	   $et=base64_encode($txt);
	   $schedBo=new CalemPmScheduleBo($et);
	   $schedInfo=$schedBo->getScheduleInfo();
	   $this->assertTrue($schedInfo->getSelection()=='months'
	                  && $schedInfo->getMonths()->getFreq()==3
	                  && $schedInfo->getMonths()->getDow()=='dow_short_fri');
	                  
	   //same dow
	   $dt=mktime(0, 0, 0, 4, 2, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
	   $data=getdate($ndt);
	   $this->assertTrue($data['mday']==2 && $data['mon']==7 && $data['year']==2007);
	}	
	
	public function testMonthsNoDow() {
		$txt="{CalemScheduleInfo: {selection: 'months'" . 
  			  ", months: {CalemScheduleMonths: {freq: 3, weekNo: 1}}" . 
	        ", dates:  {CalemScheduleDates: {start: '2007-04-07', end: '2007-09-08'}}" . 
	        "}}";
	   $et=base64_encode($txt);
	   $schedBo=new CalemPmScheduleBo($et);
	   $schedInfo=$schedBo->getScheduleInfo();
	   $this->assertTrue($schedInfo->getSelection()=='months'
	                  && $schedInfo->getMonths()->getFreq()==3);
	                  
	   //same wk
	   $dt=mktime(0, 0, 0, 4, 2, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
	   $data=getdate($ndt);
	   $this->assertTrue($data['mday']==1 && $data['mon']==7 && $data['year']==2007);
	   
	   $dt=mktime(0, 0, 0, 4, 27, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
	   $data=getdate($ndt);
	   $this->assertTrue($data['mday']==1 && $data['mon']==7 && $data['year']==2007);
	}	
	
	public function testMonthsNoDates() {
		$txt="{CalemScheduleInfo: {selection: 'months'" . 
  			  ", months: {CalemScheduleMonths: {freq: 1, weekNo: 'schedule_w1', dow: 'dow_short_mon'}}" . 
	        "}}";
	   $et=base64_encode($txt);
	   $schedBo=new CalemPmScheduleBo($et);
	   $schedInfo=$schedBo->getScheduleInfo();
	   $this->assertTrue($schedInfo->getSelection()=='months'
	                  && $schedInfo->getMonths()->getFreq()==1
	                  && $schedInfo->getMonths()->getWeekNo()=='schedule_w1'
	                  && $schedInfo->getMonths()->getDow()=='dow_short_mon');
	                  
	   //diff wk
	   $dt=mktime(0, 0, 0, 4, 1, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "noDates first dueDate in may=" . date('Y-m-d', $ndt) . "<br>"; 
		}
		$data=getDate($ndt);
		$this->assertTrue($data['wday']==1 && $data['mon']==5 && $data['mday']==7 && $data['year']==2007);
		$ndt=$schedBo->getNextDueDate($ndt);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "2nd dueDate in june=" . date('Y-m-d', $ndt) . "<br>"; 
		}
		$data=getDate($ndt);
	   $this->assertTrue($data['wday']==1 && $data['mon']==6 && $data['mday']==4 && $data['year']==2007);
	}	
	
	public function testMonths() {
		$txt="{CalemScheduleInfo: {selection: 'months'" . 
  			  ", months: {CalemScheduleMonths: {freq: 3, weekNo: 'schedule_w4', dow: 'dow_short_fri'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '2007-04-07', end: '2007-09-08'}}" . 
	        "}}";
	   $et=base64_encode($txt);
	   $schedBo=new CalemPmScheduleBo($et);
	   $schedInfo=$schedBo->getScheduleInfo();
	   $this->assertTrue($schedInfo->getSelection()=='months'
	                  && $schedInfo->getMonths()->getFreq()==3
	                  && $schedInfo->getMonths()->getWeekNo()=='schedule_w4'
	                  && $schedInfo->getMonths()->getDow()=='dow_short_fri');
	                  
	   //diff wk
	   $dt=mktime(0, 0, 0, 4, 2, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "weekNo ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
	   $data=getdate($ndt);
	   $this->assertTrue($data['mday']==27 && $data['mon']==7 && $data['year']==2007);
	   
	   //other wks
	   $dt=mktime(0, 0, 0, 4, 30, 2007);
	   $ndt=$schedBo->getNextDueDate($dt);
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "weekNo ndt=" . date('Y-m-d', $ndt) . "<br>"; 
		}
	   $data=getdate($ndt);
	   $this->assertTrue($data['mday']==27 && $data['mon']==7 && $data['year']==2007);
	}	
	
	public function testDateInRange() {
		$txt="{CalemScheduleInfo: {selection: 'months'" . 
  			  ", months: {CalemScheduleMonths: {freq: 3, weekNo: 'schedule_w4', dow: 'dow_short_fri'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '2007-04-07', end: '2007-09-08'}}" . 
	        "}}";
	   $et=base64_encode($txt);
	   $schedBo=new CalemPmScheduleBo($et);
	   $schedInfo=$schedBo->getScheduleInfo();
	   $this->assertTrue($schedInfo->getDates()->getStart()=='2007-04-07'
	                  &&$schedInfo->getDates()->getEnd()=='2007-09-08');
	   //inRange
	   $dt=mktime(0,0,0,4,10,2007);
	   $this->assertTrue($schedBo->isDateInRange($dt));
	   //outof range
	   $dt=mktime(0,0,0,4,2,2007);
	   $this->assertTrue(!$schedBo->isDateInRange($dt));
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$jt=new PmScheduleBoTest();
	$jt->testEmptySchedBo();
	//weekly
	$jt->testWeeklyEmpty();
	$jt->testWeeklyDate();
	//weeks
	$jt->testWeeksDate();
	//months
	$jt->testMonthsNoWeekNo();
	$jt->testMonthsNoDow();
	$jt->testMonthsNoDates();
	$jt->testMonths();
	//testDateInRange
	$jt->testDateInRange();
}
?>
