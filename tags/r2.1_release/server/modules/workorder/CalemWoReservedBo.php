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
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInBo.php';

class CalemWoReservedBo extends CalemBo {
	private $inBo;
	
	public function __construct() {	
 		parent::__construct();
 		$this->inBo=new CalemInBo();
 	}
 	
 	//Remove reserved by WO upon closing a wo.
 	public function removeReservedByWo($woId) {
 		$reservedDbo=CalemFactory::getDbo('in_reserved');
 		try {
			$rows=$reservedDbo->fetchBySqlParam('select * from in_reserved where wo_id=?', $woId);
			foreach ($rows as $row) {
				$reservedDbo->deleteBySqlParam('delete from in_reserved where id=?', $row['id']);
				$this->updateInventory($row['in_id'], -1*$row['qty']);
				$this->inBo->onInReservedChanged($row['in_id']);	
			}
 		} catch (CalemDboDataNotFoundException $ex) {}
 	}
 	
 	//Update by wo id
 	public function updateReservedByWo($woId, $lock=false) {
		$woDbo=CalemFactory::getDbo('workorder');
		$woRow=$woDbo->fetchById($woId);
		if ($woRow['status_id']=='wos_closed') return false;
		if ($lock) {
			$woDbo->executeBySqlParam('select id from workorder where id=? for update', $woId);
		}
		$woPlannedPartDbo=CalemFactory::getDbo('wo_planned_part');
		try {
			$partRows=$woPlannedPartDbo->fetchBySqlParam('select * from wo_planned_part where wo_id=?', $woId);
			foreach ($partRows as $partRow) {
				if ($partRow['qty']) {
					$this->updateReservedSafe($woId, $partRow['in_id'], $partRow['qty']);
				}	
			}	
		} catch (CalemDboDataNotFoundException $e) {
		}
	}
 	
 	/**
 	 * @param $qty - to add reservation the qty is > 0; otherwise it is < 0.
 	 */
	public function updateReserved($woId, $inId, $qty) {
		$woDbo=CalemFactory::getDbo('workorder');
		$woRow=$woDbo->fetchById($woId);
		if ($woRow['status_id']=='wos_closed') return false;
		$woDbo->executeBySqlParam('select id from workorder where id=? for update', $woId);
		$this->updateReservedSafe($woId, $inId, $qty);
	}
	
	public function updateReservedSafe($woId, $inId, $qty) {
		$reservedDbo=CalemFactory::getDbo('in_reserved');
		$found=true;
		try {
			$rows=$reservedDbo->fetchBySqlParam('select * from in_reserved where in_id=? and wo_id=?',
											array($inId, $woId));
			$row=$rows[0];
			$rsvd=$row['qty'];											
		} catch (CalemDboDataNotFoundException $ex) {
			$found=false;
		}
		
		if (!$found) {//no entry
			if ($qty <= 0) return; //Don't worry about it.
			//Add a record and update inventory
			$this->addReserved($woId, $inId, $qty, $reservedDbo);
			$this->updateInventory($inId, $qty);
		} else {
			//Update rsvd and update inventory
			$newRsvd=$rsvd+$qty;
			if ($newRsvd<=0) { //remove the reserved entry.
				$this->deleteReserved($row['id'], $reservedDbo);
			} else {
				$this->updateRsvd($row['id'], $newRsvd, $reservedDbo);	
			}
			$this->updateInventory($inId, $qty);
		}		
		//Now also notify inBo about the update
		$this->inBo->onInReservedChanged($inId);		
	}
	
	public function deleteReserved($rsvdId, $reservedDbo) {
		$reservedDbo->deleteBySqlParam('delete from in_reserved where id=?', $rsvdId);
	}
	
	public function addReserved($woId, $inId, $qty, $reservedDbo) {
		$ar=array();
		$ar['in_id']=$inId;
		$ar['wo_id']=$woId;
		$ar['qty']=$qty;
		$reservedDbo->setChangeBulk($ar);
		$reservedDbo->insert();
	}
	
	public function updateRsvd($id, $qty, $reservedDbo) {
		$reservedDbo->setValue('qty', $qty);
		$reservedDbo->setIdForUpdate($id);
		$reservedDbo->update();
	}
	
	public function updateInventory($id, $qty) {
		$inDbo=CalemFactory::getDbo("inventory");
		$inRow=$inDbo->fetchById($id);
		$nQty=$inRow['qty_reserved']+$qty;
		$nQty=max(0, $nQty);
		$inDbo->setValue('qty_reserved', $nQty);
		$inDbo->setIdForUpdate($id);
		$inDbo->update();
	}
}

?>