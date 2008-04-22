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
if (!defined('_CALEM_DIR_')) {
	chdir('../../../..');
	define('_CALEM_DIR_', getcwd() . '/');	
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'etc/log4php.properties');
}

if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemTaskInterface.php';
require_once _CALEM_DIR_ . 'server/modules/workorder/CalemWoGenBo.php';

/**
 * This is the Calem table DD class.
 */
class CalemWoGenTask implements CalemTaskInterface {
	private $woGenBo;
	
	public function execute() {		
		$this->woGenBo=new CalemWoGenBo();
		$this->woGenBo->generateWo();
		return 'CalemWoGenTask is done. WO count=' . $this->woGenBo->getWoCount();
	}
	
	public function getWoCount() {
		return ($this->woGenBo) ? $this->woGenBo->getWoCount() : 0;	
	}
}
?>
