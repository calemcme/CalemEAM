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

//starting installation controller map
$_CALEM_cmap=array(
   'controllers'=>array(
		'lang'=>array('class'=>'CalemInstLangController'),
		'license'=>array('class'=>'CalemInstLicenseController'),
		'syscheck'=>array('class'=>'CalemInstSyscheckController'),
		'dbschema'=>array('class'=>'CalemInstDbSchemaController'),
		'dbexpress'=>array('class'=>'CalemInstDbExpressController'),
		'dbinfo'=>array('class'=>'CalemInstDbInfoController'),
		'dbsetup'=>array('class'=>'CalemInstDbSetupController'),
		'saveconf'=>array('class'=>'CalemInstSaveConfController'),
		'done'=>array('class'=>'CalemInstDoneController')
	),
	'default_controller_id'=>'lang',
	'steps'=>array(
		'list'=>array('step_lang', 'step_license', 'step_syscheck', 'step_dbschema', 'step_dbexpress', 'step_dbinfo', 'step_dbsetup', 'step_saveconf', 'step_done'),
		'step_map'=>array(
			'lang'=>'step_lang',
			'license'=>'step_license',
			'syscheck'=>'step_syscheck',
			'dbschema'=>'step_dbschema',
			'dbexpress'=>'step_dbexpress',
			'dbinfo'=>'step_dbinfo',
			'dbsetup'=>'step_dbsetup',
			'saveconf'=>'step_saveconf',
			'done'=>'step_done'
		)
	)
);
?>
