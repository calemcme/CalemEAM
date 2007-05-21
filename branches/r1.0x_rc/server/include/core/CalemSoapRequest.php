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

require_once _CALEM_DIR_ . 'server/conf/soap_map.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemExit.php';
require_once _CALEM_DIR_ . 'server/include/core/session/CalemSession.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';

require_once 'SOAP/Base.php';
require_once 'XML/Serializer.php';

/**
 * This is the CalemSoapRequest handler base
 */
 class CalemSoapRequest {
 	/**
         * @todo there're issues related to XML format.
         * It appears to do with the way the XML doc is morphed into JSON.
         */
 	protected $responseFormat;
 	protected $logger;
 	protected $reqHeaders;
 	protected $method;
 	protected $methodResponse;
 	protected $params;
 	//Configuration
 	protected $contentType;
 	//Soap object for parsing
 	protected $soapBase;
 	//xml serializer
 	protected $sz;
 	
 	public function __construct() {
 		$this->logger=&LoggerManager::getLogger('CalemSoapRequest');
 		if ($this->logger->isDebugEnabled()) { //For debug test purpose only.
	 		$this->method="unknown";
	 		$this->methodResponse="unknownResponse";
 		}
 		$this->soapBase=new SOAP_Base();
 		//set default output format
 		global $_CALEM_conf;
 		$this->responseFormat = $_CALEM_conf['default_soap_output_format'];
 		//Build the serialization object
 		$this->sz = &new XML_Serializer($_CALEM_conf['calem_xml_serializer_option']);
 	}
 	
 	/**
 	 * This is the main soap service entry
 	 * @param Array SOAP request headers
 	 * @param String SOAP request method
 	 * @param Array SOAP request parameters
 	 * @return mixed results
 	 */
 	public function service($reqHeaders, $method, $params) {
 		try {
	 		$this->reqHeaders=$reqHeaders;
	 		$this->method=$method;
	 		$this->methodResponse = $method . 'Response';
	 		$this->params=$params;
	 		if ($this->authenticationRequired() && !$this->authenticate()) {
	 			$this->sendFault(CALEM_SF_NO_SESSION, 'No active session'); //Exit from here
	 		}
	 		//Set up response format now
	 		$this->setResponseFormat($this->reqHeaders);
	 		//Let's dispatch the call now.
	 		$response=call_user_func(array($this, $this->method));
	 		if (!$response || !is_array($response)) {
	 			$this->sendFault(CALEM_SF_UNKNOWN);
	 		}
	 		//Encode the result properly
	 		$env=call_user_func(array($this, 'encodeResponse_'.$this->responseFormat), $response);
	 		global $_CALEM_conf;
	 		$this->sendResponse($_CALEM_conf['calem_soap_status'], $env, $this->gzipIt());
 		} catch (CalemSoapException $ce) {
 			$this->logger->error("Error in processing soap request: " . $e->getMessage());
 			$this->sendFault($ce->getCode(), $e->getMessage());
 		} catch (Exception $e) {
 			$this->logger->error("Error in processing soap request: " . $e->getMessage());
 			$this->sendFault(CALEM_SF_UNKNOWN, $e->getMessage());
 		} 
 	}
 	
 	/**
 	 * fetch params
 	 */
 	public function getParamValue($n=0) {
 		if ( !isset($this->params) || $n > count($this->params) ) return null;
 		return $this->soapBase->_decode($this->params[$n]);
 	}
 	
 	/**
 	 * Serialize using Pear's XML serializer
 	 */
	public function serializeXml($data, $rootTag, $rootAttr=null) {
		//Reset given options
		$this->sz->setOption('rootName', $rootTag);
		if (isset($rootAttr)) $this->sz->setOption('rootAttributes', $rootAttr);
		
		// Serialize the data structure
		$status = $this->sz->serialize($data);

		// Check whether serialization worked
		if (PEAR::isError($status)) {
			throw new Exception($status->getMessage());
		} 		
		$resp=$this->sz->getSerializedData();	
		return $resp;	
	}
 	/**
 	 * Encode response in XML format
 	 * @param Array Response
 	 * Use PEAR's XML Serializer to generate the xml from php response.
 	 */
 	public function encodeResponse_XML($response) {
 		$xml= $this->serializeXml($response, "ns1:". $this->methodResponse);
 		return $this->packageSoapResponse($xml);
 	}
 	
 	/**
 	 * Encode response in JSON format
 	 * @param array array of elements
 	 * If the response has an array element then each element of the array should
 	 * be an array and will be translated to JavaScript array.
 	 * The conversion is done using json_encode utility by enabling json extesion 
 	 * in php.ini.
 	 */
 	public function encodeResponse_JS($response) {
 		return '{Body:{'. $this->methodResponse. ':'. json_encode($response) . '}}'; 		
 	}
 	
 	/**
 	 * Providing common soap namespaces
 	 */
 	public static function getSoapNamespaces() {
 		return "<env:Envelope xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\""
 		       ." xmlns:ns1=\"CalemSoapService\""
 		       ." xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\""
 		       ." xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\""
 		       ." xmlns:enc=\"http://www.w3.org/2003/05/soap-encoding\">";
 	}
 	
 	/**
 	 * Packaging soap response
 	 * @param String response data
 	 * @todo - may add header support later on.
 	 */
 	private function packageSoapResponse($xmlResponse) {
 		global $_CALEM_conf;
 		$env= $_CALEM_conf['calem_soap_xmlheader'] . self::getSoapNamespaces(); 
 		$env .= "<env:Body xmlns:rpc=\"http://www.w3.org/2003/05/soap-rpc\">";
 		$env .= $xmlResponse;
   	$env .="</env:Body>";
   	$env .="</env:Envelope>";
   	return $env;
 	}
 	
 	/**
 	 * Send a soap fault
 	 */
 	public function sendFault($faultcode, $faultstring='', $faultdetail='')  {
 		$this->logger->error("Soap fault for method: " . $this->method . " is: " . $faultcode);
 		global $_CALEM_conf;
 		$env= $_CALEM_conf['calem_soap_fault_xmlheader'] . self::getSoapNamespaces();
 		$env .="<env:Body><env:Fault>";
		$env .="<faultcode xsi:type=\"xsd:string\">" . $faultcode . "</faultcode>";
		$env .="<faultactor xsi:type=\"xsd:string\">" . 'CalemSoapServer' . "</faultactor>";
		$env .= "<faultstring xsi:type=\"xsd:string\">" . $faultstring . "</faultstring>";
      $env .= "<detail xsi:type=\"xsd:string\">" . $faultdetail . "</detail>";
      $env .= "</env:Fault></env:Body></env:Envelope>";
      $this->sendResponse($_CALEM_conf['calem_soap_fault_status'], $env, false);
 	}
 	
 	/**
 	 * By default all requests require authentication
 	 * @return boolean true
 	 */
 	public function authenticationRequired() {
 		return true;
 	}
 	
 	/**
 	 * Request to zip the content - false by default.
 	 */
 	public function gzipIt() {
 		return false;
 	}
 	
 	/**
 	 * Response format parsing - either js or xml
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
 			$this->responseFormat=strtoupper($reqhs->value);
 		}
	}
 	
 	/**
 	 * Authenticate the request by inspecting the sessionId passed in.
 	 */
 	private function authenticate() {
 		if (!$this->reqHeaders || !is_array($this->reqHeaders)) return false;
 		//Let's find out the sessionId field
 		foreach ($this->reqHeaders as $reqh) {
 			if ($reqh->name === CALEM_SOAP_SESSIONID) {
 				$sid=$reqh->value;
 				break;
 			}
 		}
 		if (!isset($sid)) {
 			$this->logger->error("sid not set, authentication failed");
 			return false;
 		}
 		//Verify sessionId and lifetime
 		$sesReload=CalemSession::load($sid);
 		if (!isset($sesReload)) return false;
 		//Refresh timeout setting.
 		$sesReload->renew();
 		//Keep track of the userId for data operation
 		$GLOBALS['calem_ses_data']=$sesReload->get('user');			
 		return true;
 	}
 	
 	/**
 	 * Send a response back to client
 	 * @param String Response text
 	 */
 	private function sendResponse($status, $response, $zipIt) {
 		//Check for gzip per each service
 		global $_CALEM_conf;
 		$zip=false;
 		if ($zipIt && $_CALEM_conf['calem_soap_allow_gzip'] 
 		    && ($encoding=$encoding=CalemGzip::canGzip())) {
 			$zip=true;    	
 		}
 		//Output data
		CalemGzip::gzStart();
		print $response;
		CalemGzip::gzSoapCompressEndFlush($status, $zip, $encoding, $this->logger);
 	}
 	
 	/**
 	 * Shutdown the script environment
 	 * <ul>
 	 * <li> shutdown the logger
 	 * <li> exit the script
 	 * </ul>
 	 */
 	private function shutdown() {
 		CalemExit::exitCalem();
 	}
 }
?>
