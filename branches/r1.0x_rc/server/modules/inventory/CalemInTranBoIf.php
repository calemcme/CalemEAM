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

/**
 * This is the inventory transaction business object interface.
 */
 
interface CalemInTranBoIf {
	/**
	 * Part checkout transaction
	 * @param in_id - item id
	 * @param location_id - stock location id
	 * @param qty - qty to checkout
	 * @param costcode_id - costcode 
	 * @param checkout_type_id - one of wo, asset, ...
	 * @param checkout_to_id - id of wo, ...
	 * @param note - note
	 * @param tran_time - time transaction happened
	 * @param tran_user_id - user to check out to
	 * @param store_user_id - staff performed the transaction
	 * 
	 */	
	public function checkout($tran); 
	
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
	public function inReturn($tran); 
	
	/**
	 * Receive transaction (both part and tool are the same)
	 * @param in_id - item id
	 * @param location_id - stock location id
	 * @param qty - qty to check out
	 * @param unit_cost - purchase cost
	 * @param costcode_id - costcode 
	 * @param po_id - PO 
	 * @param tran_total - optional param.
	 * @param note - note
	 * @param tran_time - time transaction happened
	 * @param tran_user_id - user to check out to
	 * @param store_user_id - staff performed the transaction
	 * 
	 */	
	public function receive($tran);
	
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
	public function checkin($tran);
	          
}	
?>
