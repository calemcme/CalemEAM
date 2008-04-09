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

require_once _CALEM_DIR_ . 'build/CalemZipMetadataJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipMessageJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipJustAjaxJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipJustCalemJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipGroupUserJs.php';
require_once _CALEM_DIR_ . 'build/CalemBuildCache.php';

require_once _CALEM_DIR_ . 'build/CalemZipCustomMetadataJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipCustomDropdownJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipCustomMessageAllJs.php';

require_once _CALEM_DIR_ . 'build/CalemConvertReportBatch.php';

class CalemZipJs {

	public function createDir($d, $r=DIR_WRITE_RIGHTS) {
		if (!is_dir($d)) mkdir($d, $r);	
	}
	
	/**
	 * Build directories for the system.
	 */
	public function buildDirectories() {
		// -- client directories
		$this->createDir(_CALEM_DIR_ . 'logs');
		
		$this->createDir(_CALEM_DIR_ . 'client/launchpad/resource');
		
		// -- server directories
		$this->createDir(_CALEM_DIR_ . 'server/cache');
		$this->createDir(_CALEM_DIR_ . 'server/cache/data');
		$this->createDir(_CALEM_DIR_ . 'server/cache/default');
		$this->createDir(_CALEM_DIR_ . 'server/cache/session');
		
		// -- custom directories
		$this->createDir(_CALEM_DIR_ . 'custom/global');
		$this->createDir(_CALEM_DIR_ . 'custom/global/dropdown');
		$this->createDir(_CALEM_DIR_ . 'custom/global/message');
		$this->createDir(_CALEM_DIR_ . 'custom/global/metadata');
		
		$this->createDir(_CALEM_DIR_ . 'custom/group/CUSTOM_SYSTEM');
		
		$this->createDir(_CALEM_DIR_ . 'custom/user');	
	}
	
	/**
	 * Initialize cache 
	 */
	public function buildCache() {
		$cacheBuilder=new CalemBuildCache();
		$cacheBuilder->buildCache();
	}
	
	public function zipJs($build) {
		if (!$build) return;
		//Allow sufficient time
		set_time_limit(0);
		/**
		 * Recompress all the files
		 */
		$ajax=new CalemZipJustAjaxJs();
		$ajax->process();
		$calemeam=new CalemZipJustCalemJs();
		$calemeam->process();
		
		$metadata=new CalemZipMetadataJs();
		$metadata->process();
		$message=new CalemZipMessageJs();
		$message->process();
		
		$groupUser=new CalemZipGroupUserJs();
		$groupUser->package();
	
		//Global custom info
		$md=new CalemZipCustomMetadataJs();
		$md->package();
	
		$md=new CalemZipCustomDropdownJs();
		$md->package();
		
		$md=new CalemZipCustomMessageAllJs();
		$md->package();
		
		//Converting report
		$tmRpt=microtime(true);
		$rpt=new CalemConvertReportBatch();
		$countRpt=$rpt->process();
		return array('reportTime'=>array('start'=>$tmRpt, 'end'=>microtime(true)));	
	}
	
	/**
	 * Main entry point.
	 */
	public function execute($build=false) {
		$this->buildDirectories();
		$time=$this->zipJs($build);
		$this->buildCache();
		return $time;
	}
}
?>
