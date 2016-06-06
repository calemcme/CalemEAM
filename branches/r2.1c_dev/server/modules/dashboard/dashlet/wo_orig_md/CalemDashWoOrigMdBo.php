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

require_once _CALEM_DIR_ . 'server/modules/dashboard/dashlet/wo_orig_day/CalemDashWoOrigDayBo.php';

/**
 * dash_wo_orig_day service class
 */
class CalemDashWoOrigMdBo extends CalemDashWoOrigDayBo {

	public function __construct() {
		parent::__construct();
		$this->dbo=CalemFactory::getDbo('dash_wo_orig_md');
 	}

 	public function getSqlCheck() {
 	 	return 'select count(*) from dash_wo_orig_md where modified_time > ?';
 	}

	/**
	 * Update local data file - data collection for the report.
	 * for wo orig md
	 */
	public function generateChartData() {
	  $conf=$this->conf['dash_wo_orig_md'];
	  //First of all, let's get data out.
	  $rtn=null;
	  try {
	    $rtn=$this->dbo->fetchBySql('select * from dash_wo_orig_md order by id');
	  } catch (CalemDboDataNotFoundException $e) {
	  }
	  //Next let's prepare data for the charts

	  $ddData = $this->ddDbo->getData();            # get data
	  $datesArray = array('dates');
	  $colarrays = array();                         # will be array of strings, but we need an array of arrays

	  foreach ($ddData as $key=>$val) {
	    $colarrays[$key] = array(KEY_PREFIX . $key);
	  }

	  //Now walk through the data in steps.
	  $thisMd = gmdate('Y-m-01');
	  $startMd = null;
	  for ($idx = 0; $rtn && $idx < count($rtn); $idx++) {
	    $dbMd = $rtn[$idx]['id'];
	    if (!$startMd) {
	      $startMd = $dbMd;
	      $startTime = CalemText::parseServerDate($startMd);
	    } else {
	      while ($startMd < $dbMd) {
	        list($datesArray, $colarrays, $startMd, $startTime) =
	        $this->unserializeOneDay($startMd, $startTime, null, $datesArray, $colarrays);
	      }
	    }
	    list($datesArray, $colarrays, $startMd, $startTime) =
	    $this->unserializeOneDay($startMd, $startTime, $rtn[$idx]['counts'], $datesArray, $colarrays);
	  }
	  //Let's make sure we're done here
	  if (!$startMd) {//No data points
	    list($datesArray, $colarrays, $startMd, $startTime) =
	    $this->unserializeOneDay($thisMd, null, null, $datesArray, $colarrays);
	  } else {
	    while ($startMd <= $thisMd) {
	      list($datesArray, $colarrays, $startMd, $startTime) =
	      $this->unserializeOneDay($startMd, $startTime, null, $datesArray, $colarrays);
	    }
	  }
	  //Now assemble the info together.
	  $finalcolarrays = array($datesArray);
	  foreach ($colarrays as $key=>$val) {
	    array_push($finalcolarrays, $val);
	  }

	  $json = array();
	  $json['bindto'] = '#graph';
	  $json['grid']['y']['show'] = true;
	  $json['axis']['x']['type'] = 'timeseries';
	  $json['axis']['x']['tick']['format'] = '%Y-%m-%d';
	  $json['data']['x'] = 'dates';
	  $json['data']['columns'] = $finalcolarrays;
	  $jsontxt = json_encode($json, JSON_PRETTY_PRINT);

	  file_put_contents($this->dataFile, $jsontxt);
	}

	public function unserializeOneDay($startMd, $startTime, $counts, $datesArray, $colarrays) {

	  $data = $counts ? unserialize($counts) : array();
	  array_push($datesArray, $startMd);
	  foreach ($colarrays as $key=>$val) {
	    $quantity = $data[$key] ? $data[$key] : 0;
	    array_push($colarrays[$key], $quantity);
	  }
	  if ($startTime!=null) {
	    $startTime=strtotime("1 month", $startTime);
	    $startMd=gmdate('Y-m-01', $startTime);
	  }
	  return array($datesArray, $colarrays, $startMd, $startTime);
	}

	public function getMdByServerDatetime($dt) {
		$dt=CalemText::parseServerDatetime($dt);
		return gmdate('Y-m-01', $dt);
	}

	//Data change listeners
	public function onDataInserted_CalemWoDbo($dataPkt) {
		$id=$this->getMdByServerDatetime($dataPkt['baseData']['orig_time']);
		$orig=$dataPkt['baseData']['origin_id'];
		$this->incCount($id, $orig);
	}

	//Updated listener
	public function onDataUpdated_CalemWoDbo($dataPkt) {
		$old_id=$this->getMdByServerDatetime($dataPkt['baseCurrent']['orig_time']);
		$old_orig=$dataPkt['baseCurrent']['origin_id'];
		$new_id=$this->getMdByServerDatetime($dataPkt['baseUpdate']['orig_time'] ? $dataPkt['baseUpdate']['orig_time'] : $dataPkt['baseCurrent']['orig_time']);
		$new_orig=$dataPkt['baseUpdate']['origin_id'] ? $dataPkt['baseUpdate']['origin_id'] : $dataPkt['baseCurrent']['origin_id'];
		if ($old_id==$new_id && $old_orig==$new_orig) return; //No operation needed.
		if ($old_id && $old_orig) $this->decCount($old_id, $old_orig);
		if ($new_id && $new_orig) $this->incCount($new_id, $new_orig);
	}

	//Deleted listener
	public function onDataDeleted_CalemWoDbo($dataPkt) {
		$id=$this->getMdByServerDatetime($dataPkt['baseData']['orig_time']);
		$orig=$dataPkt['baseData']['origin_id'];
		if ($id && $orig) $this->decCount($id, $orig);
	}
}
?>
