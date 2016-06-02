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

//Base CalemDao
require_once _CALEM_DIR_ . 'server/include/core/CalemUiException.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemUomBo.php';
require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';

class CalemInOrderGenBo extends CalemBo {
	private $conf;
	
	public function __construct() {	
 		parent::__construct();
 		//Get configuration
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['in_conf'];	
 	}
	
	/**
	 * Auto-gen a req
	 */
	public function autoGenOrderRequest($inId, $qty, $uom, $requestId, $requestTime) {
		//Figure out the due date
		$dueDate=$this->getReqDueDateByWo($inId);
		$reqRow=$this->conf['in_order_gen']['req_auto']['init'];
		if ($dueDate) {
			$reqRow['due_date']=CalemText::datetimeToDate($dueDate);	
		}
		$reqRow['request_user_id']=$requestId;
		$reqRow['request_time']=$requestTime;
		$reqBo=new CalemReqBo();
		$reqId=$reqBo->createInOrderRequest($reqRow, $inId, $qty, $uom);
	}
	
	private function getReqDueDateByWo($inId) {
		$inDbo=CalemFactory::getDbo('inventory');
		$dueDate=$inDbo->getCountBySqlParam('select min(sched_start_time) from workorder where id in (select wo_id from in_reserved where in_id=?)', $inId);
		return $dueDate;
	}
	
	/**
	 * Manual-gen a req
	 */
	public function manualGenOrderRequest($inId, $reqRow) {
		$inDbo=CalemFactory::getDbo('inventory');
		$inRow=$inDbo->fetchById($inId);
		if (!$inRow['qty_to_order']) return; //In case it's processed already
		
		//Figure out the due date
		$initRow=$this->conf['in_order_gen']['req_manual']['init'];
		foreach ($initRow as $key=>$val) {
			if (!$reqRow[$key]) {
				$reqRow[$key]=$val;
			}	
		}
		$dueDate=$this->getReqDueDateByWo($inId);		
		if ($dueDate) {
			$reqRow['due_date']=CalemText::datetimeToDate($dueDate);	
		}
		$reqRow['request_time']=CalemText::getServerDateTime();
		$reqBo=new CalemReqBo();
		$reqId=$reqBo->createInOrderRequest($reqRow, $inId, $inRow['qty_to_order'], $inRow['uom_id']);
	}
}

?>