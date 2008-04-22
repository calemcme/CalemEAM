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
require_once _CALEM_DIR_ . 'server/include/core/CalemUiException.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemUomBo.php';

class CalemPoBo extends CalemBo {
	private $conf;
	private $uomBo;
	private $reqBo;
	
	public function __construct() {	
 		parent::__construct();
 		//Get configuration
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['po_conf'];	
		$this->uomBo=new CalemUomBo();
		$this->reqBo=new CalemReqBo();
 	}
 	
	public function getNextPoNo() {
		$dbHdlr=CalemFactory::getDbHandler();
		$seq=$dbHdlr->getNextSeq('po_seq');
		return sprintf($this->conf['po_no']['format'], $seq);
	}
	
	/**
	 * Add PO item from client request
	 */
	public function addPoItemByClient($tran) {
		$poId=$tran['po_id'];
		$reqItem=base64_decode($tran['req_item']);
		$ids=CalemJson::jsonToPhp($reqItem);
		if ($this->logger->isInfoEnabled()) {
			$this->logger->info("addPoItemByClient: po_id=" . $poId . ", req ids=" . var_export($ids, true));	
		}	
		
		try {
			$poDbo=CalemFactory::getDbo('po');
			$poRow=$poDbo->fetchById($poId);
		} catch (CalemDboDataNotFoundException $ex) {
			throw new CalemDataBoException('po', $ex, null);
		}
		
		$piDbo=CalemFactory::getDbo('po_item');
		$reqDbo=CalemFactory::getDbo('requisition');
		try {
			//Start a transaction here
			$poDbo->beginTransaction();
			$poDbo->executeBySqlParam('select id from po where id=? for update', $poRow['id']);
			//processing each req item
			$riDbo=CalemFactory::getDbo('req_item');
			foreach ($ids as $id) {
				try {
					$riRow=$riDbo->fetchById($id);
				} catch (CalemDboDataNotFoundExcpetion $e) {
					if ($this->logger->isDebugEnabled()) $this->logger->debug("Req item=" . $id . " cannot be found.");
					continue; //Ignore that an item does not exist anymore.
				}	
				//process this line
				$poRow=$this->addPoItemFromReq($poRow, $riRow, $piDbo, $poDbo, $riDbo, $reqDbo);
			}
			//commit
			$poDbo->commit();
		} catch (Exception $exo) {
			$poDbo->rollback();
			throw new CalemDataBoException('req_item', $exo, null);
		}
	}
	
	/**
	 * Remove PO item from client request
	 */
	public function removePoItemByClient($tran) {
		$poId=$tran['po_id'];
		$reqItem=base64_decode($tran['req_item']);
		$ids=CalemJson::jsonToPhp($reqItem);
		if ($this->logger->isInfoEnabled()) {
			$this->logger->info("removePoItemByClient: po_id=" . $poId . ", req ids=" . var_export($ids, true));	
		}	
		
		try {
			$poDbo=CalemFactory::getDbo('po');
			$poRow=$poDbo->fetchById($poId);
		} catch (CalemDboDataNotFoundException $ex) {
			throw new CalemDataBoException('po', $ex, null);
		}
		
		$piDbo=CalemFactory::getDbo('po_item');
		$reqDbo=CalemFactory::getDbo('requisition');
		try {
			//Start a transaction here
			$poDbo->beginTransaction();
			$poDbo->executeBySqlParam('select id from po where id=? for update', $poRow['id']);
			//processing each req item
			$riDbo=CalemFactory::getDbo('req_item');
			foreach ($ids as $id) {
				try {
					$riRow=$riDbo->fetchById($id);
				} catch (CalemDboDataNotFoundExcpetion $e) {
					if ($this->logger->isDebugEnabled()) $this->logger->debug("Req item=" . $id . " cannot be found.");
					continue; //Ignore that an item does not exist anymore.
				}	
				//process this line
				$poRow=$this->removePoItemFromReq($poRow, $riRow, $piDbo, $poDbo, $riDbo, $reqDbo);
			}
			//commit
			$poDbo->commit();
		} catch (Exception $exo) {
			$poDbo->rollback();
			throw new CalemDataBoException('req_item', $exo, null);
		}
	}
	
