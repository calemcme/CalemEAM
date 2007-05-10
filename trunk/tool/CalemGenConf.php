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

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

define('GEN_DATA_PATTERN', 'CalemGen');
define('LOG_PATH', _CALEM_DIR_ . 'tool/data/log/');

class CalemGenConf {
	
	//Collect configuration and add them to the list to be generated.
	public function getGenData() {
		include _CALEM_DIR_ . 'tool/GenConfList.php';
		$dataDir= _CALEM_DIR_ . 'tool/data/';
		$ar=array();
		//Enumerate each file.
		foreach ($_gen_conf_list as $file) {
			if (strpos($file, GEN_DATA_PATTERN)===false) continue;
			include $dataDir . $file;
			if (!$this->checkStatus($_CALEM_gen_data, $file)) continue;
			$ar[]=array('data'=>$_CALEM_gen_data, 'file'=>$file);
		}
		return $ar; 	
	}
	
	//reset conf if data is generated.
	public function setGenResults($data, $results) {
		$i=0;
		foreach ($data as $item) {
			if ($results[$i++]) {
				$logFile= LOG_PATH . $this->getLogFile($item['file']);
				file_put_contents($logFile, serialize($item));	
			}	
		}		 	
	}
	
	private function checkStatus($genData, $file) {
		$logFile= LOG_PATH . $this->getLogFile($file);
		return (!is_file($logFile) || $genData['regenerate']);
	}
	
	private function getLogFile($file) {
		$logFile=substr($file, 0, strlen($file)-4) . '.log';
		return $logFile;	
	}
}

?>
