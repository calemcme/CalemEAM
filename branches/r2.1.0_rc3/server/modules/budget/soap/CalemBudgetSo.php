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

require_once _CALEM_DIR_ . 'server/include/core/CalemWsFacade.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';
require_once _CALEM_DIR_ . 'server/modules/database/CalemDataBoException.php';
require_once _CALEM_DIR_ . 'server/modules/budget/CalemBudgetBo.php';

class CalemBudgetSo extends CalemWsFacade {
	private $budgetBo;
	
	public function __construct() {
		parent::__construct();	
		$this->budgetBo=new CalemBudgetBo();
	}
 	
 	/**
 	 * VerifyBudgetStatusChange
 	 */
 	public function UpdateBudgetActual() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Invoking UpdateBudgetActual, param=" . var_export($param, true));
 	
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $row) {
 			$tran=CalemJson::objToArray($row); 			
 			try { 			
	 			$this->budgetBo->updateBudgetActual($tran);
	 			$result[]=array('status'=>0);
 			} catch (CalemDataBoException $e) {
 				$result[]=array('status'=>100, 'errorInfo'=>$e->getErrorInfo()->getData());
 			} catch (Exception $ex) {
 				$e=new CalemDataBoException('budget', $ex);
 				$result[]=array('status'=>100, 'errorInfo'=>$e->getErrorInfo()->getData());
 			}
 		}
 		return $result;
 	}
}

?>