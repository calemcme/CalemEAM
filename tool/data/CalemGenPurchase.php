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

$_CALEM_gen_data = array(
	'title'=>' Purchase module ' . "<br>",
   'regenerate'=>true,
   'overwrite'=>false,
   'dataList'=>array(
      array( //list include
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/requisition/',
				'pattern'=>'JsListRequisition'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/',
   			'pattern'=>'JsListPurchase')
   	),
   	array( //module def
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/',
				'pattern'=>'CalemReq'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/',
   			'pattern'=>'CalemPo')   				    
   	),
   	
   	//req -> po
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/controller/',
				'pattern'=>'CalemReq'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/controller/',
   			'pattern'=>'CalemPo'),
   		'file_patterns'=>array(
		   	'CalemReq'=>'CalemPo'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/view/',
				'pattern'=>'CalemReq'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/view/',
   			'pattern'=>'CalemPo'),
   		'file_patterns'=>array(
   			'CalemReq'=>'CalemPo',
		   	'req_no'=>'po_no'
		   )
   	),
   	
   	//req_item => po_tax
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/controller/',
				'pattern'=>'CalemReqItem'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/controller/',
   			'pattern'=>'CalemPoTax')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/view/',
				'pattern'=>'CalemReqItem'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/view/',
   			'pattern'=>'CalemPoTax'),
   		'file_patterns'=>array(
		   	'in_id'=>'tax_rate'
		   )
   	),
   	//Tax info - md tab form
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/budget/form/controller/',
				'pattern'=>'CalemBudgetTitle'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/controller/',
   			'pattern'=>'CalemTaxCode'),
   		'file_patterns'=>array(
   			'CalemBudgetTitle'=>'CalemTaxCode'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/budget/form/view/',
				'pattern'=>'CalemBudgetTitle'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/view/',
   			'pattern'=>'CalemTaxCode'),
   		'file_patterns'=>array(
   			'CalemBudgetTitle'=>'CalemTaxCode',
		   	'title'=>'tax_code'
		   )
   	),
   	
   	//Tax info - md tab form
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/budget/form/controller/',
				'pattern'=>'CalemBudgetForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/controller/',
   			'pattern'=>'CalemTaxRateForm'),
   		'file_patterns'=>array(
   			'CalemBudgetForm'=>'CalemTaxRateForm'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/budget/form/view/',
				'pattern'=>'CalemBudgetView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/view/',
   			'pattern'=>'CalemTaxRateView'),
   		'file_patterns'=>array(
   			'CalemBudgetView'=>'CalemTaxRateView',
		   	'start_date'=>'tax_rate'
		   )
   	),
   	
   	//Vendor
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/budget/form/controller/',
				'pattern'=>'CalemCostcode'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/controller/',
   			'pattern'=>'CalemVendor'),
   		'file_patterns'=>array(
   			'CalemCostcode'=>'CalemVendor'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/budget/form/view/',
				'pattern'=>'CalemCostcode'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/view/',
   			'pattern'=>'CalemVendor'),
   		'file_patterns'=>array(
   		   'CalemCostcode'=>'CalemVendor',
		   	'costcode'=>'vendor'
		   )
   	),
   	
   	//Address
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/budget/form/controller/',
				'pattern'=>'CalemCostcode'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/controller/',
   			'pattern'=>'CalemPoAddress'),
   		'file_patterns'=>array(
   			'CalemCostcode'=>'CalemPoAddress'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/budget/form/view/',
				'pattern'=>'CalemCostcode'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/view/',
   			'pattern'=>'CalemPoAddress'),
   		'file_patterns'=>array(
   		   'CalemCostcode'=>'CalemPoAddress',
		   	'costcode'=>'address'
		   )
   	),
   	
   	//report
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/report/',
				'pattern'=>'CalemReq'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/report/',
   			'pattern'=>'CalemPo'),
   		'file_patterns'=>array(
   			'CalemReq'=>'CalemPo',
   			'requisition'=>'po',
   			'req_item'=>'po_item',
   			'req_id'=>'po_id'
		   )
   	),
   	
   	//action
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/action/',
				'pattern'=>'CalemReq'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/form/action/',
   			'pattern'=>'CalemPo'),
   		'file_patterns'=>array(
   			'CalemReq'=>'CalemPo',
   			'requisition'=>'po',
   			'req_item'=>'po_item',
   			'req_id'=>'po_id'
		   )
   	),
   	
   	//BO
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/requisition/bo/',
				'pattern'=>'CalemReq'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/purchase/bo/',
   			'pattern'=>'CalemPo'),
   		'file_patterns'=>array(
   			'CalemReq'=>'CalemPo',
   			'requisition'=>'po',
   			'req_item'=>'po_item',
   			'req_id'=>'po_id'
		   )
   	),
   	
   ),
   'file_patterns'=>array(
   	'CalemReq'=>'CalemPo',
   	'requisition'=>'purchase',
   	'CalemReqItem'=>'CalemPoItem',
   	'req_item'=>'po_item',
   	'requisition_list'=>'po_list'
	)
);

?>
