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
require_once _CALEM_DIR_ . 'server/include/util/CalemReportUtil.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/datamodel/CalemRecordList.php';

class RecordListTest extends PHPUnit2_Framework_TestCase {
	
	public function testRecordListNull() {
		$rows=null;
		$rl=new CalemRecordList('workorder');
		$rl->populateList($rows);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "null recList id: ". $rl->getId() . "<br>"; 
		}
		$this->assertTrue($rl->getId()=='workorder');
	}	
	
	public function testRecordListNormal() {
		$rows[]=array('id'=>'1234', 'pm_id'=>'pm_id_001', 'pm_id__pm_no'=>'PM-no.001');
		$rl=new CalemRecordList('workorder');
		$rl->populateList($rows);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "one row recList id: ". $rl->getId() . "<br>"; 
		}
		$this->assertTrue($rl->getId()=='workorder');
		//Test rec value
		$rid=$rl->getRecord(0)->getValue('id');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "id= ". $rid . "<br>"; 
		}
		$this->assertTrue($rid=='1234');
		
		$rid=$rl->getRecord(0)->getValue('pm_id');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "id= ". $rid . "<br>"; 
		}
		$this->assertTrue($rid=='PM-no.001');
	}
	
	public function testResultRecordList() {
		$rows[]=array('id'=>'1234', 'pm_id'=>'pm_id_001', 'pm_id__pm_no'=>'PM-no.001');
		$rl=CalemResultRecordList::createByRawResult('workorder', $rows);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "one row recList id: ". $rl->getId() . "<br>"; 
		}
		$this->assertTrue($rl->getId()=='workorder');
		//Test rec value
		$rid=$rl->getRecord(0)->getValue('id');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "id= ". $rid . "<br>"; 
		}
		$this->assertTrue($rid=='1234');
		
		$rid=$rl->getRecord(0)->getValue('pm_id');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "id= ". $rid . "<br>"; 
		}
		$this->assertTrue($rid=='PM-no.001');
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$jt=new RecordListTest();
	$jt->testRecordListNull();
	$jt->testRecordListNormal();
	$jt->testResultRecordList();
}
?>
