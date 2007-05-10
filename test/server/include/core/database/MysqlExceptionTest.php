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

/**
 * This class verifies Mysql error code for:
 * - duplication of keys or unique constraints: a) from deletion; b) from
 * 	modification
 */
class MysqlExceptionTest extends PHPUnit2_Framework_TestCase {
	private $prefix='wo_test_ex_';
	
	private function getId($id) {
		return "'" . $this->prefix . $id . "'";
	}
	
	private function getIdNq($id) {
		return $this->prefix . $id;
	}
	
	//A test helper function to find out the record count based on the id
	private function getWorkorderCount($conn, $id) {
		$nid=$this->getId($id);
		$result=$conn->query("select count(*) from workorder where id=$nid");
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
	
	//Insert record with id
	private function insertWorkorderBind($conn, $id) {
		$nid=$this->getIdNq($id);
		$conn->beginTransaction();
		$stmt=$conn->prepare("insert into workorder (id, wo_no) values (?, ?)");
		$stmt->bindValue(1, $nid);
		$stmt->bindValue(2, $nid);
		try {
			$stmt->execute();
			$conn->commit();
			$cnt=$this->getWorkorderCount($conn, $id);
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "record id=$id inserted into workorder table: inserted=$inserted, count=" . $cnt . '<br>';
			}
			$this->assertTrue($cnt>=1);	
		} catch (Exception $e) {
			throw new Exception('SQLError', $stmt->errorCode());
		}	
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
		return $deleted;
	}
	//Modify workorder Id
	private function modifyWorkorderId($conn, $id, $newId) {
		$nid=$this->getId($id);
		$newNid=$this->getId($newId);
		$conn->beginTransaction();
		$deleted=$conn->exec("update workorder set id=$newNid where id=$nid");
		$conn->commit();
	}
	//Modify workorder no.
	private function modifyWorkorderNo($conn, $woNo, $newWoNo) {
		$nid=$this->getId($woNo);
		$newNid=$this->getId($newWoNo);
		$conn->beginTransaction();
		$deleted=$conn->exec("update workorder set wo_no=$newNid where wo_no=$nid");
		$conn->commit();
	}
	
	//Testing deletion error handling.
	public function testDbDeleteException() {
		$dbHandler=	CalemFactory::getDbHandler();
		$logger=&LoggerManager::getLogger("testDbDeleteException");
		try {
			$conn1=$dbHandler->getCalemConnection();
		} catch (Exception $e) {
			$logger->error("Error in opening CalemConnection");
			return;
		}
		//Ensure that this record does not exist
		$go=true;
		while ($go) {
			$cnt=$this->getWorkorderCount($conn1, 1);
			if ($cnt>0) {
				$this->deleteWorkorder($conn1, 1);	
			} else {
				break;
			}
		}
		$this->assertTrue($cnt==0);
		//a. Delete a record that does not exist, should not cause an exception
		$this->deleteWorkorder($conn1, 1);
		$this->deleteWorkorder($conn1, 1);
		$cnt=$this->getWorkorderCount($conn1, 1);
		$this->assertTrue($cnt==0);
		//So this is ok, no exception is thrown.
		$dbHandler->releaseCalemConnection();
	}
	
