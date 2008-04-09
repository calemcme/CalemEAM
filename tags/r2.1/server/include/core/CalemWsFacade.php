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

require_once _CALEM_DIR_ . 'server/include/util/CalemExit.php';
require_once _CALEM_DIR_ . 'server/include/core/session/CalemSession.php';

/**
 * This is the Web Service Facade Base.
 */
 class CalemWsFacade {
 	protected $wsHdlr;
 	protected $logger;
 	protected $reqHeaders;
 	protected $method;
 	protected $params;
 	
 	public function __construct() {
 		$this->logger=&LoggerManager::getLogger('CalemWsFacade');
 	}
 	
 	/**
 	 * This is the main soap service entry
 	 * @param Array SOAP request headers
 	 * @param String SOAP request method
 	 * @param Array SOAP request parameters
 	 * @return mixed results
 	 */
 	public function service($reqHeaders, $method, $params, CalemWsInterface $wsHdlr) {
 		try {
 			$this->wsHdlr=$wsHdlr;
 			$this->wsHdlr->init($reqHeaders, $method, $params, $this);
	 		$this->reqHeaders=$reqHeaders;
	 		$this->method=$method;
	 		$this->params=$params;
	 		if ($this->authenticationRequired() && !$this->authenticate()) {
	 			$this->wsHdlr->sendFault(CALEM_SF_NO_SESSION, 'No active session'); //Exit from here
	 		}
	 		//Let's dispatch the call now.
	 		$response=call_user_func(array($this, $this->method));
	 		if (!$response || !is_array($response)) {
	 			$this->wsHdlr->sendFault(CALEM_SF_UNKNOWN);
	 		}
	 		//Encode the result properly and send
	 		$this->wsHdlr->sendResult($response);
 		} catch (CalemSoapException $ce) {
 			$this->logger->error("Soap exception in soap request:" . $ce->getMessage());
 			$this->wsHdlr->sendFault($ce->getCode(), $ce->getMessage());
 		} catch (Exception $e) {
 			$this->logger->error("Exception in soap request:" . $e->getMessage());
 			$this->wsHdlr->sendFault(CALEM_SF_UNKNOWN, $e->getMessage());
 		} 
 	}
 	
 	/**
 	 * Facade function
 	 */
 	public function getParamValue($n=0) {
 		return $this->wsHdlr->getParamValue($n);
 	}
 	
 	/**
 	 * Send a soap fault
 	 */
 	public function sendFault($code, $msg='', $detail='')  {
 		return $this->wsHdlr->sendFault($code, $msg, $detail); 
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
 	 * Authenticate the request by inspecting the sessionId passed in.
 	 */
 	private function authenticate() {
 		$sid=$this->wsHdlr->getSid();
 		if (!$sid) {
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
 		$GLOBALS['calem_ses_setting']=$sesReload->get('setting');			
 		return true;
 	}
 }
?>
