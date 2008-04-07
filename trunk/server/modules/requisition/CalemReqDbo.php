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
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';

class CalemReqDbo extends CalemDbo {
	protected $conf;	
	
	public function __construct() {
		parent::__construct();
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['req_conf'];	
	}
	
	//Auto-numbering and codes auto-fill when wo_id is provided.
	public function beforeInsert($baseTable, $baseData, $customTable, $customData) {
		if (!isset($baseData['req_no']) || !$baseData['req_no']) {
			require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';
			$reqBo=new CalemReqBo();
			$baseData['req_no']=$reqBo->getNextReqNo();	
		}
		if (isset($baseData['wo_id']) && (!isset($baseData['costcode_id']) && !isset($baseData['dept_id']))) {//bring over costcode
			$woDbo=CalemFactory::getDbo('wo');
			$row=$woDbo->fetchById($baseData['wo_id']);
			$baseData['costcode_id']=$row['costcode_id'];
			$baseData['dept_id']=$row['dept_id'];
		}
		if (!isset($baseData['status_id'])) {
			$baseData['status_id']=$this->conf['req_init_status'];
		}
		if (!isset($baseData['state_id'])) {
			$baseData['state_id']=$this->conf['req_init_state'];	
		}
		if (!isset($baseData['req_on_po_id'])) {
			$baseData['req_on_po_id']=$this->conf['req_init_on_po'];	
		}
		return $baseData;
	}
	
	/**
	 * Any state changed to 'voided':
	 * - need to take out the ordering from inventory.
	 * State change from 'voided' to other states:
	 * - need to add ordering to inventory
	 */
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		//changing to voided.
		if (isset($baseUpdate['status_id']) && $baseUpdate['status_id']=='req_status_voided') {
			$this->onReqItemChanged($baseCurrent['id'], -1);
		} else if ($baseCurrent['status_id']=='req_status_voided' && isset($baseUpdate['status_id'])) {
		   $this->onReqItemChanged($baseCurrent['id'], 1);        	
		}
	}
	
	/**
	 * Status change cause req item changes
	 */
	public function onReqItemChanged($reqId, $sign) {
		$calemReqBo=new CalemReqBo();
		$reqItemDbo=CalemFactory::getDbo('req_item');
		try {
			$rows=$reqItemDbo->fetchBySqlParam('select * from req_item where req_id=?', $reqId);
			foreach ($rows as $row) {
				if ($row['qty']) {
					$calemReqBo->onReqItemChanged($row['in_id'], $reqId, $row['qty']*$sign, $row['unit_cost'], $row['uom_id']);	
				}
			}	
		} catch (CalemDboDataNotFoundException $ex) {
		}
	} 
}

?>