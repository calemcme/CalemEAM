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

class WoGenScheduleBoTestHelper {
	
	public function addPmWithTimeScheduleInvalidDates() {
		$pmDbo=CalemFactory::getDbo('pm');
		$txt="{CalemScheduleInfo: {selection: 'weeks'" . 
  			  ", months: {CalemScheduleWeeks: {freq: 2" .  
	                              ", dow: 'dow_short_mon'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '2006-04-07', end: '2007-04-02'}}" . 
	        "}}";
	   $et=base64_encode($txt);
		$pmRow=array(
			'id'=>'pm_001',
			'release_type_id'=>'pm_release_fixed',
			'schedule_type_id'=>'pm_schedule_time',
			'release_schedule'=>$et		
		);
		$pmDbo->setChangeBulk($pmRow);
		$pmDbo->insert();
		//Add one asset for it.
		$assetDbo=CalemFactory::getDbo('asset');
		$assetRow=array(
			'id'=>'asset_001',
			'status_id'=>'as_status_inservice',
		);
		$assetDbo->setChangeBulk($assetRow);
		$assetDbo->insert();
		//add pm_asset
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		$pmAssetRow=array(
			'id'=>'pm_asset_001',
			'pm_id'=>'pm_001',
			'asset_id'=>'asset_001'
		);
		$pmAssetDbo->setChangeBulk($pmAssetRow);
		$pmAssetDbo->insert();
		return array($pmRow, $pmAssetRow);
	}
	
	public function rmPmWithTimeScheduleInvalidDates() {
		$pmDbo=CalemFactory::getDbo('pm');
		$pmDbo->executeBySql("delete from pm where id='pm_001'");
		$pmDbo->executeBySql("delete from asset where id='asset_001'");
		$pmDbo->executeBySql("delete from asset_meter where asset_id='asset_001'");
		$pmDbo->executeBySql("delete from pm_asset where id='pm_asset_001'");
		$pmDbo->executeBySql("delete from pm_meter where pm_asset_id='pm_asset_001'");
		$pmDbo->executeBySql("delete from workorder where pm_id='pm_001'");	
	}
	
	public function addPmWithTimeSchedule() {
		$pmDbo=CalemFactory::getDbo('pm');
		$start=date('Y-m-d');
		$end=date('Y-m-d', strtotime('+45 day'));

		$txt="{CalemScheduleInfo: {selection: 'weeks'" . 
  			  ", weeks: {CalemScheduleWeeks: {freq: 2, dow: 'dow_short_mon'}}" . 
	        ", dates:  {CalemScheduleDates: {start: '" . $start 
	        . "', end: '" . $end . "'}}" . 
	        "}}";
	   $et=base64_encode($txt);
		$pmRow=array(
			'id'=>'pm_001',
			'release_type_id'=>'pm_release_fixed',
			'schedule_type_id'=>'pm_schedule_time',
			'release_schedule'=>$et		
		);
		$pmDbo->setChangeBulk($pmRow);
		$pmDbo->insert();
		//Add one asset for it.
		$assetDbo=CalemFactory::getDbo('asset');
		$assetRow=array(
			'id'=>'asset_001',
			'status_id'=>'as_status_inservice',
		);
		$assetDbo->setChangeBulk($assetRow);
		$assetDbo->insert();
		//add pm_asset
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		$pmAssetRow=array(
			'id'=>'pm_asset_001',
			'pm_id'=>'pm_001',
			'asset_id'=>'asset_001'
		);
		$pmAssetDbo->setChangeBulk($pmAssetRow);
		$pmAssetDbo->insert();
		return array($pmRow, $pmAssetRow);
	}
	
