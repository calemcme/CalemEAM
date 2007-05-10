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
require_once _CALEM_DIR_ . 'tool/CalemGenConf.php';

class CalemGenResource {
	protected $logger;
	
	//Construction
	public function __construct() {
		$this->logger=&LoggerManager::getLogger('CalemGenResource');
	}
	
	public function perform() {
		$conf=new CalemGenConf();
		$genData=$conf->getGenData();
		$ar=array();
		foreach ($genData as $item) {
			echo "Start processing: " . $item['data']['title'] . "<br>";
			$ar[]=$this->generate($item['data']);	
		} 
		$conf->setGenResults($genData, $ar);
	}
	
	public function generate($item) {
		$dataList=$item['dataList'];
		$rtn=false;
		
		foreach ($dataList as $element) {
			echo $element['file_src']['path'] . "->" . $element['file_dst']['path'] . "<br>";
			$dr = dir($element['file_src']['path']);

			while (false !== ($file= $dr->read())) {
				if (strpos($file, $element['file_src']['pattern'])===false) continue;
				$newFile=$this->getNewFile($element['file_src']['pattern'], $element['file_dst']['pattern'], $file);
				$this->logger->debug("old file: " . $file . ", new file: " . $newFile);
				$fullPath= $element['file_dst']['path'] . $newFile;
				if (is_file($fullPath) && !$item['overwrite']) {
					echo "Skipping $fullPath <br>";
					continue;
				}
				$ptn=$item['file_patterns'];
				if (isset($element['file_patterns'])) {
					$ptn = array_merge($element['file_patterns'], $ptn);
				}
				$this->genOneFile($file, $fullPath, $element, $ptn);
				$rtn=true;
			}
		}
		return $rtn;	
	}
	
	public function genOneFile($file, $fullPath, $item, $ptn) {
		$src=$item['file_src']['path'] . $file;
		$content=file_get_contents($src);
		foreach ($ptn as $oldPtn => $newPtn) {
			$content=str_replace($oldPtn, $newPtn, $content);	
		}	
		file_put_contents($fullPath, $content);
	}
	
	public function getNewFile($oldPtn, $newPtn, $file) {
		return str_replace($oldPtn, $newPtn, $file);
	}
}

?>
