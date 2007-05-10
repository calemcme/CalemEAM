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
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInTranBo.php';		

/**
 * This class tests UserDao class.
 */
class InTranMovePartTest extends PHPUnit2_Framework_TestCase {
	//Data to set up: an item, two stock records, one asset, one workorder.
	private $inAr=array(
		'id'=>'20201',
		'in_no'=>'Part001',
		'category_id'=>'icg_part',
		'valuation_type_id'=>'inv_avg',
		'qty_in_stock'=>5,
		'avg_unit_cost'=>30		
	);
	private $inStockAr1=array(
		'in_id'=>'20201',
		'location_id'=>'10001',
		'qty'=>2		
	);
	private $inStockAr2=array(
		'in_id'=>'20201',
		'location_id'=>'10002',
		'qty'=>3		
	);
	private $assetAr = array(
		'id'=>'30301',
		'asset_no'=>'MOTOR-001',
		'maint_material_cost'=>100,
		'maint_labor_cost'=>200		
	);	
	
	private $moveTran=array(
		'location_id'=>'10002',
		'orig_loc_id'=>'10001',
		'qty'=>1,
		'note'=>'test1',
		'tran_user_id'=>'1000000',
		'store_user_id'=>'1002',
		'tran_time'=>'2007/02/28 15:30:20'
	);	  
	
	public function addData($tbl, $ar) {
		$dbo=CalemFactory::getDbo($tbl);
		$dbo->setChangeBulk($ar);
		$dbo->insert();
	}
	
	public function setupData() {
		$dbo=CalemFactory::getDbo('inventory');
		$this->addData('inventory', $this->inAr);
		$this->addData('in_stock', $this->inStockAr1);
		$this->addData('in_stock', $this->inStockAr2);
		$this->addData('asset', $this->assetAr);	
	}
	
	public function cleanupData() {
		$dbo=CalemFactory::getDbo('asset');
		$dbo->deleteById($this->assetAr['id']);
		$inId=$this->inAr['id'];
		$dbo->deleteBySqlParam('delete from inventory where id=?', $inId);
		$dbo->deleteBySqlParam('delete from in_stock where in_id=?', $inId);
		$dbo->deleteBySqlParam('delete from in_tran where in_id=?', $inId);
		//Ensure all is done.
		$this->assertTrue(0==$dbo->getCountBySqlParam('select count(*) from asset where id=?', $this->assetAr['id']));
		$this->assertTrue(0==$dbo->getCountBySqlParam('select count(*) from inventory where id=?', $inId));
		$this->assertTrue(0==$dbo->getCountBySqlParam('select count(*) from in_stock where in_id=?', $inId));
		$this->assertTrue(0==$dbo->getcountBySqlParam('select count(*) from in_tran where in_id=?', $inId));	
	}
	
	public function _testMove($tran) {
		$inTranBo=new CalemInTranBo();
		$rtn=$inTranBo->move($tran);		
		//Add an item for this test.
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>Move result</b>=" . var_export($rtn, true) . "<br>";
		}
		$this->assertTrue($rtn['location_id']==$this->moveTran['location_id']);
		//Verify at in level
		$inDbo=CalemFactory::getDbo("inventory");
		$inRow=$inDbo->fetchById($this->inAr['id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "in row=" . var_export($inRow, true) . "<br>";
		}
		//Verify unit cost not changed		
		$this->assertTrue($inRow['avg_unit_cost']==$this->inAr['avg_unit_cost']);
		//Verify stock
		$this->assertTrue($inRow['qty_in_stock']==$this->inStockAr2['qty']+$this->inStockAr1['qty']);
		
		//Verify src moved
		$stockDbo=CalemFactory::getDbo('in_stock');
		$srcRows=$stockDbo->fetchBySqlParam('select * from in_stock where in_id=? and location_id=?', 
		                                            array($tran['in_id'], $tran['orig_loc_id']));
		$srcRow=$srcRows[0];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "src stock row=" . var_export($srcRow, true) . "<br>";
		}                  
		$this->assertTrue($srcRow['qty']==$this->inStockAr1['qty']-1);
		//Verify moved to
		$destRows=$stockDbo->fetchBySqlParam('select * from in_stock where in_id=? and location_id=?', 
		                                            array($tran['in_id'], $tran['location_id']));
		$destRow=$destRows[0];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "dest stock row=" . var_export($destRow, true) . "<br>";
		} 
		$this->assertTrue($destRow['qty']==$this->inStockAr2['qty']+1);
		
		//Verify in transaction added for this one.
		$inTranDbo=CalemFactory::getDbo('in_tran');
		$count=$inTranDbo->getCountBySqlParam('select count(*) from in_tran where in_id=?', $this->inAr['id']);
		$this->assertTrue($count==1);
	}
	  
	//Checkout to asset	 
	public function testAvgMove() {
		$this->cleanupData();
		$this->setupData();
		$tran=$this->moveTran;
		$tran['in_id']=$this->inAr['id'];
		//Run checkout
		$this->_testMove($tran);		
		//cleanup
		$this->cleanupData();                 
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new InTranMovePartTest();
	$res->testAvgMove();
}
?>
