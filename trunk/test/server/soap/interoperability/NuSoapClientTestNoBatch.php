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
require _CALEM_DIR_ . 'test/server/include/nusoap/lib/nusoap.php';

/**
 * This class tests DbSetup class by creating a test database and drop it after
 * creation.
 */
class NuSoapClientTest extends PHPUnit2_Framework_TestCase {
	/**
	 * This is an invalid method so a fault should be returned.
	 */
	public function testInvalidMethod() {
		$logger=&LoggerManager::getLogger('testInvalidMethod');
		global $_CALEM_conf;
		$uri= 'localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';
		$endpoint = 'http://localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';

		$param = array('rate'=>25,'sub'=>24);
 		$client = new soap_client($endpoint);
		$ans = $client->call('LoginRequest_notdefined', $param);
 		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			print_r($ans);
			echo '<br>';
		}
 		//Validate that this is a SOAP fault
		$this->assertTrue(isset($ans) && is_array($ans) && strcmp($ans['faultcode'], 'InvalidMethod')==0 );
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "err=" . $ans['faultcode'] . "<br>";
		}		
	}
	
	/**
	 * Return is in JSON format.
	 */
	public function testLoginJs() {
		$logger=&LoggerManager::getLogger('testLoginRequestJs');
		global $_CALEM_conf;
		$uri= 'localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';
		$endpoint = 'http://localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';

 		$soap = new soap_client($endpoint);
 		$soap->setHeaders(array(new soapval('format', false, 'js')));
 		$method = 'Login';
 		$username = 'admin';
 		$password = 'admin_password';
 		$params = array('username' => $username, 'password' => $password);
 		$soap->setDebugLevel(9);
 		$ans = $soap->call($method, $params);
 		$debug=$soap->getDebug();
 		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			//echo "<br>JsResponse: <br>";
			$idx=strpos($debug, '{Body:{LoginResponse:{');
			echo substr($debug, $idx, 80) ."<br>";
			
		}	
 		//Validate that this is a SOAP fault
		$this->assertTrue(!(strpos($soap->getDebug(), "{Body:{LoginResponse:{")===false) );	
	}
	
	/**
	 * Return is in XML format.
	 */
	public function testLoginXml() {
		$logger=&LoggerManager::getLogger('testLoginRequestXml');
		global $_CALEM_conf;
		$uri= 'localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';
		$endpoint = 'http://localhost' . $_CALEM_conf['calem_root_uri'] . '/CalemSoapService.php';

 		$soap = new SOAP_Client($endpoint);
 		$method = 'Login';
 		$username = 'admin';
 		$password = 'admin_password';
 		$params = array('username' => $username, 'password' => $password);
 		$ans = $soap->call($method, $params);
 		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
 			echo "<br>XmlResponse: <br>";
			print_r($ans);
		}	
 		//Validate that this is a SOAP fault
		$this->assertTrue(isset($ans) && !is_a($ans, 'SOAP_Fault')
							&& is_array($ans) && isset($ans['sessionId']) && isset($ans['validityPeriod']));	
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new NuSoapClientTest();
	$res->testInvalidMethod();
	$res->testLoginJs();
	$res->testLoginXml();
	echo "<br>NuSoapClientTest done!<br>";
}

?>
