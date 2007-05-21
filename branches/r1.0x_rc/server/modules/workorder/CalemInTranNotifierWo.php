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

require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInTranNotifierNone.php';
require_once _CALEM_DIR_ . 'server/modules/asset/CalemInTranNotifierAsset.php';
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoReservedBo.php';

/**
 * Parts checkout/return
 * Tool return to handle specifically
 */
class CalemInTranNotifierWo extends CalemInTranNotifierNone {
	//Part checkout
	public function on_itt_checkout_icg_part($it) {
		//Update cost in workorder first
		$id=$it['checkout_to_id'];
		$woDbo=CalemFactory::getDbo('workorder');
		$woDbo->executeBySqlParam('select id from workorder where id=? for update', $id);
		$woRow=$woDbo->fetchById($id);
		$mc= $woRow['material_cost'] + $it['tran_total'];
		$mt= $mc + $woRow['labor_cost'];
		$woDbo->setValue('material_cost', $mc);
		$woDbo->setValue('total_cost', $mt);
		$woDbo->setIdForUpdate($id);
		$woDbo->update();	
		//Update wop
		$wopDbo=CalemFactory::getDbo('wo_part');
		$ar=array();
		try {
			$rows=$wopDbo->fetchBySqlParam('select * from wo_part where wo_id=? and in_id=?', array($id, $it['in_id']));
			$row=$rows[0];
			$ar['qty_used']=$row['qty_used']+$it['qty'];
			$ar['line_cost']=$row['line_cost']+$it['tran_total'];
			$wopDbo->setChangeBulk($ar);
			$wopDbo->setIdForUpdate($row['id']);
			$wopDbo->update();	
		} catch (CalemDboDataNotFoundException $ex) { //Add a new record
			$ar['wo_id']=$id;
			$ar['in_id']=$it['in_id'];
			$ar['qty_used']=$it['qty'];
			$ar['line_cost']=$it['tran_total'];
			$ar['note']=$it['note'];
			$wopDbo->setChangeBulk($ar);
			$wopDbo->insert();				
		}
		//Update reserved parts if it's not closed.
		if ($woRow['status_id']!='wos_closed') {
			$rsvdBo=new CalemWoReservedBo();
			$rsvdBo->updateReservedSafe($woRow['id'], $it['in_id'], (-1 * $it['qty']));
		}
		
		//Needs to update asset if wo is closed
		$assetHdlr=new CalemInTranNotifierAsset();
		$it['checkout_to_id']=$woRow['asset_id'];
		$assetHdlr->on_itt_checkout_icg_part($it);	
	}
	
	//Part return
	public function on_itt_return_icg_part($it) {
		//Update cost in workorder first
		$id=$it['checkout_to_id'];
		$woDbo=CalemFactory::getDbo('workorder');
		$woDbo->executeBySqlParam('select id from workorder where id=? for update', $id);
		$woRow=$woDbo->fetchById($id);
		$mc= $woRow['material_cost'] - $it['tran_total'];
		if ($mc < 0) $mc=0;
		$mt= $mc + $woRow['labor_cost'];
		$woDbo->setValue('material_cost', $mc);
		$woDbo->setValue('total_cost', $mt);
		$woDbo->setIdForUpdate($id);
		$woDbo->update();	
		//Update wop
		$wopDbo=CalemFactory::getDbo('wo_part');
		$ar=array();
		try {
			$rows=$wopDbo->fetchBySqlParam('select * from wo_part where wo_id=? and in_id=?', array($id, $it['in_id']));
			$row=$rows[0];
			$qn = $row['qty_used'] - $it['qty'];
			$ar['qty_used']= ($qn < 0) ? 0 : $qn;
			$ln=$row['line_cost']-$it['tran_total'];
			$ar['line_cost']= ($ln<0) ? 0: $ln;
			$wopDbo->setChangeBulk($ar);
			$wopDbo->setIdForUpdate($row['id']);
			$wopDbo->update();	
		} catch (CalemDboDataNotFoundException $ex) { //Add a new record
			//This is wrong, one is returning a part that's not checked out to workorder
			throw $ex;				
		}
		//Update reserved parts if it's not closed.
		if ($woRow['status_id']!='wos_closed') {
			$rsvdBo=new CalemWoReservedBo();
			$rsvdBo->updateReservedSafe($woRow['id'], $it['in_id'], $it['qty']);
		}
		
		//Needs to update asset if wo is closed
		$assetHdlr=new CalemInTranNotifierAsset();
		$it['checkout_to_id']=$woRow['asset_id'];
		$assetHdlr->on_itt_return_icg_part($it);	
	}
	
