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

class CalemPoBoStatusTest extends PHPUnit2_Framework_TestCase {
	
	//Adding data properly
	public function addPoStatusData($pal, $poTotal) {
		$userDbo=CalemFactory::getDbo('users');
		$userDbo->setChangeBulk(
			array('id'=>'user_001',
					'po_approval_id'=>$pal));
		$userDbo->insert();					
		$poDbo=CalemFactory::getDbo('po');
		$poDbo->setChangeBulk(
			array('id'=>'po_001',
			      'total_charge'=>$poTotal)
		); 
		$poDbo->insert();   
	}
	
	public function cleanup() {
		$userDbo=CalemFactory::getDbo('users');
		$userDbo->deleteBySqlParam('delete from users where id=?', 'user_001');
		$userDbo->deleteBySqlParam('delete from po where id=?', 'po_001');
	}
	
	public function testStatusTransition() {
		$tran=array('po_id'=>'po_001', 'user_id'=>'user_001',
		          'to_status_id'=>'po_status_voided',
		          'from_status_id'=>'po_status_submitted');
		$poBo=new CalemPoBo();
		try {
			$poBo->verifyPoStatusChange($tran);
			$this->assertTrue(1==2);
		} catch (CalemUiException $ex) {
			$this->assertTrue($ex->getMessage()=='CalemPoStatusChangeNotAllowedException');	
		}		
		
		$tran=array('po_id'=>'po_001', 'user_id'=>'user_001',
		          'to_status_id'=>'po_status_voided',
		          'from_status_id'=>'po_status_acked');
		try {
			$poBo->verifyPoStatusChange($tran);
			$this->assertTrue(1==2);
		} catch (CalemUiException $ex) {
			$this->assertTrue($ex->getMessage()=='CalemPoStatusChangeNotAllowedException');	
		}	
		
		//Invalid transitions
		$tran=array('po_id'=>'po_001', 'user_id'=>'user_001',
		          'to_status_id'=>'po_status_submitted',
		          'from_status_id'=>'po_status_new');
		try {
			$poBo->verifyPoStatusChange($tran);
			$this->assertTrue(1==2);
		} catch (CalemUiException $ex) {
			$this->assertTrue($ex->getMessage()=='CalemPoStatusChangeNotAllowedException');	
		}	
		
		$tran=array('po_id'=>'po_001', 'user_id'=>'user_001',
		          'to_status_id'=>'po_status_submitted',
		          'from_status_id'=>'po_status_voided');
		try {
			$poBo->verifyPoStatusChange($tran);
			$this->assertTrue(1==2);
		} catch (CalemUiException $ex) {
			$this->assertTrue($ex->getMessage()=='CalemPoStatusChangeNotAllowedException');	
		}	
		
		//Valid
		$this->cleanup();
		$this->addPoStatusData('po_level_1', 10000000);
		$tran=array('po_id'=>'po_001', 'user_id'=>'user_001',
		          'to_status_id'=>'po_status_submitted',
		          'from_status_id'=>'po_status_approved');
		$poBo->verifyPoStatusChange($tran);
		
		$tran=array('po_id'=>'po_001', 'user_id'=>'user_001',
		          'to_status_id'=>'po_status_acked',
		          'from_status_id'=>'po_status_approved');
		$poBo->verifyPoStatusChange($tran);
			
		$this->cleanup();	
	}
	
	public function testPoApprovalLevel() {
		$poBo=new CalemPoBo();
		$this->cleanup();
		$this->addPoStatusData('po_level_3', 1000);
		$tran=array('po_id'=>'po_001', 'user_id'=>'user_001',
		          'to_status_id'=>'po_status_voided',
		          'from_status_id'=>'po_status_approved');
		$poBo->verifyPoStatusChange($tran);
		
		$this->cleanup();
		$this->addPoStatusData('po_level_1', 10000);
		$tran=array('po_id'=>'po_001', 'user_id'=>'user_001',
		          'to_status_id'=>'po_status_voided',
		          'from_status_id'=>'po_status_approved');
		try {
			$poBo->verifyPoStatusChange($tran);
			$this->assertTrue(1==2);
		} catch (CalemUiException $ex) {
			$this->assertTrue($ex->getMessage()=='CalemPoNoApprovalLevelException');
		}
		
		//Test pre-approval
		$this->cleanup();
		$this->addPoStatusData('po_level_1', 1000000);
		$tran=array('po_id'=>'po_001', 'user_id'=>'user_001',
		          'to_status_id'=>'po_status_pre',
		          'from_status_id'=>'po_status_new');
		$poBo->verifyPoStatusChange($tran);
			
		$this->cleanup();
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemPoBoStatusTest();
	$res->testStatusTransition();
	$res->testPoApprovalLevel();}
?>
