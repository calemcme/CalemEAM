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
class CalemDboTest extends PHPUnit2_Framework_TestCase {
	private $resourceMgr;
	
	private $row=array(
				'id'=>'999-test',
				'wo_no'=>'999-999-test',
				'description'=>'Test wo',
				'total_cost'=>2556.78	
			);
	
	public function __construct() {
		$this->resourceMgr=CalemFactory::getResourceManager();
	}
	
	public function testInsertSql() {
		$dbo=CalemFactory::getDbo('workorder');
		$dbo->setChangeBulk($this->row);
		$sql=$dbo->getInsertSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'insertSql='.$sql."<br>";	
		}
		$this->assertTrue(
			 !(strpos($sql, 'id')===false) 
		  && !(strpos($sql, 'wo_no')===false) 
		  && !(strpos($sql, 'insert into')===false) 
		  && !(strpos($sql, 'values')===false));	
	}
	
	public function testUpdateSql() {
		$dbo=CalemFactory::getDbo('workorder');
		$dbo->setChangeBulk($this->row);
		$sql=$dbo->getUpdateSql();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'updateSql='.$sql."<br>";	
		}
		$this->assertTrue(
			 !(strpos($sql, 'id')===false )
		  && !(strpos($sql, 'where')===false) );	
	}
	
	public function testInsertRecord() {
		//Verify if the record exist
		$dbo=CalemFactory::getDbo('workorder');
		try {
			$row=$dbo->fetchById($this->row['id']);
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo 'testInsertRecord, row exists, to delete, id=' . $this->row['id'] . "<br>";	
			}
			$dbo->deleteById($this->row['id']);
		} catch (Exception $e) {
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo "Exception in finding data in db for id=" . $this->row['id'] . "<br>";	
			}
		}
		try {
			$row=$dbo->fetchById($this->row['id']);
			$this->assertTrue(1!=1);
		} catch (CalemDboDataNotFoundException $e) {
		}
		$dbo=CalemFactory::getDbo('workorder');
		$dbo->setChangeBulk($this->row);
		$dbo->insert();
		//Verify that record is inserted.
		$row=$dbo->fetchById($this->row['id']);
		$this->assertTrue($row && $row['id']==$this->row['id']);
		$dbo->deleteById($this->row['id']);
		try {
			$row=$dbo->fetchById($this->row['id']);
			$this->assertTrue(1!=1);
		} catch (CalemDboDataNotFoundException $e) {
		}
	}
	
	public function testUpdateRecord() {
		//Verify if the record exist
		$dbo=CalemFactory::getDbo('workorder');
		try {
			$row=$dbo->fetchById($this->row['id']);
			if (!isset($_ENV['CALEM_BATCH_TEST'])) {
				echo 'testInsertRecord, row exists, to delete, id=' . $this->row['id'] . "<br>";	
			}
			$dbo->deleteById($this->row['id']);
		} catch (Exception $e) {}
		try {
			$row=$dbo->fetchById($this->row['id']);
			$this->assertTrue(1!=1);
		} catch (CalemDboDataNotFoundException $e) {}

		$dbo=CalemFactory::getDbo('workorder');
		$dbo->setChangeBulk($this->row);
		$dbo->insert();
		//Verify that record is inserted.
		$row=$dbo->fetchById($this->row['id']);
		$this->assertTrue($row && $row['id']==$this->row['id']);
		$dbo=CalemFactory::getDbo('workorder');
		$dbo->setChangeBulk($this->row);
		$dbo->update();
		$row=$dbo->fetchById($this->row['id']);
		$this->assertTrue($row!=null);
		$dbo=CalemFactory::getDbo('workorder', $this->row);
		$dbo->deleteById($this->row['id']);
		try {
			$row=$dbo->fetchById($this->row['id']);
			$this->assertTrue(1!=1);
		} catch (CalemDboDataNotFoundException $e) {}
	}
	
	public function testGetCountBySql() {
		$dbo=CalemFactory::getDbo("budget");
		$count=$dbo->getCountBySql("SELECT count(*) FROM budget");
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'budget count='. $count ."<br>";	
		}	
		$this->assertTrue($count>0);
	}
	
	public function testFetchBySql() {
		$dbo=new CalemDbo();
		$rows=$dbo->fetchBySql("SELECT count(*) FROM budget");
		foreach ($rows[0] as $key=>$val) {
			$count=(int)$val;	
		}
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'budget count='. $count . ", result=" . var_export($rows, true) ."<br>";	
		}
		$this->assertTrue(count($rows)==1 && is_int($count) && $count>0);
		
	}
	
	public function testInsertBySql() {
		$dbo=new CalemDbo();
		//Verify insertion condition first
		$count=$dbo->getCountBySql("select count(*) from recycle_bin where id='1'");
		if ($count>0) $this->testDeleteBySql();
		$sql="insert into recycle_bin (id, parent_id, description, table_name, rec_id, value_deleted, created_time, created_id)"
		     . " values('1', '2', 'test', 'budget', '123', 'budgetInfo', '2005-10-27 10:23:33', '123')";
		$dbo->insertBySql($sql);
		//Try count to ensure it's in.
		$count=$dbo->getCountBySql("select count(*) from recycle_bin");
		$this->assertTrue($count>0);
		//Now needs to get rid of the row; later.
	}
	
	public function testInsertNoData() {
		$dbo=new CalemDbo();
		$dbo->initWithTableName('workorder');
		//Delete without any data
		try {
			$dbo->insert();
			$this->assertTrue(1!=1);
		} catch (CalemDboNoDataException $no) {
			$this->assertTrue(1==1);	
		}
	}
	
	public function testUpdateBySql() {
		$dbo=new CalemDbo();
		$sql="update recycle_bin set created_id='4455' where id='1'";
		$dbo->updateBySql($sql);
		//Try count to ensure the change is in.
		$rows=$dbo->fetchBySql("select * from recycle_bin where id='1'");
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'recycle_bin row='. var_export($rows, true) ."<br>";	
		}
		$this->assertTrue($rows[0]['created_id']=='4455');
	}
	
	public function testUpdateNoData() {
		$dbo=new CalemDbo();
		$dbo->initWithTableName('workorder');
		//Delete without any data
		try {
			$dbo->update();
			$this->assertTrue(1!=1);
		} catch (CalemDboNoDataException $no) {
			$this->assertTrue(1==1);	
		}
	}
	
	public function testDeleteBySql() {
		$dbo=new CalemDbo();
		$sql="delete from recycle_bin where id='1'";
		$dbo->deleteBySql($sql);
		//Try count to ensure the change is in.
		$count=$dbo->getCountBySql("select count(*) from recycle_bin where id='1'");
		$this->assertTrue($count==0);
	}

	public function testDeleteNoData() {
		$dbo=CalemFactory::getDbo('workorder');
		//Delete without any data
		try {
			$dbo->delete();
			$this->assertTrue(1!=1);
		} catch (CalemDboNoDataException $no) {
			$this->assertTrue(1==1);	
		}
	}
	
	public function testDeleteWithRecycle() {
		//Verify recycle bin is set properly
		$dbo=CalemFactory::getDbo('recycle_bin');
		$ct=$dbo->getCountByRecordId('12345');
		if ($ct > 0) {
			$dbo->deleteBySql("delete from recycle_bin where rec_id='12345'");	
		}
		$ct=$dbo->getCountByRecordId('12345');
		$this->assertTrue($ct==0);
		//Verify budget is also set properly.
		$dbo=CalemFactory::getDbo("budget_title");
		$ct=$dbo->getCountByRecordId('12345');
		if ($ct > 0) {
			$dbo->setId('12345');
			$dbo->delete();	
		}
		$ct=$dbo->getCountByRecordId('12345');
		$this->assertTrue($ct==0);
		//Now start insertion.
		$row=array('id'=>'12345', 'title'=>'Budget 2006', 'start_date'=>'2006-12-10 15:30:19');
		$dbo->setChangeBulk($row);
		$dbo->insert(); //Add a record.
		//Verify the record added.
		$ct=$dbo->getCountBySql("select count(*) from budget_title where id='12345'");
		$this->assertTrue($ct==1);
		//Now verify deletion.
		$dbo->delete(true); //Process recycle-bin.
		//Verify that the record is inserted into recycle bin.
		$rbDbo=CalemFactory::getDbo("recycle_bin");
		$ct=$rbDbo->getCountByRecordId('12345');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'recycle_bin count='. $ct ."<br>";	
		}
		$this->assertTrue($ct>0);
		//Now delete it
		$dbo->deleteBySql("delete from recycle_bin where rec_id='12345'");
		$dbo=CalemFactory::getDbo('recycle_bin');
		$ct=$dbo->getCountByRecordId('12345');
		$this->assertTrue($ct==0);
	}

}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new CalemDboTest();
	$res->testGetCountBySql();
	$res->testFetchBySql();
	
	$res->testInsertSql();
	$res->testInsertRecord();
	
	
	$res->testInsertBySql();
	$res->testInsertNoData();
	
	$res->testUpdateSql();
	$res->testUpdateRecord();
	$res->testUpdateBySql();
	$res->testUpdateNoData();
	
	$res->testDeleteBySql();
	$res->testDeleteNoData();
	
	$res->testDeleteWithRecycle();
}

?>
