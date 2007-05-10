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
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
//Pear soap client
require_once 'SOAP/Client.php';

/**
 * This class tests DbSetup class by creating a test database and drop it after
 * creation.
 */
class HttpClientTest extends PHPUnit2_Framework_TestCase {
	/**
	 * This is a pure http post request. 
	 * This test is to show the real SOAP return to be sure.
	 */
	public function post($host, $port, $query, $others=''){
		$path=explode('/',$host);
		$host=$path[0];
		unset($path[0]);
		$path='/'.(implode('/',$path));
		$post="POST $path HTTP/1.1\r\nHost: $host\r\nContent-type: text/xml; charset: utf-8\r\n${others}User-Agent: Mozilla 4.0\r\nContent-length: ".strlen($query)."\r\nConnection: close\r\n\r\n$query";
		$h=fsockopen($host,$port);
		fwrite($h,$post);
		for($a=0,$r='';!$a;){
			$b=fread($h,1024);
			$r.=$b;
			$a=(($b=='')?1:0);
		}
		fclose($h);
		return $r;
	}
	public function testInvalidMethod() {
		$logger=&LoggerManager::getLogger('testInvalidMethod');
		global $_CALEM_conf;
		$uri= 'localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';
		$endpoint = 'http://localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';
		
		$query="<?xml version=\"1.0\" encoding=\"UTF-8\"" . '?>' . "\r\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><soap:Header><context xmlns=\"urn:zimbra\"><nosession xmlns=\"\"/><format xmlns=\"\" type=\"js\"/></context></soap:Header><soap:Body><AuthRequest xmlns=\"urn:zimbraAccount\"><account xmlns=\"\" by=\"name\">calem</account><password xmlns=\"\">calem</password></AuthRequest></soap:Body></soap:Envelope>";
		$response=$this->post($uri, 80, $query);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b> response= </b> " . htmlentities($response) . "<br><br>";
		}
		$this->assertTrue(isset($response) && !(strpos($response, "<env:Body><env:Fault>")=== false)
													  && !(strpos($response, ">InvalidMethod</faultcode>")== false));		
	}
	
	/**
	 * Response is in xml format.
	 */
	public function testLoginXml() {
		$logger=&LoggerManager::getLogger('testLoginRequestXml');
		global $_CALEM_conf;
		$uri= 'localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';
		$endpoint = 'http://localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';
		
		$query="<?xml version=\"1.0\" encoding=\"UTF-8\"" . '?>' . "\r\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><soap:Header><context xmlns=\"urn:zimbra\"><nosession xmlns=\"\"/><format xmlns=\"\" type=\"js\">xml</format></context></soap:Header><soap:Body><Login xmlns=\"urn:login\"><account xmlns=\"\" by=\"name\">admin</account><password xmlns=\"\">admin_password</password></Login></soap:Body></soap:Envelope>";
		$response=$this->post($uri, 80, $query);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>XML response= </b>" . htmlentities($response) . "<br><br>";
		}
		$this->assertTrue(isset($response) && !(strpos($response, "<ns1:LoginResponse")=== false)
													  && !(strpos($response, "</ns1:LoginResponse>")=== false) );		
	}
	
	/**
	 * Response is in JSON format.
	 */
	public function testLoginJs() {
		$logger=&LoggerManager::getLogger('testLoginRequestJs');
		global $_CALEM_conf;
		$uri= 'localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';
		$endpoint = 'http://localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';
		
		$query="<?xml version=\"1.0\" encoding=\"UTF-8\"" . '?>' . "\r\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><soap:Header><context xmlns=\"urn:zimbra\"><nosession xmlns=\"\"/><format xmlns=\"\" type=\"js\">js</format></context></soap:Header><soap:Body><Login xmlns=\"urn:login\"><account xmlns=\"\" by=\"name\">admin</account><password xmlns=\"\">admin_password</password></Login></soap:Body></soap:Envelope>";
		$response=$this->post($uri, 80, $query);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "<b>JS response=</b>" . $response . "<br><br>";
		}
		$this->assertTrue(isset($response) && !(strpos($response, "{Body:{LoginResponse:{")=== false));			
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new HttpClientTest();
	$res->testInvalidMethod();
	$res->testLoginXml();
	$res->testLoginJs();
	echo "<br>Http client test done<br>";
}

?>