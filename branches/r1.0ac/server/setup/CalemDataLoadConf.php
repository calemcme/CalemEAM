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

 
/**
 * To run Calem test one must set up the following:
 * - _CALEM_DIR_
 * - _CALEM_DIR_ . 'config/calem.php' is included already.
 */ 


/** 
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */

//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/conf/calem.php';

/**
 * This is the Calem data load configuration.
 * Configuration data type:
 * array('conflictResolution'=>'overwrite', //ignore, overwrite
 *     'dataset'=>array('path_1', 'path_2')
 * )
 */
class CalemDataLoadConf  {
	//conf
	private $conflictResolution;
	private $dataset;
	
	public function init(array $conf) {
		$this->conflictResolution= (isset($conf['conflictResolution'])? $conf['conflictResolution'] : 'ignore');	
		$this->dataset= (isset($conf['dataset'])? $conf['dataset']:array());
	}
	
	public function getOverwrite() {
		return ($this->conflictResolution=='overwrite');
	}
	
	public function getDataList($table) {
		$rtn=array();
		foreach ($this->dataset as $dir) {
			$file=_CALEM_DIR_ . $dir . '/' . $table . '.php';
			if (is_file($file)) {
				$rtn[]=$file;	
			}
		}
		return $rtn;
	}
}
?>
