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

require_once _CALEM_DIR_ . 'server/include/core/CalemUiException.php';

 /**
  * This is the error structure for use in the backend and frontend.
  */
 class CalemErrorInfo {
 	private $data;
 	
   public function __construct($ex, $tbId, $nativeError=null, $param=null) {
   	$this->data=array();
   	if (is_string($ex)) {
   		$id=$ex;
   	} else if (is_a($ex, 'CalemUiException')) {
   		$id=$ex->getMessage();	
   	} else {
   		$id=get_class($ex);
   	}   		
   	$this->data['id']=$id;
   	$this->data['table']=$tbId;
   	if (isset($nativeError)) {
   		$this->data['nativeError'] = var_export($nativeError, true);
   	}
   	if (isset($param)) {   	
	   	if (!is_array($param)) {
	   		$param=array($param);	
	   	}
	   	$this->data['param']=$param;
   	}
   }
   
   public function getData() {
   	return $this->data;
   }	
 }

?>
