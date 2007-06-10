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
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInTranBoIf.php';
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInTranNotifierFactory.php';
require_once _CALEM_DIR_ . 'server/modules/inventory/CalemInBo.php';

/**
 * Inventory transaction business object
 */
class CalemInTranBo extends CalemBo implements CalemInTranBoIf {
	private $conf;
	private $inBo;
	
	public function __construct() {	
 		parent::__construct();
 		//Get configuration
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['in_conf'];	
		$this->inBo=new CalemInBo();
 	}
 	
	/**
	 * Checkout transaction (both part and tool are the same)
	 * @param in_id - item id
	 * @param location_id - stock location id
	 * @param qty - qty to check out
	 * @param costcode_id - costcode 
	 * @param checkout_type_id - one of wo, asset, ...
	 * @param checkout_to_id - id of wo, ...
	 * @param note - note
	 * @param tran_time - time transaction happened
	 * @param tran_user_id - user to check out to
	 * @param store_user_id - staff performed the transaction
	 * 
	 */	
	public function checkout($tran, $rollback=false) {
		if ($this->logger->isInfoEnabled()) $this->logger->info("Checkout transaction: " . var_export($tran, true));
		                        	
		//Check stock level at $locationId
		$stockDbo=CalemFactory::getDbo('in_stock');
		$stocks=$stockDbo->fetchBySqlParam('select * from in_stock where in_id=? and location_id=?', 
				array($tran['in_id'], $tran['location_id']));
		$stock=$stocks[0];
		if ($stock['qty'] < $tran['qty']) {//Not enough stock level
			if ($this->conf['checkout']['negativeLevel']==-1) {
				throw new CalemUiException('InStockNotEnoughException');	
			}
		}	
		//Get valuation handler to find out unit cost                        	
		$inDbo=CalemFactory::getDbo("inventory");
		$in=$inDbo->fetchById($tran['in_id']);
		$costMd= (isset($in['valuation_type_id']) && $in['valuation_type_id']) ? $in['valuation_type_id'] : $this->conf['valuation']['default'];
		$costHdlr=CalemFactory::createInstance($this->conf['valuation'][$costMd]);
		
		try {
			//Now starts a transaction
			$inDbo->beginTransaction();
			
			//Lock inventory table first
			$inDbo->executeBySqlParam('select id from inventory where id=? for update', $tran['in_id']);
				                        	
			//Calculate cost
			$cost=$costHdlr->getUnitCostByCheckout($tran['in_id'], $tran['qty']);
					
			//Update stock level
			$qtyLeft=$stock['qty'] - $tran['qty'];
			$stockDbo->setValue('qty', $qtyLeft);
			$stockDbo->setIdForUpdate($stock['id']);
			$stockDbo->update();
			
			//Update in stock level
			$nq = $in['qty_in_stock']-$tran['qty'];
			$inDbo->setValue('qty_in_stock', $nq);
			$inDbo->setIdForUpdate($in['id']);
			$inDbo->update();	
			
			//Add inTransaction
			$inTranDbo=CalemFactory::getDbo('in_tran');
			$it['in_id']=$tran['in_id'];
			$it['type_id']= 'itt_checkout';
			$it['location_id']=$tran['location_id'];
			$it['qty']=$tran['qty'];
			$it['qty_available']=$tran['qty'];
			$it['unit_cost']=$cost['unit_cost'];
			$it['costcode_id']=isset($tran['costcode_id']) ? $tran['costcode_id'] : null;
			$it['checkout_type_id']=$tran['checkout_type_id'];
			$it['checkout_to_id']=$tran['checkout_to_id'];
			$it['tran_total']=$cost['total'];
			$it['note']=isset($tran['note'])? $tran['note'] : null;
			$it['tran_time']=$tran['tran_time'];
			$it['tran_user_id']=isset($tran['tran_user_id']) ? $tran['tran_user_id'] : null;
			$it['store_user_id']=isset($tran['store_user_id']) ? $tran['store_user_id'] : null;
			//Generating a unique id
			$it['id']=$inTranDbo->getUid();
			$inTranDbo->setChangeBulk($it);
			$inTranDbo->insert();
			
			//Add cost flow (for LIFO, FIFO)
			if (isset($cost['cost_list']) && $cost['cost_list']) {
				$inTranWsDbo=CalemFactory::getDbo('in_tran_worksheet');
				foreach ($cost['cost_list'] as $costRow) {
					$ar=array();
					$ar['in_tran_id']=$it['id'];
					$ar['src_tran_id']=$costRow['id'];
					$ar['unit_cost']=$costRow['unit_cost'];
					$inTranWsDbo->setChangeBulk($ar);
					$inTranWsDbo->insert();
				}
			}
			
			//Notify checkout transactions
			$this->notify($this->conf['checkout']['notifier_list'], $it, $in['category_id']);
			
			//Review order, etc.
			$this->inBo->onInStockLevelChanged($tran['in_id'], $inDbo);
			
			//Commit transaction
			$inDbo->commit();
			return $it;
		} catch (Exception $ex) {
			if ($rollback) $inDbo->rollback();
			$this->logger->error('Error in check out transaction: ' . $ex->getMessage() . ', tran=' . var_export($tran, true));
			throw $ex;
		}               	                     	
   }
   
