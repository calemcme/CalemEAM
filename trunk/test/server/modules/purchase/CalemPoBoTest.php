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
require_once _CALEM_DIR_ . 'server/modules/purchase/CalemPoBo.php';
require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';
require_once _CALEM_DIR_ . 'test/server/modules/requisition/CalemReqBoTestHelper.php';		

class CalemPoBoTest extends PHPUnit2_Framework_TestCase {
	
	//Adding two req items to po
	//a) PO item added
	//b) PO cost updated
	//c) REQ po status updated
	//d) REQ po id updated
	public function testPoBo() {
		$helper=new CalemReqBoTestHelper();
		$helper->cleanupReq(); //Start from a clean slab.
		$helper->setupReq();
		$ids=$helper->getIds();
		$poBo=new CalemPoBo();
		$phpo=base64_encode("['" . $ids['req_item1'] . "', '" . $ids['req_item2'] . "']");
		$ar=array('po_id'=>$ids['po_id'], 'req_item'=>$phpo);
		//
		// Adding two req items to PO
		//
		$poBo->addPoItemByClient($ar);
		
		// a) PO items
		$poItemDbo=CalemFactory::getDbo('po_item');
		$cnt=$poItemDbo->getCountBySqlParam('select count(*) from po_item where po_id=?', $ids['po_id']);
		$this->assertTrue($cnt==2);
		
		$rows=$poItemDbo->fetchBySqlParam('select * from po_item where po_id=? order by in_id ASC', $ids['po_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "po item rows added : " . var_export($rows, true) . "<br>"; 
		}
		
		$this->assertTrue($rows[0]['line_cost']==60);
		$this->assertTrue($rows[1]['line_cost']==20);
		
		// b) PO cost
		$poDbo=CalemFactory::getDbo('po');
		$row=$poDbo->fetchById($ids['po_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "po row : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['po_item_total']==80);
		
		//a) req status
		$reqDbo=CalemFactory::getDbo('requisition');
		$row=$reqDbo->fetchById($ids['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req row after adding one item : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['req_on_po_id']=='req_on_po_all');
		//b) req item having po set
		$riDbo=CalemFactory::getDbo('req_item');
		$row=$riDbo->fetchById($ids['req_item1']);
		$this->assertTrue($row['po_id']==$ids['po_id']);
		$row=$riDbo->fetchById($ids['req_item2']);
		$this->assertTrue($row['po_id']==$ids['po_id']);
		//
		// Now remove both items from PO
		//
		$poBo->removePoItemByClient($ar);
		
		// a) PO items
		$poItemDbo=CalemFactory::getDbo('po_item');
		$cnt=$poItemDbo->getCountBySqlParam('select count(*) from po_item where po_id=?', $ids['po_id']);
		$this->assertTrue($cnt==2);
		
		$rows=$poItemDbo->fetchBySqlParam('select * from po_item where po_id=? order by in_id ASC', $ids['po_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "po item rows added : " . var_export($rows, true) . "<br>"; 
		}
		
		$this->assertTrue($rows[0]['line_cost']==0);
		$this->assertTrue($rows[1]['line_cost']==0);
		
		// b) PO cost
		$poDbo=CalemFactory::getDbo('po');
		$row=$poDbo->fetchById($ids['po_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "po row : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['po_item_total']==0);
		
		//a) req status
		$reqDbo=CalemFactory::getDbo('requisition');
		$row=$reqDbo->fetchById($ids['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req row after adding one item : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['req_on_po_id']=='req_on_po_none');
		//b) req item having po set
		$riDbo=CalemFactory::getDbo('req_item');
		$row=$riDbo->fetchById($ids['req_item1']);
		$this->assertTrue($row['po_id']==null);
		$row=$riDbo->fetchById($ids['req_item2']);
		$this->assertTrue($row['po_id']==null);
		
		$helper->cleanupReq(); //Start from a clean slab.
	}	
	
	//Test PO item deletion
	public function testPoItemDeletion() {
		$helper=new CalemReqBoTestHelper();
		$helper->cleanupReq(); //Start from a clean slab.
		$helper->setupReq();
		$ids=$helper->getIds();
		$poBo=new CalemPoBo();
		$phpo=base64_encode("['" . $ids['req_item1'] . "', '" . $ids['req_item2'] . "']");
		$ar=array('po_id'=>$ids['po_id'], 'req_item'=>$phpo);
		//
		// Adding two req items to PO
		//
		$poBo->addPoItemByClient($ar);
		
		// a) PO items
		$poItemDbo=CalemFactory::getDbo('po_item');
		$cnt=$poItemDbo->getCountBySqlParam('select count(*) from po_item where po_id=?', $ids['po_id']);
		$this->assertTrue($cnt==2);
		
		$rows=$poItemDbo->fetchBySqlParam('select * from po_item where po_id=? order by in_id ASC', $ids['po_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "po item rows added : " . var_export($rows, true) . "<br>"; 
		}
		
		$this->assertTrue($rows[0]['line_cost']==60);
		$this->assertTrue($rows[1]['line_cost']==20);
		
		// b) PO cost
		$poDbo=CalemFactory::getDbo('po');
		$row=$poDbo->fetchById($ids['po_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "po row : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['po_item_total']==80);
		
		//a) req status
		$reqDbo=CalemFactory::getDbo('requisition');
		$row=$reqDbo->fetchById($ids['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req row after adding one item : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['req_on_po_id']=='req_on_po_all');
		//b) req item having po set
		$riDbo=CalemFactory::getDbo('req_item');
		$row=$riDbo->fetchById($ids['req_item1']);
		$this->assertTrue($row['po_id']==$ids['po_id']);
		$row=$riDbo->fetchById($ids['req_item2']);
		$this->assertTrue($row['po_id']==$ids['po_id']);
		//
		// Remove one item at a time
		//
		$reqBo=new CalemReqBo();
		$piRows=$poItemDbo->fetchBySqlParam('select * from po_item where po_id=? order by in_id ASC', $ids['po_id']);
		$poItemDbo->deleteById($piRows[0]['id']);
		$poRow=$poDbo->fetchById($ids['po_id']);
		
		$nPoRow=$poBo->updatePoCost($poRow, -1*$piRows[0]['line_cost']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "new po row : " . var_export($nPoRow, true) . "<br>"; 
		}
		
		$reqBo->removeAllReqItemFromPo($piRows[0]['po_id'], $piRows[0]['in_id']);
		
		//1) PO item is deleted.
		$cnt=$poItemDbo->getCountBySqlParam('select count(*) from po_item where po_id=?', $ids['po_id']);
		$this->assertTrue($cnt==1);
		//2) PO cost is adjusted
		$poRow=$poDbo->fetchById($ids['po_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "po row : " . var_export($poRow, true) . "<br>"; 
		}
		$this->assertTrue($poRow['po_item_total']==20);
		//3) req item 1 is without PO
		$riRow1=$riDbo->fetchById($ids['req_item1']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "req row : " . var_export($riRow1, true) . "<br>"; 
		}
		$this->assertTrue($riRow1['po_id']==null);
		//4) req status on po is partly
		$rRow=$reqDbo->fetchById($ids['req_id']);
		$this->assertTrue($rRow['req_on_po_id']=='req_on_po_partly');
		
		//
		//Now remove the 2nd item
		//
		
		$poItemDbo->deleteById($piRows[1]['id']);
		$poRow=$poDbo->fetchById($ids['po_id']);
		
		$nPoRow=$poBo->updatePoCost($poRow, -1*$piRows[1]['line_cost']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "new po row : " . var_export($nPoRow, true) . "<br>"; 
		}
		$reqBo->removeAllReqItemFromPo($piRows[1]['po_id'], $piRows[1]['in_id']);
		
		//1) PO item is deleted.
		$cnt=$poItemDbo->getCountBySqlParam('select count(*) from po_item where po_id=?', $ids['po_id']);
		$this->assertTrue($cnt==0);
		//2) PO cost is adjusted
		$poRow=$poDbo->fetchById($ids['po_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "po row : " . var_export($poRow, true) . "<br>"; 
		}
		$this->assertTrue($poRow['po_item_total']==0);
		//3) req item 1 is without PO
		$riRow2=$riDbo->fetchById($ids['req_item2']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "req row 2: " . var_export($riRow2, true) . "<br>"; 
		}
		$this->assertTrue($riRow1['po_id']==null);
		//4) req status on po is partly
		$rRow=$reqDbo->fetchById($ids['req_id']);
		$this->assertTrue($rRow['req_on_po_id']=='req_on_po_none');
		
		$helper->cleanupReq(); //Start from a clean slab.
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemPoBoTest();
	$res->testPoBo();
	$res->testPoItemDeletion();}
?>