	public function addPmWithMeterSchedule($releaseByMeter, $addTime=false) {
		$pmDbo=CalemFactory::getDbo('pm');
		
		if ($addTime) {
			$start=date('Y-m-d');
			$end=date('Y-m-d', strtotime('+40 day'));
	
			$txt="{CalemScheduleInfo: {selection: 'weeks'" . 
	  			  ", weeks: {CalemScheduleWeeks: {freq: 1, dow: 'dow_short_fri'}}" . 
		        ", dates:  {CalemScheduleDates: {start: '" . $start 
		        . "', end: '" . $end . "'}}" . 
		        "}}";
		   $et=base64_encode($txt);
		} else {
			$et='';
		}
	   
		$pmRow=array(
			'id'=>'pm_001',
			'release_type_id'=>'pm_release_fixed',
			'schedule_type_id'=>'pm_schedule_meter',
			'release_schedule'=>$et		
		);
		$pmDbo->setChangeBulk($pmRow);
		$pmDbo->insert();
		//Add one asset for it.
		$assetDbo=CalemFactory::getDbo('asset');
		$assetRow=array(
			'id'=>'asset_001',
			'status_id'=>'as_status_inservice',
		);
		$assetDbo->setChangeBulk($assetRow);
		$assetDbo->insert();
		//asset_meter
		$assetMeterDbo=CalemFactory::getDbo('asset_meter');
		$assetMeterRow=array(
			'id'=>'asset_meter_001',
			'asset_id'=>'asset_001',
			'meter_no'=>'meter_001',
			'reading'=>7000,
			'rollover_count'=>0,
			'rollover_reading'=>100000
		);
		$assetMeterDbo->setChangeBulk($assetMeterRow);
		$assetMeterDbo->insert();
		//add pm_asset
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		$pmAssetRow=array(
			'id'=>'pm_asset_001',
			'pm_id'=>'pm_001',
			'asset_id'=>'asset_001'
		);
		$pmAssetDbo->setChangeBulk($pmAssetRow);
		$pmAssetDbo->insert();
		//pm_asset_meter
		$pmMeterDbo=CalemFactory::getDbo('pm_meter');
		$pmMeterRow=array(
			'pm_asset_id'=>'pm_asset_001',
			'meter_id'=>'asset_meter_001',
			'release_by_meter'=>$releaseByMeter,
			'reading_interval'=>5000
		);
		$pmMeterDbo->setChangeBulk($pmMeterRow);
		$pmMeterDbo->insert();
		
		return array($pmRow, $pmAssetRow);
	}
	
	public function addPmWithTimeAndMeterSchedule($byTime, $byMeter=false, $addTimeSchedule=false) {
		$pmDbo=CalemFactory::getDbo('pm');
		
		if ($addTimeSchedule) {
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
		} else {
			$et='';
		}
	   
	   if ($byTime && $byMeter) {
	   	$schedType='pm_schedule_timeandmeter';	
	   } else if ($byTime) {
	   	$schedType='pm_schedule_time';
	   } else {
	   	$schedType='pm_schedule_meter';
	   }
		$pmRow=array(
			'id'=>'pm_001',
			'release_type_id'=>'pm_release_fixed',
			'schedule_type_id'=> $schedType,
			'release_schedule'=>$et		
		);
		$pmDbo->setChangeBulk($pmRow);
		$pmDbo->insert();
		//Add one asset for it.
		$assetDbo=CalemFactory::getDbo('asset');
		$assetRow=array(
			'id'=>'asset_001',
			'status_id'=>'as_status_inservice'
		);
		$assetDbo->setChangeBulk($assetRow);
		$assetDbo->insert();
		//asset_meter
		$assetMeterDbo=CalemFactory::getDbo('asset_meter');
		$assetMeterRow=array(
			'id'=>'asset_meter_001',
			'asset_id'=>'asset_001',
			'meter_no'=>'meter_001',
			'reading'=>7000,
			'rollover_count'=>0,
			'rollover_reading'=>100000
		);
		$assetMeterDbo->setChangeBulk($assetMeterRow);
		$assetMeterDbo->insert();
		//add pm_asset
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		$pmAssetRow=array(
			'id'=>'pm_asset_001',
			'pm_id'=>'pm_001',
			'asset_id'=>'asset_001',
			'next_due_date'=>date('Y-m-d', strtotime('+2 day'))
		);
		$pmAssetDbo->setChangeBulk($pmAssetRow);
		$pmAssetDbo->insert();
		//pm_asset_meter
		$pmMeterDbo=CalemFactory::getDbo('pm_meter');
		$pmMeterRow=array(
			'pm_asset_id'=>'pm_asset_001',
			'meter_id'=>'asset_meter_001',
			'release_by_meter'=> ($byMeter) ? 1 : 0,
			'reading_interval'=>5000
		);
		$pmMeterDbo->setChangeBulk($pmMeterRow);
		$pmMeterDbo->insert();
		
		return array($pmRow, $pmAssetRow);
	}
	
