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

class CalemReqBoStatusTest extends PHPUnit2_Framework_TestCase {
	
	//Adding data properly
	public function addReqStatusData($pal, $reqTotal) {
		$userDbo=CalemFactory::getDbo('users');
		$userDbo->setChangeBulk(
			array('id'=>'user_001',
					'req_approval_id'=>$pal));
		$userDbo->insert();					
		$reqDbo=CalemFactory::getDbo('requisition');
		$reqDbo->setChangeBulk(
			array('id'=>'req_001',
			      'req_total'=>$reqTotal)
		); 
		$reqDbo->insert();   
	}
	
	public function cleanup() {
		$userDbo=CalemFactory::getDbo('users');
		$userDbo->deleteBySqlParam('delete from users where id=?', 'user_001');
		$userDbo->deleteBySqlParam('delete from requisition where id=?', 'req_001');
	}
	
	public function testStatusTransition() {		
		//No level change required
		$tran=array('req_id'=>'req_001', 'user_id'=>'user_001',
		          'to_status_id'=>'req_status_open',
		          'from_status_id'=>'req_status_voided');
		$reqBo=new CalemReqBo();
		$reqBo->verifyReqStatusChange($tran);	
		
		$tran=array('req_id'=>'req_001', 'user_id'=>'user_001',
		          'to_status_id'=>'req_status_open',
		          'from_status_id'=>'req_status_approved');
		$reqBo->verifyReqStatusChange($tran);
		
		$tran=array('req_id'=>'req_001', 'user_id'=>'user_001',
		          'to_status_id'=>'req_status_open',
		          'from_status_id'=>'req_status_new');
		$reqBo->verifyReqStatusChange($tran);
		
		$tran=array('req_id'=>'req_001', 'user_id'=>'user_001',
		          'to_status_id'=>'req_status_new',
		          'from_status_id'=>'req_status_open');
		$reqBo->verifyReqStatusChange($tran);
	}
	
	public function testReqApprovalLevel() {
		$reqBo=new CalemReqBo();
		$this->cleanup();
		$this->addReqStatusData('req_level_3', 1000);
		$tran=array('req_id'=>'req_001', 'user_id'=>'user_001',
		          'to_status_id'=>'req_status_voided',
		          'from_status_id'=>'req_status_approved');
		$reqBo->verifyReqStatusChange($tran);
		
		$this->cleanup();
		$this->addReqStatusData('req_level_1', 10000);
		$tran=array('req_id'=>'req_001', 'user_id'=>'user_001',
		          'to_status_id'=>'req_status_voided',
		          'from_status_id'=>'req_status_approved');
		try {
			$reqBo->verifyReqStatusChange($tran);
			$this->assertTrue(1==2);
		} catch (CalemUiException $ex) {
			$this->assertTrue($ex->getMessage()=='CalemReqNoApprovalLevelException');
		}
		
		//Test pre-approval
		$this->cleanup();
		$this->addReqStatusData('req_level_1', 1000000);
		$tran=array('req_id'=>'req_001', 'user_id'=>'user_001',
		          'to_status_id'=>'req_status_pre',
		          'from_status_id'=>'req_status_new');
		$reqBo->verifyReqStatusChange($tran);
			
		$this->cleanup();
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemReqBoStatusTest();
	$res->testStatusTransition();
	$res->testReqApprovalLevel();
}
?>
