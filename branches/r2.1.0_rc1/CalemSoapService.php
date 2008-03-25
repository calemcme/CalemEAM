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
 * This is the SOAP service entry.
 */ 
if (!defined('_CALEM_DIR_')) {
	define('_CALEM_DIR_', getcwd() . '/'); 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'etc/log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php'; //Configuration
require_once _CALEM_DIR_ . 'server/conf/soap_map.php'; //Soap mapping
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php'; //Logger
require_once _CALEM_DIR_ . 'server/include/core/CalemWsSoap.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemHttpHelper.php';

//Must have PEAR SOAP on the path
require_once 'SOAP/Parser.php';

    //Disable browser side cache
	header('Cache-Control', 'no-cache');
	//Start handling the request.
	$logger=&LoggerManager::getLogger('CalemSoapService');
	$postData=CalemHttpHelper::getPostData();
	$calemWsSoap=new CalemWsSoap();
	if ($logger->isInfoEnabled()) {
		$logger->info("acceptedEncoding=" . $_SERVER['HTTP_ACCEPT_ENCODING'] . ", Received a post request=" . $postData);
	}
	if (!$postData) {
		if ($logger->isDebugEnabled()) $logger->debug("Invalid post data.");
		$calemWsSoap->sendFault(CALEM_SF_NO_POSTDATA);
	}
	//Processing postData
	$parser=&new SOAP_Parser($postData);
 	$request_headers = $parser->getHeaders();
 	if ($request_headers) {
 		if (!is_a($request_headers, 'SOAP_Value')) {
 			$calemWsSoap->sendFault(CALEM_SF_INVALID_HEADER);
 		}
 		$request_headers=$request_headers->value;
 	}
 	$params=$parser->getResponse();
 	if ($params) {
 		if (!is_a($params, 'SOAP_Value')) {
 			$calemWsSoap->sendFault(CALEM_SF_INVLIAD_PARAMS);
 		}
 		$params=$params->value;
 	}
 	$method=$parser->root_struct_name[0];
 	if (!$method || !isset($_CALEM_soap[$method])) {
 		$calemWsSoap->sendFault(CALEM_SF_INVALID_METHOD);
 	}
 	if ($logger->isDebugEnabled()) $logger->debug("reqHeader=".count($request_headers) . ", params=".count($params));
 	//Now let's dispatch to the proper class for Soap service.
 	$service=$_CALEM_soap[$method];
 	require_once _CALEM_DIR_ . 'server/modules/' . $service[CALEM_SOAP_MODULE] . '/soap/' . $service[CALEM_SOAP_CLASS] . '.php';
 	$cls = new $service[CALEM_SOAP_CLASS];
 	$cls->service($request_headers, $method, $params, $calemWsSoap);
 	//Code below will not be executed.
?>
