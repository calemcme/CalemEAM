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

require_once _CALEM_DIR_ . 'build/CalemConvertReportConf.php';
require_once _CALEM_DIR_ . 'build/CalemConvertReport.php';

class CalemConvertReportBatch {
	private $conv;
	private $count;
	
	public function process() {
		$conf=new CalemConvertReportConf();
		$this->conv = new CalemConvertReport();
		$this->count=0;
		$dirList=$conf->getConf();
		foreach ($dirList as $srcPath) {
			if (!file_exists($srcPath)) continue;
			$this->convertDir($srcPath);	
		}
		return $this->count;
	}
	
	private function convertDir($srcPath) {
		$d = dir($srcPath);
      while (false !== ($fn = $d->read())) {
      	if (strpos($fn, 'ReportMdTab') || strpos($fn, 'ReportRead') || strpos($fn, 'ReportList')) {
		   	$this->conv->convert($srcPath, $fn);
		   	$this->count++;
      	}
		}
		$d->close();	
	}
}
?>