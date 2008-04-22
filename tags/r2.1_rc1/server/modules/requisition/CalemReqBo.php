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
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInBo.php';

class CalemReqBo extends CalemBo {
	private $conf;
	
	public function __construct() {	
 		parent::__construct();
 		//Get configuration
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['req_conf'];	
 	}
 	
	public function getNextReqNo() {
		$dbHdlr=CalemFactory::getDbHandler();
		$seq=$dbHdlr->getNextSeq('req_seq');
		return sprintf($this->conf['req_no']['format'], $seq);
	}
	
	/**
	 * ReqBo to update Req with PO status
	 */
	public function addReqItemToPo($poId, $riId, $reqId, $riDbo=null, $reqDbo=null) {
		if (!$riDbo) $riDbo=CalemFactory::getDbo('req_item');
		if (!$reqDbo) $reqDbo=CalemFactory::getDbo('requisition');
		
		//Update Req item and req status
		$riDbo->setValue('po_id', $poId);
		$riDbo->setIdForUpdate($riId);
		$riDbo->update();
		//Check for req on item status
		$this->updateReqStatus($reqId, $reqDbo);
	}
	
	public function removeReqItemFromPo($poId, $riId, $reqId, $riDbo=null, $reqDbo=null) {
		if (!$riDbo) $riDbo=CalemFactory::getDbo('req_item');
		if (!$reqDbo) $reqDbo=CalemFactory::getDbo('requisition');
		
		//Update Req item and req status
		$riDbo->setValue('po_id', null);
		$riDbo->setIdForUpdate($riId);
		$riDbo->update();
		//Check for req on item status
		$this->updateReqStatus($reqId, $reqDbo);
	}
	
	public function removeAllReqItemFromPo($poId, $inId, $riDbo=null, $reqDbo=null) {
		if (!$riDbo) $riDbo=CalemFactory::getDbo('req_item');
		if (!$reqDbo) $reqDbo=CalemFactory::getDbo('requisition');
		
		//Update Req item and req status
		try {
			$rows=$riDbo->fetchBySqlParam('select distinct(req_id) as req_id from req_item where po_id=? and in_id=?',
			                          array($poId, $inId));
		} catch (CalemDboDataNotFoundException $ex) {
			return; //be done with it.
		}
		//reset po_id for all affected item and PO
		$riDbo->updateBySqlParam('update req_item set po_id=null where po_id=? and in_id=?', 
			                         array($poId, $inId));
		foreach ($rows as $row) {
			$reqId=$row['req_id'];	
			$this->updateReqStatus($reqId, $reqDbo);			                         
		}
	}
	
	public function updateReqStatus($reqId, $reqDbo=null) {
		//Check for req on item status
		$cnt=$reqDbo->getCountBySqlParam('select count(*) from req_item where req_id=?', $reqId);
		if ($cnt==0) {
			$ps='req_on_po_none';
		} else {
			$cntPo=$reqDbo->getCountBySqlParam('select count(*) from req_item where req_id=? and po_id is not NULL', $reqId);
			if ($cntPo==$cnt) {
				$ps='req_on_po_all';
			} else if ($cntPo>0) {
				$ps='req_on_po_partly';
			} else {
				$ps='req_on_po_none';
			}
		}
		$reqDbo->setValue('req_on_po_id', $ps);
		$reqDbo->setIdForUpdate($reqId);
		$reqDbo->update();
	}
	
	/**
	 * Handling req item changes
	 * a) modify req total
	 * b) modify inventory on order
	 */
	public function onReqItemChanged($inId, $reqId, $qty, $uc, $uom) {
		//Update req total
		if ($qty && $uc) {
			$reqDbo=CalemFactory::getDbo('requisition');
			$reqRow=$reqDbo->fetchById($reqId);
			$total=max(0, $reqRow['req_total']+ $qty*$uc);
			$reqDbo->setValue('req_total', $total);
			$reqDbo->setIdForUpdate($reqId);
			$reqDbo->update();
		}
		//Update in qty on order
		if ($qty) {
			$inBo=new CalemInBo();
			$inBo->updateOnOrder($inId, $qty, $uom);
		}		
	}
	
