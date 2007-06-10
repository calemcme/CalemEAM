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
require_once _CALEM_DIR_ . 'build/CalemZipBaseJs.php';

class CalemZipJustJs extends CalemZipBaseJs {
	private $resultMap;
	
	public function package() {
		//Getting the script list
		$conf=$this->getJsConf();
		if (is_array($conf)) {
			foreach($conf as $confItem) {
				$this->addConfItem($confItem);
			}	
		} else {
			$this->addConfItem($conf);
		}
		foreach ($this->resultMap as $mgFile=>$data) {
			$this->nextProcess($mgFile, $data);
		}
	}
	
	private function addConfItem($conf) {
		include $conf;
		foreach ($_CALEM_scripts as $mgFile=>$list) {
			$path=$list['path'];
			$files=$list['files'];
			$data="//Build $mgFile from $path" . CALEM_LFCR;
			foreach ($files as $file) {
				$fullPath=_CALEM_DIR_ . $path . $file;
				if (!is_file($fullPath)) {
					$this->logger->warn("Script file not found: " . $fullPath);
					echo "Script file not found: " . $fullPath . "\n<br>\n";
					continue;
				}
				$data .= file_get_contents($fullPath);
			}
			$this->addItemContent($mgFile, $data);
		}
	}
	
	private function addItemContent($mgFile, $data) {
		if (isset($this->resultMap) && isset($this->resultMap[$mgFile])) {
			$data=$this->resultMap[$mgFile] . CALEM_LFCR . $data;	
		}
		$this->resultMap[$mgFile]= $data;
	}
};
?>