   /**
    * Return transaction
    */
   public function inReturn($tran, $rollback=false) {
   	if ($this->logger->isInfoEnabled()) $this->logger->info("Return transaction: " . var_export($tran, true));
   	//Get hold of the checkout transaction
		$inTranDbo=CalemFactory::getDbo('in_tran');
		$inTranRow=$inTranDbo->fetchById($tran['checkout_tran_id']);
		try {
			$inDbo=CalemFactory::getDbo('inventory');
			
			list($inDbo, $cost, $in)= $this->_returnCommon($inDbo, $inTranRow, $tran);
			$method= 'return_' . ($in['category_id']? $in['category_id'] : 'icg_part');
			$it=call_user_func(array($this, $method), $tran, array('inTranDbo'=>$inTranDbo, 'inTranRow'=>$inTranRow,
			                                            'inDbo'=>$inDbo, 'cost'=>$cost, 'in'=>$in));
			//Updating available on checkout tran.
			$inTranRow['qty_available'] -= $tran['qty'];
			$inTranDbo->clearChanges();
			$inTranDbo->setValue('qty_available', $inTranRow['qty_available']);
			$inTranDbo->setIdForUpdate($tran['checkout_tran_id']);
			$inTranDbo->update();
			
			//Review order, etc.
			$this->inBo->onInStockLevelChanged($inTranRow['in_id'], $inDbo);
				                                            
			//Commit transaction
			$inDbo->commit();
			return $it;
		} catch (Exception $ex) {
			if ($rollback) $inDbo->rollback();
			$this->logger->error('Error in return transaction: ' . $ex->getMessage() . ', tran=' . var_export($tran, true));
			throw $ex;
		}               	                     	
   }
   
