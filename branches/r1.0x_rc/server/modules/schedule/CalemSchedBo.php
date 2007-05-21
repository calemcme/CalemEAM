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


//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

//Base CalemDao
require_once _CALEM_DIR_ . 'server/include/core/CalemUiException.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';

class CalemSchedBo extends CalemBo {
	private $schedUserDbo;
	private $userDbo;
	private $shiftData;
	
	public function __construct() {	
 		parent::__construct();
 		$this->schedUserDbo=CalemFactory::getDbo('sched_user');
 		$shiftDd=CalemFactory::getDropdown('shift');
 		$this->shiftData=$shiftDd->getData();
 	}
 	
	public function batchSchedule($tran) {
		$users=array();
		if (isset($tran['user_id'])) {
			$users[]=$tran['user_id'];
		} else {
			$userDbo=CalemFactory::getDbo('users');
			$rows=$userDbo->fetchBySqlParam('select id from users where team_id=?', $tran['team_id']);
			foreach ($rows as $row) {
				$users[]=$row['id'];
			}				
		}
		//Adding schedule for each user.
		try {
			$this->schedUserDbo->beginTransaction();
			$startDate=CalemText::parseServerDate($tran['start_date']);
			$endDate=CalemText::parseServerDate($tran['end_date']);
			$shiftRow=$this->shiftData[$tran['shift_id']];
			while ($startDate <= $endDate) {
				$dtStr=date('Y-m-d', $startDate);
				foreach ($users as $user) {
					if ($this->logger->isDebugEnabled()) 
					   $this->logger->debug("Add schedule: user_id=" . $user . ", startDate=" . $dtStr . ", shift=" . $tran['shift_id']);
					try {
						$rows=$this->schedUserDbo->fetchBySqlParam('select * from sched_user where user_id=? and sched_date=? and shift_id=?',
						                    array($user, $dtStr, $tran['shift_id']));
						//No processing here.					                    
					} catch (CalemDboDataNotFoundException $ex) {
						$ar['user_id']=$user;
						$ar['sched_date']=$dtStr;
						$ar['shift_id']=$tran['shift_id'];
						$ar['total_hours']=$shiftRow['total_hours'];
						$ar['sched_hours']=$shiftRow['sched_hours'];
						$this->schedUserDbo->setChangeBulk($ar);
						$this->schedUserDbo->insert();
						$this->schedUserDbo->unsetId();	
					} 	
				}
				//Adding a day
				$startDate=strtotime("+1 day", $startDate); 
			} 
			$this->schedUserDbo->commit();  
		} catch (Exception $ex) {
			$this->schedUserDbo->rollback();
			throw $ex;	
		}         	
   }
   
   /**
    * Update a user
    */
   public function scheduleUser($uid, $date, $shiftId, $hours) {
   	try {
   		$rows=$this->schedUserDbo->fetchBySqlParam('select * from sched_user where user_id=? and sched_date=? and shift_id=?',
   		                          array($uid, $date, $shiftId));	
			$row=$rows[0];
			$hours=$row['hours_sched']+$hours;
			$this->schedUserDbo->setValue('hours_sched', $hours);
			$this->schedUserDbo->setIdForUpdate($row['id']);
			$this->schedUserDbo->update();			   		                          		
   	} catch (CalemDboDataNotFoundException $ex) {
   		$ar=array();
   		$shiftRow=$this->shiftData[$shiftId];
   		$ar['user_id']=$uid;
   		$ar['sched_date']=$date;
   		$ar['shift_id']=$shiftId;
   		$ar['total_hours']=$shiftRow['toal_hours'];
   		$ar['sched_hours']=$shiftRow['sched_hours'];
   		$ar['hours_sched']=$hours;
   		$this->schedUserDbo->setChangeBulk($ar, true);
   		$this->schedUserDbo->insert();
   	}
   }
   	
}