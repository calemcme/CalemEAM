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
 * PM module menu
 */

// forms
CalemMenuDef['CalemPmFormList'] = {
	id: 'CalemPmFormList',
	title: 'pm',
	icon: 'CalemPm',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

CalemMenuDef['CalemPmFormList'] = {
	id: 'CalemPmFormList',
	title: 'pm',
	icon: 'CalemPm',
	disIcon: null,
	tooltip: null, 
	enabled: true,		   
	onSelect: {CalemMenuSelect: {listener: 'OpenFormListener'}}
};

//Meter release
CalemMenuDef['CalemTbPmMeterSchedule'] = {
	id: 'CalemTbPmMeterSchedule',
	title: 'view_meter_schedule',
	icon: 'CalemOpen',
	enabled: false,
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenPmMeterSchedule'}}	
};

CalemMenuDef['CalemTbPmSeason'] = {
	id: 'CalemTbPmSeason',
	title: 'view_pm_season',
	icon: 'CalemOpen',
	enabled: false,
	className: 'TBButton',
	onSelect: {CalemMenuSelect: {listener: 'OpenPmSeason'}}	
};
