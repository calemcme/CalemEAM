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

//include action interface
require_once _CALEM_DIR_ . 'server/include/core/CalemResourceManagerInterface.php';
//logger
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

require_once _CALEM_DIR_ . 'server/metadata/CalemTableMap.php';
require_once _CALEM_DIR_ . 'server/metadata/CalemTableDd.php';
require_once _CALEM_DIR_ . 'server/metadata/CalemTableDdCustom.php';

/**
 * This is the implementation of ResourceManager. It manages the repository of
 * DD and language for modules.
 */
class CalemResourceManager implements CalemResourceManagerInterface {
	//This is the singleton class
	private static $instance;
	//resource arrays
	private $tables, $table_map, $dbos;
	//Logger instance
	private $logger;
	
	/**
	 * Hide constructor in this case
	 */
	private function __construct() {
		$this->logger=&LoggerManager::getLogger('CalemResourceManager');
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
	 * Get predefined Dd for a module and table
	 */
	public function getTableDd($table_name) {
		if (!isset($this->tables[$table_name])) {
			$this->tables[$table_name]=CalemTableDdFactory::createDd($table_name);	
		}	
		return $this->tables[$table_name];
	}
	
	/**
	 * Table for custom fields.
	 */
	public function getTableDdCustom($table_name) {
		if (!isset($this->tables[$table_name])) {
			$this->tables[$table_name]=new CalemTableDdCustom($table_name);	
		}	
		return $this->tables[$table_name];
	}
	

	/**
	 * Get table map ref
	 */
	public function getTableMap() {
		if (!isset($this->table_map)) {
			$this->table_map=new CalemTableMap();	
		}	
		return $this->table_map;	
	}
}

?>