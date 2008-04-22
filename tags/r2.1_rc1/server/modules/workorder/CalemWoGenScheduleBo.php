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

//Work order generation

require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/pm/CalemPmScheduleBo.php';

class CalemWoGenScheduleBo extends CalemBo {
	protected $confMap;
	protected $pmScheduleBo;
	protected $standingPmSql;
	
	public function __construct() {
		parent::__construct();
		global $_CALEM_conf;
		$this->confMap=$_CALEM_conf['wo_conf']['wo_generation']['scheduleBoMap'];
		$this->standingPmSql=$_CALEM_conf['wo_conf']['wo_generation']['standing_pm_sql'];	
	}
	
	public function setPmReleaseSchedule($et) {
		$this->pmScheduleBo=new CalemPmScheduleBo($et);
	}
 	
	/**
	 * Schedule pm
	 * @return array of due dates, if empty, this asset is not due.
	 */
	public function schedulePm($pmRow, $pmAssetRow, $endDate) {
		$this->setPmReleaseSchedule($pmRow['release_schedule']);
		return call_user_func(array($this, $this->confMap[$pmRow['release_type_id'] . '_' . $pmRow['schedule_type_id']]),
										$pmRow, $pmAssetRow, $endDate);
	}
	
	/**
	 * Schedule by release type and schedule type
	 */
	public function handleFixedByTime($pmRow, $pmAssetRow, $endDate) {
		$dueDates=array();
		$lastReleaseDate=$this->getLastReleaseDate($pmAssetRow);
		$dueDate = ($lastReleaseDate) ? $this->pmScheduleBo->getNextDueDate($lastReleaseDate)
		                              : $this->pmScheduleBo->adjustReleaseDate(CalemText::getServerDateInt());
		//If there's no info to schedule, be done with it.
		$dueDates=$this->collectDueDates($dueDate, $dueDates, $endDate);
		return $dueDates;
	}
	
	//Collect due dates, stop at the first one or till out of range
	public function collectDueDates($dueDate, $dueDates, $endDate, $stopWhenFound=false) {
		while ($dueDate && $dueDate < $endDate) {
			list($bl, $dueDates)=$this->addDueDate($dueDate, $dueDates, $endDate);
			if ($bl && $stopWhenFound) break;
			$dueDate=$this->pmScheduleBo->getNextDueDate($dueDate);
		}
		return $dueDates;
	}
	
	/**
	 * If meter value is due, then release the PM by today with release date ajdustment.
	 */
	public function handleFixedByMeter($pmRow, $pmAssetRow, $endDate) {
		$dueDates=array();
		$pmMeterDbo=CalemFactory::getDbo('pm_meter');
		$nextDueDate=CalemText::parseServerDate($pmAssetRow['next_due_date']);
		try {
			$pmMeterRows=$pmMeterDbo->fetchBySqlParam('select * from pm_meter where pm_asset_id=?', $pmAssetRow['id']);
			$assetMeterDbo=CalemFactory::getDbo('asset_meter');
	
			foreach ($pmMeterRows as $meterRow) {
				if ($meterRow['release_by_meter'] && $meterRow['reading_interval']) {
					try {
						$amRow=$assetMeterDbo->fetchById($meterRow['meter_id']);
						$currentReading=$amRow['rollover_count']*$amRow['rollover_reading']+$amRow['reading'];
						$lastReading=$meterRow['rollover_count']*$amRow['rollover_reading']+$meterRow['reading_released'];
						$delta=$currentReading - $lastReading;
						
						if ($delta >= $meterRow['reading_interval']) {//meter is due.
							//Record in log a release by meter.
							if ($this->logger->isInfoEnabled()) {
								$this->logger->info("Due by meter for PM: " . $pmRow['pm_no'] . ", asset:" . $pmAssetRow['asset_id']
								                 . ', meter_id:' . $meterRow['meter_id'] . ', meter_reading: '
								                 . $amRow['reading'] . ", rollover: " . $amRow['rollover_count']
								                 . ', last release: ' . $meterRow['reading_released']
								                 . ', rollover_count:' . $meterRow['rollover_count']);	
							}
							$dueDate=$this->getMeterReleaseDate($nextDueDate);
							$dueDates[]=$dueDate;
							break; //No need to do it further.
						}
					} catch (CalemDboDataNotFoundException $ex) {	
					}
				}	
			}
		} catch (CalemDboDataNotFoundException $ex) {
			if ($this->logger->isDebugEnabled()) {
				$this->logger->debug("No meter found for pm_asset: " . $pmAssetRow['id']);	
			}	
		}
		return $dueDates;
	}
	
