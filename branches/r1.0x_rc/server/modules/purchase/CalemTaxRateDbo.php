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

class CalemTaxRateDbo extends CalemDbo {
	
	//Fix tax rate on tax code
	public function onDataInserted($id, $baseTable, $baseData, $customTable, $customData) {
		if (!isset($baseData['tax_rate']) || !$baseData['tax_rate']) return;
		$this->updateTaxCode($baseData['tax_code_id'], $baseData['tax_rate']);
	}
	
	//Change tax rate when updated.
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		$taxRate=$baseCurrent['tax_rate'];
		$nRate= isset($baseUpdate['tax_rate']) ? $baseUpdate['tax_rate'] : $baseCurrent['tax_rate'];
		$diff=$nRate - $taxRate;
		if ($diff !=0) {
			$this->updateTaxCode($baseCurrent['tax_code_id'], $diff);	
		}
	}
	
	//collect record info.
	public function beforeDelete() {
		$this->loadRecord();
	}
	
	//Business logic when data deletion is done.	
	public function onDataDeleted($table, $id) {
		if ($this->row['tax_rate']) {
			$this->updateTaxCode($this->row['tax_code_id'], -1*$this->row['tax_rate']);	
		}
	}
	
	//Tax code update
	public function updateTaxCode($id, $rate) {
		$dbo=CalemFactory::getDbo('tax_code');
		try {
			$row=$dbo->fetchById($id);
			$nRate=max(0, $row['tax_rate_total']+$rate);
			$dbo->setValue('tax_rate_total', $nRate);
			$dbo->setIdForUpdate($id);
			$dbo->update();
		} catch (CalemDboDataNotFoundException $ex) {}	
	}
}
