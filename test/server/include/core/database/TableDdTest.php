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
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';	
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemException.php';
require_once _CALEM_DIR_ . 'server/metadata/CalemTableNotFoundException.php';	

/**
 * Test all the functions of TableDd.
 */
class TableDdTest extends PHPUnit2_Framework_TestCase {
	//Test table list
	public function testTableDd() {
		$rm=CalemFactory::getResourceManager();
		$woDd=$rm->getTableDd('workorder');
		
		//LookupTableDd
		$this->assertTrue($woDd->getLookupTableDd('pm_id')
		                  && ($woDd->getLookupTableDd('pm_id')->getTableName() === 'pm') );			                  	                  
		$this->assertTrue($woDd->getLookupTableDd('priority_id')
		                  && ($woDd->getLookupTableDd('priority_id')->getTableName() === 'wo_priority') );
		$this->assertTrue(!$woDd->getLookupTableDd('modified_time'));
		
		//Join field
		$this->assertTrue(!$woDd->isJoinField('modified_time'));
		$this->assertTrue(!$woDd->isJoinField('priority_id'));
		$this->assertTrue($woDd->isJoinField('pm_id'));
		
		//dropdown field
		$this->assertTrue($woDd->isDropdownField('status_id')); //true
		$this->assertTrue(!$woDd->isDropdownField('pm_id')); //false
		$this->assertTrue(!$woDd->isDropdownField('modified_time')); //false
		//Memory cached field
		$this->assertTrue($woDd->isMemoryCachedField('pm_id'));
		$this->assertTrue(!$woDd->isMemoryCachedField('status_id'));
		$this->assertTrue(!$woDd->isMemoryCachedField('modified_time')); //false
		//joinFieldName
		$this->assertTrue($woDd->getJoinFieldName('pm_id')=='pm_id__pm_no');
		$this->assertTrue($woDd->getJoinFieldName('status_id') == 'status_id');
		$this->assertTrue($woDd->getJoinFieldName('modified_time') == 'modified_time');
		//Primary field
		$this->assertTrue( $woDd->getPrimaryLookup() == 'wo_no' );
		//LookupMapping
		$lkupMap=$woDd->getLookupMapping();
		$this->assertTrue(is_array($lkupMap) && $lkupMap['primary']=='wo_no');
		//LookupInfo test
		$lkupInfo=$woDd->getJoin('project_id');
		$this->assertTrue(is_array($lkupInfo)
					&& $lkupInfo['table']=='project'
					&& $lkupInfo['field']=='id'
					&& $lkupInfo['lkupField']=='project_no');
	}
	
	//Test table list
	public function testTableDdException() {
		$rm=CalemFactory::getResourceManager();
		try {
			$woDd=$rm->getTableDd('workorder_test');
			$this->assertTrue(1!=1); //Making it fail.
		} catch (CalemTableNotFoundException $e) {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "got exception: " . $e->getMessage();
			}
			$this->assertTrue(!(strpos($e->getMessage(), 'workorder_test')===false));
		}
	}
	
	//Test table list
	public function testShortName() {
		$rm=CalemFactory::getResourceManager();
		$budgetDd=$rm->getTableDd('budget');
		$budTitleDd=$rm->getTableDd('budget_title');
		$sn=$budTitleDd->getShortName('title');
		$lkupSn=$budgetDd->getJoinFieldName('title_id');
		$this->assertTrue($lkupSn==('title_id__' . $sn));
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<br> budTitle sn=". $sn . ", title_id sn=" . $lkupSn . "<br>";
		}
		//test negative case
		$cc=$rm->getTableDd('costcode');
		$sn=$cc->getShortName('costcode');
		$woDd=$rm->getTableDd('workorder');
		$lkupSn=$woDd->getJoinFieldName('costcode_id');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<br> costcode sn=". $sn . ", costcode_id sn=" . $lkupSn . "<br>";
		}
		$this->assertTrue($lkupSn== 'costcode_id__costcode');
		
	}
	
	//field info
	public function testFieldInfo() {
		$dd=CalemFactory::getTableDd('workorder');
		$info=$dd->getFieldInfo('wo_no');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "fld info: " . var_export($info, true) . "<br>";
		}
		$this->assertTrue($info->getField()=='wo_no');
	}
	
	//field label info
	public function testFieldLabelInfo() {
		$dd=CalemFactory::getTableDd('workorder');
		$info=$dd->getFieldLabelInfo('wo_no');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "fld info: " . var_export($info, true) . "<br>";
		}
		$this->assertTrue($info->getField()=='wo_no');
	}
	
	//lookup Dd test
	public function testLookup() {
		$dd=CalemFactory::getTableDd('workorder');
		$info=$dd->getLookupTableDd('pm_id');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "lookup info: " . var_export($info, true) . "<br>";
		}
		$this->assertTrue($info->getTableName()=='pm');
		
		//lookup mapping
		$lkupMapping= $info->getLookupMapping();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo 'lkupMapping=' . var_export($lkupMapping, true). "<br>";
		}
		$this->assertTrue($lkupMapping['primary']=='pm_no');
		
		$lb=$info->_getFieldLabel($lkupMapping['primary']);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo 'lb=' . $lb. "<br>";
		}
		$this->assertTrue($lb=='PM no.');
	}
	
	//field label info
	public function testGetFieldLabel() {
		$dd=CalemFactory::getTableDd('workorder');
		$info=$dd->getFieldLabel('wo_no');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "wo_no: " . $info . "<br>";
		}
		$this->assertTrue($info=='Wo no.');
		
		$info=$dd->getFieldLabel('pm_id');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "pm_id: " . $info . "<br>";
		}
		$this->assertTrue($info=='PM no.');
	}
	
	//normalized test
	public function testNormalizedType() {
		$dd=CalemFactory::getTableDd('workorder');
		$type=$dd->getNormalizedType('wo_no');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "wo_no type: " . $type . "<br>";
		}
		$this->assertTrue($type=='varchar');
		
		$type=$dd->getNormalizedType('description');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "description type: " . $type . "<br>";
		}
		$this->assertTrue($type=='text');
	}
	
	//join name
	public function testJoinName() {
		$dd=CalemFactory::getTableDd('workorder');
		$jn=$dd->getJoinFieldName('pm_id');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "pm_id join name: " . $jn . "<br>";
		}
		$this->assertTrue($jn=='pm_id__pm_no');
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new TableDdTest();
	$res->testTableDd();
	$res->testTableDdException();
	$res->testShortName();
	$res->testFieldInfo();
	$res->testFieldLabelInfo();
	$res->testLookup();
	$res->testGetFieldLabel();
	$res->testNormalizedType();
	$res->testJoinName();
}
?>