   /**
	 * Part return transaction
	 * @param checkout_tran_id - checkout transaction id
	 * @param location_id - location to return to
	 * @param qty - qty to return
	 * @param note - note
	 * @param tran_time - time transaction happened
	 * @param tran_user_id - user to check out to
	 * @param store_user_id - staff performed the transaction
	 * 
	 */	
	public function return_icg_part($tran, $param) {
		$inTranRow=$param['inTranRow'];
		$cost=$param['cost'];
		$inTranDbo=$param['inTranDbo'];
				      			
		//Add inTransaction
		$it['in_id']=$inTranRow['in_id'];
		$it['type_id']= 'itt_return';
		$it['location_id']=$tran['location_id'];
		$it['qty']=$tran['qty'];
		$it['unit_cost']=$cost['unit_cost'];
		$it['costcode_id']=isset($inTranRow['costcode_id']) ? $inTranRow['costcode_id'] : null;
		$it['checkout_type_id']=$inTranRow['checkout_type_id'];
		$it['checkout_to_id']=$inTranRow['checkout_to_id'];
		$it['checkout_tran_id']=$tran['checkout_tran_id'];
		$it['tran_total']=$cost['total'];
		$it['note']=isset($tran['note'])? $tran['note'] : null;
		$it['tran_time']=$tran['tran_time'];
		$it['tran_user_id']=isset($tran['tran_user_id']) ? $tran['tran_user_id'] : null;
		$it['store_user_id']=isset($tran['store_user_id']) ? $tran['store_user_id'] : null;
		//Generating a unique id
		$it['id']=$inTranDbo->getUid();
		$inTranDbo->setChangeBulk($it);
		$inTranDbo->insert();
		
		//Notify return transactions
		$this->notify($this->conf['part_return']['notifier_list'], $it, 'icg_part'); 
		return $it;  	                     	
   }
   
   /**
	 * Tool return transaction
	 * @param checkout_tran_id - checkout transaction id
	 * @param location_id - location to return to
	 * @param qty - qty to return
	 * @param rent_duration - hours rented
	 * @param rent_rate - rent rate
	 * @param tran_total - total cost for tran
	 * @param note - note
	 * @param tran_time - time transaction happened
	 * @param tran_user_id - user to check out to
	 * @param store_user_id - staff performed the transaction
	 * 
	 */	
	public function return_icg_tool($tran, $param) {
		$inTranRow=$param['inTranRow'];
		$cost=$param['cost'];
		$inTranDbo=$param['inTranDbo'];
		//Add inTransaction
		$it['in_id']=$inTranRow['in_id'];
		$it['type_id']= 'itt_return';
		$it['location_id']=$tran['location_id'];
		$it['qty']=$tran['qty'];
		$it['unit_cost']=$cost['unit_cost'];
		$it['costcode_id']=isset($inTranRow['costcode_id']) ? $inTranRow['costcode_id'] : null;
		$it['checkout_type_id']=$inTranRow['checkout_type_id'];
		$it['checkout_to_id']=$inTranRow['checkout_to_id'];
		$it['checkout_tran_id']=$tran['checkout_tran_id'];		
		$it['rent_duration']=$tran['rent_duration'];
		$it['rent_rate']=$tran['rent_rate'];
		$it['tran_total']=$tran['tran_total'];
		$it['note']=isset($tran['note'])? $tran['note'] : null;
		$it['tran_time']=$tran['tran_time'];
		$it['tran_user_id']=isset($tran['tran_user_id']) ? $tran['tran_user_id'] : null;
		$it['store_user_id']=isset($tran['store_user_id']) ? $tran['store_user_id'] : null;
		//Generating a unique id
		$it['id']=$inTranDbo->getUid();
		$inTranDbo->setChangeBulk($it);
		$inTranDbo->insert();
		
		//Notify return transactions
		$this->notify($this->conf['tool_return']['notifier_list'], $it,'icg_tool');
		return $it;			      	                     		
   }
   
