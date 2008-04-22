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

require_once 'CalemInstController.php';
require_once _CALEM_DIR_ . 'installation/form/model/CalemInstDbSetupModel.php';
require_once _CALEM_DIR_ . 'installation/form/view/CalemInstDbSetupView.php';

/**
 * Dbinfo controller
 */
class CalemInstDbSetupController extends CalemInstController {
	
	public function init() {
		$this->model=new CalemInstDbSetupModel($this);
		$this->view=new CalemInstDbSetupView($this->model, $this);	
	}
	
	public function execute() {
		$this->view->render();
	}
	
	public function validateInput() {
		return $this->model->validateInput();
	}
	
	public function onValidationError() {
		$this->view->render();	
	}
}	
?>
