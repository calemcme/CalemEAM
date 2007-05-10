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
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoGenBo.php';
require_once _CALEM_DIR_ . 'test/server/modules/workorder/WoGenDepReleaseBoTestHelper.php';
require_once _CALEM_DIR_ . 'server/modules/pm/CalemPmScheduleBo.php';	

class WoGenBoTest extends PHPUnit2_Framework_TestCase {
	
	//Test that semaphore is recreated if lost somehowever.
	public function testWoSemaphoreRecreate() {
		$semDbo=CalemFactory::getDbo('wo_semaphore');
		$semDbo->deleteBySqlParam('delete from wo_semaphore where id=?', 'wo_generation');
		$this->assertTrue($semDbo->getCountBySqlParam('select count(*) from wo_semaphore where id=?', 'wo_generation')==0);
		$woGenBo=new CalemWoGenBo();
		$bl=$woGenBo->getSemaphore();
		$this->assertTrue($bl);
		$row=$semDbo->fetchById('wo_generation');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "semaphore created: " . var_export($row, true) . "<br>"; 
		}
		$diff=$this->getTimeDiff($row);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "time diff: " . ($expiration - $modified) . "<br>"; 
		}		
		$this->assertTrue( $diff == 60);	
	}
	
	private function getTimeDiff($row) {
		$expiration=CalemText::parseServerDateTime($row['expiration']);
		$modified=CalemText::parseServerDateTime($row['modified_time']);
		return $expiration - $modified;
	}
	
	//Test normal semaphore op
	public function testWoSemaphoreOp() {
		$semDbo=CalemFactory::getDbo('wo_semaphore');
		$woGenBo=new CalemWoGenBo();
		$woGenBo->getSemaphore(); //Ensure init semaphore.
		//Check clear semaphore
		$woGenBo->clearSemaphore();
		$row=$semDbo->fetchById('wo_generation');
		$diff=$this->getTimeDiff($row);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "semaphore: " . var_export($row, true) . ", diff=$diff" . "<br>"; 
		}
		$this->assertTrue($diff== -24*60*60);
		
		//Ensure clear semaphore make it available
		$woGenBo->clearSemaphore();
		$bl=$woGenBo->getSemaphore();
		$this->assertTrue($bl); //So semaphore is available
		
		
		//Now extend semphore
		$woGenBo->extendSemaphore();
		$bl=$woGenBo->getSemaphore();
		$this->assertTrue(!$bl);
		//Check interval
		$row=$semDbo->fetchById('wo_generation');
		$diff=$this->getTimeDiff($row);
		$this->assertTrue(abs($diff -60) < 3);	
	}
	
	//Wo generation entry test
	public function testWoGenEntry() {
		$wogenDbo=CalemFactory::getDbo('wo_generation');
		$wogenDbo->deleteBySql('delete from wo_generation');
		//Now test a few items
		$woGenBo=new CalemWoGenBo();
		$id=$woGenBo->addWogenEntry();
		$row=$wogenDbo->fetchById($id);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "new wogen entry: " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['status_id']=='wgn_started');
		$this->assertTrue($row['wo_count']==0);

		//Complete it
		$woGenBo->completeWoGenEntry();
		$row=$wogenDbo->fetchById($id);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "complete entry: " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['status_id']=='wgn_complete');
		$this->assertTrue($row['wo_count']==0);
		
		//Now make it fail
		$woGenBo->updateWogenEntryWithError('ERROR');
		$row=$wogenDbo->fetchById($id);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "error entry: " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['status_id']=='wgn_failed');
		$this->assertTrue($row['note']=='ERROR');
		
		//Ensure there's one row
		$this->assertTrue($wogenDbo->getCountBySqlParam('select count(*) from wo_generation where id=?', $id)==1);
	}
	
	private function cleanWoGenEntry() {
		$wogenDbo=CalemFactory::getDbo('wo_generation');
		$wogenDbo->deleteBySql('delete from wo_generation');
	}
	
	public function testWoGenDep() {
		$endDate=strtotime('+50 day');
		$helper=new WoGenDepReleaseBoTestHelper();
		$helper->cleanup();
		$this->cleanWoGenEntry();
		
		//Build test data
		$helper->buildData();
		$woGenBo=new CalemWoGenBo();
		//Ensure semaphore is available.
		$woGenBo->clearSemaphore();
		
		$woGenBo->generateWo(null, $endDate);
		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "wo released: " . $woGenBo->getWoCount() . "<br>"; 
		}
		$this->assertTrue($woGenBo->getWoCount() == 5);
		
		//Start verification
		$dbo=CalemFactory::getDbo('pm');
		//1 - wo gen for pm_001
		$cnt=$dbo->getCountBySqlParam('select count(*) from workorder where pm_id=?', 'pm_001');
		$this->assertTrue($cnt==1);
		
		//2 - wo gen for pm_002
		$cnt=$dbo->getCountBySqlParam('select count(*) from workorder where pm_id=?', 'pm_002');
		$this->assertTrue($cnt==1);
		
		//3 - two wo gen for pm_003
		$cnt=$dbo->getCountBySqlParam('select count(*) from workorder where pm_id=?', 'pm_003');
		$this->assertTrue($cnt==2);
		
		//4 - No wo gen for pm_004
		$cnt=$dbo->getCountBySqlParam('select count(*) from workorder where pm_id=?', 'pm_004');
		$this->assertTrue($cnt==1);
		
		//Verify release date
		$woPm1Rows=$dbo->fetchBySqlParam('select * from workorder where pm_id=?', 'pm_001');
		$woPm2Rows=$dbo->fetchBySqlParam('select * from workorder where pm_id=?', 'pm_002');
		$woPm3Rows=$dbo->fetchBySqlParam('select * from workorder where pm_id=?', 'pm_003');
		$woPm4Rows=$dbo->fetchBySqlParam('select * from workorder where pm_id=?', 'pm_004');
		
		$this->assertTrue($woPm1Rows[0]['planned_start_time']==$woPm2Rows[0]['planned_start_time']);
		$this->assertTrue($woPm2Rows[0]['planned_start_time']==$woPm3Rows[0]['planned_start_time']);
		$this->assertTrue($woPm2Rows[0]['planned_start_time']==$woPm3Rows[1]['planned_start_time']);
		
		$pm1Time=$woPm1Rows[0]['planned_start_time'];
		$dt1=CalemText::parseServerDateTime($pm1Time);
		$pm4Time=$woPm4Rows[0]['planned_start_time'];
		$dt2=CalemText::parseServerDateTime($pm4Time);
		$schedBo=new CalemPmScheduleBo($helper->getReleaseSchedule());
		$newDt=$schedBo->getNextDueDate($dt1);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "pm1 planned start time: " . date('Y-m-d', $dt1) . ", pm4: " . date("Y-m-d", $dt2) .  ", newDt=" . date('Y-m-d', $newDt) . "<br>"; 
		}
		$this->assertTrue(date('Y-m-d', $newDt) == date('Y-m-d', $dt2));
		//Verify woGenEntry
		$genEntryDbo=CalemFactory::getDbo('wo_generation');
		$rows=$genEntryDbo->fetchBySql('select * from wo_generation');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "gen entry =" . var_export($rows, true) . "<br>"; 
		}
		$this->assertTrue($rows[0]['status_id']=='wgn_complete');
		$this->assertTrue($rows[0]['wo_count']==5);

		//Done verification, cleaning up
		$helper->cleanup();
		$this->cleanWoGenEntry();
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new WoGenBoTest();
	$res->testWoSemaphoreRecreate();
	$res->testWoSemaphoreOp();
	$res->testWoGenEntry();
	$res->testWoGenDep();
}
?>
