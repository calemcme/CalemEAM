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
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInBo.php';		

class InTranCostTest extends PHPUnit2_Framework_TestCase {
	
	private function addIn($id, $category) {
		$inDbo=CalemFactory::getDbo('inventory');
		$inDbo->setChangeBulk(
			array('id'=>$id,
			      'category_id'=>$category));
		$inDbo->insert();	
	}
	
	private function addInTran($id, $inId, $tranType, $unitCost, $qtyAvailable, $tranTime, $rentTotal=0) {
		$itDbo=CalemFactory::getDbo('in_tran');
		$itDbo->setChangeBulk(
			array('id'=>$id,
				'in_id'=>$inId,
				'type_id'=>$tranType,
				'unit_cost'=>$unitCost,
				'qty_available'=>$qtyAvailable,
				'tran_total'=>$rentTotal,
				'tran_time'=>$tranTime)
		);
		$itDbo->insert();
	}
	
	private function cleanup() {
		$inDbo=CalemFactory::getDbo('inventory');
		$inDbo->deleteBySql("delete from inventory where id like 'in_%'");
		$inDbo->deleteBySql("delete from in_tran where id like 'in_tran_%'");
	}
	
	public function testGetCheckoutCost() {
		//Add two entries
		$this->cleanup();
		$this->addIn('in_001', 'icg_part');
		$this->addIn('in_002', 'icg_tool');
		//Checkout tran
		$this->addInTran('in_tran_001', 'in_001', 'itt_checkout', 
		                  10, 2, '2006-08-01');
		$this->addInTran('in_tran_002', 'in_001', 'itt_checkout', 
		                  10, 4, '2006-09-01');

		$this->addInTran('in_tran_003', 'in_002', 'itt_checkout', 
		                  13, 1, '2006-08-10');
		$this->addInTran('in_tran_004', 'in_002', 'itt_checkout', 
		                  13, 2, '2006-09-01');
		                  
		//Tools
		$this->addInTran('in_tran_005', 'in_002', 'itt_return', 
		                  17, 1, '2006-06-01', 13);
		$this->addInTran('in_tran_006', 'in_002', 'itt_return', 
		                  17, 2, '2006-07-01', 33);		                  
		                  		                  
		                   
		$inBo=new CalemInBo();
		
		//Out of time range
		$startDate='2006-10-01';
		$endDate='2006-10-31';
		$ic=$inBo->getInCheckoutCost($startDate, $endDate);
		$this->assertTrue($ic==0);
		
		//Include Aug
		$startDate='2006-08-01';
		$endDate='2006-08-31';
		$lc=$inBo->getInCheckoutCost($startDate, $endDate);
		$this->assertTrue($lc==20);
		
		//Include Sept
		$startDate='2006-09-01';
		$endDate='2006-09-30';
		$lc=$inBo->getInCheckoutCost($startDate, $endDate);
		$this->assertTrue($lc==40);
		
		//Include Aug/Sept
		$startDate='2006-08-01';
		$endDate='2006-09-31';
		$lc=$inBo->getInCheckoutCost($startDate, $endDate);
		$this->assertTrue($lc==60);
		
		//June tool
		$startDate='2006-06-01';
		$endDate='2006-06-30';
		$lc=$inBo->getInCheckoutCost($startDate, $endDate);
		$this->assertTrue($lc==13);
		
		//July tool
		$startDate='2006-07-01';
		$endDate='2006-07-30';
		$lc=$inBo->getInCheckoutCost($startDate, $endDate);
		$this->assertTrue($lc==33);
		
		//Jun/July tool
		$startDate='2006-06-01';
		$endDate='2006-07-30';
		$lc=$inBo->getInCheckoutCost($startDate, $endDate);
		$this->assertTrue($lc==46);
		
		//Jun to Sept
		$startDate='2006-06-01';
		$endDate='2006-09-30';
		$lc=$inBo->getInCheckoutCost($startDate, $endDate);
		$this->assertTrue($lc==106);
		
		$this->cleanup();		
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new InTranCostTest();
	$res->testGetCheckoutCost();
}
?>
