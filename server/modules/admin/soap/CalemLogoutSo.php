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

require_once _CALEM_DIR_ . 'server/include/core/CalemWsFacade.php';
require_once _CALEM_DIR_ . 'server/include/core/session/CalemSession.php';

/**
 * This class will validate user login and create session if login is successful
 */
class CalemLogoutSo extends CalemWsFacade {
 	/**
 	 * Handling the Soap Logout Request
 	 * Should remove the session and go back to login page.
 	 * @param sessionId
 	 */
 	public function Logout() {
 		$sid=$this->getParamValue(0);
 		$removed=0;
 		if ($sid) {
 			$ses=$sesReload=CalemSession::load($sid);
 			if ($sesReload) {//Found a valid session so let's remove it
				$removed=1;
				$sesReload->remove();
 			} 
 		}
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Logout, sid=" . $sid . " sessionFound=" . ($sesReload?$sesReload->toString():"Session not found"));
 		//Always return a correct value
 		return array('sid'=>$sid, 'removed'=>$removed);
 	}
 	
 	/**
	 * Authentication is not required to fire off this request
	 */
	public function authenticationRequired() {
 		return false;
 	}
}
?>