   /**
	 * Receive transaction (both part and tool are the same)
	 * @param in_id - item id
	 * @param location_id - stock location id
	 * @param qty - qty to check out
	 * @param unit_cost - purchase cost
	 * @param costcode_id - costcode 
	 * @param receive_type_id - receive from
	 * @param receive_from_id - source id
	 * @param tran_total - optional param.
	 * @param note - note
	 * @param tran_time - time transaction happened
	 * @param tran_user_id - user to check out to
	 * @param store_user_id - staff performed the transaction
	 * 
	 */	
	public function receive($tran, $rollback=false) {
		if ($this->logger->isInfoEnabled()) $this->logger->info("Receive transaction: " . var_export($tran, true));
		if ($tran['qty']<=0) return;
				                        	
		//Get valuation handler to find out unit cost                        	
		$inDbo=CalemFactory::getDbo("inventory");
		$in=$inDbo->fetchById($tran['in_id']);
		$costMd= (isset($in['valuation_type_id']) && $in['valuation_type_id']) ? $in['valuation_type_id'] : $this->conf['valuation']['default'];
		$costHdlr=CalemFactory::createInstance($this->conf['valuation'][$costMd]);
		
		try {
			//Now starts a transaction
			$inDbo->beginTransaction();
			
			//Lock inventory table first
			$inDbo->executeBySqlParam('select id from inventory where id=? for update', $tran['in_id']);
				                        	
			//Calculate cost
			$uc=0;
			if (isset($tran['unit_cost'])) {
				$uc=$tran['unit_cost'];	
			} else if (isset($tran['tran_total'])) {
				$uc=$tran['tran_total']/$tran['qty'];	
			} 
			$costHdlr->setUnitCostByReceive($tran['in_id'], $uc, $tran['qty']);
					
			//Update stock level
			$in=$this->_addStock($inDbo, $tran['in_id'], $tran['location_id'], $tran['qty'], true, true);
			
			//Add inTransaction
			$inTranDbo=CalemFactory::getDbo('in_tran');
			$it['in_id']=$tran['in_id'];
			$it['type_id']= 'itt_receive';
			$it['location_id']=$tran['location_id'];
			$it['qty']=$tran['qty'];
			$it['unit_cost']=$uc;
			$it['costcode_id']=isset($tran['costcode_id']) ? $tran['costcode_id'] : null;
			$it['receive_type_id']=$tran['receive_type_id'];
			$it['receive_from_id']=$tran['receive_from_id'];
			$it['qty_available']=$tran['qty'];
			$it['tran_total']=(isset($tran['tran_total']) && $tran['tran_total']) ? $tran['tran_total'] : ($tran['qty']*$uc);
			$it['note']=isset($tran['note'])? $tran['note'] : null;
			$it['tran_time']=$tran['tran_time'];
			$it['tran_user_id']=isset($tran['tran_user_id']) ? $tran['tran_user_id'] : null;
			$it['store_user_id']=isset($tran['store_user_id']) ? $tran['store_user_id'] : null;
			//Generating a unique id
			$it['id']=$inTranDbo->getUid();
			$inTranDbo->setChangeBulk($it);
			$inTranDbo->insert();
			
			//Notify transactions
			$this->notify($this->conf['receive']['notifier_list'], $it);
			
			//Review order, etc.
			$this->inBo->onInStockLevelChanged($tran['in_id'], $inDbo);
			
			//Commit transaction
			$inDbo->commit();
			return $it;
		} catch (Exception $ex) {
			if ($rollback) $inDbo->rollback();
			$this->logger->error('Error in check out transaction: ' . $ex->getMessage() . ', tran=' . var_export($tran, true));
			throw $ex;
		}               	                     	
   }
   
