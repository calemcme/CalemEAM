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
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoGenBo.php';		

class WoGenReleaseBoTestHelper {
	
	public function cleanup() {
		$pmDbo=CalemFactory::getDbo('pm');
	
		$pmDbo->executeBySql("delete from asset where id='asset_001'");
		$pmDbo->executeBySql("delete from asset_meter where asset_id='asset_001'");
		
		$pmDbo->executeBySql("delete from pm where id='pm_001'");
		$pmDbo->executeBySql("delete from pm_asset where id='pm_asset_001'");
		$pmDbo->executeBySql("delete from pm_meter where pm_asset_id='pm_asset_001'");
		$pmDbo->executeBySql("delete from pm_labor where pm_id='pm_001'");
		$pmDbo->executeBySql("delete from pm_part where pm_id='pm_001'");
		
		$pmDbo->executeBySql("delete from inventory where id='in_001'");
		$pmDbo->executeBySql("delete from in_reserved where in_id='in_001'");
				
		$pmDbo->executeBySql("delete from workorder where pm_id='pm_001'");
		$pmDbo->executeBySql("delete from wo_planned_labor where craft_id='craft_001'");
		$pmDbo->executeBySql("delete from wo_planned_part where in_id='in_001'");	
	}
	
	public function getLaborHours() {
		return 5;	
	}
	
	public function getPartQty() {
		return 3;
	}
	
	public function getAssetRow() {
		return array(
			'id'=>'asset_001',
			'asset_no'=>'asset_no_001',
			'note'=>'asset_note_001',
			'status_id'=>'as_status_inservice'
		);	
	}
	
	public function getInRow() {
		return array(
			'id'=>'in_001',
			'category_id'=>'icg_part'
		);	
	}
	
	public function getPmRow($schedType=null, $et=null) {
		return  array(
			'id'=>'pm_001',
			'release_type_id'=>'pm_release_floating',
			'schedule_type_id'=> $schedType,
			'origin_id'=>'orig_001',
			'origin_user_id'=>'origin_user_id_001',
			'assigned_to_id'=>'assigned_to_001',
			'assigned_team_id'=>'assigned_team_001',
			'release_schedule'=>$et		
		);
	}
	
	public function getPmAssetRow() {
		return array(
			'id'=>'pm_asset_001',
			'pm_id'=>'pm_001',
			'asset_id'=>'asset_001',
			'costcode_id'=>'costcode_001',
			'dept_id'=>'dept_001',
			'release_count'=>1,
			'next_due_date'=>date('Y-m-d', strtotime('+2 day'))
		);	
	}
	
	public function getAssetMeterRow() {
		return array(
			'id'=>'asset_meter_001',
			'asset_id'=>'asset_001',
			'meter_no'=>'meter_001',
			'reading'=>7000,
			'rollover_count'=>1,
			'rollover_reading'=>100000
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
	
	public function buildData($param) {
		$addTimeSchedule=$param['addTimeSchedule'];
		
		$pmDbo=CalemFactory::getDbo('pm');
		
		if ($addTimeSchedule) {
			$et=$this->getReleaseSchedule();
		} else {
			$et='';
		}
	   
	   $schedType='pm_schedule_timeandmeter';	
		$pmRow=$this->getPmRow($schedType, $et);
	
		$pmDbo->setChangeBulk($pmRow);
		$pmDbo->insert();
		//Add one asset for it.
		$assetDbo=CalemFactory::getDbo('asset');
		$assetRow=$this->getAssetRow();
		$assetDbo->setChangeBulk($assetRow);
		$assetDbo->insert();
		//asset_meter
		$assetMeterDbo=CalemFactory::getDbo('asset_meter');
		$assetMeterRow=$this->getAssetMeterRow();
		$assetMeterDbo->setChangeBulk($assetMeterRow);
		$assetMeterDbo->insert();
		//add pm_asset
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		$pmAssetRow=$this->getPmAssetRow();
		$pmAssetDbo->setChangeBulk($pmAssetRow);
		$pmAssetDbo->insert();
		//pm_asset_meter
		$pmMeterDbo=CalemFactory::getDbo('pm_meter');
		$pmMeterRow=array(
			'pm_asset_id'=>'pm_asset_001',
			'meter_id'=>'asset_meter_001',
			'release_by_meter'=> 1,
			'reading_interval'=>5000
		);
		$pmMeterDbo->setChangeBulk($pmMeterRow);
		$pmMeterDbo->insert();
		
		//Other pm asset stuff to add
		$pmLaborDbo=CalemFactory::getDbo('pm_labor');
		$pmLaborRow=array(
			'pm_id'=>'pm_001',
			'craft_id'=>'craft_001',
			'hours'=>$this->getLaborHours()
		);
		$pmLaborDbo->setChangeBulk($pmLaborRow);
		$pmLaborDbo->insert();
		
		$inDbo=CalemFactory::getDbo('inventory');
		$inRow=$this->getInRow();
		$inDbo->setChangeBulk($inRow);
		$inDbo->insert();
		
		$pmPartDbo=CalemFactory::getDbo('pm_part');
		$pmPartRow=array(
			'pm_id'=>'pm_001',
			'in_id'=>'in_001',
			'qty'=>$this->getPartQty()
		);
		$pmPartDbo->setChangeBulk($pmPartRow);
		$pmPartDbo->insert();
		
		return array($pmRow, $pmAssetRow);
	}
	
}

?>
