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
 
/**
 * To run Calem test one must set up the following:
 * - _CALEM_DIR_
 * - _CALEM_DIR_ . 'config/calem.php' is included already.
 */ 


//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'build/CalemZipBaseJs.php';

/**
 * Zip all the files per directory into one file.
 */
class CalemZipDirectoryJs extends CalemZipBaseJs {
	private $srcDir;
	private $destDir;
	private $subsets;
	private $target;
	private $zip;
	
	public function __construct($srcDir, $destDir, $subsets, $target, $zip=true) {
		parent::__construct();
		$this->srcDir=$srcDir;
		$this->destDir=$destDir;
		$this->subsets=$subsets;
		$this->target=$target;
		$this->zip=$zip;
	}
	
	public function getGzip() {
		return $this->zip;
	}
	
	public function package() {
		$dir = dir($this->srcDir);
		//Enumerate each file.
		while (false !== ($file=$dir->read())) {
			$fullName=$this->srcDir . $file;
			if (is_dir($fullName)) continue; //Don't process directory here.
			$js=file_get_contents($fullName);
			foreach ($this->subsets as $key=>$val) {
				if (strpos($file, $key)===false)  continue;
				$js = $this->convert($js, $file);
				$this->subsets[$key] = $val . $js . CALEM_LFCR;	
			}
		} 
		
		//Now store off the data in a plain and gz file
		foreach ($this->subsets as $key=>$val) {
			if (strlen($val) ==0) {
				$this->removePkgJs($key);
				continue;	
			}
			$js='/** Calem JS package */' . CALEM_LFCR . $val;
			$fileName = $this->getFileName($this->target, $key);
			$this->nextProcess($fileName, $js, $this->destDir);
		}
	}	
	
	public function convert($js) {
		return $js;	
	}
	
	public function getFileName($target, $key) {
		return $target . $key;
	}
	
	public function removePkgJs($key) {
		$ar=array('', '.min', '.gz');
		$file=$this->getFileName($this->target, $key);
		foreach ($ar as $val) {
			$fullPath= $this->destDir . $file . $val;
			if (is_file($fullPath)) unlink($fullPath);	
		}	
	}
}
?>
