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
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInCostIf.php';

class CalemInCostAvgBo extends CalemBo implements CalemInCostIf {		
	/**
	 * Find out unit cost at checkout
	 */
	public function getUnitCostByCheckout($inId, $qty) {
		$inDbo = CalemFactory::getDbo('inventory');
		$inDbo->setId($inId);
		$inDbo->loadRecord();
		$newUc=$inDbo->getValue('avg_unit_cost');
		return array(
		         'total'=>$qty * $newUc,
		         'unit_cost'=>$newUc,
		         'cost_list'=>null); 
	}
	
	/**
	 * Set unit cost by return
	 */
	public function setUnitCostByReturn($inCheckoutRow, $qty) {
		return array(
			'total'=>$qty * $inCheckoutRow['unit_cost'],
			'unit_cost'=>$inCheckoutRow['unit_cost'],
			'cost_list'=>null
		);
	}
	/**
	 * At receive time, recalculate avgUnitCost
	 */
	public function setUnitCostByReceive($inId, $rcUnitCost, $qty) {
		if ($qty==0) return; //Nothing to do.
		
		$inDbo=CalemFactory::getDbo('inventory');
		$inDbo->setIdForUpdate($inId);
		$inDbo->loadRecord();
		$unitCost=$inDbo->getValue('avg_unit_cost');
		//Now get the total qty in stock
		$total=$inDbo->getCountBySqlParam('select sum(qty) from in_stock where in_id=?', array($inId));
		if ($total+$qty==0) {
			$this->logger->info("Total qty is 0 so unit cost is not calculated: total=" . $total . ", qty=". $qty . ", inId=" . $inId);
			return;	
		}
		$newUnitCost=($total*$unitCost + $rcUnitCost*$qty)/($total+$qty);
		$inDbo->setValue('avg_unit_cost', $newUnitCost);
		$inDbo->update();
	}
	
	public function setUnitCostByCheckin($inId, $ciUnitCost, $qty) {
		$this->setUnitCostByReceive($inId, $ciUnitCost, $qty);
	}
}
