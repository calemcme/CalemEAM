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
require_once _CALEM_DIR_ . 'build/CalemZipDirectoryJs.php';

/**
 * Zip files per group and user
 */
class CalemZipCustomMetadataJs extends CalemZipDirectoryJs {
	
	public function __construct() {
		$srcDir= _CALEM_DIR_ . 'custom/global/metadata/';
		$dst= _CALEM_DIR_ . 'custom/global/';
		$subsets= array('.metadata'=>'');
		parent::__construct($srcDir, $dst, $subsets, 'custom', false);
	}
	
	//Convert files properly
	public function convert($content) {
		$obj=unserialize($content);
		return "CalemMetadataCustom['" . $obj['table_name'] . "']=" . json_encode($obj) . CALEM_SEP_LFCR;
	}	
	
	public function getFileName($target, $key) {
		return $target . $key . '.js';
	}
}
?>
