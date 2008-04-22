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

require_once _CALEM_DIR_ . 'installation/include/util/CalemLang.php';

/**
 * Controller Map Object
 */
class CalemInstControllerMap {
	private $map;
	private $calemLang;
	
	public function __construct() {
		include 'controller_map.php';
		$this->map = $_CALEM_cmap;	
		$this->reloadLang();
	}
	
	public function reloadLang() {
		$lang=$this->getLangSelect();
		$this->calemLang=new CalemLang(_CALEM_DIR_ . 'installation/lang', $lang);
	}
	
	public function getSteps() {
		return $this->map['steps']['list'];	
	}
	
	public function getStepByAid($aid) {
		return $this->map['steps']['step_map'][$aid];	
	}
	
	public function getStepLabel($s) {
		return $this->calemLang->getMsg($s);	
	}
	
	public function getController($aid) {
		$aid= $aid ? $aid : $this->map['default_controller_id'];
		$cls=$this->map['controllers'][$aid]['class'];
		require_once $cls . '.php';
		$ins= new $cls;
		$ins->setControllerMap($this);
		$ins->setAid($aid);
		return $ins;		
	}
	
	public function getLangSelect() {
		$lang=isset($_SESSION['fi_data']['fi_lang']) ? $_SESSION['fi_data']['fi_lang'] : null;
		if (!$lang) {
			$lang='lang_en';	
		}
		return $lang;
	}
	
	public function getCalemLang() {
		return $this->calemLang;
	}
}		
?>