	//Testing insert error handler using binding
	public function testDbInsertException() {
		$dbHandler=	CalemFactory::getDbHandler();
		$logger=&LoggerManager::getLogger("testDbException");
		try {
			$conn1=$dbHandler->getCalemConnection();
		} catch (Exception $e) {
			$logger->error("Error in opening CalemConnection");
			return;
		}
		//Ensure that this record does not exist
		$cnt=$this->getWorkorderCount($conn1, 1);
		while ($cnt>0) {
			$this->deleteWorkorder($conn1, 1);
			$cnt=$this->getWorkorderCount($conn1, 1);	
		}
		$this->assertTrue($cnt==0);
		//b. insert a record twice
		try {
			$this->insertWorkorder($conn1, 1);
			$this->insertWorkorder($conn1, 1);
			//This is not good.
			throw new Exception("No exception is thrown in ". __METHOD__);
		} catch (Exception $e) {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "got exception in inserting: error=" . var_export($conn1->errorInfo(), true). "<br>";	
			}
			//This is ok so we got the exception
			$logger->error("Got insert exception, errorCode="
				. $conn1->errorCode() . ", errorInfo=" . var_export($conn1->errorInfo(), true));
			//Make sure this is key violation
			$this->assertTrue($dbHandler->isKeyViolation($conn1->errorCode()));
			$conn1->rollback();
		}
		//Let's make sure we remove the workorder inserted
		$this->deleteWorkorder($conn1, 1);
		$dbHandler->releaseCalemConnection();		
	}
	
	
	//Testing insert error handler
	public function testDbInsertBindException() {
		$dbHandler=	CalemFactory::getDbHandler();
		$logger=&LoggerManager::getLogger("testDbException");
		try {
			$conn1=$dbHandler->getCalemConnection();
		} catch (Exception $e) {
			$logger->error("Error in opening CalemConnection");
			return;
		}
		//Ensure that this record does not exist
		$cnt=$this->getWorkorderCount($conn1, 1);
		while ($cnt>0) {
			$this->deleteWorkorder($conn1, 1);
			$cnt=$this->getWorkorderCount($conn1, 1);	
		}
		$this->assertTrue($cnt==0);
		//b. insert a record twice
		try {
			$this->insertWorkorderBind($conn1, 1);
			$this->insertWorkorderBind($conn1, 1);
			//This is not good.
			throw new Exception("No exception is thrown in ". __METHOD__);
		} catch (Exception $e) {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "got exception in inserting: errorCode=" . $e->getCode() . "<br>";	
			}
			//This is ok so we got the exception
			$logger->error("Got insert exception, errorCode=" . $e->getCode() );
			//Make sure this is key violation
			$this->assertTrue($dbHandler->isKeyViolation($e->getCode()));
			$conn1->rollback();
		}
		//Let's make sure we remove the workorder inserted
		$this->deleteWorkorder($conn1, 1);
		$cnt=$this->getWorkorderCount($conn1, 1);
		$this->assertTrue($cnt==0);
		$dbHandler->releaseCalemConnection();		
	}
	
	
	//Testing update error handler
	public function testDbUpdateException() {
		$dbHandler=	CalemFactory::getDbHandler();
		$logger=&LoggerManager::getLogger("testDbException");
		try {
			$conn1=$dbHandler->getCalemConnection();
		} catch (Exception $e) {
			$logger->error("Error in opening CalemConnection");
			return;
		}
		//Ensure that this record does not exist
		$cnt=$this->getWorkorderCount($conn1, 1);
		while ($cnt>0) {
			$this->deleteWorkorder($conn1, 1);
			$cnt=$this->getWorkorderCount($conn1, 1);	
		}
		$this->assertTrue($cnt==0);
		$cnt=$this->getWorkorderCount($conn1, 2);
		while ($cnt>0) {
			$this->deleteWorkorder($conn1, 2);
			$cnt=$this->getWorkorderCount($conn1, 2);	
		}
		$this->assertTrue($cnt==0);
		//b. insert a record
		$this->insertWorkorder($conn1, 1);
		$this->insertWorkorder($conn1, 2);
		$cnt=$this->getWorkorderCount($conn1, 1);
		$this->assertTrue($cnt==1);
		$cnt=$this->getWorkorderCount($conn1, 2);
		$this->assertTrue($cnt==1);
		//Now modify the primary key Id to ensure we got an exception
		try {
			$this->modifyWorkorderId($conn1, 1, 2);	
			throw new Exception("Update to same Id not causing an exception");
		} catch (Exception $e) {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "got exception in update: error=" . var_export($conn1->errorInfo(), true). "<br>";	
			}
			//This is ok so we got the exception
			$logger->error("Got update exception, errorCode="
				. $conn1->errorCode() . ", errorInfo=" . var_export($conn1->errorInfo(), true));
			//Make sure this is key violation
			$this->assertTrue($dbHandler->isKeyViolation($conn1->errorCode()));
			$conn1->rollback();
		}
		try {
			$this->modifyWorkorderNo($conn1, '1', '2');	
			throw new Exception("Update to same Id not causing an exception");
		} catch (Exception $e) {
			//This is ok so we got the exception
			$logger->error("Got update exception, errorCode="
				. $conn1->errorCode() . ", errorInfo=" . var_export($conn1->errorInfo(), true));
			//Make sure this is key violation
			$this->assertTrue($dbHandler->isKeyViolation($conn1->errorCode()));
			//Rollback transaction
			$conn1->rollback();
		}
		//Let's make sure we remove the workorder inserted
		$this->deleteWorkorder($conn1, 1);
		$logger->debug("test transaction chaining");
		//Testing transaction chaining...
		$conn1->beginTransaction();
		$this->deleteWorkorder($conn1, 2);
		$conn1->commit();
		$dbHandler->releaseCalemConnection();		
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new MysqlExceptionTest();
	$res->testDbDeleteException();
	$res->testDbInsertException();
	$res->testDbInsertBindException();
	$res->testDbUpdateException();
}
?>
