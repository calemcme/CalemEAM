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

class WoGenDepReleaseBoTestHelper {
	
	public function cleanup() {
		$pmDbo=CalemFactory::getDbo('pm');
	
		$pmDbo->executeBySql("delete from asset where id='asset_001'");
		$pmDbo->executeBySql("delete from asset where id='asset_002'");
		
		$pmDbo->executeBySql("delete from pm where id='pm_001'");
		$pmDbo->executeBySql("delete from pm_asset where id='pm_asset_001'");
		
		$pmDbo->executeBySql("delete from pm_dependency where pm_id='pm_001'");
		$pmDbo->executeBySql("delete from pm_dependency where pm_id='pm_002'");
		
		$pmDbo->executeBySql("delete from pm where id='pm_002'");
		$pmDbo->executeBySql("delete from pm_asset where id='pm_asset_002'");
		
		$pmDbo->executeBySql("delete from pm where id='pm_003'");
		$pmDbo->executeBySql("delete from pm_asset where id='pm_asset_003'");
		
		$pmDbo->executeBySql("delete from pm where id='pm_0031'");
		$pmDbo->executeBySql("delete from pm_asset where id='pm_asset_0031'");
		
		$pmDbo->executeBySql("delete from pm where id='pm_004'");
		$pmDbo->executeBySql("delete from pm_asset where id='pm_asset_004'");
				
		$pmDbo->executeBySql("delete from workorder where pm_id='pm_001'");
		$pmDbo->executeBySql("delete from workorder where pm_id='pm_002'");
		$pmDbo->executeBySql("delete from workorder where pm_id='pm_003'");
		$pmDbo->executeBySql("delete from workorder where pm_id='pm_0031'");
		$pmDbo->executeBySql("delete from workorder where pm_id='pm_004'");
	}
	
	public function getLaborHours() {
		return 5;	
	}
	
	public function getPartQty() {
		return 3;
	}
	
	public function getAssetRow($i) {
		return array(
			'id'=>'asset_00' . $i,
			'asset_no'=>'asset_no_00' . $i,
			'note'=>'asset_note_00' . $i,
			'status_id'=>'as_status_inservice'
		);	
	}
	
	public function getPmRow($i, $schedType=null, $et=null) {
		return  array(
			'id'=>'pm_00' . $i,
			'release_type_id'=>'pm_release_floating',
			'schedule_type_id'=> $schedType,
			'origin_id'=>'orig_001',
			'origin_user_id'=>'origin_user_id_001',
			'assigned_to_id'=>'assigned_to_001',
			'assigned_team_id'=>'assigned_team_001',
			'release_schedule'=>$et,
			'status_id'=>'pm_status_active'		
		);
	}
	
	public function getPmAssetRow($i, $pmIdx, $assetIdx) {
		return array(
			'id'=>'pm_asset_00' . $i,
			'pm_id'=>'pm_00' . $pmIdx,
			'asset_id'=>'asset_00' . $assetIdx,
			'costcode_id'=>'costcode_00' . $i,
			'dept_id'=>'dept_00' . $i,
			'release_count'=>1,
			'next_due_date'=>date('Y-m-d', strtotime('+2 day'))
		);	
	}
	
	public function getReleaseSchedule() {
		$data=getDate();
		$dt=mktime(0,0,0, $data['mon'],1,$data['year']);
		$start=date('Y-m-d', $dt);
		$end=date('Y-m-d', strtotime('+50 day', $dt));

		$txt="{CalemScheduleInfo: {selection: 'months'" . 
  			  ", months: {CalemScheduleMonths: {freq: 1, weekNo: 'schedule_w2', dow: 'dow_short_fri'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '" . $start 
	        . "', end: '" . $end . "'}}" . 
	        "}}";
	   $et=base64_encode($txt);
	   return $et;
	}
	
	public function getPmDepRow($pmIdx, $pmChildIdx, $typeId, $scopeId) {
		return array(
			'pm_id'=> 'pm_00' . $pmIdx,
			'child_pm_id'=>'pm_00' . $pmChildIdx,
			'type_id'=>$typeId,
			'scope_id'=>$scopeId		
		);	
	}
	
