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
		chdir('../../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	}  
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/modules/report/controller/CalemReportMdTab.php';

class ReportMdTabTest extends PHPUnit2_Framework_TestCase {
	private function setupConf() {
		$GLOBALS['loc_conf']=array(
		  'timezone' => '(GMT-06.00) Central Time (US & Canada)',
		  'datefmt' => 'EEE, M/d/yy',
		  'timefmt' => 'h:mm a',
		  'datetimefmt' => 'EEE, M/d/yy h:mm a',
		  'intfmt' => '#,##0',
		  'numberfmt' => '#,##0.###',
		  'currencyfmt' => '#,##0.00;(#,##0.00)'
		);
	}
	
	private function setDesignTarget() {
		$GLOBALS['calem_ses_data']=array('id'=>'1000001', 'acl_group_id'=>'CUSTOM_SYSTEM');	
	}
	
	public function setupWo($id) {
		$woDbo=CalemFactory::getDbo('workorder');
		$woRow=array(
			'id'=>$id,
			'wo_no'=>'wo-001'
		);	
		$woDbo->setChangeBulk($woRow);
		$woDbo->insert();
	}
	
	public function cleanupWo($id) {
		$woDbo=CalemFactory::getDbo('workorder');
		$woDbo->deleteBySqlParam("delete from workorder where id=?", $id);
	}
	
	public function testReportMdTab() {
		$cid='56ed2c9b-0efc-aab4-49d1-c9007e298079';
		$this->cleanupWo($cid);
		$this->setupConf();
		$this->setDesignTarget();
		$this->setupWo($cid);
		$mdTab=new CalemReportMdTab();
		$mdTab->init('CalemWoReportMdTab', 'workorder', array('cid'=>$cid));
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "mdTab= ". get_class($mdTab) . ", id=". $mdTab->getId() . "<br>"; 
		}
		$render=$mdTab->getRender();
		$formModel=$mdTab->getFormModel();
		$doc=$mdTab->render();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'doc count=' . strlen($doc) .", doc=" . $doc . "<br>\n"; 
		}
		$this->assertTrue(strlen($doc) > 10);
		$this->cleanupWo($cid);		
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$jt=new ReportMdTabTest();
	$jt->testReportMdTab();
}
?>
