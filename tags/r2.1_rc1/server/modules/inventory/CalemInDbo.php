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
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInBo.php';

class CalemInDbo extends CalemDbo {		
	//Add in number and abc time
	public function beforeInsert($baseTable, $baseData, $customTable, $customData) {
		if (!isset($baseData['in_no']) || !$baseData['in_no']) {
			require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInBo.php';
			$woBo=new CalemInBo();
			$baseData['in_no']=$woBo->getNextInNo();	
		}
		if (isset($baseData['abc_id'])) {
			$baseData['abc_time']=CalemText::getServerDatetime();
		}
		return $baseData;
	}
	
	public function beforeUpdate($baseTable, $baseCurrent, $baseUpdate) {
		if (isset($baseUpdate['abc_id']) && !isset($baseUpdate['abc_time'])) {
			$baseUpdate['abc_time']=CalemText::getServerDatetime();	
		}	
		return $baseUpdate;
	}
	
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		//Notify BO about change
		if (isset($baseUpdate['order_type_id']) || isset($baseUpdate['order_gen_id'])) {
			$inBo=new CalemInBo();
			$inBo->onInOrderInfoChanged($baseCurrent['id'], $this);
		}
	}
}

?>