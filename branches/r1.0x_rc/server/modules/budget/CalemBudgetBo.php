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
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoBo.php';

class CalemBudgetBo extends CalemBo {
	private $conf;
	
	public function __construct() {	
 		parent::__construct();
 		//Get configuration
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['budget_conf'];	
 	}
 	
 	/**
 	 * Update budget actual
 	 */
	public function updateBudgetActual($tran) {
		$budgetDbo=CalemFactory::getDbo('budget');
		$bRow=$budgetDbo->fetchById($tran['budget_id']);
		$startDate=$bRow['start_date'];
		$endDate=$bRow['end_date'];
		if (!$startDate || !$endDate || ! ($startDate < $endDate)) {
			throw new CalemUiException('CalemBudgetUpdateInvalidDateException');	
		}
		//Get material cost
		$inBo=new CalemInBo();
		$mc=$inBo->getInCheckoutCost($startDate, $endDate);
		$woBo=new CalemWoBo();
		$lc=$woBo->getWoLaborCost($startDate, $endDate);
		//Actual cost
		$ac=$mc+$lc;
		$budgetDbo->setValue('app', $ac);
		$budgetDbo->setIdForUpdate($tran['budget_id']);
		$budgetDbo->update();		
	}
}
