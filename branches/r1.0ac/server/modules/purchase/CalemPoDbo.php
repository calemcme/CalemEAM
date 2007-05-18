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
require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';

class CalemPoDbo extends CalemDbo {
	protected $conf;	
	
	public function __construct() {
		parent::__construct();
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['po_conf'];	
	}
	
	//Auto-numbering and auto-fill vendor/buyer info.
	public function beforeInsert($baseTable, $baseData, $customTable, $customData) {
		if (!isset($baseData['po_no']) || !$baseData['req_no']) {
			require_once _CALEM_DIR_ . 'server/modules/purchase/CalemPoBo.php';
			$reqBo=new CalemPoBo();
			$baseData['po_no']=$reqBo->getNextPoNo();	
		}
		//Status & state
		if (!isset($baseData['status_id'])) {
			$baseData['status_id']=$this->conf['po_init_status'];
		}
		if (!isset($baseData['state_id'])) {
			$baseData['state_id']=$this->conf['po_init_state'];	
		}
		//Vendor fill-in
		if (isset($baseData['vendor_id'])) $baseData=$this->fillInVendor($baseData['vendor_id'], $baseData);
		//Buyer fill-in
		if (isset($baseData['buyer_id'])) $baseData=$this->fillInBuyer($baseData['buyer_id'], $baseData);
		//Shipping and billing address if any
		if (!isset($baseData['shipping_addr_id'])) $baseData=$this->fillInShippingAddr($baseData);
		if (!isset($baseData['billing_addr_id'])) $baseData=$this->fillInBillingAddr($baseData);
		return $baseData;
	}
	
	public function fillInShippingAddr($ar) {
		if ($this->conf['default_shipping_addr']) $ar['shipping_addr_id']=$this->conf['default_shipping_addr'];
		return $ar;	
	}
	
	public function fillInBillingAddr($ar) {
		if ($this->conf['default_billing_addr']) $ar['billing_addr_id']=$this->conf['default_billing_addr'];
		return $ar;	
	}
	
	//Fill-in vendor info
	public function fillInVendor($vendorId, $ar) {
		$vDbo=CalemFactory::getDbo('vendor');
		try {
			$row=$vDbo->fetchById($vendorId);
			$ar['vendor_addr']=$row['address'];
			$ar['vendor_contact_id']=$row['contact_id'];
			//Bring over tax rate
			if ($row['tax_code_id']) {
				$tDbo=CalemFactory::getDbo('tax_code');
				$tRow=$tDbo->fetchById($row['tax_code_id']);
				$ar['tax_rate_total']=$tRow['tax_rate_total'];	
			}
			//Bring over contact info.
			if ($row['contact_id']) {
				$cDbo=CalemFactory::getDbo('contact');
				$cRow=$cDbo->fetchById($row['contact_id']);
				$ar['vendor_contact_phone']=$cRow['phone_work'];
			}
		} catch (CalemDboDataNotFoundException $ex) {}
		return $ar;	
	}
	
	//Fill-in buyer
	public function fillInBuyer($buyerId, $ar) {
		$uDbo=CalemFactory::getDbo('users');
		try {
			$row=$uDbo->fetchById($buyerId);
			$ar['buyer_name']=$row['full_name'];
			$ar['buyer_phone']=$row['phone_work'];
		} catch (CalemDboDataNotFoundException $ex) {}
		return $ar;	
	}
	
	/**
	 * When updating a PO
	 * -- fill-in vendor if changed
	 * -- fill-in buyer if changed
	 */
	public function beforeUpdate($baseTable, $baseCurrent, $baseUpdate) {
		//vendor
		if (isset($baseUpdate['vendor_id'])) {
			$baseUpdate=$this->fillInVendor($baseUpdate['vendor_id'], $baseUpdate);
		}
		//buyer
		if (isset($baseUpdate['buyer_id'])) {
			$baseUpdate=$this->fillInBuyer($baseUpdate['buyer_id'], $baseUpdate);
		}
		/**
		 * Status change handling
		 * 1) change a PO to voided, remove the REQ from the PO
		 * 2) change a PO from voided to another status, remove all the PO items - have to start over.
		 * 3) set up po_date if status is changed to 'approved' and po_date is not set
		 */
		if (isset($baseUpdate['status_id'])) {
			if ($baseUpdate['status_id']=='po_status_voided') {//Changing to voided.
				$this->removeAllReqFromPo($baseCurrent['id']);
			} else if ($baseCurrent['status_id']=='po_status_voided') {//Coming out of voided.
				$this->resetPoItems($baseCurrent['id']);	
				//Reset cost info
				$baseUpdate['po_item_total']=0;
				$baseUpdate['tax_charge']=0;
				$baseUpdate['total_charge']=0;
			}
			//Checking for po date
			if ($baseUpdate['status_id']=='po_status_approved' && 
			    !$baseUpdate['po_date'] && !$baseCurrent['po_date']) {
				$baseUpdate['po_date']=CalemText::getServerDate();
			}
		}
		return $baseUpdate;
	}
	
	public function removeAllReqFromPo($poId) {
		$poItemDbo=CalemFactory::getDbo('po_item');
		try {
			$rows=$poItemDbo->fetchBySqlParam('select * from po_item where po_id=?', $poId);
			$reqBo = new CalemReqBo();
			foreach ($rows as $row) {
				$reqBo->removeAllReqItemFromPo($poId, $row['in_id']);
			}	
		} catch (CalemDboDataNotFoundException $ex) {
		}		
	}
	
	public function resetPoItems($poId) {
		$poItemDbo=CalemFactory::getDbo('po_item');
		$poItemDbo->updateBySqlParam('update po_item set qty=0 where po_id=?', $poId);
	}
}
