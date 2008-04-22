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

require_once _CALEM_DIR_ . 'server/include/JSON/JSON.php'; //Pear's JSON

class CalemConvertReport {
	private $json;
	private $dirChecked;
	
	public function __construct() {
		$this->json= new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
		$this->dirChecked=array();	
	}
	
	public function convert($srcPath, $srcFile) {
		$str=file_get_contents($srcPath . $srcFile);
		$idx=strpos($str, "{");
		$nStr=substr($str, $idx);
		$nStr=str_replace(';', '', $nStr);
		$dst=$this->getDstFile($srcPath, $srcFile);
		$phpo=$this->json->decode($nStr);
		if (!$phpo || !is_array($phpo) || count($phpo) < 1) {
			die("Error in converting report for: " . $srcPath . $srcFile);	
		}
		$phps=serialize($phpo);
		if ($GLOBALS['logger'] && $GLOBALS['logger']->isDebugEnabled()) {
			$GLOBALS['logger']->debug("To put file: " . $dst . ", content size=" . strlen($phps));	
		}
		file_put_contents($dst, $phps);
	}
	
	public function getDstFile($srcPath, $srcFile) {
		if (!isset($this->dirChecked[$srcPath])) {
			if (!file_exists($srcPath . REPORT_PATH)) {
				mkdir($srcPath . REPORT_PATH, DIR_WRITE_RIGHTS);
				if (!file_exists($srcPath . REPORT_PATH)) {
					die("Error in creating path at: " . $srcPath . REPORT_PATH);	
				}				
			}
			$this->dirChecked[$srcPath]=true;
		}
		$idx=strpos($srcFile, '.');
		$dstFile= $srcPath . REPORT_PATH . '/' . substr($srcFile, 0, $idx) . REPORT_EXT;	
		return $dstFile;
	}
}
?>
