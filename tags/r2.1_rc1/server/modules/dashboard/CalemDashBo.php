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

require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemMsg.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';

/**
 * Common function for dash BO
 */
class CalemDashBo extends CalemBo {
	protected $conf;	
	protected $id;
	protected $settings;
	protected $dataFile;
	
	public function __construct() {
		parent::__construct();
		global $_CALEM_conf;	
 		$this->conf=$_CALEM_conf['dash_conf'];
 	}
 	
 	public function init($id, $stg, $data) {
 		$this->id=$id;
 		$this->settings=$stg;	
 		$this->dataFile=$data;
 	}
 	
 	public function getSettings($reload=false) {
 		return is_file($this->settings) ? file_get_contents($this->settings) : '';	
 	}
 	
 	public function getSettingsByLocale() {
 		$stg=$this->getSettings();
 		$stg=str_replace($this->conf['decimal_holder'], $this->conf['decimal_sep'], $stg);
 		return str_replace($this->conf['title_holder'], CalemMsg::getMsg($this->id), $stg);	
 	}
 	
 	public function get_settings() {
 		CalemGzip::gzContents($this->getSettingsByLocale(), $this->conf['gzip'], $this->logger);
 	}
 	
 	public function get_data($reload=false) {
 		$data=$this->getChartData($reload);
 		CalemGzip::gzContents($data, $this->conf['gzip'], $this->logger);
 	}
 	
 	/**
 	 * Load data includes:
 	 * a) reconstruct data if server data is changed
 	 * b) replace with local strings when data is created
 	 */
 	public function getChartData($reload=false) {
 		if ($reload || !is_file($this->dataFile) || $this->getDataChanged()) {
 			$this->generateChartData();	
 		}
 		return $this->getChartDataByLocale(); 		
 	}
 	
 	public function getId() {
 		return $this->id;
 	}
 	
 	public function getDataFile() {
 		return $this->dataFile;	
 	}
}
 	
?>
