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

class CalemZipBaseJs {
	protected $logger;
	protected $textjs;
	protected $jsmin;
	protected $gzjs;
	protected $minHdlr;
	
	//Construction
	public function __construct() {
		$this->logger=&LoggerManager::getLogger('CalemZipBaseJs');
		global $_CALEM_conf;
		$jsconf=$_CALEM_conf['jsminClass'];
		require_once _CALEM_DIR_ . $jsconf['path'] . '/' . $jsconf['class'] . '.php';
		$this->minHdlr=new $jsconf['class'];
	}
	
	public function process() {
		$this->package();
	}
	
	/**
	 * Generate .gz, .min files
	 * @param $target - the target file to store the $js
	 * @param $js - the JS script files
	 * @param $path - where the generated files are saved.
	 */
	public function nextProcess($target, $js, $path=null) {
		//Check if we have $js at all
		if (strlen($js)==0) return;
		
		if (!isset($path)) {
			$path=_CALEM_DIR_ . 'client/launchpad/resource/';	
		}
		//Store off the source and min, gz
		$this->textjs= $path . $target;
		file_put_contents($this->textjs, $js);
		if ($this->logger->isDebugEnabled()) $this->logger->debug("Saved off file in " . $this->textjs);
		
		//Now store off the data in a plain and gz file	
		$this->gzjs=$this->textjs . '.gz';
		$this->jsmin=$this->textjs . '.min';
		
		//further processing here.
		if ($this->getJsmin()) {
			$this->jsmin($this->textjs, $this->jsmin);	
		} else {
			$this->copyJsmin();
		}
		if ($this->getGzip()) {
			$this->gz($this->jsmin, $this->gzjs);
		}	
	}
	
	public function getJsmin() {
		return false;	
	}
	
	public function getGzip() {
		return true;	
	}
	
	public function jsmin($src, $dest) {
		if (!$this->minHdlr->jsmin($src, $dest)) {//do without jsmin here
			$this->copyJsmin();
		}
	}
	
	public function copyJsmin() {
		if (!copy($this->textjs, $this->jsmin)) {
			$err="Error in copying file from " . $this->textjs . " -> " . $this->jsmin;
			$this->logger->error($err);
			echo $err . "<br>\n";	
		}	
	}
	
	public function gz($src, $dest) {		
		$content=file_get_contents($src);
		//zip js 
		$handle=gzopen($dest, 'w9');
		gzwrite($handle, $content);
		gzclose($handle);
		$this->logger->debug("gz file saved at " . $dest);
	}
}

?>
