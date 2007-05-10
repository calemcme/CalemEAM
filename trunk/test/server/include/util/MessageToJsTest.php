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
		chdir('../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/util/MessageToJs.php';	
require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';

class MessageToJsTest extends PHPUnit2_Framework_TestCase {
	
	//Test Ajax message
	public function testAjaxMessage() {
		$fullname=_CALEM_DIR_ . 'client/lang/AjxMsg.properties';
		$str=MessageToJs::fileToJs('AjxMsg', $fullname);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "message length=" . strlen($str) . "<br>";
			//echo $str;
			//echo "<br>";
		}
		$this->assertTrue($str && strpos($str, "numberLessThanEqualMin"));
	}
	
	/**
	 * This is a pure http post request. 
	 * This test is to show the real SOAP return to be sure.
	 */
	public function post($host, $port, $query, $others=''){
		$path=explode('/',$host);
		$host=$path[0];
		unset($path[0]);
		$path='/'.(implode('/',$path));
		$post="POST $path HTTP/1.1\r\nHost: $host\r\nContent-type: text/xml; charset: utf-8\r\nAccept-Encoding: gzip, deflate\r\n${others}User-Agent: Mozilla 4.0\r\nContent-length: ".strlen($query)."\r\nConnection: close\r\n\r\n$query";
		$h=fsockopen($host,$port);
		fwrite($h,$post);
		for($a=0,$r='';!$a;){
			$b=fread($h,1024);
			$r.=$b;
			$a=(($b=='')?1:0);
		}
		fclose($h);
		//Verify that the result status is correct.
		$idx=strpos($r, "\n");
		$status=substr($r, 0, $idx);
		$ar=explode(" ", $status);
		if ($ar[1] != '200') { //It's not OK from the server.
		   echo "response is not OK: status=" . $status . "\n<br>";
			$this->assertTrue(1!=1);
		}
		return $r;
	}
	
	//Test Ajax message without zip
	public function testAjaxMessageNoGzip() {
		global $_CALEM_conf;
		$endpoint = 'localhost' . $_CALEM_conf['calem_root_uri'] . '/client/JsMessages.php?';
		$query="";
		$response=$this->post($endpoint, 80, $query);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Uncompressed repsonse length=".strlen($response) ."<br>";
		}
		/*
		$fh=fopen(_CALEM_DIR_ . 'msg.txt', "w");
		fwrite($fh, $response);
		fclose($fh);
		*/
		$this->assertTrue(strlen($response)>10000);
		return strlen($response);
	}
	
	//Test Ajax message
	public function testAjaxMessageGzip() {
		//This is uncompressed length
		$len=$this->testAjaxMessageNoGzip();
		
		global $_CALEM_conf;
		$endpoint = 'localhost' . $_CALEM_conf['calem_root_uri'] . '/client/JsPkg.php?loadmode=gzip&js=CalemMsg';
		
		$query="";
		$response=$this->post($endpoint, 80, $query);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "Compressed repsonse length=".strlen($response);
		}
		/*
		$fh=fopen(_CALEM_DIR_ . 'msg.zip', "w");
		fwrite($fh, $response);
		fclose($fh);
		*/
		$this->assertTrue(strlen($response)< $len/2);
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new MessageToJsTest();
	$res->testAjaxMessage();
	$res->testAjaxMessageNoGzip();
	$res->testAjaxMessageGzip();
}
?>
