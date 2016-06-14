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
class CalemDashWoStatusPieBo extends CalemDashBo {
	protected $dbo;
	protected $ddDbo;

	public function __construct() {
		parent::__construct();
		$this->dbo=CalemFactory::getDbo('workorder');
		$this->ddDbo=CalemFactory::getDropdown('wo_status');
 	}

 	//Check for data changes
 	public function getDataChanged() {
 		$mt=filemtime($this->dataFile);
 		return (mktime()-$mt > $this->conf['dash_wo_status_pie']['ttl']);
 	}

	/**
	 * Update local data file - data collection for the report.
	 */
	public function generateChartData() {

		try {
			$rtn = $this->dbo->fetchBySql('select status_id, count(*) as cnt from workorder group by status_id order by cnt DESC');
		} catch (CalemDboDataNotFoundException $e) {
		}

		$cols = array();                             # array to organize column data
		$proc = array();

		for ($i = 0; $rtn && $i < count($rtn); $i++) {
			$id = $rtn[$i]['status_id'];
			$proc[$id] = true;
			$cols[$i] = array(KEY_PREFIX . $id, $rtn[$i]['cnt']);
		}
		$ddData = $this->ddDbo->getData();
		foreach ($ddData as $key=>$val) {
			if ($proc[$key]) continue;
			array_push($cols, array(array(KEY_PREFIX . $key, 0)));
		}

		# set up array object to serialize into json file
		$json = array();
	  $json['bindto'] = '#graph';
	  $json['data']['type'] = 'donut';
	  $json['data']['columns'] = $cols;
	  $jsontxt = json_encode($json, JSON_PRETTY_PRINT);
	  file_put_contents($this->dataFile, $jsontxt);
	}

	# adjusts the name labels for the pie chart based on the user's locale
	public function getChartDataByLocale() {

		$cnts = file_get_contents($this->dataFile);
		$ddData=$this->ddDbo->getData();

		# for donut charts, can't simply map names to each other; use string replace
		foreach ($ddData as $key=>$value) {
			$cnts = str_replace(KEY_PREFIX . $key, CalemMsg::getMsg($key), $cnts);
		}
		$unscnts = json_decode($cnts, true);
		return $unscnts;
	}
}
?>
