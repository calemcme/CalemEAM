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
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';
require_once _CALEM_DIR_ . 'server/modules/purchase/CalemPoBo.php';

class CalemPoItemDbo extends CalemDbo {
	protected $conf;	
	protected $poStatus;
	
	public function __construct() {
		parent::__construct();
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['po_conf'];
		$this->poStatus=array();	
	}
	
	//Overwrite deletion to collect pm_id info.
	public function beforeDelete() {
		$this->loadRecord();
	}
	
	//Business logic when data deletion is done.	
	public function onDataDeleted($table, $id) {
		$reqBo=new CalemReqBo();
		$poBo=new CalemPoBo();
		$poBo->updatePoCostById($this->row['po_id'], -1*$this->row['line_cost']);
		$reqBo->removeAllReqItemFromPo($this->row['po_id'], $this->row['in_id']);
	}
	
	//before update
	public function beforeUpdate($baseTable, $baseCurrent, $baseUpdate) {
		$qty=isset($baseUpdate['qty']) ? $baseUpdate['qty'] : $baseCurrent['qty'];
		$uc=isset($baseUpdate['unit_cost']) ? $baseUpdate['unit_cost'] : $baseCurrent['unit_cost'];
		$baseUpdate['line_cost']=$qty*$uc;
		return $baseUpdate;	
	}
	
	//On data updated
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		$nCost=isset($baseUpdate['line_cost']) ? $baseUpdate['line_cost'] : $baseCurrent['line_cost'];
		$diff=$nCost - $baseCurrent['line_cost'];
		if ($diff!=0) {
			$poBo=new CalemPoBo();
			$poBo->updatePoCostById($baseCurrent['po_id'], $diff);
		}  
	}
}
