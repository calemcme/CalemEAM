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
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoReservedBo.php';		

class WoReservedTest extends PHPUnit2_Framework_TestCase {
	
	private function cleanup() {
		$dbo=CalemFactory::getDbo('inventory');
		$dbo->deleteBySqlParam('delete from inventory where id=?', 'in_001');
		$dbo->deleteBySqlParam('delete from workorder where id=?', 'wo_001');
		$dbo->deleteBySqlParam('delete from wo_planned_part where wo_id=?', 'wo_001');
		$dbo->deleteBySqlParam('delete from in_reserved where wo_id=?', 'wo_001');
	}
	
	private function addInRow($row) {
		$inDbo=CalemFactory::getDbo('inventory');
		$inDbo->setChangeBulk($row);
		$inDbo->insert();	
	}
	
	private function addWoRow($row) {
		$dbo=CalemFactory::getDbo('workorder');
		$dbo->setChangeBulk($row);
		$dbo->insert();	
	}
	
	private function addWopRow($row) {
		$dbo=CalemFactory::getDbo('wo_planned_part');
		$dbo->setChangeBulk($row);
		$dbo->insert();	
	}
	
	public function testPlannedPart() {
		$rsvDbo=CalemFactory::getDbo('in_reserved');
		
		$this->cleanup();
		$this->addInRow(array(
			'id'=>'in_001',
			'qty_in_stock'=>5,
			'qty_on_order'=>4,
			'qty_reserved'=>0
		));
		$this->addWoRow(array(
			'id'=>'wo_001'		
		));
		$this->addWopRow(array(
			'in_id'=>'in_001',
			'wo_id'=>'wo_001',
			'qty'=>5
		));
		$rBo=new CalemWoReservedBo();
		$rBo->updateReservedSafe('wo_001', 'in_001', 5);
		//Now verify reserved
		$rows=$rsvDbo->fetchBySqlParam('select * from in_reserved where in_id=? and wo_id=?', 
										array('in_001', 'wo_001'));
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in rsvd=" . var_export($rows, true) . "<br>";
		}										
		$this->assertTrue(count($rows)==1);
		$this->assertTrue($rows[0]['qty']==5);
		
		//Mimic a deletion of wo planned part
		$rBo->updateReservedSafe('wo_001', 'in_001', -5);
		//Now verify reserved
		try {
			$rows=$rsvDbo->fetchBySqlParam('select * from in_reserved where in_id=? and wo_id=?', 
												array('in_001', 'wo_001'));
			$this->assertTrue(1===2);												
		} catch (CalemDboDataNotFoundException $ex) {	
		}
		
		$this->cleanup();
	}	
	
	public function testCloseWo() {
		$rsvDbo=CalemFactory::getDbo('in_reserved');
		
		$this->cleanup();
		$this->addInRow(array(
			'id'=>'in_001',
			'qty_in_stock'=>5,
			'qty_on_order'=>4,
			'qty_reserved'=>0
		));
		$this->addWoRow(array(
			'id'=>'wo_001'		
		));
		$this->addWopRow(array(
			'in_id'=>'in_001',
			'wo_id'=>'wo_001',
			'qty'=>5
		));
		$rBo=new CalemWoReservedBo();
		$rBo->updateReservedSafe('wo_001', 'in_001', 5);
		//Now verify reserved
		$rows=$rsvDbo->fetchBySqlParam('select * from in_reserved where in_id=? and wo_id=?', 
										array('in_001', 'wo_001'));
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in rsvd=" . var_export($rows, true) . "<br>";
		}										
		$this->assertTrue(count($rows)==1);
		$this->assertTrue($rows[0]['qty']==5);
		
		//Mimic a deletion of wo planned part
		$rBo->removeReservedByWo('wo_001');
		//Now verify reserved
		try {
			$rows=$rsvDbo->fetchBySqlParam('select * from in_reserved where in_id=? and wo_id=?', 
												array('in_001', 'wo_001'));
			$this->assertTrue(1===2);												
		} catch (CalemDboDataNotFoundException $ex) {	
		}
		
		$this->cleanup();
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new WoReservedTest();
	$res->testPlannedPart();
	$res->testCloseWo();
}
?>
