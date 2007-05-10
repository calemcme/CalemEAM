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

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoGenScheduleBo.php';
require_once _CALEM_DIR_ . 'test/server/modules/workorder/WoGenScheduleBoTestHelper.php';		

class WoGenScheduleBoTest extends PHPUnit2_Framework_TestCase {
	
	public function testScheduleBoStandingPm() {
		$scheduleBo=new CalemWoGenScheduleBo();
		$pmAssetRow=array(
			'id'=>'pm_asset_001',
			'pm_id'=>'pm_001',
			'asset_id'=>'asset_001'
		);
		$woDbo=CalemFactory::getDbo('workorder');
		$woDbo->executeBySql("delete from workorder where pm_id='pm_001'");
		$bl=$scheduleBo->hasStandingPm($pmAssetRow);
		$this->assertTrue(!$bl);
		
		//Now adding a wo
		$row=array(
			'wo_no'=>'101',
			'pm_id'=>'pm_001',
			'asset_id'=>'asset_001'
		);
		$woDbo->setChangeBulk($row);
		$woDbo->insert();
		
		$cnt=$woDbo->getCountBySqlParam('select count(*) from workorder where pm_id=? and asset_id=?', array($pmAssetRow['pm_id'], $pmAssetRow['asset_id']));
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "wo count=" . $cnt . "<br>"; 
		}
		
		$bl=$scheduleBo->hasStandingPm($pmAssetRow);
		$this->assertTrue($bl);
		
		//Now clean up it
		$woDbo->executeBySql("delete from workorder where pm_id='pm_001'");
		
		//Now adding a wo with status being closed
		$row=array(
			'wo_no'=>'101',
			'pm_id'=>'pm_001',
			'asset_id'=>'asset_001', 
			'status_id'=>'wos_closed'
		);
		$woDbo->setChangeBulk($row);
		$woDbo->insert();
		
