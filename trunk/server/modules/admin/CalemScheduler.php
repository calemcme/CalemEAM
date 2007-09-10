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
require_once _CALEM_DIR_ . 'server/include/core/semaphore/CalemSemaphoreBo.php';
require_once _CALEM_DIR_ . 'server/modules/admin/CalemSchedulerJobBo.php';


/**
 * This is the scheduler class that evaluates each job and decides which one to launch.
 */
class CalemScheduler {	
	const SemSchedulerId = 'CalemSchedulerSem';
	
	protected $logger;
	protected $semBo;	
	protected $jobBo;
	protected $conf;
	
	public function __construct() {	
 		$this->logger=&LoggerManager::getLogger("CalemScheduler");
 		$this->semBo=new CalemSemaphoreBo();
 		$this->jobBo=new CalemSchedulerJobBo();
 		global $_CALEM_conf;
 		$this->conf=$_CALEM_conf['admin_conf']['scheduler'];
 	}
 	
 	/**
 	 * If the scheduler cannot secure a semaphore do not proceed.
 	 */
 	public function execute() {
 		$sem=$this->semBo->get(self::SemSchedulerId);
 		if ($sem!=null && $sem->getExpireTime() > gmmktime()) {
 			$this->logger->debug("A semaphore is still on. Abort this run.");
 			return;
 		}
 		//Secure a semaphore for this run
 		$this->setSemaphore();
 		
 		//Cycle through jobs
 		try {
 			$jobs=$this->jobBo->getDueJobList();
			if (!$jobs) {
				$this->semBo->clear(self::SemSchedulerId);
				return;
			}
 			foreach ($jobs as $job) {
 				//Extend script time and semaphore
 				if ($this->conf['task_script_time']) {
 					set_time_limit($this->conf['task_script_time']);
 				}
 				$this->setSemaphore();
 				
 				//run one job.
 				if ($this->logger->isDebugEnabled()) $this->logger->debug("starting job: " . var_export($job, true));
 				try {
 					$this->jobBo->updateNextDueTime($job);
 					$startTime=CalemText::getServerDateTime();
 					$rtn=$this->jobBo->executeJob($job);
 					$endTime=CalemText::getServerDateTime();
 					$this->jobBo->addJobRun($job, $startTime, $endTime, $rtn);
 				} catch (Exception $e) {
 					$this->logger->error("Error in starting job=" . $job['id'] . ", msg=" . $e->getMessage());
 				}	
 			}	
 		} catch (Exception $e) {
 			$this->logger->error("Error in starting jobs, msg=" . $e->getMessage());	
 		}
 		
 		$this->semBo->clear(self::SemSchedulerId);
 	}
 	
 	//Set up semaphore
 	public function setSemaphore() {
 		$sem=new CalemSemaphore(self::SemSchedulerId);
 		$sem->setDurationSecs($this->conf['semaphoreExpireSecs']);
 		$this->semBo->set($sem);
 	}
}
