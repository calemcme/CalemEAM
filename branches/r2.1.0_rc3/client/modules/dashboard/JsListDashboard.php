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

$_CALEM_scripts=array(
	'Calem.js'=>array(
   	'path'=>'client',
   	'files'=>array(
			//BO
			
			//Menu
         '/modules/dashboard/form/CalemDashMenuDef.js',
         //Views
         '/modules/dashboard/form/view/CalemDashWoOrigDayViewChartDef.js',
         '/modules/dashboard/form/view/CalemDashWoOrigMdViewChartDef.js',
         '/modules/dashboard/form/view/CalemDashWoStatusPieViewChartDef.js',
         '/modules/dashboard/form/view/CalemDashWoAgePriViewChartDef.js',
         
		   
			//Controllers
			'/modules/dashboard/form/controller/CalemDashWoOrigDayFormChart.js',
			'/modules/dashboard/form/controller/CalemDashWoOrigMdFormChart.js',
			'/modules/dashboard/form/controller/CalemDashWoStatusPieFormChart.js',
			'/modules/dashboard/form/controller/CalemDashWoAgePriFormChart.js',
			'/modules/dashboard/form/controller/CalemDashFormPeerTab.js',
		   
			//ItemDef
			'/modules/dashboard/form/CalemDashItemDef.js',
			//Module
			'/modules/dashboard/form/CalemDashModuleDef.js',
			)
		)
);

?>