	/**
	 * Inserting a po item from req
	 * - Add to an existing po_item or insert a po item based on itemNo.
	 * - Update po cost
	 * - Update req item with the po number
	 * - Update req's req_on_po status
	 */
	private function addPoItemFromReq($poRow, $riRow, $piDbo, $poDbo, $riDbo, $reqDbo) {
		$reqRow=$reqDbo->fetchById($riRow['req_id']);	
		
		$piRow=null;
		try {
			$rows=$piDbo->fetchBySqlParam('select * from po_item where po_id=? and in_id=?', 
			                                array($poRow['id'], $riRow['in_id']));
			$piRow=$rows[0];			                                
		} catch (CalemDboDataNotFoundException $ex) {
		}
		if ($piRow) {//Merge the reqItem to existing PO item
			//Due date to set to the earlier one.
			if ($piRow['due_date'] && $reqRow['due_date']) {
				if ($piRow['due_date'] > $reqRow['due_date']) $piRow['due_date']=$reqRow['due_date'];	
			} else if ($reqRow['due_date']) {
				$piRow['due_date']=$reqRow['due_date'];
			}
			//qty/unit cost/uom - be careful in mixing them up.
			$piCost=$piRow['line_cost'];
			if ($piRow['uom_id']==$riRow['uom_id']) {//This should be the norm.
				$piRow['qty']= $piRow['qty']+$riRow['qty'];
				//Check unit cost
				if (!$piRow['unit_cost'] && $riRow['unit_cost']) { //Only one has unit cost.
					$piRow['unit_cost']=$riRow['unit_cost'];
				}	
			} else {//Pick one UOM to use on the PO.
				if ($piRow['uom_id'] && $piRow['unit_cost']) { //Use this one's UOM
					$factor=$this->uomBo->getUomMap($riRow['uom_id'], $piRow['uom_id']);
					$piRow['qty'] += $factor*$riRow['qty'];	
				} else if ($riRow['uom_id'] && $riRow['unit_cost']) {
					$factor=$this->uomBo->getUomMap($piRow['uom_id'], $riRow['uom_id']);
					$piRow['qty']= $piRow['qty']*$factor + $riRow['qty'];
					$piRow['uom_id']=$riRow['uom_id'];
					$piRow['unit_cost']=$riRow['unit_cost'];
				} else if ($piRow['unit_cost']) {
					$piRow['qty'] += $riRow['qty'];
				} else if ($riRow['unit_cost']) {
					$piRow['qty'] += $riRow['qty'];
					$piRow['unit_cost']=$riRow['unit_cost'];
					$piRow['uom_id']=$riRow['uom_id'];
				} else {//does not matter.
					$piRow['qty'] += $riRow['unit_cost'];
				}
			}
			//New po line cost
			$piRow['line_cost']=$piRow['unit_cost']*$piRow['qty'];
			$piDbo->setChangeBulk($piRow);
			$piDbo->setIdForUpdate($piRow['id']);
			$piDbo->update();
			//Cost change to PO.
			$piCost=$piRow['line_cost']-$piCost;
		} else {//Add a new poItem to PO
			$piRow=$this->copyReqItemToPo($riRow);
			$piRow['po_id']=$poRow['id'];
			$piRow['due_date']=$reqRow['due_date'];
			//Figure out the line no.
			$ln=$piDbo->getCountBySqlParam('select count(*) from po_item where po_id=?', $poRow['id']);
			$piRow['line_no']=$ln+1;
			$piDbo->setChangeBulk($piRow);
			$piDbo->insert();
			$piDbo->unsetId();
			//Cost change for PO.
			$piCost=$piRow['line_cost'];	
		}
		//Update po cost
		$poRow=$this->updatePoCost($poRow, $piCost, $poDbo);
		//Update req
		$this->reqBo->addReqItemToPo($poRow['id'], $riRow['id'], $reqRow['id'], $riDbo, $reqDbo);
		//done - update poRow as well
		return $poRow;
	}
	
	/**
	 * Removing a po item from req
	 * - If qty of the po item is 0, optionally remove the po item.
	 * - Update po cost
	 * - Update req item with the po number
	 * - Update req's req_on_po status
	 */
	private function removePoItemFromReq($poRow, $riRow, $piDbo, $poDbo, $riDbo, $reqDbo) {
		$reqRow=$reqDbo->fetchById($riRow['req_id']);	
		
		$piRow=null;
		try {
			$rows=$piDbo->fetchBySqlParam('select * from po_item where po_id=? and in_id=?', 
			                                array($poRow['id'], $riRow['in_id']));
			$piRow=$rows[0];			                                
		} catch (CalemDboDataNotFoundException $ex) {
		}
		if ($piRow) {//Deduct quantity properly.
			$piCost=$piRow['line_cost'];
			$factor=$this->uomBo->getUomMap($riRow['uom_id'], $piRow['uom_id']);
			$qty=$factor*$riRow['qty'];
			$piRow['qty']=max(0, $piRow['qty']-$qty);
			//New po line cost
			$piRow['line_cost']=$piRow['unit_cost']*$piRow['qty'];
			$piDbo->setChangeBulk($piRow);
			$piDbo->setIdForUpdate($piRow['id']);
			$piDbo->update();
			//Cost change to PO.
			$piCost=$piRow['line_cost']-$piCost;
			//Update po cost
			$poRow=$this->updatePoCost($poRow, $piCost, $poDbo);
		}
		
		//Update req
		$this->reqBo->removeReqItemFromPo($poRow['id'], $riRow['id'], $reqRow['id'], $riDbo, $reqDbo);
		return $poRow;
	}
	
