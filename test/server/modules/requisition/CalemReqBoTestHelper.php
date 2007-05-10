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
 * Must define _CALEM_DIR_ and _LOG4PHP_CONFIGURATION
 * 
 */ 

if (!defined('_CALEM_DIR_')) {
	if (!isset($_ENV['CALEM_DIR'])) {
		chdir('../../../..');
		define('_CALEM_DIR_', getcwd() . '/');
	} else {
		define('_CALEM_DIR_', $_ENV['CALEM_DIR']);
	} 
	define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');
}

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/requisition/CalemReqBo.php';		

class CalemReqBoTestHelper {
	private $ids=array(
		'req_id'=>'req_001',
		'in_id1'=>'in_001',
		'in_id2'=>'in_002',
		'req_item1'=>'req_item_001',
		'req_item2'=>'req_item_002',
		'po_id'=>'po_001',
		'vendor_id'=>'vendor_001'
	);
	
	public function getReq() {
		return array(
			'table'=>'requisition',
			'row'=>array(
				'id'=>$this->ids['req_id'],
				'req_on_po_id'=>'req_on_po_none',
				'req_total'=>0
			)		
		);	
	}
	
	public function getReqItem1() {
		return array(
			'table'=>'req_item',
			'row'=>array(
				'id'=>$this->ids['req_item1'],
				'req_id'=>$this->ids['req_id'],
				'vendor_id'=>$this->ids['vendor_id'],
				'in_id'=>$this->ids['in_id1'],
				'unit_cost'=>20,
				'qty'=>3,
				'line_cost'=>60			
			)				
		);	
	}
	
	public function getReqItem2() {
		return array(
			'table'=>'req_item',
			'row'=>array(
				'id'=>$this->ids['req_item2'],
				'req_id'=>$this->ids['req_id'],
				'vendor_id'=>$this->ids['vendor_id'],
				'in_id'=>$this->ids['in_id2'],
				'unit_cost'=>10,
				'qty'=>2,
				'line_cost'=>20	
			)				
		);	
	}
	
	public function getPo() {
		return array(
			'table'=>'po',
			'row'=>array(
				'id'=>$this->ids['po_id'],
				'vendor_id'=>$this->ids['vendor_id']			
			)		
		);	
	}
	
	public function addRow($ar) {
		$dbo=CalemFactory::getDbo($ar['table']);
		$dbo->setChangeBulk($ar['row']);
		$dbo->insert();			
	}
	
	public function setupReq() {
		$this->addRow($this->getReq());
		$this->addRow($this->getReqItem1());
		$this->addRow($this->getReqItem2());
		$this->addRow($this->getPo());		
	}
	
	public function cleanupReq() {
		$dbo=CalemFactory::getDbo('requisition');
		$dbo->deleteBySqlParam('delete from requisition where id=?', $this->ids['req_id']);
		$dbo->deleteBySqlParam('delete from req_item where req_id=?', $this->ids['req_id']);
		$dbo->deleteBySqlParam('delete from po where id=?', $this->ids['po_id']);
		$dbo->deleteBySqlParam('delete from po_item where po_id=?', $this->ids['po_id']);
	}
	
	public function getIds() {
		return $this->ids;
	}
}

?>
