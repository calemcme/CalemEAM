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
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';	

/**
 * DataBo test with custom fields.
 */

class DataBoTest extends PHPUnit2_Framework_TestCase {
	
	private function setupTest() {
		//Use a special table for test use.
		$dbo=CalemFactory::getDbo('dept');
		$this->assertTrue($dbo->getTableDd()->getTableName() == 'dept');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'dept dbo tableName=' . $dbo->getTableDd()->getTableName() . "<br>";
		}

		$path=_CALEM_DIR_ . 'custom/global/metadata/zc_dept.metadata';
		if (is_file($path)) unlink($path);
		
		if (!is_file($path)) {
			$ar=array('fields'=>array('test'=>array('type'=>'varchar', 'length'=>30)));
			file_put_contents($path, serialize($ar));	
		}
		$this->assertTrue(is_file($path));
		
		//Make sure database has a table zc_dept.
		$dbHdlr=CalemFactory::getDbHandler();
		if ($dbHdlr->tableExists($dbo, 'zc_dept')) {
			$this->dropTable($dbHdlr, 'zc_dept');
		}
		
		$this->assertTrue(!$dbHdlr->tableExists($dbo, 'zc_dept'));
	
		if (!$dbHdlr->tableExists($dbo, 'zc_dept')) {
			$dbo->executeDDL('create table zc_dept (zc_id varchar(36) primary key, test varchar(30))');	
		}
		$this->assertTrue($dbHdlr->tableExists($dbo, 'zc_dept'));
		