	/**
	 * PM1 is to be released
	 * PM1 releases PM2 (1 asset)
	 * PM2 releases PM3 (2 assets), but exclude PM4
	 * So PM1 release causes 4 wos to be generated properly.
	 */
	public function buildData() {
		
		$pmDbo=CalemFactory::getDbo('pm');
		
		//asset 1
		//Add one asset for it.
		$assetDbo=CalemFactory::getDbo('asset');
		$assetRow1=$this->getAssetRow(1);
		$assetDbo->setChangeBulk($assetRow1);
		$assetDbo->insert();
		$assetDbo->unsetId();
		
		//asset 2
		$assetRow2=$this->getAssetRow(2);
		$assetDbo->setChangeBulk($assetRow2);
		$assetDbo->insert();
		
		//PM1 to PM4
		$et=$this->getReleaseSchedule();
	   $schedType='pm_schedule_timeandmeter';	
		$pmRow1=$this->getPmRow(1, $schedType, $et);
		$pmDbo->setChangeBulk($pmRow1);
		$pmDbo->insert();
		$pmDbo->unsetId();
		
		$pmRow2=$this->getPmRow(2, $schedType, $et);
		$pmDbo->setChangeBulk($pmRow2);
		$pmDbo->insert();
		$pmDbo->unsetId();
		
		$pmRow3=$this->getPmRow(3, $schedType, $et);
		$pmDbo->setChangeBulk($pmRow3);
		$pmDbo->insert();
		$pmDbo->unsetId();
		
		$pmRow4=$this->getPmRow(4, $schedType, $et);
		$pmDbo->setChangeBulk($pmRow4);
		$pmDbo->insert();
		
		//PM assets
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		//pm_asset 1 for PM1/asset1
		$pmAssetRow1=$this->getPmAssetRow(1, 1, 1);
		$pmAssetDbo->setChangeBulk($pmAssetRow1);
		$pmAssetDbo->insert();
		$pmAssetDbo->unsetId();
		
		//pm_asset 2 for PM2/asset1
		$pmAssetRow2=$this->getPmAssetRow(2, 2, 1);
		$pmAssetDbo->setChangeBulk($pmAssetRow2);
		$pmAssetDbo->insert();
		$pmAssetDbo->unsetId();
		
		//pm_asset 3 for PM3/asset1
		$pmAssetRow3=$this->getPmAssetRow(3, 3, 1);
		$pmAssetDbo->setChangeBulk($pmAssetRow3);
		$pmAssetDbo->insert();
		$pmAssetDbo->unsetId();
		
		//pm_asset 31 for pm3/asset2
		$pmAssetRow31=$this->getPmAssetRow(31, 3, 2);
		$pmAssetDbo->setChangeBulk($pmAssetRow31);
		$pmAssetDbo->insert();
		$pmAssetDbo->unsetId();
		
		//pm_asset 4 for pm4/asset1
		$pmAssetRow4=$this->getPmAssetRow(4, 4, 1);
		$pmAssetDbo->setChangeBulk($pmAssetRow4);
		$pmAssetDbo->insert();
		$pmAssetDbo->unsetId();
		
		//PM dependency
		$pmDepDbo=CalemFactory::getDbo('pm_dependency');
		//PM1 -> PM2 before
		$pmDepRow1=$this->getPmDepRow(1, 2, 'pm_dependency_before', 'pm_dependency_scope_all');
		$pmDepDbo->setChangeBulk($pmDepRow1);
		$pmDepDbo->insert();
		$pmDepDbo->unsetId();
		
		//PM2 -> PM3 after
		$pmDepRow2=$this->getPmDepRow(2, 3, 'pm_dependency_after', 'pm_dependency_scope_all');
		$pmDepDbo->setChangeBulk($pmDepRow2);
		$pmDepDbo->insert();
		$pmDepDbo->unsetId();
		
		//PM2 -> PM4 exclude
		$pmDepRow3=$this->getPmDepRow(2, 4, 'pm_dependency_donotrelease', 'pm_dependency_scope_all');
		$pmDepDbo->setChangeBulk($pmDepRow3);
		$pmDepDbo->insert();
		$pmDepDbo->unsetId();
		
		return array($pmRow1, $pmAssetRow1);
	}
	
}

?>
