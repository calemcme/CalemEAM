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

/**
 * CalemReadText
 * This is the edit text adapted from DwtInput's text area implementation so the cols can be set and alignment with other
 * input fields are kept.
 */
class CalemReadText {
	private $params;
	private $value;
	
	public function CalemReadText($params) {
		$this->params = $params;
	}
	
	public function setValue($val) {
		$this->value=$val;
	}
	
	public function render() {
		$clsName= ($this->params && isset($this->params['className'])) ? $this->params['className'] : 'CalemReadText';
		$rtn='<div class=' . $clsName . '>' . $this->value . '</div>';
		return $rtn;	
	}
}
?>