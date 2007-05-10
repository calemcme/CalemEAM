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
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */ 

//Note that PHPUnit2 must be on the include path for it to work.
require_once 'PHPUnit2/Framework/TestCase.php';

if (!defined('_CALEM_DIR_')) {
	if (!isset($_ENV['CALEM_DIR'])) {
		chdir('../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	}   
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'build/CalemConvertReportConf.php';	
require_once _CALEM_DIR_ . 'build/CalemConvertReport.php';

class JsConvertReportTest extends PHPUnit2_Framework_TestCase {
	protected $conv;
	protected $testPath;
	protected $srcPath;
	
	public function setUp() {
		$this->conv=new CalemConvertReport();
		$this->testPath=_CALEM_DIR_ . 'test/server/build/';
		$this->srcPath= _CALEM_DIR_ . 'client/modules/workorder/form/report/';
		
		if (file_exists($this->testPath . REPORT_PATH)) {
			$d=dir($this->testPath . REPORT_PATH);
			while (false !== ($fn = $d->read())) {
			   if (strpos($fn, 'Report')===false) continue;
			   unlink($this->testPath . REPORT_PATH . '/' . $fn);
			}
			$d->close();	
		}
	}
	
	public function testConvertReportConf() {
		$conf=new CalemConvertReportConf();
		$dirList=$conf->getConf();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'dirList: ' . var_export($dirList, true) . "<br>\n";
		}
		//verify a few modules
		$this->assertTrue(count($dirList)>5);
	}
	
	public function startConvertFile($srcFile) {		
		copy($this->srcPath . $srcFile, $this->testPath . $srcFile);
		$this->assertTrue(file_exists($this->testPath . $srcFile));
		$this->conv->convert($this->testPath, $srcFile);
		$dstFp=$this->conv->getDstFile($this->testPath, $srcFile);
		$this->assertTrue(file_exists($dstFp));
		$phpsz=file_get_contents($dstFp);
		$phpo=unserialize($phpsz);
		$this->assertTrue(is_array($phpo));
		return $phpo;	
	}
	
	public function testConvertWoReportMdTab() {		
		$src='CalemWoReportMdTab.js';
		$phpo=$this->startConvertFile($src);
		//Some assertion here
		$obj=$phpo['CalemFormMdTabInfo'];
		$this->assertTrue(isset($obj['layout']) && isset($obj['model']) 
		                   && isset($obj['itemMap']));
	}
	
	public function testConvertWoReportRead() {
		$src='CalemWoReportRead.js';
		$phpo=$this->startConvertFile($src);
	}
	
	public function testConvertWoLaborReportList() {		
		$src='CalemWoLaborReportList.js';
		$phpo=$this->startConvertFile($src);
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new JsConvertReportTest();
	$res->testConvertReportConf();
	$res->setUp();
	$res->testConvertWoReportMdTab();
	$res->testConvertWoReportRead();
	$res->testConvertWoLaborReportList();
}
?>
