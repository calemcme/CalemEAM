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
//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

/**
 * Provide files based on:<p>
 * <ul>
 * <li> js file: js=CalemMsg
 * <li> language: lang=cn [empty or ja; default is us_en]. </li>
 * <li> file format: loadmode=aggr/gzip [single file or zip] </li>
 * </ul>
 */
class CalemIncludeJsPkg {
	private $logger;
	
	public function __construct() {
		$this->logger=&LoggerManager::getLogger('CalemIncludeJsPkg');
	}
	
	/**
	 * download a bunch of files in gz mode.
	 */
	public function downloadBulk($bulkList, $jsList=null) { 		
	 	//language
	 	global $_CALEM_conf;
		$lang=isset($_REQUEST['lang'])?$_REQUEST['lang']:$_CALEM_conf['client_language'];
		$ext=false;
		if ($lang) {
			$ext='_' . $lang;	
		}		
		//download mode
		$mode=isset($_REQUEST['loadmode'])?$_REQUEST['loadmode']:$_CALEM_conf['client_js_load_mode'];
		$zip=false;
		$zipIt=(count($bulkList)>1); //zipping more than 1 files using min.
		if ($mode == "gzip") {
			if ($encoding=CalemGzip::canGzip()) {
				$zip=true;
			}
			if ($zipIt) {//More than 1 files so must use min regardless.
				$mode_ext=$_CALEM_conf['client_js_custom_ext']['min'];
			} else if ($zip) {//single file case - could use a zip file.
				$mode_ext=$_CALEM_conf['client_js_custom_ext']['gzip'];
			} else {//zip not available.
				$mode_ext=$_CALEM_conf['client_js_custom_ext']['min']; //use min instead.
			}
		} else { //This is no gzip case.
			$mode_ext=$_CALEM_conf['client_js_custom_ext'][$mode];
		}
		
		//Now let's process file list here.
		$js='';
		foreach ($bulkList as $fileItem) {
			$fileName= ($fileItem['addLang'] && $ext) ? $fileItem['id'] . $ext : $fileItem['id'];
			$fileName .= $fileItem['ext'] . $mode_ext;
			if (is_file($fileName)) {
				$data = file_get_contents($fileName);
				$js .= $data;
				if ($this->logger->isDebugEnabled()) $this->logger->debug("adding file for download: " . $fileName);
			}	
		}
		//Add in text list if any
		if (isset($jsList)) {
			foreach ($jsList as $jsDef) {
				$js .= $jsDef;
				if ($this->logger->isDebugEnabled()) $this->logger->debug("adding jsDef for download: " . $jsDef);
			}	
		}
		//Needs to pipe through gz if it's zipped format.
		if ($zip && $zipIt) {
			$js= gzencode($js, $_CALEM_conf['server_gzip_rate']);	
		}
		
		if ($this->logger->isDebugEnabled()) {
			$this->logger->debug("Downloading JS by query: zip=" . $zip . ", mode=" . $mode_ext . ", fileCount=" . count($bulkList));	
		}
		
		//Disable browser side cache
		header('Cache-Control', 'no-cache');
		//Output data
		CalemGzip::gzStart();
		print $js;
		CalemGzip::gzEndFlush($zip, $encoding);
	}
}
?>