   /**
	 * Check-in transaction (both part and tool are the same)
	 * @param in_id - item id
	 * @param location_id - stock location id
	 * @param qty - qty to check out
	 * @param unit_cost - purchase cost
	 * @param costcode_id - costcode  
	 * @param note - note
	 * @param tran_time - time transaction happened
	 * @param tran_user_id - user to check out to
	 * @param store_user_id - staff performed the transaction
	 * 
	 */	
	public function checkin($tran, $rollback=false) {
		if ($this->logger->isInfoEnabled()) $this->logger->info("Check-in transaction: " . var_export($tran, true));
		if ($tran['qty']<=0) return;
				                        	
		//Get valuation handler to find out unit cost                        	
		$inDbo=CalemFactory::getDbo("inventory");
		$in=$inDbo->fetchById($tran['in_id']);
		$costMd= (isset($in['valuation_type_id']) && $in['valuation_type_id']) ? $in['valuation_type_id'] : $this->conf['valuation']['default'];
		$costHdlr=CalemFactory::createInstance($this->conf['valuation'][$costMd]);
		
		try {
			//Now starts a transaction
			$inDbo->beginTransaction();
			
			//Lock inventory table first
			$inDbo->executeBySqlParam('select id from inventory where id=? for update', $tran['in_id']);
				                        	
			//Calculate cost
			$costHdlr->setUnitCostByReceive($tran['in_id'], $tran['unit_cost'], $tran['qty']);
					
			//Update stock level
			$in=$this->_addStock($inDbo, $tran['in_id'], $tran['location_id'], $tran['qty']);
			
			//Add inTransaction
			$inTranDbo=CalemFactory::getDbo('in_tran');
			$it['in_id']=$tran['in_id'];
			$it['type_id']= 'itt_checkin';
			$it['location_id']=$tran['location_id'];
			$it['qty']=$tran['qty'];
			$it['unit_cost']=$tran['unit_cost'];
			$it['costcode_id']=isset($tran['costcode_id']) ? $tran['costcode_id'] : null;
			$it['qty_available']=$tran['qty'];
			$it['tran_total']= $tran['qty']*$tran['unit_cost'];
			$it['note']=isset($tran['note'])? $tran['note'] : null;
			$it['tran_time']=$tran['tran_time'];
			$it['tran_user_id']=isset($tran['tran_user_id']) ? $tran['tran_user_id'] : null;
			$it['store_user_id']=isset($tran['store_user_id']) ? $tran['store_user_id'] : null;
			//Generating a unique id
			$it['id']=$inTranDbo->getUid();
			$inTranDbo->setChangeBulk($it);
			$inTranDbo->insert();
			
			//Notify transactions
			$this->notify($this->conf['checkin']['notifier_list'], $it);
			
			//Review order, etc.
			$this->inBo->onInStockLevelChanged($tran['in_id'], $inDbo);
			
			//Commit transaction
			$inDbo->commit();
			return $it;
		} catch (Exception $ex) {
			if ($rollback) $inDbo->rollback();
			$this->logger->error('Error in check out transaction: ' . $ex->getMessage() . ', tran=' . var_export($tran, true));
			throw $ex;
		}               	                     	
   }
   
   /**
	 * Physical counting transaction (both part and tool are the same)
	 * @param in_id - item id
	 * @param location_id - stock location id
	 * @param qty - qty to set to
	 * @param costcode_id - costcode  
	 * @param note - note
	 * @param tran_time - time transaction happened
	 * @param tran_user_id - who did the counting
	 * @param store_user_id - staff performed the transaction
	 * 
	 */	
	public function physical($tran, $rollback=false) {
		if ($this->logger->isInfoEnabled()) $this->logger->info("Physical transaction: " . var_export($tran, true));
		if ($tran['qty']<=0) return;
				                        	
		//Get valuation handler to find out unit cost                        	
		$inDbo=CalemFactory::getDbo("inventory");
		$in=$inDbo->fetchById($tran['in_id']);
		
		try {
			//Now starts a transaction
			$inDbo->beginTransaction();
			
			//Lock inventory table first
			$inDbo->executeBySqlParam('select id from inventory where id=? for update', $tran['in_id']);
					
			//Update stock level
			$oldQty= $this->_setStock($inDbo, $tran['in_id'], $tran['location_id'], $tran['qty']);
			
			//Add inTransaction
			$inTranDbo=CalemFactory::getDbo('in_tran');
			$it['in_id']=$tran['in_id'];
			$it['type_id']= 'itt_physical';
			$it['location_id']=$tran['location_id'];
			$it['qty']=$tran['qty'];
			$it['qty_orig']=$oldQty;
			$it['costcode_id']=isset($tran['costcode_id']) ? $tran['costcode_id'] : null;
			$it['note']=isset($tran['note'])? $tran['note'] : null;
			$it['tran_time']=$tran['tran_time'];
			$it['tran_user_id']=isset($tran['tran_user_id']) ? $tran['tran_user_id'] : null;
			$it['store_user_id']=isset($tran['store_user_id']) ? $tran['store_user_id'] : null;
			//Generating a unique id
			$it['id']=$inTranDbo->getUid();
			$inTranDbo->setChangeBulk($it);
			$inTranDbo->insert();
			
			//Notify transactions
			$this->notify($this->conf['physical']['notifier_list'], $it);
			
			//Review order, etc.
			$this->inBo->onInStockLevelChanged($tran['in_id'], $inDbo);
			
			//Commit transaction
			$inDbo->commit();
			return $it;
		} catch (Exception $ex) {
			if ($rollback) $inDbo->rollback();
			$this->logger->error('Error in check out transaction: ' . $ex->getMessage() . ', tran=' . var_export($tran, true));
			throw $ex;
		}               	                     	
   }		
   
