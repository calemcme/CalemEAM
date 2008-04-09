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
			
			 // BO
			'/modules/project/bo/CalemProjectBo.js',
			'/modules/project/bo/CalemProjectTypeBo.js',
			
			 //Menu
         '/modules/project/form/CalemProjectMenuDef.js',
         
         //project views
         '/modules/project/form/view/CalemProjectViewListDef.js',
         '/modules/project/form/view/CalemProjectViewLookupDef.js',
         '/modules/project/form/view/CalemProjectViewNewDef.js',
         '/modules/project/form/view/CalemProjectViewReadDef.js',
         '/modules/project/form/view/CalemProjectViewEditDef.js',
         '/modules/project/form/view/CalemProjectViewSearchDef.js',
         //Downtime
         '/modules/project/form/view/CalemSubProjectViewListDef.js',
         '/modules/project/form/view/CalemSubProjectViewNewDef.js',
         '/modules/project/form/view/CalemSubProjectViewEditDef.js',
         '/modules/project/form/view/CalemSubProjectViewReadDef.js',
         //Comment
         '/modules/project/form/view/CalemProjectWoViewListDef.js',
         
         //project type
         '/modules/project/form/view/CalemProjectTypeViewListDef.js',
         '/modules/project/form/view/CalemProjectTypeViewLookupDef.js',
         '/modules/project/form/view/CalemProjectTypeViewNewDef.js',
         '/modules/project/form/view/CalemProjectTypeViewReadDef.js',
         '/modules/project/form/view/CalemProjectTypeViewEditDef.js',
         '/modules/project/form/view/CalemProjectTypeViewSearchDef.js',
         
         //project forms
         '/modules/project/form/controller/CalemProjectFormList.js',
         '/modules/project/form/controller/CalemProjectFormMdTab.js',
         '/modules/project/form/controller/CalemProjectFormRead.js',
         '/modules/project/form/controller/CalemProjectFormNew.js',
         '/modules/project/form/controller/CalemProjectFormEdit.js',
         '/modules/project/form/controller/CalemProjectFormLookup.js',
         //Downtime
         '/modules/project/form/controller/CalemSubProjectFormList.js',
         '/modules/project/form/controller/CalemSubProjectFormNew.js',
         '/modules/project/form/controller/CalemSubProjectFormEdit.js',
         '/modules/project/form/controller/CalemSubProjectFormRead.js',
         //Comment
         '/modules/project/form/controller/CalemProjectWoFormList.js',
         
         //project_type forms
         '/modules/project/form/controller/CalemProjectTypeFormList.js',
         '/modules/project/form/controller/CalemProjectTypeFormRead.js',
         '/modules/project/form/controller/CalemProjectTypeFormNew.js',
         '/modules/project/form/controller/CalemProjectTypeFormEdit.js',
         '/modules/project/form/controller/CalemProjectTypeFormLookup.js',
			
         //Project module
			'/modules/project/form/CalemProjectItemDef.js',
			'/modules/project/form/CalemProjectModuleDef.js',
			
			)
		)
);

?>