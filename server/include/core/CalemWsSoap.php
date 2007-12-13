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

require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemWsInterface.php';

require_once _CALEM_DIR_ . 'server/include/SOAP/Base.php';
require_once _CALEM_DIR_ . 'server/include/XML/Serializer.php';

/**
 * This is the SOAP Service Handler
 */
 class CalemWsSoap implements CalemWsInterface{
 	protected $responseFormat;
 	protected $logger;
 	protected $reqHeaders;
 	protected $method;
 	protected $methodResponse;
 	protected $params;
 	//Soap object for parsing
 	protected $soapBase;
 	//xml serializer
 	protected $sz;
 	//Service object
 	protected $so;
 	
 	public function __construct() {
 		$this->logger=&LoggerManager::getLogger('CalemWsSoap');
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
 	 * Set the values for this handler.
 	 * @param Array SOAP request headers
 	 * @param String SOAP request method
 	 * @param Array SOAP request parameters
 	 * @return mixed results
 	 */
 	public function init($reqHeaders, $method, $params, $so) {
 		$this->reqHeaders=$reqHeaders;
 		$this->method=$method;
 		$this->methodResponse = $method . 'Response';
 		$this->params=$params;
 		$this->so=$so;
 		//Set up response format now
 		$this->setResponseFormat($this->reqHeaders);	 		 		
 	}
 	
 	/**
 	 * Interface service - provide parameters.
 	 */
 	public function getParamValue($n=0) {
 		if ( !isset($this->params) || $n > count($this->params) ) return null;
 		return $this->soapBase->_decode($this->params[$n]);
 	}
 	
 	/**
 	 * Interface service - provide SID from client
 	 */
 	public function getSid() {
 		$sid=null;
 		if (!$this->reqHeaders || !is_array($this->reqHeaders)) return $sid;
 		//Let's find out the sessionId field
 		foreach ($this->reqHeaders as $reqh) {
 			if ($reqh->name === CALEM_SOAP_SESSIONID) {
 				$sid=$reqh->value;
 				break;
 			}
 		}
 		return $sid;
 	}
 	
 	/**
 	 * Interface - send result back to client.
 	 */
 	public function sendResult($response) {
 	   $env=call_user_func(array($this, 'encodeResponse_'.$this->responseFormat), $response);
	 	global $_CALEM_conf;
	 	$this->sendResponse($_CALEM_conf['calem_soap_status'], $env, $this->gzipIt());	
 	}
 	
 	//Service object callback
 	private function gzipIt() {
 		return $this->so->gzipIt();
 	}
 	
 	/**
 	 * Serialize using Pear's XML serializer
 	 */
	private function serializeXml($data, $rootTag, $rootAttr=null) {
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
 	private function encodeResponse_XML($response) {
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
 	private function encodeResponse_JS($response) {
 		return '{Body:{'. $this->methodResponse. ':'. json_encode($response) . '}}'; 		
 	}
 	
 	/**
 	 * Providing common soap namespaces
 	 */
 	private function getSoapNamespaces() {
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
 		$env= $_CALEM_conf['calem_soap_xmlheader'] . $this->getSoapNamespaces(); 
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
 		$env= $_CALEM_conf['calem_soap_fault_xmlheader'] . $this->getSoapNamespaces();
 		$env .="<env:Body><env:Fault>";
		$env .="<faultcode xsi:type=\"xsd:string\">" . $faultcode . "</faultcode>";
		$env .="<faultactor xsi:type=\"xsd:string\">" . 'CalemSoapServer' . "</faultactor>";
		$env .= "<faultstring xsi:type=\"xsd:string\">" . $faultstring . "</faultstring>";
      $env .= "<detail xsi:type=\"xsd:string\">" . $faultdetail . "</detail>";
      $env .= "</env:Fault></env:Body></env:Envelope>";
      $this->sendResponse($_CALEM_conf['calem_soap_fault_status'], $env, false);
 	}
 	
 	/**
 	 * Response format parsing - either js or xml
 	 */
 	private function setResponseFormat($reqhs) {
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
 	 * Send a response back to client
 	 * @param String Response text
 	 */
 	private function sendResponse($status, $response, $zipIt) {
 		//Check for gzip per each service
 		global $_CALEM_conf;
 		$zip=false;
 		if ($zipIt && $_CALEM_conf['calem_soap_allow_gzip'] 
 		    && ($encoding=CalemGzip::canGzip())) {
 			$zip=true;    	
 		}
 		//Output data
		CalemGzip::gzStart();
		print $response;
		CalemGzip::gzSoapCompressEndFlush($status, $zip, $encoding, $this->logger);
 	}
 }
?>
