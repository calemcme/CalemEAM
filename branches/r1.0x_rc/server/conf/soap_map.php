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
 * Soap Service mapping from method name to module and classes.
 * 
 */
define('CALEM_SF_NO_POSTDATA', 		'NoPostData'); 
define('CALEM_SF_INVALID_METHOD', 	'InvalidMethod');
define('CALEM_SF_INVALID_HEADER',	'InvalidHeaders');
define('CALEM_SF_INVLIAD_PARAMS',	'InvalidParams');
define('CALEM_SF_INVALID_LOGIN', 	'InvalidLogin');
define('CALEM_SF_NO_SESSION', 		'NoActiveSession');
define('CALEM_SF_UNKNOWN', 			'Unknown');
//starting configuration
$_CALEM_soap=array(
	'Login'=>array('module'=>'admin', 'class'=>'CalemLoginSo'),
	'Logout'=>array('module'=>'admin', 'class'=>'CalemLogoutSo'),
	'BulkFetch'=>array('module'=>'database', 'class'=>'CalemBulkFetchSo'),
	'InsertData'=>array('module'=>'database', 'class'=>'CalemDataSo'),
	'DeleteData'=>array('module'=>'database', 'class'=>'CalemDataSo'),
	'UpdateData'=>array('module'=>'database', 'class'=>'CalemDataSo'),
	'ModifyDataTran'=>array('module'=>'database', 'class'=>'CalemDataSo'),
	
	/** 
	 * Customization - view, form, search, modules, module menu, custom fields and dropdowns.
	 */
	'SaveView'=>array('module'=>'admin', 'class'=>'CalemViewSo'),
	'SaveForm'=>array('module'=>'admin', 'class'=>'CalemFormSo'),
	'SaveSearch'=>array('module'=>'admin', 'class'=>'CalemSearchSo'),
	'DeleteSearch'=>array('module'=>'admin', 'class'=>'CalemSearchSo'),
	'RefreshSearch'=>array('module'=>'admin', 'class'=>'CalemSearchSo'),
	'SaveModList'=>array('module'=>'admin', 'class'=>'CalemModListSo'),
	'LoadCustomInfo'=>array('module'=>'admin', 'class'=>'CalemCustomInfoSo'),
	'SaveModule'=>array('module'=>'admin', 'class'=>'CalemModuleSo'),

	// Custom fields
	'AddField'=>array('module'=>'admin', 'class'=>'CalemCustomFieldSo'),
	'DeleteField'=>array('module'=>'admin', 'class'=>'CalemCustomFieldSo'),
	'ModifyFieldName'=>array('module'=>'admin', 'class'=>'CalemCustomFieldSo'),
	'ModifyFieldType'=>array('module'=>'admin', 'class'=>'CalemCustomFieldSo'),
	'EditLabel'=>array('module'=>'admin', 'class'=>'CalemCustomFieldSo'),
	
	// Custom dropdown
	'AddDropdown'=>array('module'=>'admin', 'class'=>'CalemCustomDropdownSo'),
	'DeleteDropdown'=>array('module'=>'admin', 'class'=>'CalemCustomDropdownSo'),
	'ModifyDropdown'=>array('module'=>'admin', 'class'=>'CalemCustomDropdownSo'),
	'SwapDropdown'=>array('module'=>'admin', 'class'=>'CalemCustomDropdownSo'),
	
	// In Transaction
	'InTranCheckout'=>array('module'=>'inventory', 'class'=>'CalemInTranSo'),
	'InTranReturn'=>array('module'=>'inventory', 'class'=>'CalemInTranSo'),
	'InTranPhysical'=>array('module'=>'inventory', 'class'=>'CalemInTranSo'),
	'InTranMove'=>array('module'=>'inventory', 'class'=>'CalemInTranSo'),
	'InTranReceive'=>array('module'=>'inventory', 'class'=>'CalemInTranSo'),
	'InTranCheckin'=>array('module'=>'inventory', 'class'=>'CalemInTranSo'),
	'GenInOrderRequest'=>array('module'=>'inventory', 'class'=>'CalemInOrderGenSo'),
	
	 //Batch schedule	
	'BatchSchedule'=>array('module'=>'schedule', 'class'=>'CalemScheduleSo'),
	
	 //workorders
	'LookupWoNewByPm'=>array('module'=>'workorder', 'class'=>'CalemWoSo'),
	
	 //REQ
	'VerifyReqStatusChange'=>array('module'=>'requisition', 'class'=>'CalemReqSo'),
	
	 //Purchase
	'AddPoItemFromReq'=>array('module'=>'purchase', 'class'=>'CalemPoSo'),
	'RemovePoItemFromReq'=>array('module'=>'purchase', 'class'=>'CalemPoSo'),
	'VerifyPoStatusChange'=>array('module'=>'purchase', 'class'=>'CalemPoSo'),
	
	 //Budget
	'UpdateBudgetActual'=>array('module'=>'budget', 'class'=>'CalemBudgetSo'),
);
?>
