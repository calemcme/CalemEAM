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
		chdir('../../../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';	
require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemCustomInfoManager.php';	

/**
 * This class tests UserDao class.
 */
class CalemScheduleInfoTest extends PHPUnit2_Framework_TestCase {
       
	public function testWeekly() {
	  	$wkly=new CalemScheduleWeekly();
	  	$this->assertTrue(count($wkly->getDows())==0); 
	  	
	  	$obj=array('CalemScheduleWeekly'=>array());
	  	$ds=CalemJson::setJson($obj);
	  	$this->assertTrue(count($ds->getDows())==0);
	 
	  	$wkly=new CalemScheduleWeekly(array('dow_short_mon', 'dow_short_thu'));
	  	$this->assertTrue(count($wkly->getDows()) == 2);
	}
	
	public function testWeeks() {
	  	$weeks=new CalemScheduleWeeks();
	  	$this->assertTrue($weeks->getFreq()==null && $weeks->getDow()==null);
	  	
	  	$schedule=new CalemScheduleInfo('weeks', null, $weeks);
	  	$this->assertTrue($schedule->getWeeks()->getFreq()==null);
	  	
	  	$weeks=new CalemScheduleWeeks(3, 'dow_short_mon');
	  	$this->assertTrue($weeks->getFreq()==3 && $weeks->getDow()=='dow_short_mon');
	  	
	  	$schedule=new CalemScheduleInfo('weeks', null, $weeks);
	  	$this->assertTrue($schedule->getWeeks()->getFreq()==3);
	  	$this->assertTrue($schedule->getWeeks()->getDow()=='dow_short_mon');
	}
	
	
	public function testMonths() {  	
	  	$months=new CalemScheduleMonths();
	  	$this->assertTrue($months->getFreq()==null && $months->getDow()==null);
	  	
	  	$schedule=new CalemScheduleInfo('months', null, null, $months);
	  	$this->assertTrue($schedule->getMonths()->getFreq()==null);
	  	
	  	$months=new CalemScheduleMonths(2, 'schedule_w1', 'dow_short_tue');
	  	$this->assertTrue($months->getFreq()==2 && $months->getWeekNo() == 'schedule_w1' && $months->getDow()=='dow_short_tue');
	  
	  	
	  	$schedule=new CalemScheduleInfo('months', null, null, $months);
	  	$ms=$schedule->getMonths();
	  	$this->assertTrue($months===$ms);
	}
	
	public function testDates() {  	
	  	$dates=new CalemScheduleDates();
	  	$this->assertTrue($dates->getStart()==null && $dates->getEnd()==null);
	  	
	  	$months=new CalemScheduleMonths();
	  	$schedule=new CalemScheduleInfo('months', null, null, $months, $dates);
	  	$this->assertTrue($schedule->getDates()==$dates);
	  	
	  	$dates=new CalemScheduleDates('2007/02/19');
	  	$start=CalemText::parseServerDate($dates->getStart());
		$si=getDate($start);
		$this->assertTrue($si['year']==2007 && $si['mon']==02 && $si['mday']==19);
	  	$this->assertTrue($dates->getEnd()==null);
  	}
  
  	function testInWeekly() {
		$wkly=new CalemScheduleWeekly();        	
		$schedule=new CalemScheduleInfo('weekly', $wkly);
		$this->assertFalse($schedule->inWeekly('dow_short_mon'));
		
		$wkly=new CalemScheduleWeekly(array('dow_short_mon', 'dow_short_thu'));        	
		$schedule=new CalemScheduleInfo('weekly', $wkly);
		$this->assertTrue($wkly===$schedule->getWeekly());
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "weekly=" . var_export($wkly->getDows(), true) . "<br>";
			//echo 'array search=' . array_search('dow_short_mon', $wkly->getDows()) . "<br>"; 
		}
		$this->assertTrue($schedule->inWeekly('dow_short_mon'));
		$this->assertTrue($schedule->inWeekly('dow_short_thu'));
		$this->assertFalse($schedule->inWeekly('dow_short_fri'));
  	}
  	
  	public function testDecode() {
  		$txt="{CalemScheduleInfo: {selection: 'months'" . 
  			  ", months: {CalemScheduleMonths: {freq: 3" .  
	                              ", weekNo: 'schedule_w1', dow: 'dow_short_mon'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '2007-04-07', end: '2007-09-08'}}" . 
	        "}}";
	   $et=base64_encode($txt);
	   $schedule=CalemScheduleInfo::decode($et);
	   //Verify it's right
	   if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "schedule=" . var_export($schedule, true) . "<br>"; 
		}
	   $this->assertTrue($schedule->getSelection()=='months');
	   $this->assertTrue($schedule->getMonths()!=null);
	   $this->assertTrue($schedule->getDates()!=null);
	   $ms=$schedule->getMonths();
	   $this->assertTrue($ms->getFreq()==3);
	   $this->assertTrue($ms->getWeekNo()=='schedule_w1');
	   $this->assertTrue($ms->getDow()=='dow_short_mon');
	   $ds=$schedule->getDates();
	   $this->assertTrue($ds->getStart()=='2007-04-07');
	   $this->assertTrue($ds->getEnd()=='2007-09-08');  			
  	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemScheduleInfoTest();
	$res->testWeekly();
	$res->testWeeks();
	$res->testMonths();
	$res->testDates();
	$res->testInWeekly();
	$res->testDecode();
}
?>