		$cnt=$woDbo->getCountBySqlParam("select count(*) from workorder where pm_id=? and asset_id=? and status_id <> 'wos_closed'", array($pmAssetRow['pm_id'], $pmAssetRow['asset_id']));
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "wo count=" . $cnt . "<br>"; 
		}
		
		$bl=$scheduleBo->hasStandingPm($pmAssetRow);
		$this->assertTrue(!$bl);
		
		//Now clean up it
		$woDbo->executeBySql("delete from workorder where pm_id='pm_001'");		
	}
	
	public function testAddDueDate() {
		$scheduleBo=new CalemWoGenScheduleBo();
		$dueDates=array();
		$dueDate=null;
		$endDate=strtotime('+35 day');
		//a) invalid due date
		list($bl, $dueDates)=$scheduleBo->addDueDate($dueDate, $dueDates, $endDate);
		$this->assertTrue(!$bl && count($dueDates)==0);
		
		//b) invalid date range
		$txt="{CalemScheduleInfo: {selection: 'weeks'" . 
  			  ", months: {CalemScheduleWeeks: {freq: 2" .  
	                              ", dow: 'dow_short_mon'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '2006-04-07', end: '2007-04-02'}}" . 
	        "}}";
	   $et=base64_encode($txt);
		$scheduleBo->setPmReleaseSchedule($et);
		$dueDate=mktime();
		list($bl, $dueDates)=$scheduleBo->addDueDate($dueDate, $dueDates, $endDate);
		$this->assertTrue(!$bl && count($dueDates)==0);
		
		//c) valid dates
		$start=date('Y-m-d');
		$end=date('Y-m-d', strtotime('+40 day'));

		$txt="{CalemScheduleInfo: {selection: 'weeks'" . 
  			  ", weeks: {CalemScheduleWeeks: {freq: 2, dow: 'dow_short_mon'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '" . $start 
	        . "', end: '" . $end . "'}}" . 
	        "}}";
	   $et=base64_encode($txt);
		$scheduleBo->setPmReleaseSchedule($et);
		$dueDate=mktime();
		$dueDates=$scheduleBo->collectDueDates($dueDate, $dueDates, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "valid due dates=" . var_export($dueDates, true) . "<br>"; 
		}
		$this->assertTrue(!$bl && count($dueDates)==3);
	}
	
	public function testScheduleFixedByTimeInvalidDates() {
		$helper=new WoGenScheduleBoTestHelper();
		$helper->rmPmWithTimeScheduleInvalidDates();
		list($pmRow, $pmAssetRow) = $helper->addPmWithTimeScheduleInvalidDates();
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "invalidDates fixedByTime=" . var_export($dueDates, true) . "<br>"; 
		}
		$this->assertTrue(count($dueDates)==0);
		$helper->rmPmWithTimeScheduleInvalidDates();
	}
	
	public function testScheduleFixedByTime() {
		$helper=new WoGenScheduleBoTestHelper();
		$helper->rmPmWithTimeScheduleInvalidDates();
		list($pmRow, $pmAssetRow) = $helper->addPmWithTimeSchedule();
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+45 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "dueDates for fixedByTime=" . var_export($dueDates, true) . ", endDate=" . date('Y-m-d', $endDate) . "<br>";
			foreach ($dueDates as $dueDate) {
				echo 'dueDate=' . date('Y-m-d', $dueDate) . "<br>";	
			} 
		}
		$this->assertTrue(count($dueDates)==3 || count($dueDates)==4);
		$helper->rmPmWithTimeScheduleInvalidDates();
	}
	
	public function testScheduleFixedByMeter() {
		$helper=new WoGenScheduleBoTestHelper();
		$helper->rmPmWithTimeScheduleInvalidDates();
		//Do not schedule by meter.
		list($pmRow, $pmAssetRow) = $helper->addPmWithMeterSchedule(0);
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+45 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "dueDates for fixedByMeter (null)=" . var_export($dueDates, true) . "<br>";
		}
		$this->assertTrue(count($dueDates)==0);
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//Now schedule by meter.
		list($pmRow, $pmAssetRow) = $helper->addPmWithMeterSchedule(1);
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+45 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "dueDates for fixedByTime (with one)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1 && date('Y-m-d', $dueDates[0]) == date('Y-m-d'));
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//Now schedule by meter with release date adjusted by time info.
		list($pmRow, $pmAssetRow) = $helper->addPmWithMeterSchedule(1, 1);
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+45 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "dueDates for fixedByTime (date adjusted)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$data=getdate($dueDates[0]);
		$this->assertTrue($data['wday']==5); //Friday
		$helper->rmPmWithTimeScheduleInvalidDates();
	}
	
	public function testScheduleFixedByTimeAndMeter() {
		$helper=new WoGenScheduleBoTestHelper();
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//a) Schedule by time without schedule info.
		list($pmRow, $pmAssetRow) = $helper->addPmWithTimeAndMeterSchedule(1);
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+50 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "byTimeAndMeter for byTimeNoScheduleInfo (today)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1 && date('Y-m-d')==date('Y-m-d', $dueDates[0]));
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//b) Schedule by time with schedule info
		list($pmRow, $pmAssetRow) = $helper->addPmWithTimeAndMeterSchedule(1,0,1);
		$schedBo=new CalemWoGenScheduleBo();
		$data=getDate();
		$dt=mktime(0,0,0, $data['mon'],1,$data['year']);
		$endDate=strtotime('+50 day', $dt);
		
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "byTimeAndMeter for byTime ScheduleInfo (2 release)=" . date('Y-m-d', $dueDates[0]) . ", " . date('Y-m-d', $dueDates[1]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==2);
		$data1=getDate($dueDates[0]);
		$data2=getDate($dueDates[1]);
		$this->assertTrue($data1['wday']==$data2['wday'] && $data1['wday']==5);
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//c) schedule by meter only
		list($pmRow, $pmAssetRow) = $helper->addPmWithTimeAndMeterSchedule(0,1,0);
		$schedBo=new CalemWoGenScheduleBo();
		$data=getDate();
		$dt=mktime(0,0,0, $data['mon'],1,$data['year']);
		$endDate=strtotime('+50 day', $dt);
		
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "byTimeAndMeter for byMeter NoScheduleInfo (1 release - nextDueDate (2 from today))=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1 && date('Y-m-d', strtotime('+2 day'))==date('Y-m-d', $dueDates[0]));
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//d) schedule by meter with schedule
		list($pmRow, $pmAssetRow) = $helper->addPmWithTimeAndMeterSchedule(0,1,1);
		$schedBo=new CalemWoGenScheduleBo();
		$data=getDate();
		$dt=mktime(0,0,0, $data['mon'],1,$data['year']);
		$endDate=strtotime('+50 day', $dt);
		
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "byTimeAndMeter for byMeter ScheduleInfo (1 release adjusted)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$relDt=strtotime('+2 day');
		$this->assertTrue(date('Y-m-d', $dueDates[0]) == date('Y-m-d', $relDt));
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		
		//e) schedule by time and meter, first release date is adjusted.
		list($pmRow, $pmAssetRow) = $helper->addPmWithTimeAndMeterSchedule(1,1,1);
		$schedBo=new CalemWoGenScheduleBo();
		$data=getDate();
		$dt=mktime(0,0,0, $data['mon'],1,$data['year']);
		$endDate=strtotime('+50 day', $dt);
		
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "byTimeAndMeter for byMeterAndTime (2 release adjusted)=" . var_export($dueDates, true) . "<br>";
			foreach ($dueDates as $dueDate) {
				echo 'dueDate=' . date('Y-m-d', $dueDate) . "<br>";	
			} 
		}
		$this->assertTrue(count($dueDates)==2);
		/*			
		$relDt=strtotime('+2 day');
		$this->assertTrue(date('Y-m-d', $dueDates[0]) == date('Y-m-d', $relDt));
		*/
		$data=getDate($dueDates[1]);
		$this->assertTrue($data['wday']==5);
		$helper->rmPmWithTimeScheduleInvalidDates();
	}
	
	/**
	 * Floating cases
	 */
	public function testScheduleFloatingByTime() {
		$helper=new WoGenScheduleBoTestHelper();
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//a) no schedule info, floating by time
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule(array('byTime'=>true));
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byTimeNoSchedule (today)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//b) schedule info, floating by time
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule(array('byTime'=>true, 'addTimeSchedule'=>true));
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byTime ScheduleInfo (adjusted)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$data=getDate($dueDates[0]);
		$this->assertTrue($data['wday']==5);
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//c) schedule info, floating by time with close date
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule(array('byTime'=>true, 'addTimeSchedule'=>true, 'addCloseDate'=>true));
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+50 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byTime ScheduleInfo (closeDate adjusted)=" . date('Y-m-d', $dueDates[0]) . ", dueDates=" . var_export($dueDates, true) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$data=getDate($dueDates[0]);
		$this->assertTrue($data['wday']==5);
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//d) schedule info, floating by time with standing wo
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule(
					array('byTime'=>true, 'addTimeSchedule'=>true, 'addCloseDate'=>true, 'addWo'=>true));
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byTime ScheduleInfo (standing Wo)=" . var_export($dueDates, true) . "<br>";
		}
		$this->assertTrue(count($dueDates)==0);
		$helper->rmPmWithTimeScheduleInvalidDates();
	}
	
	public function testScheduleFloatingByMeter() {
		$helper=new WoGenScheduleBoTestHelper();
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//a) no schedule info, floating by meter
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule(array('byMeter'=>true));
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byMeterNoSchedule (today)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//b) schedule info, floating by meter
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule(
		      array('byMeter'=>true, 'addTimeSchedule'=>true));
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byMeter ScheduleInfo (adjusted to nextDueDate)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$this->assertTrue(date('Y-m-d', strtotime('+2 day')) == date('Y-m-d', $dueDates[0]));
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//c) schedule info, floating by meter with close date
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule(
		        array('byMeter'=>true, 'addTimeSchedule'=>true, 'addCloseDate'=>true));
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byMeter ScheduleInfo (closeDate not used)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$this->assertTrue(date('Y-m-d', strtotime('+2 day')) == date('Y-m-d', $dueDates[0]));
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//d) schedule info, floating by time with standing
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule(
					array('byMeter'=>true, 'addTimeSchedule'=>true, 'addCloseDate'=>true, 'addWo'=>true));
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byMeter ScheduleInfo (standing Wo)=" . var_export($dueDates, true) . "<br>";
		}
		$this->assertTrue(count($dueDates)==0);
		$helper->rmPmWithTimeScheduleInvalidDates();
	}
	
	public function testScheduleFloatingByTimeAndMeter() {
		$helper=new WoGenScheduleBoTestHelper();
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		$ar=array('byMeter'=>true, 'byTime'=>true);
		//a) no schedule info
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule($ar);
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byTime&Meter NoSchedule (today earlier than nextDueDate)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//b) schedule info
		$ar['addTimeSchedule']=true;
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule($ar);
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byTime&Meter ScheduleInfo (adjusted to nextDueDate)=" . var_export($dueDates, true) . "<br>";
			echo 'DueDate=' . date('Y-m-d', $dueDates[0]). "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		/*
		$this->assertTrue(date('Y-m-d', strtotime('+2 day')) == date('Y-m-d', $dueDates[0]));
		*/
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//c) schedule info, floating by meter with close date
		$ar['addCloseDate']='true';
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule($ar);
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byTime&Meter ScheduleInfo (earliest date so closeDate not used)=" . date('Y-m-d', $dueDates[0]) . "<br>";
		}
		$this->assertTrue(count($dueDates)==1);
		$this->assertTrue(date('Y-m-d', strtotime('+2 day')) == date('Y-m-d', $dueDates[0]));
		$helper->rmPmWithTimeScheduleInvalidDates();
		
		//d) schedule info, with standing
		$ar['addWo']=true;
		list($pmRow, $pmAssetRow) = $helper->addFloatingTimeAndMeterSchedule($ar);
		$schedBo=new CalemWoGenScheduleBo();
		$endDate=strtotime('+40 days');
		$dueDates=$schedBo->schedulePm($pmRow, $pmAssetRow, $endDate);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Floating for byTime&Meter ScheduleInfo (standing Wo)=" . var_export($dueDates, true) . "<br>";
		}
		$this->assertTrue(count($dueDates)==0);
		$helper->rmPmWithTimeScheduleInvalidDates();
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new WoGenScheduleBoTest();
	$res->testScheduleBoStandingPm();
	$res->testAddDueDate();
	$res->testScheduleFixedByTimeInvalidDates();
	$res->testScheduleFixedByTime();
	$res->testScheduleFixedByMeter();
	$res->testScheduleFixedByTimeAndMeter();
	//Floating
	$res->testScheduleFloatingByTime();
	$res->testScheduleFloatingByMeter();
	$res->testScheduleFloatingByTimeAndMeter();
}
?>