	//Tool checkout - update qty checked out.
	public function on_itt_checkout_icg_tool($it) {
		//Lock wo first
		$id=$it['checkout_to_id'];
		$woDbo=CalemFactory::getDbo('workorder');
		$woDbo->executeBySqlParam('select id from workorder where id=? for update', $id);
		//Update qty checked out.
		$woToolDbo=CalemFactory::getDbo('wo_tool');
		try {
			$tRows=$woToolDbo->fetchBySqlParam('select * from wo_tool where wo_id=? and in_id=?', 
			                                           array($id, $it['in_id']));
			$tRow=$tRows[0];
			$qty=$tRow['qty_checkout']+$it['qty'];
			$woToolDbo->setValue('qty_checkout', $qty);
			$woToolDbo->setIdForUpdate($tRow['id']);
			$woToolDbo->update();
		} catch (CalemDboDataNotFoundException $ex) {
			$nRow['wo_id']=$id;
			$nRow['in_id']=$it['in_id'];
			$nRow['qty_checkout']=$it['qty'];
			$nRow['note']=$it['note'];
			$woToolDbo->setChangeBulk($nRow);
			$woToolDbo->insert();	
		}
	}
	
	//Tool return
	public function on_itt_return_icg_tool($it) {
		//Update cost in workorder first
		$id=$it['checkout_to_id'];
		$woDbo=CalemFactory::getDbo('workorder');
		$woDbo->executeBySqlParam('select id from workorder where id=? for update', $id);
		$woRow=$woDbo->fetchById($id);
		$mc= $woRow['material_cost'] + $it['tran_total'];
		if ($mc < 0) $mc=0;
		$mt= $mc + $woRow['labor_cost'];
		$woDbo->setValue('material_cost', $mc);
		$woDbo->setValue('total_cost', $mt);
		$woDbo->setIdForUpdate($id);
		$woDbo->update();	
		//Update wo_tool
		$wotDbo=CalemFactory::getDbo('wo_tool');
		$ar=array();
		try {
			$rows=$wotDbo->fetchBySqlParam('select * from wo_tool where wo_id=? and in_id=?', array($id, $it['in_id']));
			$row=$rows[0];
			$ar['line_cost'] += $it['tran_total'];
			$ar['qty_return'] = $row['qty_return']+$it['qty'];
			$wotDbo->setChangeBulk($ar);
			$wotDbo->setIdForUpdate($row['id']);
			$wotDbo->update();	
		} catch (CalemDboDataNotFoundException $ex) { //Add a new record
			//Add usage here.
			$ar=array();
			$ar['wo_id']=$id;
			$ar['in_id']=$it['in_id'];
			$ar['qty_return']=$it['qty'];
			$ar['line_cost']=$it['tran_total'];
			$ar['note']=$it['note'];
			$wotDbo->setChangeBulk($ar);
			$wotDbo->insert();				
		}
		
		//Needs to update asset if wo is closed
		$assetHdlr=new CalemInTranNotifierAsset();
		$it['checkout_to_id']=$woRow['asset_id'];
		$assetHdlr->on_itt_return_icg_tool($it);	
	}
}