	public function addFloatingTimeAndMeterSchedule($param) {
		$byTime=$param['byTime'];
		$byMeter=$param['byMeter'];
		$addTimeSchedule=$param['addTimeSchedule'];
		$addWo=$param['addWo'];
		$addCloseDate=$param['addCloseDate'];
		
		$pmDbo=CalemFactory::getDbo('pm');
		
		if ($addTimeSchedule) {
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
		} else {
			$et='';
		}
	   
	   if ($byTime && $byMeter) {
	   	$schedType='pm_schedule_timeandmeter';	
	   } else if ($byTime) {
	   	$schedType='pm_schedule_time';
	   } else {
	   	$schedType='pm_schedule_meter';
	   }
		$pmRow=array(
			'id'=>'pm_001',
			'release_type_id'=>'pm_release_floating',
			'schedule_type_id'=> $schedType,
			'release_schedule'=>$et		
		);
		$pmDbo->setChangeBulk($pmRow);
		$pmDbo->insert();
		//Add one asset for it.
		$assetDbo=CalemFactory::getDbo('asset');
		$assetRow=array(
			'id'=>'asset_001',
			'status_id'=>'as_status_inservice'
		);
		$assetDbo->setChangeBulk($assetRow);
		$assetDbo->insert();
		//asset_meter
		$assetMeterDbo=CalemFactory::getDbo('asset_meter');
		$assetMeterRow=array(
			'id'=>'asset_meter_001',
			'asset_id'=>'asset_001',
			'meter_no'=>'meter_001',
			'reading'=>7000,
			'rollover_count'=>0,
			'rollover_reading'=>100000
		);
		$assetMeterDbo->setChangeBulk($assetMeterRow);
		$assetMeterDbo->insert();
		//add pm_asset
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		if ($addCloseDate) {
			$dt=mktime(0,0,0, $data['mon'],1,$data['year']);
			$lastCloseDate=date('Y-m-d', strtotime('+4 day', $dt));
		} else {
			$lastCloseDate=null;
		}
		$pmAssetRow=array(
			'id'=>'pm_asset_001',
			'pm_id'=>'pm_001',
			'asset_id'=>'asset_001',
			'last_closed'=>$lastCloseDate,
			'next_due_date'=>date('Y-m-d', strtotime('+2 day'))
		);
		$pmAssetDbo->setChangeBulk($pmAssetRow);
		$pmAssetDbo->insert();
		//pm_asset_meter
		$pmMeterDbo=CalemFactory::getDbo('pm_meter');
		$pmMeterRow=array(
			'pm_asset_id'=>'pm_asset_001',
			'meter_id'=>'asset_meter_001',
			'release_by_meter'=> ($byMeter) ? 1 : 0,
			'reading_interval'=>5000
		);
		$pmMeterDbo->setChangeBulk($pmMeterRow);
		$pmMeterDbo->insert();
		
		//wo stuff
		if ($addWo) {
			$woDbo=CalemFactory::getDbo('workorder');
			$woRow=array(
				'pm_id'=>'pm_001',
				'asset_id'=>'asset_001',
				'status_id'=>'wos_new'			
			);	
			$woDbo->setChangeBulk($woRow);
			$woDbo->insert();
		}
		
		return array($pmRow, $pmAssetRow);
	}
	
}

?>
