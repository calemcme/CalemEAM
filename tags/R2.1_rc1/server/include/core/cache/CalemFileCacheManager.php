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

//Pear's CacheLite 
require_once _CALEM_DIR_ . 'server/include/Cache_Lite/Lite.php';
require_once _CALEM_DIR_ . 'server/include/core/cache/CalemCacheManagerInterface.php';

/**
 * This is the file-based implementation of cacheManager. 
 */
class CalemFileCacheManager implements CalemCacheManagerInterface {
	//This is the singleton class
	private static $instance;
	//cache
	protected $cache;
	
	/**
	 * Hide constructor in this case
	 */
	public function __construct() {
		$this->_createCache();
   }
   
   /**
    * Re-create cache for other functions.
    */
   public function _createCache() {
   	//Initialize the backup here.
		global $_CALEM_conf;
		$this->cache=new Cache_Lite($_CALEM_conf['calem_cache_config']);
   }
	
	/**
	 * Singleton method for this resource manager
	 */	
	public static function getInstance() {
       if (!isset(self::$instance)) {
           $c = __CLASS__;
           self::$instance = new $c;
       }
       return self::$instance;
   }
	/**
	 * Load session
	 */
	public function load($sid) {
		return $this->cache->get($sid);
	}
	/**
	 * Save session
	 */
	public function save($data, $sid) {
		$rtn=$this->cache->save($data, $sid);
		$this->reportError($rtn);
	}
	/**
	 * Remove session
	 */
	public function remove($sid) {
		$rtn=$this->cache->remove($sid);
		$this->reportError($rtn);
	}
	
	/**
	 * Pear error handling
	 */
	protected function reportError($rtn) {
		if (is_bool($rtn)) return;
		require_once 'PEAR.php';
		if (PEAR::isError($rtn)) {
			$GLOBALS['logger']->error("CalemFileCacheManager error: " . $rtn->getMessage() 
			                          . ', userInfo' . $rtn->getUserInfo());	
		}
	}
}

?>