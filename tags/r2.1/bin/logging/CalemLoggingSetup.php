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

define('LOG_PLACE_HOLDER', '_CALEM_LOG_PATH_');
define('LOG4PHP_SRC', 'etc/log4php.sample.properties');
define('LOG4PHP_CONF', 'etc/log4php.properties');

class CalemLoggingSetup {
	public static function execute() {
		if (!is_file(_CALEM_DIR_ . LOG4PHP_CONF)) {
			copy(_CALEM_DIR_ . LOG4PHP_SRC, _CALEM_DIR_ . LOG4PHP_CONF);
		}
		 
		if (is_file(_CALEM_DIR_ . LOG4PHP_CONF)) {
			$cnt=file_get_contents(_CALEM_DIR_ . LOG4PHP_CONF);
			if (false!==($pos=strpos($cnt, LOG_PLACE_HOLDER))) {
				$nc=str_replace(LOG_PLACE_HOLDER, _CALEM_DIR_ . 'logs/calem.log', $cnt);
				file_put_contents(_CALEM_DIR_ . LOG4PHP_CONF, $nc);
				return "Logging is configured\n";	
			} else {
				return "Logging is already configured.\n";	
			}
		} else {
			throw new Exception('Error in finding log4php.properties. Logging is not configured.');	
		}
	}
}		
?>
