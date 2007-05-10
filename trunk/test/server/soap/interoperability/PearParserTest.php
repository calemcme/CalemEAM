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
//Parser
require_once 'SOAP/Parser.php';

/**
 * This class tests SOAP parser with/without headers.
 */
class PearParserTest extends PHPUnit2_Framework_TestCase {
	private $format;
	/**
	 * Parse the header to get the format.
	 */
	protected function setResponseFormat($reqhs) {
 		if (!$reqhs) return;
 		if (is_array($reqhs)) {
 			foreach ($reqhs as $reqh) {
 				$this->setResponseFormat($reqh);
			}
 		} elseif (is_array($reqhs->value)) { //The value is an array
 			$this->setResponseFormat($reqhs->value);
 		} elseif ($reqhs->name==='format') {
 			$this->format=strtoupper($reqhs->value);
 		}
	}
	/**
	 * Parse a soap request without headers.
	 */
	public function testRequestWithoutHeader() {
		$logger=&LoggerManager::getLogger('testRequestWithoutHeader');
		$query="<?xml version=\"1.0\" encoding=\"UTF-8\"" . '?>' . "\r\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><soap:Body><AuthRequest xmlns=\"urn:zimbraAccount\"><account xmlns=\"\" by=\"name\">calem</account><password xmlns=\"\">calem</password></AuthRequest></soap:Body></soap:Envelope>";
		$parser = new SOAP_Parser($query);
		$headers=$parser->getHeaders();
		$req=$parser->getResponse();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "**headers: ";
			//print_r($headers);
			//echo "<br>";
			//echo "**request: ";
			//print_r($req->value);
			//echo "<br>";
		}
		$this->assertTrue(!isset($headers) && isset($req) && is_a($req, 'SOAP_Value') && is_array($req->value));		
	}
	
	/**
	 * Single header <format>js</format>
	 */
	public function testRequestWithSingleHeader() {
		$logger=&LoggerManager::getLogger('testRequestWithSingleHeader');
		$xml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
      $xml .=" <SOAP-ENV:Envelope  xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"";
 		$xml .=" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"";
 		$xml .=" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"";
 		$xml .=" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\"";
 		$xml .=" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">";
		$xml .=" <SOAP-ENV:Header>";
		$xml .="<format xsi:type=\"xsd:string\" SOAP-ENV:actor=\"http://schemas.xmlsoap.org/soap/actor/next\" SOAP-ENV:mustUnderstand=\"0\">js</format>";
		$xml .=" </SOAP-ENV:Header>";
		$xml .=" <SOAP-ENV:Body>";
		$xml .="<LoginRequest><username xsi:type=\"xsd:string\">calem</username>";
		$xml .="<password xsi:type=\"xsd:string\">calem</password></LoginRequest>";
		$xml .="</SOAP-ENV:Body></SOAP-ENV:Envelope>";
		$parser = new SOAP_Parser($xml);
		$headers=$parser->getHeaders();
		$req=$parser->getResponse();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "**headers: ";
			//print_r($headers->value);
			//echo "<br>";
			//echo "**request: ";
			//print_r($req->value);
			//echo "<br>";
		}
		$this->assertTrue(isset($headers) && is_a($headers, 'SOAP_Value') && is_array($headers->value)
		                  && isset($req) && is_a($req, 'SOAP_Value') && is_array($req->value));
		$this->setResponseFormat($headers->value);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'format=' . $this->format ."<br>";
		}		
		$this->assertTrue(isset($this->format) && $this->format === 'JS');
		$this->format=false;
	}
	
	/**
	 * Composite headers <context><nosession></nosession><format type="js"
	 * ></format></context>
	 */
	public function testRequestWithCompositeHeaders() {
		$logger=&LoggerManager::getLogger('testRequestWithCompositeHeaders');
		$query="<?xml version=\"1.0\" encoding=\"UTF-8\"" . '?>' . "\r\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><soap:Header><context xmlns=\"urn:zimbra\"><nosession xmlns=\"\"/><format xmlns=\"\" type=\"js\">js</format></context></soap:Header><soap:Body><AuthRequest xmlns=\"urn:zimbraAccount\"><account xmlns=\"\" by=\"name\">calem</account><password xmlns=\"\">calem</password></AuthRequest></soap:Body></soap:Envelope>"; 
		$parser = new SOAP_Parser($query);
		$headers=$parser->getHeaders();
		$req=$parser->getResponse();
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "**headers: ";
			//print_r($headers->value);
			//echo "<br>";
			//echo "**request: ";
			//print_r($req->value);
			//echo "<br>";
		}
		$this->assertTrue(isset($headers) && is_a($headers, 'SOAP_Value') && is_array($headers->value)
		                  && isset($req) && is_a($req, 'SOAP_Value') && is_array($req->value));
		$this->setResponseFormat($headers->value);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo 'format=' . $this->format ."<br>";
		}		
		$this->assertTrue(isset($this->format) && $this->format === 'JS');		
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new PearParserTest();
	$res->testRequestWithoutHeader();
	$res->testRequestWithSingleHeader();
	$res->testRequestWithCompositeHeaders();
	echo "<br>PearParserTest done<br>";
}

?>