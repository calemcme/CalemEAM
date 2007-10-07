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
 * Admin module menu
 */

//Modules Form

// forms
CalemMenuDef['CalemInFormList'] = {
	id: 'CalemInFormList',
	title: 'inventory',
	icon: 'CalemIn',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemInLocationFormList'] = {
	id: 'CalemInLocationFormList',
	title: 'in_location',
	icon: 'CalemIn',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

//Codes
CalemMenuDef['CalemInCodes'] = {
	id: 'CalemInCodes',
	title: 'in_codes',
	icon: 'CalemCodes',
	disIcon: null,
	tooltip: null,
	enabled: true,				   
	onSelect: null	
}; 

CalemMenuDef['CalemInTypeFormList'] = {
	id: 'CalemInTypeFormList',
	title: 'in_type',
	icon: 'CalemIn',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemUomFormList'] = {
	id: 'CalemUomFormList',
	title: 'uom',
	icon: 'CalemIn',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemUomMapFormList'] = {
	id: 'CalemUomMapFormList',
	title: 'uom_map',
	icon: 'CalemIn',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};


//Meter readings
CalemMenuDef['CalemTbInTranWorksheet'] = {
	id: 'CalemTbInTranWorksheet',
	title: 'view_in_tran_worksheet',
	icon: 'CalemOpen',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenInTranWorksheet'}}	
};

/**
 * Inventory transactions
 * - Checkout - part/tool checkout
 * - Return - part/tool return
 * - Receive - Receive part/tool from purchase
 * - Physical - physical counting of part/tool
 * - Move - move part/tool
 * - Checkin - Check in parts for there're no Purchase history
 */
CalemMenuDef['CalemTbInCheckout'] = {
	id: 'CalemTbInCheckout',
	title: 'in_tb_checkout',
	icon: 'CalemInCheckout',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenInCheckout'}}	
};

CalemMenuDef['CalemTbInReturn'] = {
	id: 'CalemTbInReturn',
	title: 'in_tb_return',
	icon: 'CalemInReturn',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenInReturn'}}	
};

CalemMenuDef['CalemTbInTranReturn'] = {
	id: 'CalemTbInTranReturn',
	title: 'in_tb_return',
	icon: 'CalemInReturn',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenInTranReturn'}}	
};

CalemMenuDef['CalemTbInReceive'] = {
	id: 'CalemTbInReceive',
	title: 'in_tb_receive',
	icon: 'CalemInReceive',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenInReceive'}}	
};

CalemMenuDef['CalemTbInTranReceive'] = {
	id: 'CalemTbInTranReceive',
	title: 'in_tb_receive',
	icon: 'CalemInReceive',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenInTranReceive'}}	
};

CalemMenuDef['CalemTbInPhysical'] = {
	id: 'CalemTbInPhysical',
	title: 'in_tb_physical',
	icon: 'CalemInPhysical',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenInPhysical'}}	
};

CalemMenuDef['CalemTbInMove'] = {
	id: 'CalemTbInMove',
	title: 'in_tb_move',
	icon: 'CalemInMove',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenInMove'}}	
};

CalemMenuDef['CalemTbInCheckin'] = {
	id: 'CalemTbInCheckin',
	title: 'in_tb_checkin',
	icon: 'CalemInCheckin',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenInCheckin'}}	
};

// Generate order request
CalemMenuDef['CalemTbInGenOrderReq'] = {
	id: 'CalemTbInGenOrderReq',
	title: 'in_tb_gen_order_req',
	icon: 'CalemNew',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'InGenOrderReq'}}	
};

CalemMenuDef['CalemInOrderFormList'] = {
	id: 'CalemInOrderFormList',
	title: 'in_order_list',
	icon: 'CalemIn',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};


