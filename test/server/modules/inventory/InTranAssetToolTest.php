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
class InTranAssetToolTest extends PHPUnit2_Framework_TestCase {
	//Data to set up: an item, two stock records, one asset, one workorder.
	private $inAr=array(
		'id'=>'20201',
		'in_no'=>'Part001',
		'category_id'=>'icg_tool',
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
	
	public function _testCheckout($tran) {
		$inTranBo=new CalemInTranBo();
		$rtn=$inTranBo->checkout($tran);		
		//Add an item for this test.
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>checkout result</b>=" . var_export($rtn, true) . "<br>";
		}
		//Verify at in level
		$inDbo=CalemFactory::getDbo("inventory");
		$inRow=$inDbo->fetchById($this->inAr['id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($rtn['unit_cost']==$inRow['avg_unit_cost']
		                 && $rtn['unit_cost']==$this->inAr['avg_unit_cost']);
		$this->assertTrue($inRow['qty_in_stock']==$this->inAr['qty_in_stock']-2);
		//Verify stock level
		$stockDbo=CalemFactory::getDbo('in_stock');
		$stockRows=$stockDbo->fetchBySqlParam('select * from in_stock where in_id=? and location_id=?', 
		                  array($this->inStockAr1['in_id'], $this->inStockAr1['location_id']));
		$stockRow=$stockRows[0];		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "stock row=" . var_export($stockRow, true) . "<br>";
		}                  
		$this->assertTrue($stockRow['qty']==0);
		//Verify in transaction added for this one.
		$inTranDbo=CalemFactory::getDbo('in_tran');
		$count=$inTranDbo->getCountBySqlParam('select count(*) from in_tran where in_id=?', $this->inAr['id']);
		$this->assertTrue($count==1);
		//Verify asset cost adjusted.
		$assetDbo=CalemFactory::getDbo('asset');
		$assetRow=$assetDbo->fetchById($this->assetAr['id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "asset row=" . var_export($assetRow, true) . "<br>";
		} 
		$this->assertTrue($assetRow['maint_material_cost']==$this->assetAr['maint_material_cost']);
	}
	
	public function _testReturn($tran, $tranReturn) {
		$inTranBo=new CalemInTranBo();
		$rtn=$inTranBo->inReturn($tranReturn);		
		//Add an item for this test.
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>return result</b>=" . var_export($rtn, true) . "<br>";
		}
		
		//verify checkout tran changed
		$inTranDbo=CalemFactory::getDbo('in_tran');
		$checkoutRow=$inTranDbo->fetchById($tranReturn['checkout_tran_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>checkoutRow result</b>=" . var_export($checkoutRow, true) . "<br>";
		}
		$this->assertTrue($checkoutRow['qty']==2 && $checkoutRow['qty_available']==
		                   $checkoutRow['qty']-$tranReturn['qty']);
		                   
		//Verify at in level
		$inDbo=CalemFactory::getDbo("inventory");
		$inRow=$inDbo->fetchById($this->inAr['id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "in row=" . var_export($inRow, true) . "<br>";
		}
		$this->assertTrue($rtn['unit_cost']==$inRow['avg_unit_cost']
		                 && $rtn['unit_cost']==$this->inAr['avg_unit_cost']);
		$this->assertTrue($inRow['qty_in_stock']==$this->inAr['qty_in_stock']-$tran['qty']+$tranReturn['qty']);
		//Verify stock level
		$stockDbo=CalemFactory::getDbo('in_stock');
		$stockRows=$stockDbo->fetchBySqlParam('select * from in_stock where in_id=? and location_id=?', 
		                  array($this->inStockAr1['in_id'], $this->inStockAr1['location_id']));
		$stockRow=$stockRows[0];		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "stock row=" . var_export($stockRow, true) . "<br>";
		}                  
		$this->assertTrue($stockRow['qty']== $tran['qty']-$tranReturn['qty']);
		//Verify in transaction added for this one.
		$inTranDbo=CalemFactory::getDbo('in_tran');
		$count=$inTranDbo->getCountBySqlParam('select count(*) from in_tran where in_id=?', $this->inAr['id']);
		$this->assertTrue($count==2); //checkout and return
		
		//Verify asset cost adjusted.
		$assetDbo=CalemFactory::getDbo('asset');
		$assetRow=$assetDbo->fetchById($this->assetAr['id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "asset row=" . var_export($assetRow, true) . "<br>";
		} 
		$this->assertTrue($assetRow['maint_material_cost']==$this->assetAr['maint_material_cost']+
		                    $tranReturn['tran_total']);
		$this->assertTrue($assetRow['maint_cost']==$this->assetAr['maint_labor_cost']+$this->assetAr['maint_material_cost']
		                    +$tranReturn['tran_total']);	                    
		
	}
	 
	//Checkout to asset	 
	public function testAvgCheckout() {
		$this->cleanupData();
		$this->setupData();
		$tran=array(
			'in_id'=>$this->inAr['id'],
			'location_id'=>'10001',
			'qty'=>2,
			'checkout_type_id'=>'ict_asset',
			'checkout_to_id'=>'30301',
			'note'=>'test1',
			'tran_user_id'=>'1000000',
			'store_user_id'=>'1002',
			'tran_time'=>'2007/02/28 15:30:20'		);
		//Run checkout
		$this->_testCheckout($tran);		
		//cleanup
		$this->cleanupData();                 
	}
	 	
	//Return from asset
	public function testAvgReturn() {
		$this->cleanupData();
		$this->setupData();
		$tran=array(
			'in_id'=>$this->inAr['id'],
			'location_id'=>'10001',
			'qty'=>2,
			'checkout_type_id'=>'ict_asset',
			'checkout_to_id'=>'30301',
			'note'=>'test1',
			'tran_user_id'=>'1000000',
			'store_user_id'=>'1002',
			'tran_time'=>'2007/02/28 15:30:20'		);
		//Run checkout
		$this->_testCheckout($tran);
		
		//Run return
		$inTranDbo=CalemFactory::getDbo('in_tran');
		$rows=$inTranDbo->fetchBySqlParam('select id from in_tran where in_id=? and checkout_to_id=?', array($this->inAr['id'], '30301'));
		$checkout_tran_id=$rows[0]['id'];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "checkout_tran_id=" . $checkout_tran_id . "<br>";
		} 
		$tranReturn=array(
			'checkout_tran_id'=>$checkout_tran_id,
			'location_id'=>'10001',
			'qty'=>1,
			'tran_total'=>40,
			'rent_rate'=>4,
			'rent_duration'=>10,
			'note'=>'test return',
			'tran_user_id'=>'1000000',
			'store_user_id'=>'1002',
			'tran_time'=>'2007/02/28 15:30:20'		);
		$this->_testReturn($tran, $tranReturn);
		
		//cleanup
		$this->cleanupData();                 
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new InTranAssetToolTest();
	$res->testAvgCheckout();
	$res->testAvgReturn();
}
?>
