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

/**
 * Parts checkout/return
 * Tool return to handle specifically
 */
class CalemInTranNotifierAsset extends CalemInTranNotifierNone {
	//Part checkout
	public function on_itt_checkout_icg_part($it) {
		$id=$it['checkout_to_id'];
		$assetDbo=CalemFactory::getDbo('asset');
		$assetDbo->executeBySqlParam('select id from asset where id=? for update', $id);
		$row=$assetDbo->fetchById($id);
		$mc= $row['maint_material_cost'] + $it['tran_total'];
		$mt= $mc + $row['maint_labor_cost'];
		$assetDbo->setValue('maint_material_cost', $mc);
		$assetDbo->setValue('maint_cost', $mt);
		$assetDbo->setIdForUpdate($id);
		$assetDbo->update();	
	}
	
	public function on_itt_return_icg_part($it) {
		$id=$it['checkout_to_id'];
		$assetDbo=CalemFactory::getDbo('asset');
		$assetDbo->executeBySqlParam('select id from asset where id=? for update', $id);
		$row=$assetDbo->fetchById($id);
		$mc= $row['maint_material_cost'] - $it['tran_total'];
		$mt= $mc + $row['maint_labor_cost'];
		$assetDbo->setValue('maint_material_cost', $mc);
		$assetDbo->setValue('maint_cost', $mt);
		$assetDbo->setIdForUpdate($id);
		$assetDbo->update();	
	}
	
	public function on_itt_return_icg_tool($it) {
		$id=$it['checkout_to_id'];
		$assetDbo=CalemFactory::getDbo('asset');
		$assetDbo->executeBySqlParam('select id from asset where id=? for update', $id);
		$row=$assetDbo->fetchById($id);
		$mc= $row['maint_material_cost'] + $it['tran_total'];
		$mt= $mc + $row['maint_labor_cost'];
		$assetDbo->setValue('maint_material_cost', $mc);
		$assetDbo->setValue('maint_cost', $mt);
		$assetDbo->setIdForUpdate($id);
		$assetDbo->update();	
	}
}

?>