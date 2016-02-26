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
require_once _CALEM_DIR_ . 'server/metadata/CalemTableMap.php';
require_once _CALEM_DIR_ . 'build/CalemZipDirectoryJs.php';

/**
 * Zip files per group and user
 */
class CalemZipGroupUserJs {
	
	public function package() {
		$groupDir= _CALEM_DIR_ . 'custom/group/';
		$this->packageByDir($groupDir);
		$userDir= _CALEM_DIR_ . 'custom/user/';
		$this->packageByDir($userDir);
	}
	
	public function packageByDir($dir) {
		$dirObj = dir($dir);
		//Enumerate each dir.
		global $_CALEM_conf;
		$list=$_CALEM_conf['calem_cutsom_set'];
		$subsets=array();
		foreach ($list as $idx) $subsets[$idx]='';
		while (false !== ($file=$dirObj->read())) {
			if (strpos($file, '.')!==false) continue; //Special files
			$fullName=$dir . $file . '/';			
			if (!is_dir($fullName)) continue;
			$dirHandler=new CalemZipDirectoryJs($fullName, $dir, $subsets, $file, false);
			$dirHandler->package();
		} 
	}		
}
?>
