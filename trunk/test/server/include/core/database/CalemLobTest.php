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
 * This class tests DbSetup class by creating a test database and drop it after
 * creation.
 */
class CalemLobTest extends PHPUnit2_Framework_TestCase {
	
	//A test helper function to find out the record count based on the id
	private function getWorkorderCount($dbo, $id) {
		$cnt=$dbo->getCountByRecordId($id);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record id=$id in workorder table: " . $cnt . '<br>';
		}
		return $cnt;
	}
	
	//Delete a record with id
	private function deleteWorkorder($dbo, $id) {
		$dbo->setId($id);
		$dbo->delete();
		$cnt=$this->getWorkorderCount($dbo, $id);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record id=$id deleted from workorder table: deleted=$deleted, count= " . $cnt . '<br>';
		}
		$this->assertTrue($cnt==0);
	}
	
	//Insert a record with id
	private function insertWorkorder($dbo, $id, $desc) {
		$dbo->setId($id);
		$dbo->setValue('description', $desc);
		$dbo->insert();
		$cnt=$this->getWorkorderCount($dbo, $id);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record id=$id inserted into workorder, count= " . $cnt . '<br>';
		}
		$this->assertTrue($cnt==1);
	}
	
	//Fetch a record with id
	private function fetchWorkorder($dbo, $id) {
		$result=$dbo->fetchBySqlParam($dbo->getSqlFetchById(), array($id));
		$row=$result[0];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record id=$id fetched from workorder, desc length=" . strlen($row['description']) . '<br>';
		}
		return $row;
	}
	
	public function testLobOnWorkorder() {
		//Verify recycle bin is set properly
		$dbo=CalemFactory::getDbo('workorder');
		$woId='wo_lob_test_001';
		//Use a 64K text for testing.
		if ($this->getWorkorderCount($dbo, $woId) > 0 ) {
			$this->deleteWorkorder($dbo, $woId);				
		}
			
		//Prepare a text of 64K in size
		$size=64000;
		$rtn='';
		for ($i=0; $i< $size; $i++) {
			$rtn .= 'a';
		}
		$this->assertTrue(strlen($rtn)==$size);
		
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'text size='. strlen($rtn) ."<br>";	
		}
		//now insert it.
		$this->insertWorkorder($dbo, $woId, $rtn);
		//Fetch it out
		$row = $this->fetchWorkorder($dbo, $woId);
		$this->assertTrue(strlen($row['description'])==$size);
		
		//Now remove the record
		$this->deleteWorkorder($dbo, $woId);
		$this->assertTrue($this->getWorkorderCount($dbo, $woId)==0);
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemLobTest();
	$res->testLobOnWorkorder();
}

?>
