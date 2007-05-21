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

require_once _CALEM_DIR_ . 'server/include/core/cache/CalemFileCacheManager.php';

/**
 * This is the file-based implementation of SessionManager. 
 */
class CalemFileSessionManager extends CalemFileCacheManager { 
	private static $sesInstance;  
   /**
    * configuration for File session.
    */
   public function _createCache() {
   	//Initialize the backup here.
		global $_CALEM_conf;
		$this->cache=new Cache_Lite($_CALEM_conf['calem_session_config']);
   }
   
   /**
	 * Singleton method for this resource manager
	 */	
	public static function getInstance() {
       if (!isset(self::$sesInstance)) {
           $c = __CLASS__;
           self::$sesInstance = new $c;
       }
       return self::$sesInstance;
   }
}
