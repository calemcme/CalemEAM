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

require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemScheduleInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemScheduleTimeInfo.php';

/**
 * This is the scheduler class that evaluates each job and decides which one to launch.
 */
class CalemSchedulerJobBo {	
	
	protected $logger;
	protected $dbo;	
	protected $dboRun;
	protected $taskDbo;
	
	public function __construct() {	
 		$this->logger=&LoggerManager::getLogger("CalemSchedulerJobBo");
 		$this->dbo=CalemFactory::getDbo('scheduler_job');
 		$this->dboRun=CalemFactory::getDbo('scheduler_job_log');
 		$this->taskDbo=CalemFactory::getDbo('scheduler_task');
 	}
 	
 	/**
 	 * Find the due job list
 	 * where active is true and due time passes.
 	 */
 	public function getDueJobList() {
 		$rtn=null;
 		$now=CalemText::getServerDateTime();
 		try {
 			$rtn=$this->dbo->fetchBySqlParam("select * from scheduler_job where is_active=1 and time_due is not NULL and time_due <= ? order by start_seq", array($now));
 		} catch (CalemDboDataNotFoundException $e) {
 		}
 		return $rtn;	
 	}
 	
 	/**
 	 * Figure out next time due
 	 */
 	public function updateNextDueTime($jobRow) {
 		$schedDay=CalemScheduleInfo::decode($jobRow['release_day']);
 		$schedTime=CalemScheduleInfo::decode($jobRow['release_time']);
 		$dueTime=CalemText::parseServerDateTime($jobRow['time_due']);
 		$newTime=$schedTime->getNextDueTime($dueTime, $schedDay);
 		try {
			$this->dbo->setValue('time_due', CalemText::getServerDateTime($newTime));
			$this->dbo->setIdForUpdate($jobRow['id']);
			$this->dbo->update();
		} catch (Exception $e) {
			$this->logger->error("Error in updating job row=" . var_export($jobRow, true) . ", msg=" . $e->getMessage());
		} 
 	}
 	
 	/**
 	 * Add a job run record
 	 */
 	public function addJobRun($job, $startTime, $endTime, $rtn) {
 		$this->dboRun->setChangeBulk(array(
 			'job_id'=>$job['id'],
 			'start_time'=>$startTime,
 			'end_time'=>$endTime,
 			'results'=>$rtn
 			)
 		);
 		$this->dboRun->insert(); 			
 	}
 	
 	/**
 	 * Execute job
 	 */
 	public function executeJob($job) {
 		try {
 			$task=$this->taskDbo->fetchById($job['task_id']);
 			$cls=$task['class_name'];
 			$clsPath=$task['class_path'];
 			if ($clsPath && strrpos($clsPath, "/")!=strlen($clsPath)) {
 				$clsPath .= '/';	
 			}
 			$fp=_CALEM_DIR_ . $clsPath . $cls . '.php';
 			if (!is_file($fp)) {
 				$this->logger->error("Task $fp does not exist!");
 				return;	
 			}
 			require_once $fp;
 			$obj=new $cls;
 			return $obj->execute();
 		} catch (Exception $e) {
 			$this->logger->error('Error in execute job, msg=' . $e->getMessage() . ', job=' . var_export($job, true));	
 		}		
 	}
}

?>