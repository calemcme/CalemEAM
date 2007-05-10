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

require_once 'XML/Serializer.php';

/**
 * Test JS and XML encoding.
 */
class SoapEncodingTest extends PHPUnit2_Framework_TestCase {
	private $sz;
	
	public function __construct() {
		$this->sz = &new XML_Serializer(array (
											   'addDecl' => false,
											   'encoding' => 'UTF-8',
											   'indent' => '  ',
											   'rootName' => 'AuthResponse',
											   'rootAttributes' =>array('env:encodingStyle'=>"http://www.w3.org/2003/05/soap-encoding"),
											   'defaultTagName' => 'itm'));
	}
	/**
	 * Simple JS types of number and string.
	 */
	public function testSimpleJsEncoding() {
		$sid=123445689;
		$lifetime=12344565;
		$type='cookie';
		$bl=true;
		$bl2=false;
		$ar=array('sessionId'=>$sid, 'lifetime'=>$lifetime, 'type'=>$type, 'succ'=>$bl, 'lucky'=>$bl2);
		$response=json_encode($ar);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "**response=<br>" . $response;
			echo "<br>**end response<br>";
		}		
	}
	/**
	 * Test array data encoding in JSON
	 */
	public function testArrayJsEncoding() {
		$sid=123445689;
		$lifetime=12344565;
		$type='cookie';
		$bl=true;
		$bl2=false;
		$ar=array('sessionId'=>$sid, 'lifetime'=>$lifetime, 'type'=>$type, 'succ'=>$bl, 'lucky'=>$bl2);
		
		$ay=array('a'=>array('col1', 'col2'), 'b'=>array(array('23', '24'), array('33', '34')));
		
		$ar2=array('ok'=>true, 'AuthResponse'=>array($ar, $ar, $ar,$ar, $ay));
		
		$response=json_encode($ar2);
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "**json_encode response=<br>" . $response ."<br>";
		}
	}
	//Serialize data
	public function serializeXml($ar, $rootTag=null, $rootAttr=null) {
		$this->sz->setOption('rootName', $rootTag);
		$this->sz->setOption('rootAttributes', $rootAttr);
		
		// Serialize the data structure
		$status = $this->sz->serialize($ar);
		// Check whether serialization worked
		if (PEAR::isError($status)) {
		   die($status->getMessage());
		} 		
		$resp=$this->sz->getSerializedData();	
		return $resp;	
	}
	/**
	 * Simple simple XML types of number and string.
	 */
	public function testSimpleXmlEncoding() {
		$sid=123445689;
		$lifetime=12344565;
		$type='cookie';
		$bl=true;
		$bl2=false;
		$ar=array('sessionId'=>$sid, 'lifetime'=>$lifetime, 'type'=>$type, 'succ'=>$bl, 'lucky'=>$bl2);
		$resp=$this->serializeXml($ar, 'SimpleResponse');									   
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "**xml response=<br>" . htmlentities($resp) ."<br>";
		}
	}		
	
	/**
	 * Test array data encoding in XML
	 */
	public function testArrayXmlEncoding() {
		$sid=123445689;
		$lifetime=12344565;
		$type='cookie';
		$bl=true;
		$bl2=false;
		$ar=array('sessionId'=>$sid, 'lifetime'=>$lifetime, 'type'=>$type, 'succ'=>$bl, 'lucky'=>$bl2);
		$ar2=array('ok'=>true, 'AuthResponse'=>array($ar, $ar, $ar,$ar));
		$resp=$this->serializeXml($ar2, 'TestResponse');
		if (!isset($_ENV['CALEM_BATCH_TEST'])) {
			echo "**response=<br>" . htmlentities($resp) . "<br>";
		}
	}
}

if (!isset($_ENV['CALEM_BATCH_TEST'])) {
	$res=new SoapEncodingTest();
	//jsEncoding - json extension of php
	$res->testSimpleJsEncoding();
	$res->testArrayJsEncoding();
	//pear XML serializer.
	$res->testSimpleXmlEncoding();
	$res->testArrayXmlEncoding();
	echo "<br>SoapEncodingTest done<br>";
}

?>