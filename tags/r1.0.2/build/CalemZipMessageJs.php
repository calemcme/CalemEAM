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
require_once _CALEM_DIR_ . 'server/include/util/MessageToJs.php';
require_once _CALEM_DIR_ . 'server/include/util/MessageToPhp.php';
require_once _CALEM_DIR_ . 'build/CalemZipBaseJs.php';

class CalemZipMessageJs extends CalemZipBaseJs {
	
	public function getJsmin() {
		return false;	
	}
	
	public function package() {
		//Getting the language list
		global $_CALEM_conf;
		$list=$_CALEM_conf['client_lang_list'];
		foreach ($list as $langfile=>$mapping) {
			if ($this->logger->isDebugEnabled()) {
				$this->logger->debug("Generating JS file: " . $langfile);	
			}
			$data="//Messages for Calem" . CALEM_LFCR;
			//added an array for php
			$ar=array();
			foreach ($mapping as $class=>$files) {
				$data .="//Message definition for " . $class . CALEM_LFCR;
		 	   $data .='function '. $class . '() {}' . CALEM_LFCR . CALEM_LFCR;
				foreach ($files as $file) {
					$fullname=_CALEM_DIR_ . 'client/lang/' . $file . '.properties';
					$data .= MessageToJs::fileToJs($class, $fullname);
					$ar= MessageToPhp::fileToPhp($fullname, $ar);
				}
			}
			//Store off php info
			$this->savePhp($langfile, $ar);
			//Now store off the data in a plain and gz file
			$this->nextProcess($langfile, $data);
		}
	}
	
	private function savePhp($langfile, $ar) {
		$idx=strpos($langfile, '.');
		$nf=substr($langfile, 0, $idx) . '.phpo';
		$fp=_CALEM_DIR_ . 'client/launchpad/resource/' . $nf;
		file_put_contents($fp, serialize($ar));
	}
}
?>