   /**
	 * Move transaction (both part and tool are the same)
	 * @param in_id - item id
	 * @param orig_loc_id - original location id
	 * @param location_id - stock location id
	 * @param qty - qty to move  
	 * @param note - note
	 * @param tran_time - time transaction happened
	 * @param tran_user_id - who did the counting
	 * @param store_user_id - staff performed the transaction
	 * 
	 */	
	public function move($tran, $rollback=false) {
		if ($this->logger->isInfoEnabled()) $this->logger->info("Move transaction: " . var_export($tran, true));
		if ($tran['qty']<=0) return;
				                        	
		//Get valuation handler to find out unit cost                        	
		$inDbo=CalemFactory::getDbo("inventory");
		$in=$inDbo->fetchById($tran['in_id']);
		
		try {
			//Now starts a transaction
			$inDbo->beginTransaction();
			
			//Lock inventory table first
			$inDbo->executeBySqlParam('select id from inventory where id=? for update', $tran['in_id']);
					
			//Update stock level
			$this->_reduceStock($tran['in_id'], $tran['orig_loc_id'], $tran['qty']);
			$this->_addStock($inDbo, $tran['in_id'], $tran['location_id'], $tran['qty'], false);
			
			//Add inTransaction
			$inTranDbo=CalemFactory::getDbo('in_tran');
			$it['in_id']=$tran['in_id'];
			$it['type_id']= 'itt_move';
			$it['location_id']=$tran['location_id'];
			$it['qty']=$tran['qty'];
			$it['orig_loc_id']=$tran['orig_loc_id'];
			$it['costcode_id']=isset($tran['costcode_id']) ? $tran['costcode_id'] : null;
			$it['note']=isset($tran['note'])? $tran['note'] : null;
			$it['tran_time']=$tran['tran_time'];
			$it['tran_user_id']=isset($tran['tran_user_id']) ? $tran['tran_user_id'] : null;
			$it['store_user_id']=isset($tran['store_user_id']) ? $tran['store_user_id'] : null;
			//Generating a unique id
			$it['id']=$inTranDbo->getUid();
			$inTranDbo->setChangeBulk($it);
			$inTranDbo->insert();
			
			//Notify transactions
			$this->notify($this->conf['move']['notifier_list'], $it);
			
			//Commit transaction
			$inDbo->commit();
			return $it;
		} catch (Exception $ex) {
			if ($rollback) $inDbo->rollback();
			$this->logger->error('Error in check out transaction: ' . $ex->getMessage() . ', tran=' . var_export($tran, true));
			throw $ex;
		}               	                     	
   }
   
   /**
    * Common functions for return
    */
   private function _returnCommon($inDbo, $inTranRow, $tran) {
		//Now starts a transaction
		$inDbo->beginTransaction();
		
		//Lock inventory table first
		$inDbo->executeBySqlParam('select id from inventory where id=? for update', $inTranRow['in_id']);
		
		//Adjust stock level first
		$in=$this->_addStock($inDbo, $inTranRow['in_id'], $inTranRow['location_id'], $tran['qty']);
		$costMd= (isset($in['valuation_type_id']) && $in['valuation_type_id']) ? $in['valuation_type_id'] : $this->conf['valuation']['default'];
		$costHdlr=CalemFactory::createInstance($this->conf['valuation'][$costMd]);
		$cost=$costHdlr->setUnitCostByReturn($inTranRow, $tran['qty']);
		
		return array($inDbo, $cost, $in);	
   }
   
