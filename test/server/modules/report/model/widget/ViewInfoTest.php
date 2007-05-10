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

/**
 * This class tests UserDao class.
 */
class ViewInfoTest extends PHPUnit2_Framework_TestCase {
	
	public function testViewInfoReportRead() {
		$fn=_CALEM_DIR_ . 'client/modules/workorder/form/report/converted/CalemWoReportReadDef.phpo';
		$fc=file_get_contents($fn);
		$fp=unserialize($fc);
		$vi=CalemJson::setJson($fp);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>CalemWoReportRead: </b>=" . var_export($vi, true) . "<br>"; 
		}
		$this->assertTrue($vi->getId() == 'CalemWoReportRead');
		$this->assertTrue($vi->getLayout()->getColLayout()->getColCount()==4);
		$this->assertTrue(count($vi->getLayout()->getRows()) > 0);
	}	
	
	public function testViewInfoReportReadCustom() {
		$fn=_CALEM_DIR_ . 'custom/group/CALEM_OOB/converted/CalemWoReportRead.phpo';
		$fc=file_get_contents($fn);
		$fp=unserialize($fc);
		$vi=CalemJson::setJson($fp);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>CalemWoReportReadCustom: </b>=" . var_export($vi, true) . "<br>"; 
		}
		$this->assertTrue($vi->getId() == 'CalemWoReportRead');
		$this->assertTrue($vi->getAcl() && $vi->getLayout());
		$this->assertTrue(count($vi->getLayout()->getViewLayout()) > 0);
	}	
	
	public function testViewInfoReportList() {
		$fn=_CALEM_DIR_ . 'client/modules/workorder/form/report/converted/CalemWoLaborReportListDef.phpo';
		$fc=file_get_contents($fn);
		$fp=unserialize($fc);
		$vi=CalemJson::setJson($fp);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>CalemWoLaborReportList: </b>=" . var_export($vi, true) . "<br>"; 
		}
		$this->assertTrue($vi->getId() == 'CalemWoLaborReportList');
		$this->assertTrue($vi->getLayout()->getColLayout()->getColCount()==1);
	}	
	
	public function testViewInfoReportListCustom() {
		$fn=_CALEM_DIR_ . 'custom/group/CALEM_OOB/converted/CalemWoStepReportList.phpo';
		$fc=file_get_contents($fn);
		$fp=unserialize($fc);
		$vi=CalemJson::setJson($fp);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<b>CalemWoStepReportListCustom: </b>=" . var_export($vi, true) . "<br>"; 
		}
		$this->assertTrue($vi->getId() == 'CalemWoStepReportList');
		$this->assertTrue($vi->getAcl() && $vi->getLayout());
		$this->assertTrue(count($vi->getLayout()->getViewLayout())>0);
		$this->assertTrue(count($vi->getLayout()->getGridLayout()->getColList())>0);
	}	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new ViewInfoTest();
	$res->testViewInfoReportRead();
	$res->testViewInfoReportReadCustom();
	$res->testViewInfoReportList();
	$res->testViewInfoReportListCustom();
}
?>
