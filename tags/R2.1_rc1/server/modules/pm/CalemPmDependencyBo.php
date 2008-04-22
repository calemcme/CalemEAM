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

/**
 * This is the dependency map manager
 */
class CalemPmDependencyBo extends CalemBo {	
	
	/**
	 * PM dependency map to load up
	 */
	public function getPdm() {
		$pdm=null;
		$cache=CalemFactory::getDataCacheManager();
		$pdmInfo=$cache->load('pdm');
		if ($pdmInfo) {
			if ($this->pdmUpToDate($pdmInfo)) {
				$pdm=$pdmInfo['pdm'];
			}	
		}
		if (!$pdm) {
			//Create PDM and save it.
			$timestamp=CalemText::getServerDateTime();
			$pdm=$this->buildPdm();
			$cache->save(array('timestamp'=>$timestamp, 'pdm'=>$pdm), 'pdm');	
		}
		return $pdm;
	}	
	
	/**
	 * Check for update/insertion in pm_dependency
	 * Deletion will not affect the tasks being generated so it's not checked.
	 */
	public function pdmUpToDate($pdmInfo) {
		$depDbo=CalemFactory::getDbo('pm_dependency');
		$ts=$depDbo->getCountBySql('select max(modified_time) from pm_dependency');
		//Empty is deemed as out of date.
		return ($ts && $ts < $pdmInfo['timestamp']);			
	}
	
	/**
	 * build PDM
	 */
	public function buildPdm() {
		$pdm=array();
		$dbo=CalemFactory::getDbo('pm_dependency');
		$childAr=array();
		$parentAr=array();
		$sortAr=array();
		try {
			$rows= $dbo->fetchBySql('select * from pm_dependency');
			//Constructing child/parent ars.
			foreach ($rows as $row) {
				$childAr=$this->addChild($row, $childAr);
				$parentAr=$this->addParent($row, $parentAr);					
			}
			//Now scan the parentAr to come up with order.
			while (true) {
				if (count($parentAr)==0) break;
				$tempAr=array();
				$newParentAr=array();
				foreach ($parentAr as $key=>$ar) {
					$ar=$this->removeParents($ar, $sortAr);
					if (count($ar)==0) {
						$tempAr[$key]=1;
					} else {
						$newParentAr[$key]=$ar;	
					}						
				}
				$sortAr = $sortAr+$tempAr;
				$parentAr=$newParentAr;
			}
			$pdm=array('sort'=>$sortAr, 'map'=>$childAr);		
		} catch (CalemDboDataNotFoundException $ex) {
		}
		return $pdm;
	}
	
	//remove parents
	private function removeParents($ar, $sortAr) {
		$newAr=array();
		foreach ($ar as $val) {
			if (!array_key_exists($val, $sortAr)) {
				array_push($newAr, $val);
			}					
		}	
		return $newAr;
	}
	
	/**
	 * Build graph for ordering later.
	 */
	public function addChild($row, $childAr) {
		if (isset($childAr[$row['pm_id']])) {
			array_push($childAr[$row['pm_id']], $row); 	
		} else {
			$childAr[$row['pm_id']]=array($row);	
		}
		return $childAr;
	}
	
	public function addParent($row, $parentAr) {
		if (isset($parentAr[$row['child_pm_id']])) {
			array_push($parentAr[$row['child_pm_id']], $row['pm_id']);	
		}	else {
			$parentAr[$row['child_pm_id']] = array($row['pm_id']);
		}
		//Also the parent itself.
		if (!isset($parentAr[$row['pm_id']])) {
			$parentAr[$row['pm_id']]=array(); //Set as empty array
		}
		return $parentAr;
	}
}

?>