	/**
	 * REQ Status change verification
	 */
	public function verifyReqStatusChange($tran) {
		if (!$this->isStatusTransitionValid($tran['from_status_id'], $tran['to_status_id'])) {
			throw new CalemUiException('CalemReqStatusChangeNotAllowedException');	
		}
		if (!$this->verifyApprovalLevel($tran)) {
			throw new CalemUiException('CalemReqNoApprovalLevelException');
		}
	}
	
	public function isStatusTransitionValid($fromId, $toId) {
		$rtn=true;
		$map=$this->conf['req_status_invalid_map'];
		if (isset($map[$fromId])) {
			$rtn= !isset($map[$fromId][$toId]);	
		}	
		return $rtn;
	}
	
	public function verifyApprovalLevel($tran) {
		$rtn=true;
		//Verify approval rights to make these changes
		switch ($tran['to_status_id']) {
			case 'req_status_pre': 
			case 'req_status_approved':
			case 'req_status_voided':
				$rtn=$this->hasReqApprovalRight($tran['user_id']);	
				break;				
		}	
		if (!$rtn) return $rtn;
		
		//Approval amount must be sufficient
		switch ($tran['to_status_id']) {
			case 'req_status_approved':
			case 'req_status_voided':
				$rtn=$this->hasReqApprovalLevel($tran);
				break;				
		}	
		return $rtn;
	}
	
	public function hasReqApprovalRight($userId) {
		$pal=$this->getReqApprovalLevel($userId);
		return ($pal && $pal != 'req_level_none');
	}
	
	public function hasReqApprovalLevel($tran) {
		$reqDbo=CalemFactory::getDbo('requisition');
		$reqRow=$reqDbo->fetchById($tran['req_id']);
		$pal=$this->getReqApprovalLevel($tran['user_id']);		
		$reqApprovalDbo=CalemFactory::getDropdown('req_approval_level');
		$reqApprovalData=$reqApprovalDbo->getData();
		return ($reqApprovalData[$pal]['amount'] >= $reqRow['req_total']);
	}
	
	public function getReqApprovalLevel($userId) {
		$userDbo=CalemFactory::getDbo('users');
		$userDbo->loadRecordById($userId);
		return $userDbo->getReqApprovalLevel();	
	}
	
	/**
	 * Creating a req with an item on order
	 */
	public function createInOrderRequest($reqRow, $inId, $qty, $uom) {
		$reqDbo=CalemFactory::getDbo('requisition');
		$reqRow['req_no']=$this->getNextReqNo();
		$reqDbo->setChangeBulk($reqRow);
		$reqId= $reqDbo->insert();
		$this->addItemToReq($reqId, $inId, $qty, $uom);
	}	
	
	public function addItemToReq($reqId, $inId, $qty, $uom) {
		$inBo=new CalemInBo();
		$vendorRow=$inBo->getInVendor($inId);
		if ($vendorRow) {
			$uomBo=new CalemUomBo();
			$qty=$uomBo->convertUomQty($qty, $uom, $vendorRow['uom_id']);
			$uom=$vendorRow['uom_id'];
			$uc=$vendorRow['unit_cost'];
			$vendorId=$vendorRow['vendor_id'];
			$vpn=$vendorRow['vendor_part_no'];
		} else {
			$uc=0;
			$vendorId=null;	
			$vpn=null;
		}
		$lineCost=$uc*$qty;
		$reqItemDbo=CalemFactory::getDbo('req_item');
		$reqItemDbo->setChangeBulk(
			array('req_id'=>$reqId, 
			      'in_id'=>$inId,
			      'vendor_id'=>$vendorId,
			      'vendor_part_no'=>$vpn,
			      'unit_cost'=>$uc,
			      'qty'=>$qty,
			      'uom_id'=>$uom,
			      'line_cost'=>$lineCost));
		$reqItemDbo->insert();
		$this->onReqItemChanged($inId, $reqId, $qty, $uc, $uom);			      
	} 
}

?>