	public function getMeterReleaseDate($nextDueDate) {
		//Next due date should be released in this case
		if ($nextDueDate) {
			$dueDate=$nextDueDate;	
		} else {
			$dueDate=CalemText::getServerDateInt();
			$dueDate=$this->pmScheduleBo->adjustReleaseDate($dueDate);
		}
		return $dueDate;
	}
	
	//Due by dates or meter whichever happens first.
	public function handleFixedByTimeAndMeter($pmRow, $pmAssetRow, $endDate) {
		$dueDates=$this->handleFixedByTime($pmRow, $pmAssetRow, $endDate);
		$dueDates2=$this->handleFixedByMeter($pmRow, $pmAssetRow, $endDate);
		$dueDates=$this->mergeTimeMeter($dueDates, $dueDates2);
		return $dueDates;
	}
	
	//Time and meter whichever happens first
	public function mergeTimeMeter($dueDates, $dueDates2) {
		if (count($dueDates)>0) {
			if (count($dueDates2)>0) {
				if ($dueDates[0]>$dueDates2[0]) {
					$dueDates[0]=$dueDates2[0];	
				}	
			}
		} else {
			$dueDates=$dueDates2;	
		}
		return $dueDates;		
	}
	
	/**
	 * Floating PMs will not be released if there're workorders that's not closed.
	 * Otherwise, use last close date to count next release date.
	 */
	public function handleFloatingByTime($pmRow, $pmAssetRow, $endDate, $bypassStandingPm=false) {
		$dueDates=array();
		if ($this->hasStandingPm($pmAssetRow, $bypassStandingPm)) return $dueDates;
		$lastCloseDate=$this->getLastCloseDate($pmAssetRow);
		$dueDate = ($lastCloseDate) ? $this->pmScheduleBo->getNextDueDate($lastCloseDate)
		                              : $this->pmScheduleBo->adjustReleaseDate(CalemText::getServerDateInt());                 
		$dueDates=$this->collectDueDates($dueDate, $dueDates, $endDate, true);
		return $dueDates;		
	}
	
	//Checking standing PM, meter is handled the same way as for fixed.
	public function handleFloatingByMeter($pmRow, $pmAssetRow, $endDate, $bypassStandingPm=false) {
		$dueDates=array();
		if ($this->hasStandingPm($pmAssetRow, $bypassStandingPm)) return $dueDates;
		return $this->handleFixedByMeter($pmRow, $pmAssetRow, $endDate);
	}
	
	public function handleFloatingByTimeAndMeter($pmRow, $pmAssetRow, $endDate, $bypassStandingPm=false) {
		$dueDates=array();
		if ($this->hasStandingPm($pmAssetRow, $bypassStandingPm)) return $dueDates;
		$dueDates=$this->handleFloatingBytime($pmRow, $pmAssetRow, $endDate, true);
		$dueDates2=$this->handleFloatingByMeter($pmRow, $pmAssetRow, $endDate, true); //By pass standing check.	
		$dueDates=$this->mergeTimeMeter($dueDates, $dueDates2);			
		return $dueDates;
	}
	
	/**
	 * There're standing PMs in the workorder table.
	 */
	public function hasStandingPm($pmAssetRow, $bypassStandingPm=false) {
		if ($bypassStandingPm) return false;
		$woDbo=CalemFactory::getDbo('workorder');
		$cnt=$woDbo->getCountBySqlParam($this->standingPmSql, array($pmAssetRow['pm_id'], $pmAssetRow['asset_id']));
		return ($cnt>0);
	}
	
	//If there're no close date, use last release date
	public function getLastCloseDate($pmAssetRow) {
		$dtStr= ($pmAssetRow['last_closed'] ? $pmAssetRow['last_closed'] : $pmAssetRow['last_released']);
		return CalemText::parseServerDate($dtStr);	
	}
	
	//Find out last release date
	public function getLastReleaseDate($pmAssetRow) {
		return CalemText::parseServerDate($pmAssetRow['last_released']);	
	}
	
	/**
	 * Conditions to accept a due date
	 * a) it's valid value; AND
	 * b) it's within schedule range of the PM; AND
	 * c) it's within the generation target range
	 */
	public function addDueDate($dueDate, $dueDates, $endDate) {
		if (!$dueDate) {
			return array(false, $dueDates);	
		} else if (!$this->pmScheduleBo->isDateInRange($dueDate)) {
			return array(false, $dueDates);
		} else if ($dueDate > $endDate) {
			return array(false, $dueDates);
		} else {
			array_push($dueDates, $dueDate);
			return array(true, $dueDates);
		}
	}
	
}
?>