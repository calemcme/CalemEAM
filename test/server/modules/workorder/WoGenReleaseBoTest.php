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
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoGenReleaseBo.php';
require_once _CALEM_DIR_ . 'server/modules/pm/CalemPmScheduleBo.php';
require_once _CALEM_DIR_ . 'test/server/modules/workorder/WoGenReleaseBoTestHelper.php';		

class WoGenReleaseBoTest extends PHPUnit2_Framework_TestCase {
	
	public function testReleasePmNoSchedule() {
		$ar=array();
		$this->releasePm($ar);
	}
	
	public function testReleasePmWithSchedule() {
		$ar=array('addTimeSchedule'=>true);
		$this->releasePm($ar);
	}
	
	public function releasePm($ar) {
		$helper=new WoGenReleaseBoTestHelper();
		$helper->cleanup();
		
		//a) no schedule info, floating by meter
		list($pmRow, $pmAssetRow) = $helper->buildData($ar);
		$releaseBo=new CalemWoGenReleaseBo();
		$dueDate=strtotime('+3 day');
		$finishDate=strtotime('+5 day');
		$woId=$releaseBo->releasePm($dueDate, $finishDate, $pmRow, $pmAssetRow);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Released woId=" . $woId . "<br>";
		}
		$this->assertTrue($woId ? true : false);
		//Verify wo released and PM updated
		//a) workorder labor and part each has a record
		$woDbo=CalemFactory::getDbo('workorder');
		$this->assertTrue($woDbo->getCountBySqlParam('select count(*) from wo_planned_labor where wo_id=?', $woId)==1);
		$this->assertTrue($woDbo->getCountBySqlParam('select count(*) from wo_planned_part where wo_id=?', $woId)==1);
		//b) labor hours is good
		$woRow=$woDbo->fetchById($woId);
		$this->assertTrue($woRow['planned_labor_hours']==$helper->getLaborHours());
		//c) reserved part count is correct
		$inRow=$helper->getInRow();
		$inDbo=CalemFactory::getDbo('inventory');
		$inDbRow=$inDbo->fetchById($inRow['id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "inDbRow=" . var_export($inDbRow, true) . "<br>"; 
		}
		$this->assertTrue($inDbRow['qty_reserved']==$helper->getPartQty());
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "inDbRow=" . var_export($inDbRow, true) . "<br>"; 
		}
		$this->assertTrue($inDbo->getCountBySqlParam('select count(*) from in_reserved where in_id=?', $inRow['id'])==1);
		//d) info copied from asset
		$assetRow=$helper->getAssetRow();
		$this->assertTrue($assetRow['note']==$woRow['asset_note']);
		//e) verify PM info copied over
		global $_CALEM_conf;
		$pmConf=$_CALEM_conf['pm_conf']['lookupWoNewFromPm'];
		$pmRow=$helper->getPmRow();
		foreach ($pmConf['pm'] as $pmFld=>$woFld) {
			$this->assertTrue($pmRow[$pmFld]==$woRow[$woFld]);	
		}
		//f) verify pmAsset info copied over
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		$pmAssetRows=$pmAssetDbo->fetchBySqlParam('select * from pm_asset where pm_id=?', $pmRow['id']);
		$pmAssetRow=$pmAssetRows[0];
		foreach ($pmConf['pm_asset'] as $pmFld=>$woFld) {
			$this->assertTrue($pmAssetRow[$pmFld]==$woRow[$woFld]);	
		}
		//g) verify PM asset release date
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "g) lastReleased=" . $pmAssetRow['last_released'] . ", dueDate=" . gmdate('Y-m-d', $dueDate). "<br>"; 
		}
		$this->assertTrue($pmAssetRow['last_released']==gmdate('Y-m-d', $dueDate));
		//Next due date
		$nextDueDate=$this->getNextDueDate($dueDate, $ar, $helper);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "nextDueDate=" . $pmAssetRow['next_due_date'] . ", nextDueDate=" . gmdate('Y-m-d', $nextDueDate). "<br>"; 
		}
		$this->assertTrue($pmAssetRow['next_due_date']==gmdate('Y-m-d', $nextDueDate));
		
		$pmAssetRowHelper=$helper->getPmAssetRow();
		$this->assertTrue($pmAssetRowHelper['release_count']+ 1== $pmAssetRow['release_count']); 
		
		//h) verify meter is released properly
		$pmMeterDbo=CalemFactory::getDbo('pm_meter');
		$pmMeterRows=$pmMeterDbo->fetchBySqlParam('select * from pm_meter where pm_asset_id=?', $pmAssetRow['id']);
		$pmMeterRow=$pmMeterRows[0];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "pm meterRow=". var_export($pmMeterRow, true) . "<br>"; 
		}
		$assetMeterRow=$helper->getAssetMeterRow();
		$this->assertTrue($assetMeterRow['reading']==$pmMeterRow['reading_released']);
		$this->assertTrue($assetMeterRow['rollover_count']==$pmMeterRow['rollover_count']);
		//Congratulations! - released verified.
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "completed tests: " . var_export($ar, true) . "<br>"; 
		}
		$helper->cleanup();
	}
	
	public function getNextDueDate($dueDate, $ar, $helper) {
		if ($ar['addTimeSchedule']) {
			$pmScheduleBo= new CalemPmScheduleBo($helper->getReleaseSchedule());
			$dueDate=$pmScheduleBo->getNextDueDate($dueDate);
		}			
		return $dueDate;
	}

}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new WoGenReleaseBoTest();
	$res->testReleasePmNoSchedule();
	$res->testReleasePmWithSchedule();
}
?>
