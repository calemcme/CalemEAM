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

require_once _CALEM_DIR_ . 'server/modules/admin/soap/CalemCustomHandler.php';

/**
 * This class handle search customization and removal.
 */
class CalemCustomInfoSo extends CalemCustomHandler {
	
	/**
	 * Use gzip
	 */
	public function gzipIt() {
		return true;
	}
	
	/**
 	 * Load custom info for the list of targets.
 	 */
 	public function LoadCustomInfo() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Load customInfo, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $customObj) {
 			$path= _CALEM_DIR_ . 'custom/group/';
 			$targets=explode(';', $customObj->targets);
 			global $_CALEM_conf;
 			$sets=$_CALEM_conf['calem_cutsom_design_load'];
 			$js='';
 			foreach ($targets as $target) {
 				foreach ($sets as $set) {
 					$file=$path . $target . $set;
 					if (is_file($file)) {
 						$js .= file_get_contents($file);	
 					}	
 				}
 			}
 			if (strlen($js) > 0) {
 				$result[]=array('targets'=>$targets,
                            'status'=>0, 'reload'=>base64_encode($js) );
 			} else {
 				$result[]=array('targets'=>$targets, 'status'=>1);
 			}
 		}
 		return $result;
	}
}
?>
