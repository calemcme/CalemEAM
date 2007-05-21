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

/**
 * Only AvgUnitCost is supported at this time. FIFO to add later.
 */
class CalemInCostFifoBo extends CalemBo implements CalemInCostIf {		
	/**
	 * Find out unit cost at checkout
	 */
	public function getUnitCostByCheckout($inId, $qty) {
		if ($qty==0) return;
		
		//Find out the transactions to check out from
		$inTranDbo= CalemFactory::getDbo('in_tran');
		$rows = $inTranDbo->fetchBySqlParam('select id, in_id, unit_cost, qty_available, tran_time from in_tran where in_id=? and qty_available > 0 and voided=0 and type_id in (?, ?) order by tran_time ASC',
		                            array($inId, 'itt_receive', 'itt_checkin'));
		$useRows=array();
		$cQty=$qty;
		foreach ($rows as $row) {
			if ($row['qty_available']>=$cQty) {
				$useRows[]=array('src_tran_id'=>$row['id'], 'in_id'=>$inId, 'unit_cost'=>$row['unit_cost'], 'qty'=>$cQty, 'qty_available'=>$row['qty_available']-$cQty);
				break;
			} else {
				$userRows[]=array('src_tran_id'=>$row['id'], 'in_id'=>$inId, 'unit_cost'=>$row['unit_cost'], 'qty'=>$row['qty_available'], 'qty_available'=>0);
				$cQty -= $row['qty_available'];
			}
		}		
		if ($cQty > 0) {//By cost it would not work out.
		   global $_CALEM_conf;
		   if ($_CALEM_conf['in_checkout']['noCost']< 0) {
				throw new CalemUiException('CheckoutNotEnoughQtyInStock');
		   }
		   //Find avgUnitCost
		   $inDbo=CalemFactory::getDbo('inventory');
		   $inDbo->setId($inId);
		   $inDbo->loadRecord();
		   //Use avgUnitCost for this row.
		   $userRows[]=array('src_tran_id'=>null, 'in_id'=>$inId, 'unit_cost'=>$inDbo->row['avg_unit_cost'], 'qty'=>$cQty);
		}
		//Now figure out the total for this transaction
		$total=0;
		foreach ($userRows as $row) {
			$total += $row['unit_cost']*$row['qty'];	
		}    
		$newUc=$total/$qty;
		return array(
		         'total'=>$total,
		         'unit_cost'=>$newUc,
		         'cost_list'=>$userRows);                        
	}
	
	/**
	 * Set unit cost by return
	 */
	public function setUnitCostByReturn($checkoutTranId, $qty) {
		$wsDbo=CalemFactory::getDbo('in_tran_worksheet');
		
	}
	/**
	 * At receive time, recalculate avgUnitCost
	 */
	public function setUnitCostByReceive($inId, $rcUnitCost, $qty) {
	}
	
	public function setUnitCostByCheckin($inId, $ciUnitCost, $qty) {
		$this->setUnitCostByReceive($inId, $ciUnitCost, $qty);
	}
}
