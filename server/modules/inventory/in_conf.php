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
 * This file defined the configuration for this installation by 
 * combining the custom with the distributed installation. 
 */
 
//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

/**
 * Inventory configuration
 */
$_CALEM_dist['in_conf']=array( 
	'in_no'=>array('format'=>'IN%06d'),
   //
   //In order request generation
   //
	'in_order_gen'=>array(
		'req_auto'=>array(
		   'init'=>array(
				'status_id'=>'req_status_new',
				'state_id'=>'req_state_open',
				'description'=>'Inventory auto-reorder request',
				'priority_id'=>'reqp_operation',
				'source_id'=>'req_source_auto',
				'req_on_po_id'=>'req_on_po_none',
				'shipping_type_id'=>'shipping_ground'
			)		
		),
		'req_manual'=>array(
			'init'=>array(
				'status_id'=>'req_status_new',
				'state_id'=>'req_state_open',
				'description'=>'Inventory manual-reorder request',
				'priority_id'=>'reqp_operation',
				'source_id'=>'req_source_auto',
				'req_on_po_id'=>'req_on_po_none',
				'shipping_type_id'=>'shipping_ground'
			)		
		)
	),
	
	//
	//Inventory transaction use
	// 
	'valuation'=>array(
		'default'=>'inv_avg',
		'inv_avg'=>array(
			'path'=>'server/modules/inventory/',
			'name'=>'CalemInCostAvgBo'
		)
	),
	
   'checkout'=>array(
   	'negativeLevel'=>1, //1 - allow, -1 - exception
   	'noCost'=>1,   //1 - use avgUnitCost, -1 - exception
   	'notifier_list'=>array(
   		'by_checkout_to',
   		'in_notifier'   	
   	)
   ),
   
   'part_return'=>array(
   	'noCost'=>1,   //1 - use avgUnitCost, -1 - exception
   	'notifier_list'=>array(
   		'by_checkout_to',
   		'in_notifier'   	
   	)
   ),
   
   'tool_return'=>array(
   	'noCost'=>1,   //1 - use avgUnitCost, -1 - exception
   	'notifier_list'=>array(
   		'by_checkout_to',
   		'in_notifier'   	
   	)
   ),
   
   'receive'=>array(
   	'notifier_list'=>array(
   		'in_notifier'   	
   	)
   ),
   
   'checkin'=>array(
   	'notifier_list'=>array(
   		'in_notifier'   	
   	)
   ),
   
   'physical'=>array(
   	'notifier_list'=>array(
   		'in_notifier'   	
   	)
   ),
   
   'move'=>array(
   	'notifier_list'=>array(
   		'in_notifier'   	
   	)
   ),
   
   'tran_notifier_map'=>array(
      'by_checkout_to'=>array(
   		'path'=>'server/modules/inventory/',
   		'name'=>'CalemInTranNotifyOtherFactory'
	   ),
   	'ict_wo'=>array(
   		'path'=>'server/modules/workorder/',
   		'name'=>'CalemInTranNotifierWo'
   	),
   	'ict_asset'=>array(
   		'path'=>'server/modules/asset/',
   		'name'=>'CalemInTranNotifierAsset'
   	),
   	'ict_project'=>array(
   		'path'=>'server/modules/inventory/',
   		'name'=>'CalemInTranNotifierNone'
   	),
   	'ict_user'=>array(
   		'path'=>'server/modules/inventory/',
   		'name'=>'CalemInTranNotifierNone'
   	),
	   'in_notifier'=>array(
	   	'path'=>'server/modules/inventory/',
	   	'name'=>'CalemInTranNotifierIn'
	   )
   )
);

?>
