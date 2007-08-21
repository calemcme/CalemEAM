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

//Work order generation

require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/pm/CalemPmScheduleBo.php';

class CalemWoGenReleaseBo extends CalemBo {
	protected $releaseConf;
	protected $pmToWoConf;
	protected $woDbo;
	
	public function __construct() {
		parent::__construct();
		global $_CALEM_conf;
		$this->releaseConf=$_CALEM_conf['wo_conf']['wo_generation']['release_conf'];	
		$this->pmToWoConf=$_CALEM_conf['pm_conf']['lookupWoNewFromPm'];
		$this->woDbo=CalemFactory::getDbo('workorder');
	}
 	
 	/**
 	 * To use CalemWoDbo for business logic reuse. 
 	 */
	public function releasePm($dueDate, $finishTime, $pmRow, $pmAssetRow) {
		//Counting dates
		$woRow=array();
		$woRow['planned_start_time']=CalemText::getServerDateTime($dueDate);
		$woRow['planned_finish_time']=CalemText::getServerDateTime($finishTime);
		$woRow['status_id']=$this->releaseConf['wo_status'];
		
		$woRow['orig_time']=CalemText::getServerDateTime(); //It's today
		$woRow['time_needed']=$woRow['planned_finish_time'];
		
		$woRow=$this->copyPmToWo($woRow, $pmRow, $pmAssetRow);
		$woRow=$this->woDbo->beforeInsert('workorder', $woRow, null, null);
		//Start a transaction here
		$this->woDbo->unsetId(); //So a new Id is generated
		$this->woDbo->beginTransaction();
		try {
			$this->woDbo->setChangeBulk($woRow);
			$woId=$this->woDbo->insert();
			$this->woDbo->onDataInserted($woId, 'workorder', $woRow, null, null);
			//Also recording release dates at PM
			$this->setPmReleaseDate($dueDate, $pmRow, $pmAssetRow);
			$this->woDbo->commit();
		} catch (Exception $ex) {
			$this->logger->error("Error in releasing pm: " . var_export($woRow, true));
			$this->woDbo->rollback();
			$woId=null;
		}
		return $woId;
	}
	
	//Count finish time
	public function getPlannedFinishTime($dueDate, $durHours) {
		$finishDate=$dueDate;
		$days=$this->getDurationInDays($durHours);
		if ($days > 0) {
			$finishDate=strtotime('+' . $days . " day", $dueDate);
		}
		return $finishDate;
	}
	
	//Count finish time
	public function getStartDate($finishDate, $durHours) {
		$startDate=$finishDate;
		$days=$this->getDurationInDays($durHours);
		if ($days > 0) {
			$startDate=strtotime('-' . $days . " day", $finishDate);
		}
		return $startDate;
	}
	
	//Count finish time
	public function getDurationInDays($durHours) {
		$days=0;
		if ($durHours) {
			$hours=$this->releaseConf['hours_in_a_day'];
			$hours= $hours ? $hours : 24; //24 hours in a day as a default.
			$days=floor($durHours/$hours);
		}	
		return $days;
	}
	
	//Copy from PM to wo
	public function copyPmToWo($woRow, $pmRow, $pmAssetRow) {
		foreach ($this->pmToWoConf['pm'] as $pmFld=>$woFld) {
			$woRow[$woFld]=$pmRow[$pmFld];	
		}	
		$woRow['pm_id']=$pmRow['id'];
		foreach ($this->pmToWoConf['pm_asset'] as $pmFld=>$woFld) {
			$woRow[$woFld]=$pmAssetRow[$pmFld];	
		}
		$woRow['asset_id']=$pmAssetRow['asset_id'];
		return $woRow;
	}
	
	//Set release date for the PM asset
	public function setPmReleaseDate($dueDate, $pmRow, $pmAssetRow, $setLastClosed=false) {
		$schedBo=new CalemPmScheduleBo($pmRow['release_schedule']);
		$nextDueDate=$schedBo->getNextDueDate($dueDate);
		if (!$nextDueDate) $nextDueDate=$dueDate; //In case there's no schedule planned
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		$pmAssetRow=$pmAssetDbo->fetchById($pmAssetRow['id']);	
		$pmAssetDbo->setChangeBulk(
			array('last_released'=>CalemText::getServerDateTime($dueDate),
			      'next_due_date'=>CalemText::getServerDateTime($nextDueDate),
			      'release_count'=>$pmAssetRow['release_count']+1));
		$pmAssetDbo->setIdForUpdate($pmAssetRow['id']);			      
		$pmAssetDbo->update();
		//Going through meters if any
		$pmMeterDbo=CalemFactory::getDbo("pm_meter");
		try {
			$pmMeterRows=$pmMeterDbo->fetchBySqlParam('select * from pm_meter where pm_asset_id=?', $pmAssetRow['id']);
			$assetMeterDbo=CalemFactory::getDbo('asset_meter');
			foreach ($pmMeterRows as $pmMeterRow) {
				if ($pmMeterRow['release_by_meter']) {
					try {
						$assetMeterRow=$assetMeterDbo->fetchById($pmMeterRow['meter_id']);
						$pmMeterDbo->setChangeBulk(
							array('reading_released'=>$assetMeterRow['reading'],
							      'rollover_count'=>$assetMeterRow['rollover_count'])
						);	
						$pmMeterDbo->setIdForUpdate($pmMeterRow['id']);
						$pmMeterDbo->update();
					} catch (CalemDboDataNotFoundException $ex) {
					}
				}
			}	
		} catch (CalemDboDataNotFoundException $ex) {
		}
	}
	
}
?>
