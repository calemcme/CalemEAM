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

//Include the view factory interface
require_once _CALEM_DIR_ . 'server/modules/admin/CalemSecurityBoIf.php';
//Include UserDao class
require_once _CALEM_DIR_ . 'server/modules/admin/CalemUserDbo.php';

/**
 * This is the security class implementing SecurityBo interface.
 * It provides all the access control functions and is a singleton.
 */
class CalemSecurityBo implements CalemSecurityBoIf {
	//This is the singleton class
	private static $instance;
	//This is the logger class.
	private $logger;
	
	//Constructor method
	private function __construct() {
   	$this->logger=&LoggerManager::getLogger("CalemSecurityBo");
   }
   /**
	 * Singleton method for the security service.
	 */	
	public static function getInstance() {
       if (!isset(self::$instance)) {
           $c = __CLASS__;
           self::$instance = new $c;
       }
       return self::$instance;
   }
   /**
    * Verify user login info.
    * @param String $username
    * @param String $password
    * @return boolean true|false
    * @return userDbo if verified
    */
	public function verifyLogin($username, $password) {
		$user=CalemUserDbo::findByUsername($username); //User will not be null if found.
		$succ=($user
			&&$user->getLoginAllowed()
			&&$user->getUsername()==$username
			&&$user->getPassword()==md5($password));
		return array($succ, $user);
	}
}

?>