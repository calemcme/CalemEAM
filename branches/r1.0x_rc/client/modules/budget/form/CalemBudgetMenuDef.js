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
 * Budget module menu
 */

// Budget list form
CalemMenuDef['CalemBudgetTitleFormList'] = {
	id: 'CalemBudgetTitleFormList',
	title: 'budget_list',
	icon: 'CalemBudget',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	menu_style: DwtMenuItem.RADIO_STYLE,
	menu_className: null, 				   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}	
};

// update actual from EAM
CalemMenuDef['CalemTbBudgetUpdate'] = {
	id: 'CalemTbBudgetUpdate',
	title: 'menu_budget_update_actual',
	icon: 'CalemBudgetUpdate',
	disIcon: null,
	enabled: false,
	tooltip: null, 
	style: (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_LEFT),  	
	btn_style: null,			   
	radioGroupId: null,
	idx: null,
	className: 'TBButton',
	posStyle: null,
	onSelect: {CalemMenuSelect: {listener: 'BudgetUpdateListener'}}
};

CalemMenuDef['CalemTbBudgetReopen'] = {
	id: 'CalemTbBudgetReopen',
	title: 'budget_reopen_budget',
	icon: 'CalemReopen',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'ReopenBudget'}}	
};

CalemMenuDef['CalemTbBudgetStatusLog'] = {
	id: 'CalemTbBudgetStatusLog',
	title: 'budget_view_status_log',
	icon: 'CalemOpen',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'BudgetStatusLog'}}	
};

// Budget list form
CalemMenuDef['CalemCostcodeFormList'] = {
	id: 'CalemCostcodeFormList',
	title: 'costcode',
	icon: 'CalemBudget',
	disIcon: null,
	enabled: true,
	tooltip: null, 
	menu_style: DwtMenuItem.RADIO_STYLE,
	menu_className: null, 				   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}	
};