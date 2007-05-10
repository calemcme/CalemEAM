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

 
/** 
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */ 

//Note that PHPUnit2 must be on the include path for it to work.
require_once 'PHPUnit2/Framework/TestCase.php';

if (!defined('_CALEM_DIR_')) {
	if (!isset($_ENV['CALEM_DIR'])) {
		chdir('../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	}  
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemUiException.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/budget/CalemBudgetBo.php';		

class UpdateBudgetActualTest extends PHPUnit2_Framework_TestCase {
	
	private function addBudget($id, $start, $end) {
		$dDbo=CalemFactory::getDbo('budget');
		$dDbo->setChangeBulk(
			array('id'=>$id,
				'start_date'=>$start,
				'end_date'=>$end)
		);
		$dDbo->insert();
	}
	
	private function cleanup() {
		$wlDbo=CalemFactory::getDbo('wo_labor');
		$wlDbo->deleteBySql("delete from budget where id like 'budget_%'");
	}
	
	public function testUpdateBudgetActual() {
		//Add two entries
		$this->cleanup();
		$this->addBudget('budget_001', '2006-10-01', '2006-09-01');
		$budBo=new CalemBudgetBo();
		
		//Out of time range
		try {
			$budBo->updateBudgetActual(array('budget_id'=>'budget_001'));
			$this->assertTrue(1==2);
		} catch (CalemUiException $ex) {}
		
		// Good time range
		$this->cleanup();
		$this->addBudget('budget_001', '2006-10-01', '2006-11-01');
		$budBo->updateBudgetActual(array('budget_id'=>'budget_001'));
		
		$this->cleanup();		
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new UpdateBudgetActualTest();
	$res->testUpdateBudgetActual();
}
?>