		//Remove data from both tables
		$dept='cl-A';
		$this->removeData($dbo, $dept);
		$dept='cl-B';
		$this->removeData($dbo, $dept);
	}
	
	public function removeData($dbo, $dept) {
		$cnt=$dbo->getCountBySql("select count(*) from dept where dept='" . $dept . "'");
		if ($cnt>0) {
			$rows=$dbo->fetchBySql("select * from dept where dept='" . $dept . "'");
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "Found data, " . var_export($rows, true) . " <br>"; 
			}
			$id=$rows[0]['id'];
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "Data found: dept= $dept, id=$id <br>"; 
			}
			$dbo->deleteBySql("delete from dept where id='" . $id . "'");
			try {
				$dbo->deleteBySql("delete from zc_dept where zc_id='" . $id . "'");	
			} catch (Exception $ex) {
				//	
			}
			$cnt=$dbo->getCountBySql("select count(*) from dept where dept='" . $dept . "'");
		} else {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "No data found, continue testing... <br>"; 
			}	
		}
		$this->assertTrue($cnt==0);
	}
	
	private function teardownTest($id) {
		//Use a special table for test use.
		$dbo=CalemFactory::getDbo('dept');
		$path=_CALEM_DIR_ . 'custom/global/metadata/zc_dept.metadata';		
		//Make sure database has a table zc_dept.
		$dbHdlr=CalemFactory::getDbHandler();
		
		//tear down test
		unlink($path);
		$dbo->deleteBySql("delete from dept where id='" . $id . "'");
		$this->dropTable($dbHdlr, 'zc_dept');	
	}
	
	public function dropTable($dbHdlr, $tb) {
		$adminConn=$dbHdlr->getDatabaseAdminConnection();
		$adminConn->query('drop table calemeam.' . $tb);
		$dbHdlr->releaseDatabaseAdminConnection();
	}
	
	public function verifyDataCount($id, $count) {
		$dbo=CalemFactory::getDbo('dept');
		$baseCnt=$dbo->getCountBySql("select count(*) from dept where id='" . $id . "'");
		$customCnt=$dbo->getCountBySql("select count(*) from zc_dept where zc_id='" . $id . "'");
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo date("D M j G:i:s T Y") . ', base dept count='. $baseCnt . ", zc_dept count=" . $customCnt . "<br>";
		}
		$this->assertTrue($baseCnt == $customCnt && $baseCnt==$count);
	}
	
	//Two dbo transaction test
	public function testDboTransaction() {
		$this->setupTest();
		
		//Use a special table for test use.
		$dbo=CalemFactory::getDbo('dept');
		$path=_CALEM_DIR_ . 'custom/global/metadata/zc_dept.metadata';		
		//Make sure database has a table zc_dept.
		$dbHdlr=CalemFactory::getDbHandler();
		
		$baseData=array('dept'=>'cl-A');
		$custData=array('test'=>'cl-A');
		$dboCustom=CalemFactory::getDboCustom('zc_dept');

		$dbo->beginTransaction();
		$dbo->setChangeBulk($baseData);
		$dbo->insert();
		
		$custData['zc_id']=$dbo->getId();
		$dboCustom->setChangeBulk($custData);
		$dboCustom->insert();
	
		$dbo->commit();
		
		//Verify db record count
		$id=$dbo->getId();
		$this->verifyDataCount($id, 1);
		
		//tear down test
		$this->teardownTest($id);		                                   		              
	}
	
	//DataBo - insert, update and delete.
	public function testDataBo() {
		$this->setupTest();
		//DataBo insertion
		$table='dept';
		$customTable='zc_dept';
		$row['dept']='cl-A';
		$custom['test']='cl-A';
		$fetchSql='SELECT dept.* , zc_dept.* FROM dept LEFT JOIN zc_dept ON dept.id=zc_dept.zc_id WHERE dept.id = ?';
		$bo=CalemFactory::getDataBo($table);
		$feedback=$bo->insert($table, $row, $customTable, $custom, $fetchSql);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo date("D M j G:i:s T Y") . ', insert feedback='. var_export($feedback, true) . "<br>";
		}
		$this->assertTrue($feedback['data']['id'] && ($feedback['data']['id']==$feedback['data']['zc_id']));
		//Verify db record count
		$id=$feedback['data']['id'];
		$this->verifyDataCount($id, 1);
		
		//DataBo update - conflict in base table
		$current['id']=$id;
		$current['dept']='cl-1';
		$update['dept']='cl-B';
		$customCurrent['test']='cl-A';
		$customUpdate['test']='cl-B';
		//- conflict in base table
		try {
			$bo->update($table, $current, $update, $customTable, $customCurrent, $customUpdate, $fetchSql);
			$this->assertTrue(1==2);
		} catch (CalemDboUpdateConflictException $ex) {
			//Verify exception here.	
			$conflict=$ex->getConflict();
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo 'Base exception ='. var_export($ex->getConflict(), true) . "<br>";
			}
			$this->assertTrue(count($conflict)> 0);
		}
		
		//DataBo update - conflict in custom field table
		$current['id']=$id;
		$current['dept']='cl-A';
		$update['dept']='cl-B';
		$customCurrent['test']='cl-1';
		$customUpdate['test']='cl-B';
		//- conflict in base table
		try {
			$bo->update($table, $current, $update, $customTable, $customCurrent, $customUpdate, $fetchSql);
			$this->assertTrue(1==2);
		} catch (CalemDboUpdateConflictException $ex) {
			//Verify exception here.	
			$conflict=$ex->getConflict();
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo 'Custom update exception ='. var_export($ex->getConflict(), true) . "<br>";
			}
			$this->assertTrue(count($conflict)> 0);
		}
		
		//DataBo update - succ case
		$current['id']=$id;
		$current['dept']='cl-A';
		$update['dept']='cl-B';
		$customCurrent['test']='cl-A';
		$customUpdate['test']='cl-C';
		$feedback=$bo->update($table, $current, $update, $customTable, $customCurrent, $customUpdate, $fetchSql);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'update feedback='. var_export($feedback, true) . "<br>";
		}
		$this->assertTrue($feedback['server']['test']==$customUpdate['test']
		         && $feedback['server']['dept']==$update['dept']);
		
		//DataBo deletion
		$feedback=$bo->delete($table, $id, $customTable, $id);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'delete feedback='. var_export($feedback, true) . "<br>";
		}
		$this->verifyDataCount($id, 0);
		
		//tear down test
		$this->teardownTest($id);		                                   		              
	}

}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new DataBoTest();
	$res->testDboTransaction();
	$res->testDataBo();
}
?>
