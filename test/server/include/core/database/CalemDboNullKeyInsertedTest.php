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
 * To run Calem test one must set up the following:
 * - _CALEM_DIR_
 * - _CALEM_DIR_ . 'config/calem.php' is included already.
 */ 


/** 
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */
//Note that PHPUnit2 must be on the include path for it to work.
require_once 'PHPUnit2/Framework/TestCase.php';

if (!defined('_CALEM_DIR_')) {
	if (!isset($_ENV['CALEM_DIR'])) {
		chdir('../../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	}  
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';

/**
 * A record without ID was inserted during PO test.
 * Here's the test case:
 * a) create a dbo object
 * b) insert a record first
 * c) update record with setIdForUpdate where id is set but changed is not set
 * d) insert another record which will cause a null id inserted
 * Note: the fixed has been rolled back to test this fix.
 */
class CalemDboNullKeyInsertedTest extends PHPUnit2_Framework_TestCase {
	private $resourceMgr;
	
	private $row=array(
				'id'=>'999-test',
				'wo_no'=>'999-999-test',
				'description'=>'Test wo',
				'total_cost'=>2556.78	
			);
	
	public function __construct() {
		$this->resourceMgr=CalemFactory::getResourceManager();
	}
	
	public function testIt() {
		$dbo=CalemFactory::getDbo('dept');
		$dbo->deleteBySqlParam('delete from dept where id=?', 'dept_001');
		$dbo->deleteBySqlParam('delete from dept where dept=?', 'dept_002');
		
		//insert
		$dbo->setChangeBulk(array('id'=>'dept_001', 'dept'=>'my_dept'));
		$dbo->insert();
		
		//update
		$dbo->setValue('note', 'note_001');
		$dbo->setIdForUpdate('dept_001');
		$dbo->update();
		
		//Now use the same object to do an insert
		$dbo->setChangeBulk(array('dept'=>'dept_002'));
		$dbo->insert();
		
		$rows=$dbo->fetchBySqlParam('select * from dept where dept=?', 'dept_002');
		$iRow=$rows[0];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'inserted row='.var_export($iRow, true)."<br>";	
		}
		$this->assertTrue(strlen($iRow)>0);
		$this->assertTrue(!$iRow['note']);
		
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemDboNullKeyInsertedTest();
	$res->testIt();
}

?>
