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
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemUomBo.php';
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInOrderGenBo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';

class CalemInBo extends CalemBo {
	private $conf;
	
	public function __construct() {	
 		parent::__construct();
 		//Get configuration
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['in_conf'];	
 	}
	
	public function getInCheckoutCost($startDate, $endDate) {
		$inTranDbo=CalemFactory::getDbo('in_tran');
		//Get part cost from checkout
		$pc=$inTranDbo->getCountBySqlParam(
                "select sum(t.qty_available*t.unit_cost) from in_tran t join inventory i1 " .
                "where t.tran_time >=? and t.tran_time <=? and t.type_id='itt_checkout' " . 
                " and t.in_id=i1.id and i1.category_id='icg_part'",
		                     array($startDate, $endDate));	
	   //Get tool cost from return
		$tc=$inTranDbo->getCountBySqlParam(
                "select sum(t.tran_total) from in_tran t join inventory i1 " .
                "where t.tran_time >=? and t.tran_time <=? and t.type_id='itt_return' " . 
                " and t.in_id=i1.id and i1.category_id='icg_tool'",
		                     array($startDate, $endDate));	
		return $pc+$tc;
	}
	
	/**
	 * On order qty changed
	 */
	public function updateOnOrder($inId, $qty, $uom) {
		$inDbo=CalemFactory::getDbo('inventory');
		$inRow=$inDbo->fetchById($inId);
		$uomBo=new CalemUomBo();
		$factor=$uomBo->getUomMap($uom, $inRow['uom_id']);
		$qtyOnOrder=max(0, $inRow['qty_on_order']+$qty*$factor);
		$inDbo->setValue('qty_on_order', $qtyOnOrder);
		$inDbo->setIdForUpdate($inId);
		$inDbo->update();
		//onOrder is updated
		$this->onInOnOrderChanged($inId, $inDbo);
	}
	
	/**
	 * Inventory stock level monitor
	 * Check for order generation based on:
	 *   qty_in_stock + qty_on_order - qty_reserved
	 */
	public function onInStockLevelChanged($inId, $inDbo=null) {
		if (!$inDbo) $inDbo=CalemFactory::getDbo('inventory');
		$inRow=$this->updateQtyToOrder($inId, $inDbo);
		$this->generateOrderRequest($inRow);
	}
	
	public function onInOnOrderChanged($inId, $inDbo=null) {
		if (!$inDbo) $inDbo=CalemFactory::getDbo('inventory');
		$inRow=$this->updateQtyToOrder($inId, $inDbo); 
		//Will not auto-gen in this case.
	}
	
	public function onInReservedChanged($inId, $inDbo=null) {
		if (!$inDbo) $inDbo=CalemFactory::getDbo('inventory');
		$inRow=$this->updateQtyToOrder($inId, $inDbo);
		$this->generateOrderRequest($inRow);		
	}
	
	public function onInOrderInfoChanged($inId, $inDbo=null) {
		if (!$inDbo) $inDbo=CalemFactory::getDbo('inventory');
		$inRow=$this->updateQtyToOrder($inId, $inDbo);
		$this->generateOrderRequest($inRow);	
	}
	
	/**
	 * Figure out qty to order
	 */
	public function updateQtyToOrder($inId, $inDbo) {
		$inRow=$inDbo->fetchById($inId);
		$stockLevel=$inRow['qty_in_stock']+$inRow['qty_on_order']-$inRow['qty_reserved'];
		$oldQty=$inRow['qty_to_order'];
		if ($inRow['order_type_id']=='in_order_minmax') {
			if ($stockLevel < $inRow['min_level']) {
				$inRow['qty_to_order']=max(0, $inRow['max_level']-$stockLevel);	
			} else {
				$inRow['qty_to_order']=0;
			}
		} else if ($inRow['order_type_id']=='in_order_rp') {
			if ($stockLevel < $inRow['reorder_point']) {
				$inRow['qty_to_order']=$inRow['reorder_qty'];	
			} else {
				$inRow['qty_to_order']=0;
			}
		} 
		//on-demand
		else if ($inRow['order_type_id']=='in_order_demand') {
			$inRow['qty_to_order']=max(0, -1 * $stockLevel);	
		} else { //Not calculated
			$inRow['qty_to_order']=0;
		}
		
		if ($oldQty != $inRow['qty_to_order']) {//There's a change
			$inDbo->setValue('qty_to_order', $inRow['qty_to_order']);
			$inDbo->setIdForUpdate($inId);
			$inDbo->update();
		}
		return $inRow;
	} 
	
	/**
	 * Order generation check
	 */
	public function generateOrderRequest($inRow) {
		if ($inRow['qty_to_order'] > 0 && $inRow['order_gen_id']=='inog_auto') {
			$inOrderGenBo=new CalemInOrderGenBo();
			$inOrderGenBo->autoGenOrderRequest($inRow['id'], $inRow['qty_to_order'], 
			               $inRow['uom_id'], $inRow['owner_user_id'], CalemText::getServerDateTime());
		}
	}
	
	/**
	 * Find a vendor
	 */
	public function getInVendor($inId) {
		$vRow=null;
		$vDbo=CalemFactory::getDbo('in_vendor');
		try {
			$rows=$vDbo->fetchBySqlParam('select * from in_vendor where in_id=? order by is_primary', $inId);
			$vRow=$rows[0];	
		}	catch (CalemDboDataNotFoundException $ex) {}
		return $vRow;
	}
}
