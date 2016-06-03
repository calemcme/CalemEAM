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

if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/modules/dashboard/CalemDashBo.php';

/**
 * dash_wo_age_pri BO class
 */
class CalemDashWoAgePriBo extends CalemDashBo {
	protected $dbo;
	protected $ddDbo;
	protected $sb;
	protected $ddData;
	protected $ranges;
	protected $series;
	protected $data;
	protected $nullPri;
	protected $cf;

	public function __construct() {
		parent::__construct();
		$this->dbo=CalemFactory::getDbo('workorder');
		$this->ddDbo=CalemFactory::getDropdown('wo_priority');
		$this->sb=CalemFactory::getSb($this->conf['sb']);
		$this->_initIt();
 	}

 	public function _initIt() {
 		$cf=$this->conf['dash_wo_age_pri'];
		$this->nullPri=$cf['nullPri'];
		$this->ddData=$this->ddDbo->getData();
		$this->ddData[$this->nullPri]=true; //Null value case.
		$this->ranges=$cf['ranges'];
		$this->series=$cf['series'];
 	}

 	//Check for data changes
 	public function getDataChanged() {
 		$mt=filemtime($this->dataFile);
 		return (mktime()-$mt > $this->conf['ttl']);
 	}

 	//Add a data point
 	public function addData($row) {
 		$pri=$row['priority_id'] ? $row['priority_id'] : $this->nullPri;
 		$sid=$this->getSeriesId($row['days']);
 		if (isset($this->data[$pri][$sid])) {
 			$this->data[$pri][$sid]++;
 		} else {
 			$this->data[$pri][$sid]=1;
 		}
 	}

 	public function getSeriesId($days) {
 		$idx=count($this->ranges);
 		for ($i=0; $i < $idx; $i++) {
 			if ($days < $this->ranges[$i]) {
 				$idx=$i;
 				break;
 			}
 		}
 		return $this->series[$idx];
 	}

	/**
	* Update local data file - data collection for the report.
	*/
	public function generateChartData() {
		try {
			$rtn=$this->dbo->fetchBySql($this->sb->getWoAgePri());
		} catch (CalemDboDataNotFoundException $e) {
		}

		$innerarrays = array();        # organizer of column arrays
		$xsarray[0] = 'categs';
		$groups = array();

		foreach ($this->series as $key) {             # fill xsarray with categories
			array_push($xsarray, KEY_PREFIX . $key);
		}

		# collect data by scanning through it
		$this->data=array();
		for ($i=0; $rtn && $i < count($rtn); $i++) {
			$this->addData($rtn[$i]);
		}

		# putting the data into arrays
		foreach ($this->ddData as $key=>$value) {
			$innerarrays[KEY_PREFIX . $key] = array(KEY_PREFIX . $key);
			array_push($groups, KEY_PREFIX . $key);
			foreach ($this->series as $ks) {

				$val = (isset($this->data[$key][$ks]) ? $this->data[$key][$ks] : 0);
				array_push($innerarrays[KEY_PREFIX . $key], $val);
			}
		}

		$cols = array($xsarray);
		foreach($innerarrays as $key => $value) {
			array_push($cols, $value);
		}

		$json = array();       # create object to serialize into json and write file
		$json['bindto'] = '#graph';
		$json['axis']['x']['type'] = 'category';
		$json['data']['type'] = 'bar';
		$json['data']['x'] = $xsarray[0];
		$json['data']['groups'] = array($groups);
		$json['data']['columns'] = $cols;

		$jtxt = json_encode($json, JSON_PRETTY_PRINT);
		file_put_contents($this->dataFile, $jtxt);
	}

	public function getChartDataByLocale() {

		$cnts = file_get_contents($this->dataFile);
		$names = array();
		$unscnts = json_decode($cnts, true);

		foreach ($this->ddData as $key=>$value) {
			$names[KEY_PREFIX . $key] = CalemMsg::getMsg($key);
		}

		$newnames = array('categs');
		foreach ($this->series as $key) {
			array_push($newnames, CalemMsg::getMsg($key));
		}
		array_shift($unscnts['data']['columns']);
		$unscnts['data']['names'] = $names;
		array_push($unscnts['data']['columns'], $newnames);
		return $unscnts;
	}
}
?>
