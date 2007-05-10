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
		chdir('../../../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';	
require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemCustomInfoManager.php';	

/**
 * This class tests UserDao class.
 */
class CustomViewInfoTest extends PHPUnit2_Framework_TestCase {
	
	public function testMyCustomViewUser() {
		$GLOBALS['calem_ses_data']=array('id'=>'1002', 'acl_group_id'=>'2001');
		$ti=CalemDesignTargetInfo::getReportDesignTarget();
		
		$vm=CalemCustomViewManager::getInstance();
		$ci=$vm->getMyCustomInfo('CalemWoReportRead', $ti);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>testMyCustomViewUser: </b>=" . var_export($ci, true) . "<br>"; 
		}
		$this->assertTrue($ci->getId()=='CalemWoReportRead');
		$this->assertTrue($ci->getLayout()!=null);
		$this->assertTrue(count($ci->getAcl()->getViewAcl()->getAcl())>0);
	}	
	
	public function testParentCustomViewUser() {
		$GLOBALS['calem_ses_data']=array('id'=>'1002', 'acl_group_id'=>'2001');
		$ti=CalemDesignTargetInfo::getReportDesignTarget();
		
		$vm=CalemCustomViewManager::getInstance();
		$ci=$vm->getParentCustomInfo('CalemWoReportRead', $ti);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>testParentCustomViewUser: </b>=" . var_export($ci, true) . "<br>"; 
		}
		$this->assertTrue($ci->getId()=='CalemWoReportRead');
		$this->assertTrue($ci->getLayout()!=null);
		$this->assertTrue(count($ci->getAcl()->getViewAcl()->getAcl())>0);
	}	
	
	public function testFullCustomViewUser() {
		$GLOBALS['calem_ses_data']=array('id'=>'1002', 'acl_group_id'=>'2001');
		$ti=CalemDesignTargetInfo::getReportDesignTarget();
		
		$vm=CalemCustomViewManager::getInstance();
		$ci=$vm->getFullCustomInfo('CalemWoReportRead', $ti);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>testFullCustomViewUser: </b>=" . var_export($ci, true) . "<br>"; 
		}
		$this->assertTrue($ci->getId()=='CalemWoReportRead');
		$this->assertTrue($ci->getLayout()!=null);
		$this->assertTrue(count($ci->getAcl()->getViewAcl()->getAcl())>0);
	}	
	
	
	public function testMyCustomViewOob() {
		$GLOBALS['calem_ses_data']=array('id'=>'1000001', 'acl_group_id'=>'CUSTOM_SYSTEM');
		$ti=CalemDesignTargetInfo::getReportDesignTarget();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b> testMyCustomViewOob ti: </b>=" . var_export($ti, true) . "<br>"; 
		}
		
		$vm=CalemCustomViewManager::getInstance();
		$ci=$vm->getMyCustomInfo('CalemWoReportRead', $ti);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>testMyCustomViewOob: </b>=" . var_export($ci, true) . "<br>"; 
		}
		$this->assertTrue($ci->getId()=='CalemWoReportRead');
		$this->assertTrue($ci->getLayout() && $ci->getAcl());
		$this->assertTrue(count($ci->getLayout()->getViewLayout()) > 0);
	}	
	
	public function testParentCustomViewOob() {
		$GLOBALS['calem_ses_data']=array('id'=>'1000001', 'acl_group_id'=>'CUSTOM_SYSTEM');
		$ti=CalemDesignTargetInfo::getReportDesignTarget();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>ti: </b>=" . var_export($ti, true) . "<br>"; 
		}
		
		$vm=CalemCustomViewManager::getInstance();
		$ci=$vm->getParentCustomInfo('CalemWoReportRead', $ti);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>customInfo: </b>=" . var_export($ci, true) . "<br>"; 
		}
		$this->assertTrue($ci->getId()=='CalemWoReportRead');
		$this->assertTrue($ci->getLayout()==null);
		$this->assertTrue(count($ci->getAcl()->getViewAcl()->getAcl())==0);
	}	
	
	public function testFullCustomViewOob() {
		$GLOBALS['calem_ses_data']=array('id'=>'1000001', 'acl_group_id'=>'CUSTOM_SYSTEM');
		$ti=CalemDesignTargetInfo::getReportDesignTarget();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>ti: </b>=" . var_export($ti, true) . "<br>"; 
		}
		
		$vm=CalemCustomViewManager::getInstance();
		$ci=$vm->getFullCustomInfo('CalemWoReportRead', $ti);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>customInfo: </b>=" . var_export($ci, true) . "<br>"; 
		}
		$this->assertTrue($ci->getId()=='CalemWoReportRead');
		$this->assertTrue($ci->getLayout() && $ci->getAcl());
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CustomViewInfoTest();
	$res->testMyCustomViewUser();
	$res->testParentCustomViewUser();
	$res->testFullCustomViewUser();
	
	$res->testMyCustomViewOob();
	$res->testParentCustomViewOob();
	$res->testFullCustomViewOob();
}
?>
