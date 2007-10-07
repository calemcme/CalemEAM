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

//Base CalemDao
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoReservedBo.php';

class CalemWoDbo extends CalemDbo {	
	//Add workorder number
	public function beforeInsert($baseTable, $baseData, $customTable, $customData) {
		if (!isset($baseData['wo_no']) || !$baseData['wo_no']) {
			require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoBo.php';
			$woBo=new CalemWoBo();
			$baseData['wo_no']=$woBo->getNextWoNo();	
		}
		if (!isset($baseData['status_id'])) {
			global $_CALEM_conf;
			$status=$_CALEM_conf['wo_conf']['wo_new_status'];
			$baseData['status_id']=$status;
		}
		//Lookup info from asset
		if (!isset($baseData['asset_note'])) {
			$assetDbo=CalemFactory::getDbo("asset");
			$assetRow=$assetDbo->fetchById($baseData['asset_id']);
			$baseData['asset_note']= $assetRow['note'];	
		}
		return $baseData;
	}
	
	//Bring details records over when adding a wo with PM number
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
		if (!isset($baseData['pm_id']) || !$baseData['pm_id']) {
			$this->notifyDataInserted($id, $baseTable, $baseData, $customTable, $customData);
			return;
		}
		$pmId=$baseData['pm_id'];
		$assetId=$baseData['asset_id'];
		$woId=$this->row['id'];
		//Now bring details from pm to workorder
		global $_CALEM_conf;
		$lkupConf=$_CALEM_conf['wo_conf']['pmToWo'];
		foreach ($lkupConf as $src=>$dstConf) {
			$dboSrc=CalemFactory::getDbo($src);	
			$dboDst=CalemFactory::getDbo($dstConf['target']);
			$fldMap=$dstConf['fieldMap'];
			try {
				$rows=$dboSrc->fetchBySqlParam('select * from ' . $src . ' where pm_id=?', $pmId);
				foreach ($rows as $row) {
					$dstRow=array();
					foreach ($fldMap as $sf=>$df) {
						$dstRow[$df]=$row[$sf];	
					}
					$dstRow['wo_id']=$woId;
					$dboDst->setChangeBulk($dstRow);
					$dboDst->insert();
					$dboDst->unsetId();
				}
			} catch (CalemDboDataNotFoundException $ex) {}
		}
		//Now process pm meter
		$bHasAsset=true;
		$pmAssetDbo=CalemFactory::getDbo('pm_asset');
		try {
			$rows=$pmAssetDbo->fetchBySqlParam('select * from pm_asset where pm_id=? and asset_id=?', array($pmId, $assetId));
			$pmAssetId=$rows[0]['id'];	
		} catch (CalemDboDataNotFoundException $ex) {
			$bHasAsset=false;
		}
		if ($bHasAsset) {
		$pmMeterDbo=CalemFactory::getDbo('pm_meter');
		try {
			$rows=$pmMeterDbo->fetchBySqlParam('select * from pm_meter where pm_asset_id=?', $pmAssetId);
			$woMeterDbo=CalemFactory::getDbo('wo_meter');			                                   
			foreach ($rows as $row) {
				if (!isset($row['copy_to_wo']) || !$row['copy_to_wo']) continue;
				$wm=array();
				$wm['wo_id']=$woId;
				$wm['meter_id']=$row['meter_id'];
				$woMeterDbo->setChangeBulk($wm);
				$woMeterDbo->insert();
				$woMeterDbo->unsetId();	
			}			                                   
		} catch (CalemDboDataNotFoundException $ex) {}
		}
		//Now handle reserved parts
		$woReserved=new CalemWoReservedBo();
		$woReserved->updateReservedByWo($woId);
		//Now count craft hours and downtime
		$woDbo=CalemFactory::getDbo('workorder');
		$lbHrs=$woDbo->getCountBySqlParam('select sum(hours) from wo_planned_labor where wo_id=?', $woId);
		$downtime=$woDbo->getCountBySqlParam('select sum(hours) from wo_planned_downtime where wo_id=?', $woId);
		$woDbo->setValue('planned_labor_hours', $lbHrs);
		$woDbo->setValue('planned_downtime_hours', $downtime);
		$woDbo->setIdForUpdate($woId);
		$woDbo->update();
		//Notify listeners
		$this->notifyDataInserted($id, $baseTable, $baseData, $customTable, $customData);
	}
	
	//On data updated - if status set to closed:
	// a) update PM with last close date.
	// b) reset qty reserved
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		//Must have a status change
		if (isset($baseUpdate['status_id'])) { //Managing status changes
			if ($baseUpdate['status_id']=='wos_closed') {
				if ($baseCurrent['pm_id']) { //Now update PM to set the date
					$pmDbo=CalemFactory::getDbo('pm_asset');
					$pmDbo->updateBySqlParam('update pm_asset set last_closed=? where pm_id=? and asset_id=?', 
													array(CalemText::getServerDate(), $baseCurrent['pm_id'], $baseCurrent['asset_id']));
				}
				//Clear reserved
				$reserveBo=new CalemWoReservedBo();
				$reserveBo->removeReservedByWo($baseCurrent['id']);	
			}
		}		    
		//Other listeners
		$this->notifyDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate);	    
	}
	
	//Deletion handling
	public function beforeDelete() {
		$this->loadRecord();
	}
	
	//Business logic when data deletion is done.	
	public function onDataDeleted($table, $id) {
		$this->notifyDataDeleted($table, $this->row);
	}
	
}
