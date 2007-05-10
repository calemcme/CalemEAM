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

class InBoQtyToOrderTest extends PHPUnit2_Framework_TestCase {
	
	private function addInRow($inRow) {
		$inDbo=CalemFactory::getDbo('inventory');
		$inDbo->setChangeBulk($inRow);
       $inDbo->insert();	
	}
	
	private function cleanup() {
		$inDbo=CalemFactory::getDbo('inventory');
		$inDbo->deleteBySql("delete from inventory where id like 'in_%'");
		$inDbo->deleteBySql("delete from in_tran where id like 'in_tran_%'");
	}
	
	public function testMinMax() {
		$inDbo=CalemFactory::getDbo('inventory');
		$inId='in_001';
		
		//Add two entries
		$this->cleanup();
		//No order gen
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>5,
               'qty_on_order'=>3,
               'qty_reserved'=>4,
               'order_type_id'=>'in_order_minmax',
               'min_level'=>4,
               'max_level'=>8
               )
		
		);
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==0);
		
		//set qty
		$this->cleanup();
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>5,
               'qty_on_order'=>0,
               'qty_reserved'=>4,
               'order_type_id'=>'in_order_minmax',
               'min_level'=>4,
               'max_level'=>8
               )
		
		);
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==7);
		
		$this->cleanup();		
	}	
	
	public function testReorderPoint() {
		$inDbo=CalemFactory::getDbo('inventory');
		$inId='in_001';
		
		//Add two entries
		$this->cleanup();
		//No order gen
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>5,
               'qty_on_order'=>3,
               'qty_reserved'=>4,
               'order_type_id'=>'in_order_rp',
               'reorder_point'=>4,
               'reorder_qty'=>5
               )
		
		);
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==0);
		
		//set qty
		$this->cleanup();
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>5,
               'qty_on_order'=>0,
               'qty_reserved'=>4,
               'order_type_id'=>'in_order_rp',
               'reorder_point'=>4,
               'reorder_qty'=>5
               )
		
		);
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==5);
		
		$this->cleanup();		
	}	
	
	public function testDemand() {
		$inDbo=CalemFactory::getDbo('inventory');
		$inId='in_001';
		
		//Add two entries
		$this->cleanup();
		//No order gen
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>5,
               'qty_on_order'=>3,
               'qty_reserved'=>4,
               'order_type_id'=>'in_order_demand',
               'reorder_point'=>4,
               'reorder_qty'=>5
               )
		
		);
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==0);
		
		//set qty
		$this->cleanup();
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>5,
               'qty_on_order'=>0,
               'qty_reserved'=>6,
               'order_type_id'=>'in_order_demand',
               )
		);
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==1);
		
		$this->cleanup();		
	}	
	
	public function testNone() {
		$inDbo=CalemFactory::getDbo('inventory');
		$inId='in_001';
		
		//Add two entries
		$this->cleanup();
		//No order gen
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>5,
               'qty_on_order'=>3,
               'qty_reserved'=>4,
               'order_type_id'=>'in_order_none',
               'reorder_point'=>4,
               'reorder_qty'=>5
               )
		
		);
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==0);
		
		//set qty
		$this->cleanup();
		$this->addInRow(
			array('id'=>$inId,
               'qty_in_stock'=>5,
               'qty_on_order'=>0,
               'qty_reserved'=>6,
               'order_type_id'=>'in_order_none',
               )
		);
		$inBo=new CalemInBo();
		$inBo->onInStockLevelChanged($inId);
		$inRow=$inDbo->fetchById($inId);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($inRow['qty_to_order']==0);
		
		$this->cleanup();		
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new InBoQtyToOrderTest();
	$res->testMinMax();
	$res->testReorderPoint();
	$res->testDemand();
	$res->testNone();
}
?>
