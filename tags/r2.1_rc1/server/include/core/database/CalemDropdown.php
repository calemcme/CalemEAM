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

 define('CUSTOM_DROPDOWN_PATH', _CALEM_DIR_ . 'custom/global/dropdown/');
 define('DROPDOWN_PATH', _CALEM_DIR_ . 'server/setup/dropdown/');
 
 class CalemDropdown {
 	private $data;
 	public function initWithTableName($table) {
 		if (is_file(CUSTOM_DROPDOWN_PATH . $table . '.dropdown')) {
 			$ct=file_get_contents(CUSTOM_DROPDOWN_PATH . $table . '.dropdown');
 			$this->data=unserialize($ct);	
 		} else {
 			include DROPDOWN_PATH . $table . '.php';
 			$this->data=$data;	
 		}
 	}
 	
 	public function getData() {
 		return $this->data;
 	}
 	
 }
?>