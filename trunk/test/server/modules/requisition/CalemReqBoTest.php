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
require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';
require_once _CALEM_DIR_ . 'test/server/modules/requisition/CalemReqBoTestHelper.php';		

class CalemReqBoTest extends PHPUnit2_Framework_TestCase {
	
	//Adding two req items to po
	//a) Req po status updated
	//b) Req item po updated
	public function testReqBo() {
		$helper=new CalemReqBoTestHelper();
		$helper->cleanupReq(); //Start from a clean slab.
		$helper->setupReq();
		$ids=$helper->getIds();
		$reqBo=new CalemReqBo();
		$reqBo->addReqItemToPo($ids['po_id'], $ids['req_item1'], $ids['req_id']);
		//a) req status
		$reqDbo=CalemFactory::getDbo('requisition');
		$row=$reqDbo->fetchById($ids['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req row after adding one item : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['req_on_po_id']=='req_on_po_partly');
		//b) req item having po set
		$riDbo=CalemFactory::getDbo('req_item');
		$row=$riDbo->fetchById($ids['req_item1']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req item row after adding one item : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['po_id']==$ids['po_id']);
		//Now adding the 2nd req item to po
		$reqBo->addReqItemToPo($ids['po_id'], $ids['req_item2'], $ids['req_id']);
		//a) req status to be all on PO
		//b) req item 2 having po set.
		// -a)
		$row=$reqDbo->fetchById($ids['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req row after adding one item : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['req_on_po_id']=='req_on_po_all');
		//- b)
		$row=$riDbo->fetchById($ids['req_item2']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req item row after adding one item : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['po_id']==$ids['po_id']);
		//
		// Now remove one item from PO
		// a) status to 'partly'; b) req item 1 no po_id
		//
		$reqBo->removeReqItemFromPo($ids['po_id'], $ids['req_item1'], $ids['req_id']);
		$row=$reqDbo->fetchById($ids['req_id']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req row after adding one item : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['req_on_po_id']=='req_on_po_partly');
		//- b)
		$row=$riDbo->fetchById($ids['req_item1']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "req item row after adding one item : " . var_export($row, true) . "<br>"; 
		}
		$this->assertTrue($row['po_id']==null);
		
		//
		// Now remove all of item 2
		//
		$reqBo->removeAllReqItemFromPo($ids['po_id'], $ids['in_id2']);
		
		$row=$reqDbo->fetchById($ids['req_id']);
		$this->assertTrue($row['req_on_po_id']=='req_on_po_none');

		$row=$riDbo->fetchById($ids['req_item2']);
		$this->assertTrue($row['po_id']==null);
		
		$helper->cleanupReq();
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemReqBoTest();
	$res->testReqBo();
}
?>
