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
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInOrderGenBo.php';	

class InBoGenOrderReqTest extends PHPUnit2_Framework_TestCase {
	
	private function addInRow($inRow) {
		$inDbo=CalemFactory::getDbo('inventory');
		$inDbo->setChangeBulk($inRow);
      $inDbo->insert();	
	}
	
	private function addInVendor($inRow) {
		$inDbo=CalemFactory::getDbo('in_vendor');
		$inDbo->setChangeBulk($inRow);
      $inDbo->insert();	
	}
	
	private function cleanup() {
		$inDbo=CalemFactory::getDbo('inventory');
		$inDbo->deleteBySql("delete from inventory where id like 'in_%'");
		$inDbo->deleteBySqlParam("delete from requisition where id in (select distinct(req_id) from req_item where in_id=?)", 'in_001');
		$inDbo->deleteBySqlParam('delete from in_vendor where in_id=?', 'in_001');
		$inDbo->deleteBySqlParam('delete from req_item where in_id=?', 'in_001');
	}
	
	public function testGenReqManual() {
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "testGenReqManual<br>";
		}
		$riDbo=CalemFactory::getDbo('req_item');
		$rDbo=CalemFactory::getDbo('requisition');
		$inDbo=CalemFactory::getDbo('inventory');
		$inId='in_001';
		
		//Add two entries
		$this->cleanup();
		//No order gen
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>2,
               'qty_on_order'=>3,
               'qty_reserved'=>4,
               'order_type_id'=>'in_order_minmax',
               'min_level'=>4,
               'max_level'=>8,
               'order_gen_id'=>'inog_manual'
               )
		);
		$this->addInVendor(
			array('in_id'=>'in_001',
			      'vendor_id'=>'vendor_001',
			      'vendor_part_no'=>'vendor_part_no_001',
			      'unit_cost'=>10,
			      'is_primary'=>1
               )
		);
		//Update it first
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		
		//Now get the row and verify qty_to_order
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==7);
		
		//Use order gen directly.
		//conf
		global $_CALEM_conf;
		$conf=$_CALEM_conf['in_conf'];
		$initRow=$conf['in_order_gen']['req_manual']['init'];
		$orderGen=new CalemInOrderGenBo();
		$orderGen->manualGenOrderRequest($inRow['id'], $initRow);
		
		//Verify that req is generated
		$riRows=$riDbo->fetchBySqlParam('select * from req_item where in_id=?', 'in_001');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req_item rows=" . var_export($riRows, true) . "<br>";
		}
		$this->assertTrue(count($riRows)==1);
		$riRow=$riRows[0];
		$this->assertTrue($riRow['qty']==7 && $riRow['unit_cost']==10 
		                  && $riRow['line_cost']==70);
		$this->assertTrue($riRow['vendor_id']=='vendor_001'
		               && $riRow['vendor_part_no']=='vendor_part_no_001');
		//Verify Req
		$rRow=$rDbo->fetchById($riRow['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req row=" . var_export($rRow, true) . "<br>";
		}	               		                  
		
		foreach ($initRow as $key=>$val) {
			$this->assertTrue($rRow[$key]==$val);	
		}
		$this->assertTrue($rRow['req_total']==$riRow['line_cost']);	
		
		$this->cleanup();		
	}	
	
	public function testGenReqAuto() {
		$riDbo=CalemFactory::getDbo('req_item');
		$rDbo=CalemFactory::getDbo('requisition');
		$inDbo=CalemFactory::getDbo('inventory');
		$inId='in_001';
		
		//Add two entries
		$this->cleanup();
		//No order gen
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>2,
               'qty_on_order'=>3,
               'qty_reserved'=>4,
               'order_type_id'=>'in_order_minmax',
               'min_level'=>4,
               'max_level'=>8,
               'order_gen_id'=>'inog_auto'
               )
		);
		$this->addInVendor(
			array('in_id'=>'in_001',
			      'vendor_id'=>'vendor_001',
			      'vendor_part_no'=>'vendor_part_no_001',
			      'unit_cost'=>10,
			      'is_primary'=>1
               )
		);
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==0);
		//Verify that req is generated
		$riRows=$riDbo->fetchBySqlParam('select * from req_item where in_id=?', 'in_001');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req_item rows=" . var_export($riRows, true) . "<br>";
		}
		$this->assertTrue(count($riRows)==1);
		$riRow=$riRows[0];
		$this->assertTrue($riRow['qty']==7 && $riRow['unit_cost']==10 
		                  && $riRow['line_cost']==70);
		$this->assertTrue($riRow['vendor_id']=='vendor_001'
		               && $riRow['vendor_part_no']=='vendor_part_no_001');
		//Verify Req
		$rRow=$rDbo->fetchById($riRow['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req row=" . var_export($rRow, true) . "<br>";
		}	               		                  
		//conf
		global $_CALEM_conf;
		$conf=$_CALEM_conf['in_conf'];
		$initRow=$conf['in_order_gen']['req_auto']['init'];
		foreach ($initRow as $key=>$val) {
			$this->assertTrue($rRow[$key]==$val);	
		}
		$this->assertTrue($rRow['req_total']==$riRow['line_cost']);
		
		//Now mimic a reserved change and change to on demand order type
		$inDbo->setChangeBulk( array(
          'qty_reserved'=>$inRow['qty_reserved']+10,
          'order_type_id'=>'in_order_demand'));
		$inDbo->setIdForUpdate($inId);
		$inDbo->update();
		
		$inBo->onInReservedChanged($inId);
		//Now explore the result again
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==0);
		//Verify that req is generated
		$riRows=$riDbo->fetchBySqlParam('select * from req_item where in_id=? order by qty DESC', 'in_001');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "req_item rows=" . var_export($riRows, true) . "<br>";
		}
		$this->assertTrue(count($riRows)==2);
		$riRow=$riRows[0];
		$this->assertTrue($riRow['qty']==7 && $riRow['unit_cost']==10 
		                  && $riRow['line_cost']==70);
		$rRow=$rDbo->fetchById($riRow['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "req row=" . var_export($rRow, true) . "<br>";
		}
		$this->assertTrue($rRow['req_total']==70);		                  
		                  
		$riRow=$riRows[1];		                  
		$this->assertTrue($riRow['qty']==2 && $riRow['unit_cost']==10 
		                  && $riRow['line_cost']==20);		                  
		$this->assertTrue($riRow['vendor_id']=='vendor_001'
		               && $riRow['vendor_part_no']=='vendor_part_no_001');
		$rRow=$rDbo->fetchById($riRow['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "req row=" . var_export($rRow, true) . "<br>";
		}
		$this->assertTrue($rRow['req_total']==20);
		
		
		$this->cleanup();		
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new InBoGenOrderReqTest();
	$res->testGenReqAuto();
	$res->testGenReqManual();
}
?>
