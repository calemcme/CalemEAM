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
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoBo.php';		

class WoLaborCostTest extends PHPUnit2_Framework_TestCase {
	
	private function addWoLabor($id, $startTime, $cost=10) {
		$wlDbo=CalemFactory::getDbo('wo_labor');
		$wlDbo->setChangeBulk(
			array('id'=>$id,
				'line_cost'=>$cost,
				'start_time'=>$startTime)
		);
		$wlDbo->insert();
	}
	
	private function cleanup() {
		$wlDbo=CalemFactory::getDbo('wo_labor');
		$wlDbo->deleteBySql("delete from wo_labor where id like 'wo_labor_%'");
	}
	
	public function testGetLaborCost() {
		//Add two entries
		$this->cleanup();
		$this->addWoLabor('wo_labor_001', '2006-09-01 12:00:00', 10);
		$this->addWoLabor('wo_labor_002', '2006-08-01 12:30:00', 60);
		$woBo=new CalemWoBo();
		
		//Out of time range
		$startDate='2006-10-01';
		$endDate='2006-10-31';
		$lc=$woBo->getWoLaborCost($startDate, $endDate);
		$this->assertTrue($lc==0);
		
		//Include Aug
		$startDate='2006-08-01';
		$endDate='2006-08-31';
		$lc=$woBo->getWoLaborCost($startDate, $endDate);
		$this->assertTrue($lc==60);
		
		//Include Aug/Sep
		$startDate='2006-08-01';
		$endDate='2006-09-30';
		$lc=$woBo->getWoLaborCost($startDate, $endDate);
		$this->assertTrue($lc==70);
		
		$this->cleanup();		
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new WoLaborCostTest();
	$res->testGetLaborCost();
}
?>