	public function copyReqItemToPo($riRow) {
		$ar=array();
		foreach ($this->conf['reqItemToPoItem'] as $rk=>$pk) {
			$ar[$pk]=$riRow[$rk];	
		}	
		return $ar;
	}
	
	public function updatePoCostById($poId, $piCost, $poDbo=null) {
		if (!$poDbo) $poDbo=CalemFactory::getDbo('po');
		$poRow=$poDbo->fetchById($poId);
		return $this->updatePoCost($poRow, $piCost, $poDbo);      
	}
	
	public function updatePoCost($poRow, $piCost, $poDbo=null) {
		if (!$poDbo) $poDbo=CalemFactory::getDbo('po');
		$poRow['po_item_total'] = max(0, $poRow['po_item_total']+$piCost);
		$poRow['tax_charge']= $poRow['po_item_total']*$poRow['tax_rate_total'];
		$poRow['total_charge']=$poRow['po_item_total']+$poRow['tax_charge'];
		$poDbo->setChangeBulk(
		     array('po_item_total'=>$poRow['po_item_total'],
		           'tax_charge'=>$poRow['tax_charge'],
		           'total_charge'=>$poRow['total_charge']));
		$poDbo->setIdForUpdate($poRow['id']);
		$poDbo->update();
		return $poRow;		           
	}
	
	/**
	 * PO Status change verification
	 */
	public function verifyPoStatusChange($tran) {
		if (!$this->isStatusTransitionValid($tran['from_status_id'], $tran['to_status_id'])) {
			throw new CalemUiException('CalemPoStatusChangeNotAllowedException');	
		}
		if (!$this->verifyApprovalLevel($tran)) {
			throw new CalemUiException('CalemPoNoApprovalLevelException');
		}
	}
	
	public function isStatusTransitionValid($fromId, $toId) {
		$rtn=true;
		$map=$this->conf['po_status_invalid_map'];
		$iMap=$map[$fromId];
		if ($iMap) {
			$rtn= !isset($iMap[$toId]);	
		}	
		//Enforce that must reach 'approved' to reach 'submitted', 'acked'
		if ($toId=='po_status_submitted') {
			$rtn=($fromId=='po_status_approved'||$fromId=='po_status_acked');
		} else if ($toId=='po_status_acked') {
			$rtn=($fromId=='po_status_approved'||$fromId=='po_status_submitted');
		}
		return $rtn;
	}
	
	public function verifyApprovalLevel($tran) {
		$rtn=true;
		//Verify approval rights to make these changes
		switch ($tran['to_status_id']) {
			case 'po_status_pre': 
			case 'po_status_approved':
			case 'po_status_voided':
			case 'po_status_submitted':
			case 'po_status_acked':
				$rtn=$this->hasPoApprovalRight($tran['user_id']);	
				break;				
		}	
		if (!$rtn) return $rtn;
		
		//Approval amount must be sufficient
		switch ($tran['to_status_id']) {
			case 'po_status_approved':
			case 'po_status_voided':
				$rtn=$this->hasPoApprovalLevel($tran);
				break;				
		}	
		return $rtn;
	}
	
	public function hasPoApprovalRight($userId) {
		$pal=$this->getPoApprovalLevel($userId);
		return ($pal && $pal != 'po_level_none');
	}
	
	public function hasPoApprovalLevel($tran) {
		$poDbo=CalemFactory::getDbo('po');
		$poRow=$poDbo->fetchById($tran['po_id']);
		$pal=$this->getPoApprovalLevel($tran['user_id']);		
		$poApprovalDbo=CalemFactory::getDropdown('po_approval_level');
		$poApprovalData=$poApprovalDbo->getData();
		return ($poApprovalData[$pal]['amount'] >= $poRow['total_charge']);
	}
	
	public function getPoApprovalLevel($userId) {
		$userDbo=CalemFactory::getDbo('users');
		$userDbo->loadRecordById($userId);
		return $userDbo->getPoApprovalLevel();	
	}	
}

?>