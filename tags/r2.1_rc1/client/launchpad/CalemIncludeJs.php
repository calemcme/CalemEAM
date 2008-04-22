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

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

class CalemIncludeJs {
	private $logger;
	
	public function __construct() {
		$this->logger=&LoggerManager::getLogger('JsInclude');
	}
	
	public function includeJs($conf, $rootDir) {
		include $conf;
		$this->logger->debug("Loading scripts from " . $conf);
		foreach ($_CALEM_scripts as $mgFile=>$list) {
			$data="//Include scripts listed in $conf " . CALEM_LFCR;
			$path=$list['path'];
			$files=$list['files'];
			foreach ($files as $file) {
				$fullPath=_CALEM_DIR_ . $path . $file;
				if (!is_file($fullPath)) {
					$this->logger->warn("Script file not found: " . $fullPath);
					continue;
				}
				print "<script type=\"text/javascript\" src=\"" . $rootDir . '/' . $path . $file . "\"></script>";
			}
		}
	}
}
?>
