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
CalemMenuDef['CalemPoFormList'] = {
	id: 'CalemPoFormList',
	title: 'po_list',
	icon: 'CalemPo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemPoMineFormList'] = {
	id: 'CalemPoMineFormList',
	title: 'po_mine',
	icon: 'CalemPo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

//tax code
CalemMenuDef['CalemTaxCodeFormList'] = {
	id: 'CalemTaxCodeFormList',
	title: 'tax_code',
	icon: 'CalemPo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

//poAddress
CalemMenuDef['CalemPoAddressFormList'] = {
	id: 'CalemPoAddressFormList',
	title: 'po_address',
	icon: 'CalemPo',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemTbPoStatusLog'] = {
	id: 'CalemTbPoStatusLog',
	title: 'po_view_status_log',
	icon: 'CalemOpen',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'PoStatusLog'}}	
};

CalemMenuDef['CalemTbPoReopen'] = {
	id: 'CalemTbPoReopen',
	title: 'po_reopen_po',
	icon: 'CalemReopen',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'ReopenPo'}}	
};

CalemMenuDef['CalemTbPoAddItem'] = {
	id: 'CalemTbPoAddItem',
	title: 'po_add_item',
	icon: 'CalemPoItemAdd',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'PoAddItem'}}	
};

CalemMenuDef['CalemTbPoRemoveItem'] = {
	id: 'CalemTbPoRemoveItem',
	title: 'po_remove_item',
	icon: 'CalemPoItemRemove',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'PoRemoveItem'}}	
};

CalemMenuDef['CalemPoOpenForms'] = {
	id: 'CalemPoOpenForms',
	title: 'po_open_forms',
	icon: 'CalemOpen',
	disIcon: null,
	tooltip: null,
	enabled: true,				   
	onSelect: null	
}; 
