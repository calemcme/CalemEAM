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
require_once _CALEM_DIR_ . 'server/modules/pm/CalemPmDependencyBo.php';

class CalemWoGenBo extends CalemBo {
	private $conf;
	private $pdmBo;
	private $pdm;
	private $pms;
	
	private $pmDbo;
	private $pmAssetDbo;
	
	private $endDate;
	private $userId;
	
	private $scheduleBo;
	private $releaseBo;
	private $depReleaseBo;
	private $decisionHelper;
	
	private $woCount;
	private $wogenEntryId;
	private $semDbo;
	
	public function __construct() {	
 		parent::__construct();
 		$this->init();
 	}
 	
 	/**
 	 * Init instance...
 	 */
 	public function init() {
 		//Get configuration
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['wo_conf']['wo_generation'];
		$this->pdmBo = new CalemPmDependencyBo();		
		$this->pmDbo=CalemFactory::getDbo('pm');
		$this->pmAssetDbo=CalemFactory::getDbo('pm_asset');
		$this->scheduleBo=CalemFactory::createInstance($this->conf['scheduleBo']);
		$this->releaseBo=CalemFactory::createInstance($this->conf['releaseBo']);
		$this->depReleaseBo=CalemFactory::createInstance($this->conf['depReleaseBo']);
		$this->semDbo=CalemFactory::getDbo('wo_semaphore');
 	}
 	
	/**
	 * Generate for a given pm list
	 * @param $pms - use pm_id as the key (pm=>1)
	 */
	public function generateWo($pms=null, $endDate=null, $userId=null) {
		//Must acquire a semaphore before proceeding
		if (!$this->getSemaphore()) return;
		$this->extendScriptTime($this->conf['script_start_time']);
		
		
		if (!$pms) {
			$pms=array();
			$pmDbo=CalemFactory::getDbo('pm');
			try {
				$rows=$pmDbo->fetchBySql('select id from pm');
				foreach ($rows as $row) {
					$pms[$row['id']]=1;
				}
			} catch (CalemDboDataNotFoundException $ex) {
			}
		}	
		if (count($pms)==0) return; //Nothing to generate
		//Figure out dates and userId
		if (!$endDate) {//use configured number of days to generate
			$endDate=strtotime("+" . $this->conf['days_ahead']['days'] . " days");	
		}
		$this->endDate=$endDate;
		
		if (!$userId) {
			$userId=$this->conf['user_id']['id'];	
		}
		$this->userId=$userId;
		//Set up for data insertion
		$GLOBALS['calem_ses_data']['id']=$this->userId;
		
		if ($this->logger->isInfoEnabled()) {
			$this->logger->info('Generate workorder: endDate=' . date('Y-m-d', $this->endDate). ", user_id=" . $this->userId . 
                              ', pm count=' . count($pms));	
		}
		
		$this->addWogenEntry();
		
		$this->pms=$pms;
		try {			
			//1st pass - go by the dependency
			$this->pdm=$this->pdmBo->getPdm();
			//cl-debug
			if ($this->logger->isDebugEnabled()) {
				$this->logger->debug("wo gen: pdm=" . var_export($this->pdm, true) . ", pms=" . var_export($this->pms, true));	
			}
			if ($this->pdm && $this->pdm['sort']) {
				foreach ($this->pdm['sort'] as $pmId=>$val) {
					if (!$this->pms[$pmId]) continue;
					unset($this->pms[$pmId]); //Remove the entry.
					$this->generateByPmDep($pmId);
					$this->extendScriptTime($this->conf['script_interim_time']);
					$this->extendSemaphore();	
				}
			}
			//2nd pass - the remaining PMs with no dependency.
			foreach ($this->pms as $pmId=>$val) {
				$this->generateByPmNoDep($pmId);
				$this->extendScriptTime($this->conf['script_interim_time']);	
				$this->extendSemaphore();				
			} 
			$this->completeWoGenEntry();
		} catch (Exception $ex) {
			$this->logger->error("Error in generating workorder, msg=" . $ex->getMessage());
			$this->updateWogenEntryWithError($ex->getMessage());	
		}
		$this->clearSemaphore();
	}
	
