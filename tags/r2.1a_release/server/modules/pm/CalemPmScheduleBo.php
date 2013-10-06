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
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemScheduleInfo.php';

/**
 * This is the dependency map manager
 */
class CalemPmScheduleBo extends CalemBo {	
	protected $scheduleInfo;
	
	public function __construct($dbSchedInfo) {
		parent::__construct();
		$this->scheduleInfo=CalemScheduleInfo::decode($dbSchedInfo);
	}
	
	public function getScheduleInfo() {
		return $this->scheduleInfo;
	}
	
	public function isValid() {
		return $this->scheduleInfo->isValid();	
	}
	
	/**
	 * Figure out next release date
	 */
	public function getNextDueDate($releaseDate) {
		return $this->scheduleInfo->getNextDueDate($releaseDate);
	}
	
	/**
	 * Adjust release date to fit the release date portion of the schedule info.
	 */
	public function adjustReleaseDate($releaseDate) {
		return $this->scheduleInfo->adjustReleaseDate($releaseDate);
	}
	
	/**
	 * Check date range
	 */
	public function isDateInRange($dt) {
		return $this->scheduleInfo->isDateInRange($dt);
	}
}

?>