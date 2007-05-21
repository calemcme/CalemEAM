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
			
			 //CONF
			'/modules/schedule/CalemSchedConf.js',
			
			 //Menu
         '/modules/schedule/form/CalemSchedMenuDef.js',
         
         //schedule user
         '/modules/schedule/form/view/CalemSchedUserViewListDef.js',
         '/modules/schedule/form/view/CalemSchedUserViewLookupDef.js',
         '/modules/schedule/form/view/CalemSchedUserViewNewDef.js',
         '/modules/schedule/form/view/CalemSchedUserViewReadDef.js',
         '/modules/schedule/form/view/CalemSchedUserViewEditDef.js',
         '/modules/schedule/form/view/CalemSchedUserViewSearchDef.js',
         
         //sched by user, by team
         '/modules/schedule/form/view/CalemSchedByUserViewEditDef.js',
         '/modules/schedule/form/view/CalemSchedByTeamViewEditDef.js',


			//Forms
			
         //schedule forms
         '/modules/schedule/form/controller/CalemSchedUserFormList.js',
         '/modules/schedule/form/controller/CalemSchedUserFormRead.js',
         '/modules/schedule/form/controller/CalemSchedUserFormNew.js',
         '/modules/schedule/form/controller/CalemSchedUserFormEdit.js',
         '/modules/schedule/form/controller/CalemSchedUserFormLookup.js',
         
         //meter_type forms
         '/modules/schedule/form/controller/CalemSchedByUserFormEdit.js',
         '/modules/schedule/form/controller/CalemSchedByTeamFormEdit.js',
			
         //Asset module
			'/modules/schedule/form/CalemSchedItemDef.js',
			'/modules/schedule/form/CalemSchedModuleDef.js',
			)
		)
);

?>