	public function setPdm($pdm) {
		$this->pdm=$pdm;	
	}
	
	//Extend script time
	public function extendScriptTime($secs) {
		set_time_limit($secs);	
	}
	
	//Add an entry to record generation
	public function addWogenEntry() {
		$woGenDbo=CalemFactory::getDbo('wo_generation');
		$row=array(
			'status_id'=>'wgn_started',
			'to_date'=>CalemText::getServerDate($this->endDate)
		);	
		$woGenDbo->setChangeBulk($row);
		$this->wogenEntryId=$woGenDbo->insert();
		return $this->wogenEntryId; //for test use
	}
	
	public function completeWoGenEntry() {
		$woGenDbo=CalemFactory::getDbo('wo_generation');
		try {
			$row=array(
				'status_id'=>'wgn_complete',
				'wo_count'=>$this->woCount
			);
			$woGenDbo->setChangeBulk($row);
			$woGenDbo->setIdForUpdate($this->wogenEntryId);
			$woGenDbo->update();
		} catch (Exception $ex) {
			$this->logger->error("Unable to update wogen entry: id=" . $this->wogenEntryId);	
		}
	}
	
	public function updateWogenEntryWithError($err) {
		$woGenDbo=CalemFactory::getDbo('wo_generation');
		try {
			$row=array(
				'status_id'=>'wgn_failed',
				'wo_count'=>$this->woCount,
				'note'=>$err
			);
			$woGenDbo->setChangeBulk($row);
			$woGenDbo->setIdForUpdate($this->wogenEntryId);
			$woGenDbo->update();
		} catch (Exception $ex) {
			$this->logger->error("Unable to update wogen entry with error. Id=" . $this->wogenEntryId);	
		}
	}
	
	public function incWoCount() {
		$this->woCount++;	
	}
	
	public function getWoCount() {
		return $this->woCount;	
	}
	
	public function getSemExpiration() {
		return $exp=strtotime('+' . $this->conf['semaphore_ttl'] . ' second');
	}
	
	public function extendSemaphore() {
		//Create the new timestamp
		$exp=$this->getSemExpiration();
		$this->semDbo->setValue('expiration', CalemText::getServerDateTime($exp));
		$this->semDbo->setIdForUpdate($this->conf['semaphore_id']);
		$this->semDbo->update(); 
	}
	
	public function clearSemaphore() {
		//Create the new timestamp
		$this->semDbo->setValue('expiration', CalemText::getServerDateTime(strtotime('-1 day')));
		$this->semDbo->setIdForUpdate($this->conf['semaphore_id']);
		$this->semDbo->update(); 
	}
	
	public function getSemaphore() {
		try {
			$row=$this->semDbo->fetchById($this->conf['semaphore_id']);
			if ($row['expiration']) {
				$time=CalemText::parseServerDateTime($row['expiration']);	
			} else {
				$time=0;
			}
			if ($time > mktime()) {
				if ($this->logger->isInfoEnabled()) {
					$this->logger->info("Cannot start wo generation, semaphore is not expired: " . date('Y-m-d H:i:s', $time));	
				}	
				return false;
			}
			$this->extendSemaphore();
		} catch (CalemDboDataNotFoundException $ex) {
			$this->semDbo->setChangeBulk(
				array('id'=>$this->conf['semaphore_id'],
				      'expiration'=>CalemText::getServerDateTime($this->getSemExpiration()))
			);
			$this->semDbo->insert();
		}
		return true;
	}
	
	
	/**
	 * Explore the pm first, if can be released, process the dependencies.
	 */
	public function generateByPmDep($pmId) {
		$this->schedulePm($pmId, true);
	}
	
	/**
	 * Explore PMs without dependencies
	 */
	public function generateByPmNoDep($pmId) {
		$this->schedulePm($pmId, false);
	}
	
