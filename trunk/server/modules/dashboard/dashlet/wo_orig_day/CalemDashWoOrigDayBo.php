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
 * dash_wo_orig_day service class
 */
class CalemDashWoOrigDayBo extends CalemDashBo {
	protected $dbo;
	protected $ddDbo;

	public function __construct() {
		parent::__construct();
		$this->dbo=CalemFactory::getDbo('dash_wo_orig_day');
		$this->ddDbo=CalemFactory::getDropdown('wo_origin');
 	}

 	//Check for data changes
 	public function getDataChanged() {
 		$mt=filemtime($this->dataFile);
 		if (mktime() - $mt <= $this->conf['ttl']) return false;
 		$rtn=false;
 		try {
 			$stime=CalemText::getServerDateTime($mt);
 			$cnt=$this->dbo->getCountBySqlParam($this->getSqlCheck(), array($stime));
 			$rtn = ($cnt > 0);
 		} catch (CalemDboDataNotFoundException $e) {
 		}
 		return $rtn;
 	}

 	public function getSqlCheck() {
 	 	return 'select count(*) from dash_wo_orig_day where modified_time > ?';
 	}

 /* this method generates a json file of information to be fed into c3.generate()
	* to create graphs for the WO Misc tab of the dashboard for the graph
	* "WO Created Daily by Organization"
	*/
	public function generateChartData() {

		$conf = $this->conf['dash_wo_orig_day'];
		$limit = $conf['limit'];
		$startTime = strtotime($limit . " day ago");          # set time frame
		$startDate = CalemText::getServerDate($startTime);

  	$rtn = null;
		try {
			$rtn = $this->dbo->fetchBySqlParam('select * from dash_wo_orig_day
																				 where id >= ? order by id', array($startDate));
		} catch (CalemDboDataNotFoundException $e) {
		}
		$ddData = $this->ddDbo->getData();
		$columnarray = array();                # array to organize all data

		foreach ($ddData as $key => $val) {    # create arrays for each key id
			$columnarray[$key] = array(KEY_PREFIX . $key);
		}

		# first, initialize dates array because line graph's x is timeseries
		$dates = array('dates');

		# this loop fills columnarray's inner arrays
		for ($idx=0; $rtn && $idx < count($rtn); $idx++) {

			$dbDate = $rtn[$idx]['id'];
			while ($startDate < $dbDate) {

				list($dates, $columnarray, $startDate, $startTime) =
				$this->unserializeOneDay($startDate, $startTime, null, $dates, $columnarray);
			}
			list($dates, $columnarray, $startDate, $startTime) =
			$this->unserializeOneDay($startDate, $startTime, $rtn[$idx]['counts'],
			$dates, $columnarray);
		}

		$today = CalemText::getServerDate();

		# check that all values have been added that should be added
		while ($startDate <= $today) {
			list($dates, $columnarray, $startDate, $startTime) =
			$this->unserializeOneDay($startDate, $startTime, null, $dates, $columnarray);
		}

		array_push($columnarray, $dates);   # lastly, add dates array to columnarray
		$cols = array();                    # move all completed arrays to array of arrays

		foreach ($columnarray as $key => $val) {  # transfer the array objects
			array_push($cols, $val);							  # in $columnarray to $cols
		}
		# create and fill object to json serialize and fill file
		$paramsForC3 = array();
		$paramsForC3['bindto'] = '#graph';
		$paramsForC3['grid'] = array('y' => array('show' =>  true));
		$paramsForC3['axis'] = array('x' => array('type' =>  'timeseries',
																							'tick' =>  array('format' => '%Y-%m-%d',
																															 'rotate' => 45)));
																															 # rotate axis labels for scaling
		$paramsForC3['data']['x'] = 'dates';
		$paramsForC3['data']['columns'] = $cols;

		$jsontxt = json_encode($paramsForC3, JSON_PRETTY_PRINT);

		file_put_contents($this->dataFile, $jsontxt);
	}

 /* invoker: generateChartData
  * deserializes the data from one day and updates the appropriate arrays
	* of information with the deserialized values of wo for each day
	*/
	public function unserializeOneDay($startDate, $startTime, $counts, $datesArray, $graph) {
		# $data initialized as array of values of wo type => quantity of wo created on that day
		$data = $counts ? unserialize($counts) : array();

		# add the startdate onto the array of dates
		array_push($datesArray, $startDate);

		foreach ($graph as $key=>$val) {

			$quantity = $data[$key];        # how many wo were created that day
			array_push($graph[$key], ($quantity ? $quantity : 0));
		}

		# update the date/time for next iteration for the invoker
		$startTime = strtotime("+1 day", $startTime);
		$startDate = CalemText::getServerDate($startTime);

		return array($datesArray, $graph, $startDate, $startTime);
	}

 /* sets the names of the data to be displayed to user
	* must be by locale since people use different languages
	*/
	public function getChartDataByLocale() {
  	$cnts = file_get_contents($this->dataFile);
  	$ddData=$this->ddDbo->getData();
  	$names = array();
  	foreach ($ddData as $key=>$value) {
    	$names[KEY_PREFIX . $key] = CalemMsg::getMsg($key);
  	}
  	$unscts = json_decode($cnts, true);
		$unscts['data']['names'] = $names;  # set names for data sets on graph
  	return $unscts;
  }

	//Data change listeners
	public function onDataInserted_CalemWoDbo($dataPkt) {
		$id=CalemText::datetimeToDate($dataPkt['baseData']['orig_time']);
		$orig=$dataPkt['baseData']['origin_id'];
		$this->incCount($id, $orig);
	}

	//Updated listener
	public function onDataUpdated_CalemWoDbo($dataPkt) {
		$old_id=CalemText::datetimeToDate($dataPkt['baseCurrent']['orig_time']);
		$old_orig=$dataPkt['baseCurrent']['origin_id'];
		$new_id=CalemText::datetimeToDate($dataPkt['baseUpdate']['orig_time'] ? $dataPkt['baseUpdate']['orig_time'] : $dataPkt['baseCurrent']['orig_time']);
		$new_orig=$dataPkt['baseUpdate']['origin_id'] ? $dataPkt['baseUpdate']['origin_id'] : $dataPkt['baseCurrent']['origin_id'];
		if ($old_id==$new_id && $old_orig==$new_orig) return; //No operation needed.
		if ($old_id && $old_orig) $this->decCount($old_id, $old_orig);
		if ($new_id && $new_orig) $this->incCount($new_id, $new_orig);
	}

	//Deleted listener
	public function onDataDeleted_CalemWoDbo($dataPkt) {
		$id=CalemText::datetimeToDate($dataPkt['baseData']['orig_time']);
		$orig=$dataPkt['baseData']['origin_id'];
		if ($id && $orig) $this->decCount($id, $orig);
	}

	//Utilities function
	// -add count
	// -dec count
	public function incCount($id, $orig) {
		$this->modifyCount($id, $orig, 1);
	}

	public function decCount($id, $orig) {
		$this->modifyCount($id, $orig, -1);
	}

	public function modifyCount($id, $orig, $count) {
		try {
			$row=$this->dbo->fetchById($id);
			if ($row['counts']) {
				$counts=unserialize($row['counts']);
				if (is_array($counts)) {
					$counts[$orig]=$counts[$orig]+$count;
				} else {
					$counts[$orig]=$count;
				}
			} else {
				$counts[$orig]=$count;
			}
			$counts[$orig]=max($counts[$orig],0);
			$this->dbo->setValue('counts', serialize($counts));
			$this->dbo->setIdForUpdate($id);
			$this->dbo->update();
		} catch (CalemDboDataNotFoundException $e) {
			$cnt=max($count, 0);
			$counts=array($orig=>$cnt);
			$this->dbo->setChangeBulk(array('id'=>$id, 'counts'=>serialize($counts)));
			$this->dbo->insert();
		}
	}
}
?>
