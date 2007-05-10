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

/**
 * This class tests multiple database connections and find out if we need to use
 * reference for connection closing.
 */
class MultiDbConnectionTest extends PHPUnit2_Framework_TestCase {
	private $prefix='wo_test_';
	
	private function getId($id) {
		return "'" . $this->prefix . $id . "'";
	}
	
	//A test helper function to find out the record count based on the id
	private function getWorkorderCount($conn, $id) {
		$id=$this->getId($id);
		$result=$conn->query("select count(*) from workorder where id=$id");
		$cnt=$result->fetchColumn();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record id=$id in workorder table: " . $cnt . '<br>';
		}
		return $cnt;
	}
	//Insert record with id
	private function insertWorkorder($conn, $id) {
		$nid=$this->getId($id);
		$conn->beginTransaction();
		$inserted=$conn->exec("insert into workorder (id, wo_no) values ($nid, $nid)");
		$conn->commit();
		$cnt=$this->getWorkorderCount($conn, $id);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record id=$id inserted into workorder table: inserted=$inserted, count=" . $cnt . '<br>';
		}
		$this->assertTrue($cnt>=1);
	}
	//Delete a record with id
	private function deleteWorkorder($conn, $id) {
		$nid=$this->getId($id);
		$conn->beginTransaction();
		$deleted=$conn->exec("delete from workorder where id=$nid");
		$conn->commit();
		$cnt=$this->getWorkorderCount($conn, $id);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "record id=$id deleted from workorder table: deleted=$deleted, count= " . $cnt . '<br>';
		}
		$this->assertTrue($cnt==0);
	}
	//Testing DB handler
	public function testMultiCalemConnection() {
		$dbHandler=	CalemFactory::getDbHandler();
		$conn1=$dbHandler->getCalemConnection();
		$conn2=$dbHandler->getCalemConnection();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Got two Calem connections: " . get_class($conn1) . ', ' . get_class($conn2) . '<br>';
		}
		//Now verify both connections are valid first
		if ($this->getWorkorderCount($conn1, 2)) {
			$this->deleteWorkorder($conn1, 2);
		}
		if ($this->getWorkorderCount($conn1, 3)) {
			$this->deleteWorkorder($conn1, 3);
		}
		
		//a. insert a workorder and removed it from the 1st connection
		$cnt=$this->getWorkorderCount($conn1, 1);
		if ($cnt>=1) {
			$this->deleteWorkorder($conn1, 1);
		}
		$this->insertWorkorder($conn1, 1);
		$cnt=$this->getWorkorderCount($conn1, 1);
		$this->assertTrue($cnt==1);
		//Delete this workorder
		$this->deleteWorkorder($conn1, 1);
		//Now set the first connection to null
		$conn1=null;
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'set conn1 to null, conn2=' . get_class($conn2) . '<br>';
		}
		//Make sure the 2nd connection is still good.
		$cnt=$this->getWorkorderCount($conn2, 2);
		if ($cnt>=1) {
			$this->deleteWorkorder($conn2, 2);
		}
		$cnt=$this->getWorkorderCount($conn2, 2);
		$this->assertTrue($cnt==0);
		$this->insertWorkorder($conn2, 2);
		$cnt=$this->getWorkorderCount($conn2, 2);
		$this->assertTrue($cnt==1);
		//Now delete it.
		$this->deleteWorkorder($conn2, 2);
		$cnt=$this->getWorkorderCount($conn2, 2);
		$this->assertTrue($cnt==0);
		//Now let's release the connection in dbHandler
		$dbHandler->releaseCalemConnection();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'release CalemConnection in dbHandler, conn2=' . get_class($conn2) . '<br>';
		}
		//Can we still operate $conn2 so we know if this is a copy.
		$cnt=$this->getWorkorderCount($conn2, 2);
		$this->assertTrue($cnt==0);
		//Insert a rec and remove it.
		$this->insertWorkorder($conn2, 3);
		$cnt=$this->getWorkorderCount($conn2, 3);
		$this->assertTrue($cnt==1);
		$this->deleteWorkorder($conn2, 3);
		$cnt=$this->getWorkorderCount($conn2, 3);
		$this->assertTrue($cnt==0);
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new MultiDbConnectionTest();
	$res->testMultiCalemConnection();
}
?>
