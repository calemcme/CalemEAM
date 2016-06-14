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
require_once _CALEM_DIR_ . 'server/modules/asset/CalemAssetBo.php';

class CalemWoLaborDbo extends CalemDbo {
	
	//Fill-in craft, rate, ot_factor, and line_cost before doing the processing
	public function beforeInsert($baseTable, $baseData, $customTable, $customData) {
		return $this->updateByUser($baseData['user_id'], $baseData, $baseData['hours'], $baseData['ot_hours']);
	}
	
	//Business logic when data insertion is done.	
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
		$hours=$baseData['hours']+$baseData['ot_hours'];
		$cost= $baseData['line_cost'];
		if ($hours > 0 || $cost > 0) {
			$this->updateWoLaborActual($baseData['wo_id'], $hours, $cost);	
		}
	}
	
	//Overwrite deletion to collect pm_id info.
	public function beforeDelete() {
		$this->loadRecord();
	}
	
	//Business logic when data deletion is done.	
	public function onDataDeleted($table, $id) {
		$hours= isset($this->row['hours']) ? $this->row['hours'] : 0;
		$cost=isset($this->row['line_cost']) ? $this->row['line_cost'] : 0;
		if ($hours > 0 || $cost > 0) {
			$hours = (-1) * $hours;
			$cost = (-1)*$cost;
			$this->updateWoLaborActual($this->row['wo_id'], $hours, $cost);	
		}
	}
	
	//before update
	public function beforeUpdate($baseTable, $baseCurrent, $baseUpdate) {
		$hours=isset($baseUpdate['hours'])?$baseUpdate['hours'] : $baseCurrent['hours'];
		$otHours=isset($baseUpdate['ot_hours'])?$baseUpdate['ot_hours'] : $baseCurrent['ot_hours'];
		if (isset($baseUpdate['user_id'])) {
			$baseUpdate= $this->updateByUser($baseUpdate['user_id'], $baseUpdate, $hours, $otHours);	
		} else {
			if (isset($baseUpdate['hours']) || isset($baseUpdate['ot_hours'])) { //redo line cost.
				$baseUpdate['line_cost']=$hours*$baseCurrent['rate']+$otHours*$baseCurrent['rate']*$baseCurrent['ot_factor'];
			}
		}
		return $baseUpdate;	
	}
	
	//On data updated
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		if (!isset($baseUpdate['line_cost'])) return;

		//Let's figure out old hours/cost
		$oldHours= $baseCurrent['hours']+$baseCurrent['ot_hours'];
		$oldCost= $baseCurrent['line_cost'];
		//Let's figure out the new cost
		$newHours= (isset($baseUpdate['hours']) ? $baseUpdate['hours'] : $baseCurrent['hours'])
		       +   (isset($baseUpdate['ot_hours']) ? $baseUpdate['ot_hours'] : $baseCurrent['ot_hours']) ;
		$newCost=$baseUpdate['line_cost'];
		$this->updateWoLaborActual($baseCurrent['wo_id'], ($newHours - $oldHours), ($newCost - $oldCost));	
	}
	
	/**
	 * Update schedUser 
	 */
	public function updateWoLaborActual($woId, $hours, $cost) {
		$woDbo=CalemFactory::getDbo('workorder');
		$row=$woDbo->fetchById($woId); 
		$ar=array();
		$ar['actual_labor_hours']= $row['actual_labor_hours']+$hours;
		$ar['actual_labor_hours']=max(0, $ar['actual_labor_hours']);
		$ar['labor_cost'] = $row['labor_cost'] + $cost;
		$ar['labor_cost']=max(0, $ar['labor_cost']);
		$ar['total_cost']= $row['material_cost']+$ar['labor_cost'];
		$woDbo->setChangeBulk($ar);
		$woDbo->setIdForUpdate($woId);
		$woDbo->update();
		//Now update asset
		$assetBo=new CalemAssetBo();
		$assetBo->updateLaborCost($row['asset_id'], $hours, $cost);
	}
	
	/**
	 * Updating craft, rate, ot_factor, line_cost based on user_id.
	 */
	public function updateByUser($uid, $data, $hours, $otHours) {
		$craftRow=$this->getCraftByUserId($uid);
		if ($craftRow) {
			$data['craft_id']=$craftRow['id'];
			$data['rate']= $craftRow['rate'];
			$data['ot_factor']=$craftRow['ot_factor'];
			$cost= $hours*$data['rate'] + $otHours*$data['rate']*$data['ot_factor'];
			$data['line_cost']=$cost;
		} else {
			$data['craft_id']=null;
			$data['rate']=0;
			$data['ot_factor']=0;
			$data['line_cost']=0;
		}
		return $data;
	}
	
	public function getCraftByUserId($uid) {
		$userDbo=CalemFactory::getDbo('users');
		$userRow=$userDbo->fetchById($uid);	
		$craftRow=null;
		if (isset($userRow['craft_id']) && $userRow['craft_id']) {
			$craftDbo=CalemFactory::getDbo('craft');
			try {
				$craftRow=$craftDbo->fetchById($userRow['craft_id']);
			} catch (CalemDboDataNotFoundException $ex) {
			}			
		}	
		return $craftRow;
	}
}

?>