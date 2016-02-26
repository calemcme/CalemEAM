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

require_once 'CalemInstControllerMap.php';

/**
 * Installation front controller
 */
class CalemInstallFront {
	protected $cmap;
	
	public function __construct() {
		$this->cmap=new CalemInstControllerMap();
	}
	
	public static function dispatch() {
		$front=new CalemInstallFront();
		$front->onInput();	
	}
	
	public function onInput() {
		try {
			$vc=$this->getValidationController();
			if ($vc && !$vc->validateInput()) {
				$vc->onValidationError();
				return;	
			}
			$ic=$this->getNextController();
			$ic->execute();
		} catch (Exception $e) {
			$GLOBALS['logger']->error("Error at dispatch: " . $e->getMessage());	
		}		
	}
	
	public function getNextController() {
		$cls=$this->cmap->getController($_REQUEST['aid']);
		return $cls;	
	}
	
	public function getValidationController() {
		if (!$_REQUEST['validation']) return null;
		$cls=$this->cmap->getController($_REQUEST['validation']);
		return $cls;	
	}
}		
?>