   /**
    * Add items to stock
    */
   private function _addStock($inDbo, $in_id, $location_id, $qty, $adjustIn=true, $reduceOnOrder=false) {
   	//Adjust stock level
		$stockDbo=CalemFactory::getDbo('in_stock');
		try {
			$stocks=$stockDbo->fetchBySqlParam('select * from in_stock where in_id=? and location_id=?', 
					array($in_id, $location_id));
			$stockRow=$stocks[0];
			$qtyNew=$stockRow['qty']+$qty;
			$stockDbo->setValue('qty', $qtyNew);
			$stockDbo->setIdForUpdate($stockRow['id']);
			$stockDbo->update();
		} catch (CalemDboDataNotFoundException $ex) {
			//Add a new location here.
			$ar=array();
			$ar['in_id']=$in_id;
			$ar['location_id']=$location_id;
			$ar['qty']=$qty;
			$stockDbo->setChangeBulk($ar);
			$stockDbo->insert();	
		}
		//Update in stock level
		$in=null;
		if ($adjustIn) {
			$in=$inDbo->fetchById($in_id);
			$nq = $in['qty_in_stock']+$qty;
			$inDbo->setValue('qty_in_stock', $nq);
			if ($reduceOnOrder) {
				$oq=max($in['qty_on_order']-$qty, 0);
				$inDbo->setValue('qty_on_order', $oq);	
			}
			$inDbo->setIdForUpdate($in_id);
			$inDbo->update();
		}
		return $in;	
   }   	
   
   /**
    * Set stock level
    */
   private function _setStock($inDbo, $in_id, $location_id, $qty) {
   	//Adjust stock level
   	$oldQty=0;
		$stockDbo=CalemFactory::getDbo('in_stock');
		try {
			$stocks=$stockDbo->fetchBySqlParam('select * from in_stock where in_id=? and location_id=?', 
					array($in_id, $location_id));
			$stockRow=$stocks[0];
			$oldQty=$stockRow['qty'];
			$stockDbo->setValue('qty', $qty);
			$stockDbo->setIdForUpdate($stockRow['id']);
			$stockDbo->update();
		} catch (CalemDboDataNotFoundException $ex) {
			//Add a new location here.
			$ar=array();
			$ar['in_id']=$in_id;
			$ar['location_id']=$location_id;
			$ar['qty']=$qty;
			$stockDbo->setChangeBulk($ar);
			$stockDbo->insert();	
		}
		//Re-calculate stock level
		$sc=$inDbo->getCountBySqlParam('select sum(qty) from in_stock where in_id=?', array($in_id));
		$inDbo->setValue('qty_in_stock', $sc);
		$inDbo->setIdForUpdate($in_id);
		$inDbo->update();	
		return $oldQty;
   }
   
   /**
    * Remove stock
    */
	private function _reduceStock($in_id, $location_id, $qty) {
		$stockDbo=CalemFactory::getDbo('in_stock');
		$stockDbo->updateBySqlParam('update in_stock set qty= qty - ' . $qty . ' where in_id=? and location_id=?', array($in_id, $location_id));	
	}    
   
   /**
    * Notify transaction
    */
   public function notify($nfl, $it, $category=false) {
   	if (!$nfl) return;
   	$nfs=CalemInTranNotifierFactory::getNotifiers($nfl, $this->conf['tran_notifier_map']);
   	if (!$nfs) return;
   	
   	foreach ($nfs as $nf) {
   		$notifier=$nf->getNotifier($it);
 			$method= ($category ? 'on_'.$it['type_id'].'_'.$category : 'on_'.$it['type_id']);
   		call_user_func(array($notifier, $method), $it);	
   	}
   }
}