	/**
	 * Decide if a PM is due
	 * @return an array ('due'=>true/false, 'due_date'=>new_due_date)
	 */
	public function schedulePm($pmId, $dep) {
		//Check for PM status first and release type.
		try {
			$pmRow=$this->pmDbo->fetchById($pmId);
			//Check at PM level if we should try to schedule it.
			if (!$this->isAutoSchedulePm($pmRow)) return;
			
			//Schedule is strictly done by pmAssets
			$pmAssetRows=$this->pmAssetDbo->fetchBySqlParam('select * from pm_asset where pm_id=?', $pmId);
			$assetDbo=CalemFactory::getDbo('asset');
			foreach ($pmAssetRows as $pmAssetRow) {
				//Ensure asset is in service before releasing PM
				if (!$this->isAutoScheduleAsset($pmAssetRow, $assetDbo)) continue; //Skip assets that are not valid
				$dueDates=$this->scheduleBo->schedulePm($pmRow, $pmAssetRow, $this->endDate);
				$this->releasePm($dueDates, $pmRow, $pmAssetRow, $dep);
			}
		} catch (CalemDboDataNotFoundException $ex) {
		}
	}
	
	/**
	 * Auto schedule PM determination
	 * - Status must be active
	 * - Release type must be either fixed or floating
	 * - Schedule type must be by time/meter
	 */
	public function isAutoSchedulePm($pmRow) {
		return $this->isValidSchedulePm($this->conf['auto_conf'], $pmRow);
		       
	}
	
	private function isValidSchedulePm($conf, $pmRow) {   
		return ( $conf['pm_status'][$pmRow['status_id']]
		       &&$conf['release_type'][$pmRow['release_type_id']]
		       &&$conf['schedule_type'][$pmRow['schedule_type_id']] );
	}
	
	public function isAutoScheduleAsset($pmAssetRow, $assetDbo) {
		try {
			$row=$assetDbo->fetchById($pmAssetRow['asset_id']);
			return $this->conf['auto_conf']['asset_status'][$row['status_id']];	
		} catch (CalemDboDataNotFoundException $ex) {
			return false;
		}
	}
	/**
	 * Dependency release validation
	 */
	public function isDependencySchedulePm($pmRow) {
		return $this->isValidSchedulePm($this->conf['dependency_conf'], $pmRow);
		       
	}
	
	public function isDependencyScheduleAsset($pmAssetRow, $assetDbo) {
		try {
			$row=$assetDbo->fetchById($pmAssetRow['asset_id']);
			return $this->conf['dependency_conf']['asset_status'][$row['status_id']];	
		} catch (CalemDboDataNotFoundException $ex) {
			return false;
		}
	}
	
	/**
	 * PM release
	 */
   public function releasePm($dueDates, $pmRow, $pmAssetRow, $dep) {
   	foreach ($dueDates as $dueDate) {
   		$finishTime=$this->releaseBo->getPlannedFinishTime($dueDate, $pmRow['duration_hours']);
   		$woId=$this->releaseBo->releasePm($dueDate, $finishTime, $pmRow, $pmAssetRow);
   		if ($woId) $this->incWoCount();
   		if ($woId && $dep) {
   			$this->releaseByDependency($woId, $dueDate, $finishTime, $pmRow, $pmAssetRow);	
   		}	
   	}	
   }
	
	/**
	 * Release dependent PMs
	 */
	public function releaseByDependency($woId, $dueDate, $finishTime, $pmRow, $pmAssetRow) {
		$depPms=$this->pdm['map'][$pmRow['id']];
		if (count($depPms)<=0) return;
		foreach ($depPms as $depRow) {
			if ($depRow['type_id']=='pm_dependency_donotrelease') {
				$this->depReleaseBo->excludeReleasePm(
													  $depRow['child_pm_id'], $depRow['scope_id'], 
				                             $woId, $dueDate, $finishTime, $pmRow, $pmAssetRow, $this);	
			} else {
				$this->depReleaseBo->depReleasePm(
													  $depRow['child_pm_id'], $depRow['scope_id'], $depRow['type_id'],
													  $woId, $dueDate, $finishTime, $pmRow, $pmAssetRow, $this);	
			}
		}
	}
}
?>