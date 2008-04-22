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
require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';

class CalemReqItemDbo extends CalemDbo {
	protected $conf;	
	protected $reqStatus;
	
	public function __construct() {
		parent::__construct();
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['req_conf'];
		$this->reqStatus=array();	
	}
	
	//Add vendor info if left blank upon insertion
	public function beforeInsert($baseTable, $baseData, $customTable, $customData) {
		$vRow=null;
		$loadVendor=(!isset($baseData['vendorId']) || !isset($baseData['unit_cost']) 
		            || !isset($baseData['uom_id']) || !isset($baseData['vendor_part_no']) );
		if ($loadVendor) {
			$inVendorDbo=CalemFactory::getDbo('in_vendor');
			if (!isset($baseData['vendor_id'])) { //Auto-lookup vendor id.
				try {
					$rows=$inVendorDbo->fetchBySqlParam('select * from in_vendor where in_id=? and is_primary=1', $baseData['in_id']);
					$vRow=$rows[0];
					//set vendor Id	
				   $baseData['vendor_id']=$vRow['vendor_id'];
				} catch (CalemDboDataNotFoundException $ex) {
				}
			} else {
				try {
					$rows=$inVendorDbo->fetchBySqlParam('select * from in_vendor where in_id=? and vendor_id=?', 
					                       array($baseData['in_id'], $baseData['vendor_id']));	
					$vRow=$rows[0];				                       
				} catch (CalemDboDataNotFoundException $ex) {
				}
			}
			if ($vRow) {
				if (!isset($baseData['unit_cost'])) $baseData['unit_cost']=$vRow['unit_cost'];
				if (!isset($baseData['uom_id'])) $baseData['uom_id']=$vRow['uom_id'];
				if (!isset($baseData['vendor_part_no'])) $baseData['vendor_part_no']=$vRow['vendor_part_no'];
			}
		}
		//Keep track of line cost
		$baseData['line_cost']=$baseData['unit_cost']*$baseData['qty'];
		return $baseData;
	}
	
	//Business logic when data insertion is done.	
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
		//fill-in UOM, unit cost if 
		if (!isset($baseData['qty'])) return;
		$this->onReqItemChange($baseData['in_id'], $baseData['req_id'], $baseData['qty'], $baseData['unit_cost'], $baseData['uom_id']);
	}
	
	//Overwrite deletion to collect pm_id info.
	public function beforeDelete() {
		$this->loadRecord();
	}
	
	//Business logic when data deletion is done.	
	public function onDataDeleted($table, $id) {
		if (!$this->row['qty']) return;
		$this->onReqItemChange($this->row['in_id'], $this->row['req_id'], -1*$this->row['qty'], $this->row['unit_cost'], $this->row['uom_id']);
	}
	
	//before update
	public function beforeUpdate($baseTable, $baseCurrent, $baseUpdate) {
		if ($baseTable['po_id']) {//If this line is on PO
			foreach ($baseUpdate as $key=>$value) {
				if ($this->conf['req_on_po_no_change_fields'][$key]) {
					throw new CalemUiException('CalemReqItemOnPoNoChangeException');
				}
			}
		}
		$qty=isset($baseUpdate['qty']) ? $baseUpdate['qty'] : $baseCurrent['qty'];
		$uc=isset($baseUpdate['unit_cost']) ? $baseUpdate['unit_cost'] : $baseCurrent['unit_cost'];
		$baseUpdate['line_cost']=$qty*$uc;
		return $baseUpdate;	
	}
	
	//On data updated
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		if ( isset($baseUpdate['qty']) || isset($baseUpdate['unit_cost']) || isset($baseUpdate['uom_id'])) {
			$inId=$baseCurrent['in_id'];
			$reqId=$baseCurrent['req_id'];
			if ($baseCurrent['qty']) {
				$this->onReqItemChange($inId, $reqId, -1*$baseCurrent['qty'], $baseCurrent['unit_cost'], $baseCurrent['uom_id']);
			}
			$nQty= ($baseUpdate['qty'] ? $baseUpdate['qty'] : $baseCurrent['qty']);
			$nUc=($baseUpdate['unit_cost']?$baseUpdate['unit_cost']: $baseCurrent['unit_cost']);
			$nUom=($baseUpdate['uom_id'] ? $baseUpdate['uom_id'] : $baseCurrent['uom_id']);
			$this->onReqItemChange($inId, $reqId, $nQty, $nUc, $nUom);
		}    
	}
	
	public function getReqStatus($reqId) {
		$reqDbo=CalemFactory::getDbo("requisition");
		$reqRow=$reqDbo->fetchById($reqId);
		return $reqRow['status_id'];	
	}
	
	public function isReqVoided($reqId) {
		if (!isset($this->reqStatus[$reqId])) {
			$this->reqStatus[$reqId]=$this->getReqStatus($reqId);
		}
		return ($this->reqStatus[$reqId]=='req_status_voided');	
	}
	
	public function onReqItemChange($inId, $reqId, $qty, $uc, $uom) {
		if ($this->isReqVoided($reqId)) return;
		$reqBo=new CalemReqBo();
		$reqBo->onReqItemChanged($inId, $reqId, $qty, $uc, $uom);
	}
	
}

?>