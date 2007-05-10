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
require_once _CALEM_DIR_ . 'server/modules/pm/CalemPmScheduleBo.php';
require_once _CALEM_DIR_ . 'test/server/modules/workorder/WoGenDepReleaseBoTestHelper.php';
require_once _CALEM_DIR_ . 'server/modules/pm/CalemPmDependencyBo.php';		

class WoGenDepReleaseBoTest extends PHPUnit2_Framework_TestCase {
	
	//Verify that PDM is set up properly for this test case.
	public function testPdm() {
		$helper=new WoGenDepReleaseBoTestHelper();
		$helper->cleanup();
		//Build test data
		list($pmRow, $pmAssetRow) = $helper->buildData();
		$depBo=new CalemPmDependencyBo();
		$pdm=$depBo->getPdm();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "pdm=" . var_export($pdm, true). '<br>'; 
		}
		//Let's verify the levels
		$this->assertTrue(count($pdm['map']['pm_001'])==1);
		$this->assertTrue(count($pdm['map']['pm_002'])==2);
		$this->assertTrue(count($pdm['map']['pm_003'])==0);
		$this->assertTrue(count($pdm['map']['pm_004'])==0);
		//Done with the test
		$helper->cleanup();
	}
	
	public function testDepReleasePm_3() {
		$dueDate=strtotime('+3 day');
		$dueDates=array($dueDate);
		$this->depReleasePm($dueDates);
	}
	public function testDepReleasePm_30() {
		$dueDate=strtotime('+3 day');
		$dueDate2=strtotime('+40 day');
		$dueDates=array($dueDate, $dueDate2);
		$this->depReleasePm($dueDates);
	}
	
	public function depReleasePm($dueDates) {
		$dueDateCount=count($dueDates);
		$helper=new WoGenDepReleaseBoTestHelper();
		$helper->cleanup();
		//Build test data
		list($pmRow, $pmAssetRow) = $helper->buildData();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "pmRow=" . var_export($pmRow, true) . "<br>"; 
		}
		$depBo=new CalemPmDependencyBo();
		$pdm=$depBo->getPdm();
		$woGenBo=new CalemWoGenBo();
		$woGenBo->setPdm($pdm);
		$woGenBo->releasePm($dueDates, $pmRow, $pmAssetRow, true);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "wo released: " . $woGenBo->getWoCount() . "<br>"; 
		}
		//Start verification
		$dbo=CalemFactory::getDbo('pm');
		//1 - wo gen for pm_001
		$cnt=$dbo->getCountBySqlParam('select count(*) from workorder where pm_id=?', 'pm_001');
		$this->assertTrue($cnt==$dueDateCount);
		
		//2 - wo gen for pm_002
		$cnt=$dbo->getCountBySqlParam('select count(*) from workorder where pm_id=?', 'pm_002');
		$this->assertTrue($cnt==$dueDateCount);
		
		//3 - two wo gen for pm_003
		$cnt=$dbo->getCountBySqlParam('select count(*) from workorder where pm_id=?', 'pm_003');
		$this->assertTrue($cnt==$dueDateCount*2);
		
		//4 - No wo gen for pm_004
		$cnt=$dbo->getCountBySqlParam('select count(*) from workorder where pm_id=?', 'pm_004');
		$this->assertTrue($cnt==0);
		
		//Wo count is 4
		$cnt=$woGenBo->getWoCount();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "woGen count=" . $cnt . " for release dates: " . var_export($dueDates, true) .  "<br>"; 
		}
		
		//Let's verify that next due date is updated properly for all the PMs involved
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		$pmAssetRows=$pmAssetDbo->fetchBySqlParam('select * from pm_asset where pm_id=?', 'pm_001');
		$pmAssetRow=$pmAssetRows[0];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "pm_001 row=" . var_export($pmAssetRow, true) .  "<br>"; 
		}
		$nextDueDate=$pmAssetRow['next_due_date'];
		for ($i=2; $i<=4; $i++) {
			$rows=$pmAssetDbo->fetchBySqlParam('select * from pm_asset where pm_id=?', 'pm_00' . $i);
			foreach ($rows as $row) {
				if (!isset($_ENV['CALEM_BATCH_TEST'])) {
					echo "pm_00" . $i ." row=" . var_export($row, true) .  "<br>"; 
				}	
				$this->assertTrue($row['next_due_date']==$nextDueDate);
			}	
		}
		//Let's verify wo relation ship
		//1 -> 2 before
		//2 -> 3 after
		$woPm1Rows = $pmAssetDbo->fetchBySqlParam('select * from workorder where pm_id=? order by planned_start_time DESC', 'pm_001');
		$woPm2Rows = $pmAssetDbo->fetchBySqlParam('select * from workorder where pm_id=? order by planned_start_time DESC', 'pm_002');
		$woPm3Rows = $pmAssetDbo->fetchBySqlParam('select * from workorder where pm_id=? order by planned_start_time DESC', 'pm_003');
		//Process 1 or two cases
		if (count($dueDates)==1) {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				//echo "wo pm1 row=" .var_export($woPm1Rows[0], true) .  "<br>"; 
				//echo "wo pm2 row=" .var_export($woPm2Rows[0], true) .  "<br>";
				//echo "wo pm3 row=" .var_export($woPm3Rows, true) .  "<br>";
			}	
			$this->assertTrue($woPm1Rows[0]['parent_wo_id']== $woPm2Rows[0]['id']); //PM1 after PM2
			$this->assertTrue($woPm3Rows[0]['parent_wo_id']== $woPm2Rows[0]['id']);
			$this->assertTrue($woPm3Rows[1]['parent_wo_id']== $woPm2Rows[0]['id']);
		}
		//Done with verification
		$helper->cleanup();
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new WoGenDepReleaseBoTest();
	$res->testPdm();
	$res->testDepReleasePm_3();
	$res->testDepReleasePm_30();
}
?>
