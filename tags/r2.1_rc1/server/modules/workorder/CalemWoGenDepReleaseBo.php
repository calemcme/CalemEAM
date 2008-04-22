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

class CalemWoGenDepReleaseBo extends CalemBo {
	protected $releaseBo;
	protected $pmDbo;
	protected $pmAssetDbo;
	protected $conf;
	
	public function __construct() {
		parent::__construct();
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['wo_conf']['wo_generation'];
		$this->releaseBo=CalemFactory::createInstance($this->conf['releaseBo']);
		$this->pmDbo=CalemFactory::getDbo('pm');
		$this->pmAssetDbo=CalemFactory::getDbo('pm_asset');
	}
	
	/**
	 * Exclude PM from release
	 * - this implementation will set release dates of dependent PMs so they are not released by a later run.
	 */
	public function excludeReleasePm($childPmId, $scopeId, $woId, $dueDate, $finishTime,
	                                 $pmRow, $pmAssetRow, $wogenBo) {
		$depPmRow=$this->getPmRow($childPmId);
		if ($scopeId=='pm_dependency_scope_same') {
			$depPmAssetRows=$this->getPmAssetRow($childPmId, $pmAssetRow['asset_id']);
		} else if ($scopeId=='pm_dependency_scope_all') {
			$depPmAssetRows=$this->getPmAssetRow($childPmId);
		}                         	
		if (!$depPmRow || !$depPmAssetRows) return;
		//Otherwise for each asset row, set release date as well as last_closed as if they were released
		foreach ($depPmAssetRows as $depPmAssetRow) {
			$this->releaseBo->setPmReleaseDate($dueDate, $depPmRow, $depPmAssetRow);
		}	                                 	
	}

	/**
	 * Release at the same time
	 */
	public function depReleasePm($childPmId, $scopeId, $typeId, $woId, $dueDate, $finishTime,
	                             $pmRow, $pmAssetRow, $wogenBo) {
	   $depPmRow=$this->getPmRow($childPmId);
		if ($scopeId=='pm_dependency_scope_same') {
			$depPmAssetRows=$this->getPmAssetRow($childPmId, $pmAssetRow['asset_id']);
		} else if ($scopeId=='pm_dependency_scope_all') {
			$depPmAssetRows=$this->getPmAssetRow($childPmId);
		}  
		if (!$depPmRow || !$depPmAssetRows) return;
		
		if (!$wogenBo->isDependencySchedulePm($depPmRow)) return; //this dependent PmRow cannot be released.
		$assetDbo=CalemFactory::getDbo('asset');
		
		//Get schedule object
		$schedBo=new CalemPmScheduleBo($depPmRow['release_schedule']);
		//release each based on scope and type.  
		foreach ($depPmAssetRows as $depPmAssetRow) {
			//Let's check for asset here
			if (!$wogenBo->isDependencyScheduleAsset($depPmAssetRow, $assetDbo)) continue;
			//Let's go ahead and release the asset
			$depDueDate=$dueDate;
			//@todo - do we need a configuration to check for floating case so it's not released?
	
			if ($typeId=='pm_dependency_before') {//Figure out a dueDate by 
				$startDate=$this->releaseBo->getStartDate($dueDate, $depPmRow['duration_hours']);
				$depDueDate=$schedBo->adjustReleaseDate($startDate);
			} else if ($typeId=='pm_dependency_after') {
				$depDueDate=$schedBo->adjustReleaseDate($finishTime);
			}
			$depFinishTime=$this->releaseBo->getPlannedFinishTime($depDueDate, $depPmRow['duration_hours']);
			$depWoId=$this->releaseBo->releasePm($depDueDate, $depFinishTime, $depPmRow, $depPmAssetRow);
			
			if ($depWoId) {
				$wogenBo->incWoCount();
				$this->setDepWoId($typeId, $woId, $depWoId);
				//Need to recursively release for dependency
				$wogenBo->releaseByDependency($depWoId, $depDueDate, $depFinishTime, $depPmRow, $depPmAssetRow);
			}
		}                        	
	}
	
	//Set woId to indicate parent relationship (parent_id is used as performAfterWoId)
	public function setDepWoId($typeId, $woId, $depWoId) {
		if ($typeId=='pm_dependency_before') {
			$updateWoId=$woId;
			$pWoId=$depWoId;	
		} else {
			$updateWoId=$depWoId;
			$pWoId=$woId;	
		}
		$woDbo=CalemFactory::getDbo('workorder');
		try {
			$woDbo->setValue('parent_wo_id', $pWoId);
			$woDbo->setIdForUpdate($updateWoId);
			$woDbo->update();	
		} catch (Exception $e) {
			$this->logger->error("Error in updating parent workorder id: " . $e->getMessage() 
			                      . ", updateWoId=" . $updateWoId . ", parent woId=" . $pWoId);	
		}
	}
	
	//Add processed
	/** Not supported at this time
	public function addProcessed($pmId, $pmAssetId) {
		if (!$processed[$pmId]) {
			$processed[$pmId]=array($pmAssetId=>1);	
		} else {
			$processed[$pmId][$pmAssetId]=1;	
		}
		return $processed;
	}
	*/
	
	//Fetch data row
	public function getPmRow($pmId) {
		try {
			$row=$this->pmDbo->fetchById($pmId);	
		} catch (CalemDboDataNotFoundException $ex) {
			$row=null;	
		}
		return $row;
	}
	
	public function getPmAssetRow($pmId, $assetId=null) {
		try {
			if ($assetId) {
				$rows=$this->pmAssetDbo->fetchBySqlParam('select * from pm_asset where pm_id=? and asset_id=?', array($pmId, $assetId));
			} else {
				$rows=$this->pmAssetDbo->fetchBySqlParam('select * from pm_asset where pm_id=?', $pmId);	
			}
		} catch (CalemDboDataNotFoundException $ex) {
			$rows=null;	
		}	
		return $rows;
	}
											
}
?>
