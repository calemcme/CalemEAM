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
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/schedule/CalemSchedBo.php';		

/**
 * This class tests UserDao class.
 */
class BatchScheduleTest extends PHPUnit2_Framework_TestCase {
	private $uid='test_001';
	private $uid2='test_002';
	private $teamId='team_001';
	
	private function cleanUp() {
		//Check sched users
		$schedUserDbo=CalemFactory::getDbo('sched_user');
		$schedUserDbo->deleteBySqlParam('delete from sched_user where user_id=?', $this->uid);
		$schedUserDbo->deleteBySqlParam('delete from sched_user where user_id=?', $this->uid2);
		
		$dboUser=CalemFactory::getDbo('users');
		$dboUser->deleteBySqlParam('delete from users where id=?', $this->uid);
		$dboUser->deleteBySqlParam('delete from users where id=?', $this->uid2);
	}
	
	private function initUser($id) {
		$dboUser=CalemFactory::getDbo('users');
		$cnt=$dboUser->getCountBySqlParam('select count(*) from users where id=?', $id);
		if ($cnt==0) {
			$ar=array();
			$ar['id']=$id;
			$ar['full_name']=$id;
			$ar['team_id']=$this->teamId;
			$dboUser->setChangeBulk($ar);
			$dboUser->insert();	
		}
	}
	
	public function testScheduleByUser() {
		$this->cleanUp();
		$this->initUser($this->uid);
		$tran=array();
		$tran['start_date']='2007-03-05';
		$tran['end_date']='2007-03-10';
		$tran['shift_id']='shift_1';
		$tran['user_id']='test_001';
		$schedBo=new CalemSchedBo();
		$schedBo->batchSchedule($tran);
		//Now verify results
		$schedUserDbo=CalemFactory::getDbo('sched_user');
		$cnt=$schedUserDbo->getCountBySqlParam('select count(*) from sched_user where user_id=?', $this->uid);
		//Add an item for this test.
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>user shift schedule for uid=</b>=" . $this->uid . ", count=" . $cnt . "<br>"; 
		}
		$this->assertTrue($cnt==6);
		//Verify contents
		$rows=$schedUserDbo->fetchBySqlParam('select * from sched_user where user_id=? order by sched_date ASC', $this->uid);
		$row=$rows[0];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>added user row=</b>=" . var_export($row, true) . "<br>"; 
		}	
		$shiftDbo=CalemFactory::getDropdown('shift');
		$data=$shiftDbo->getData();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>shift row= </b>=" . var_export($data, true) . "<br>"; 
		}	
		$this->assertTrue($row['total_hours']==$data[$row['shift_id']]['total_hours']
		           && $row['sched_hours']==$data[$row['shift_id']]['sched_hours']); 		           
		$this->assertTrue($row['sched_date']==$tran['start_date']);
		$this->assertTrue($row['shift_id']==$tran['shift_id']);
		//Clean up the changes
		$this->cleanUp();
	}
	
	public function testScheduleByTeam() {
		$this->cleanUp();
		$this->initUser($this->uid);
		$this->initUser($this->uid2);
		$tran=array();
		$tran['start_date']='2007-03-05';
		$tran['end_date']='2007-03-10';
		$tran['shift_id']='shift_1';
		$tran['team_id']=$this->teamId;
		$schedBo=new CalemSchedBo();
		$schedBo->batchSchedule($tran);
		//Now verify results
		$schedUserDbo=CalemFactory::getDbo('sched_user');
		$cnt=$schedUserDbo->getCountBySqlParam('select count(*) from sched_user where user_id=?', $this->uid);
		$cnt2=$schedUserDbo->getCountBySqlParam('select count(*) from sched_user where user_id=?', $this->uid);
		//Add an item for this test.
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>user shift schedule for uid=</b>=" . $this->uid . ", count=" . $cnt . "<br>";
			echo "<b>user shift schedule for uid=</b>=" . $this->uid2 . ", count=" . $cnt2 . "<br>"; 
		}
		$this->assertTrue($cnt+$cnt2==12);
		//Verify contents
		$rows=$schedUserDbo->fetchBySqlParam('select * from sched_user where user_id=? order by sched_date ASC', $this->uid);
		$row=$rows[0];
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>added user row=</b>=" . var_export($row, true) . "<br>"; 
		}	
		$shiftDbo=CalemFactory::getDropdown('shift');
		$data=$shiftDbo->getData();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>shift row= </b>=" . var_export($data, true) . "<br>"; 
		}	
		$this->assertTrue($row['total_hours']==$data[$row['shift_id']]['total_hours']
		           && $row['sched_hours']==$data[$row['shift_id']]['sched_hours']); 		           
		$this->assertTrue($row['sched_date']==$tran['start_date']);
		$this->assertTrue($row['shift_id']==$tran['shift_id']);
		//Clean up the changes
		$this->cleanUp();
	}
	
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new BatchScheduleTest();
	$res->testScheduleByUser();
	$res->testScheduleByTeam();
}
?>
