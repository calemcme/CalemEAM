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
	'title'=>' Project module ' . "<br>",
   'regenerate'=>true,
   'overwrite'=>false,
   'dataList'=>array(
      array( //list include
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/',
				'pattern'=>'JsListAsset'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/',
   			'pattern'=>'JsListProject')
   	),
   	array( //module def
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/',
				'pattern'=>'CalemAsset'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/form/',
   			'pattern'=>'CalemProject'),
   				    
   	),
		//asset_type -> project type
      array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetTypeForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/form/controller/',
   			'pattern'=>'CalemProjectTypeForm'),
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetTypeView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/form/view/',
   			'pattern'=>'CalemProjectTypeView'),
   	),
   	
   	//asset -> project
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/form/controller/',
   			'pattern'=>'CalemProjectForm')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/form/view/',
   			'pattern'=>'CalemProjectView'),
   		'file_patterns'=>array(
		   	'asset_no'=>'project_no'
		   )
   	),
   	
   	//asset_downtime -> project_project
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetDowntimeForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/form/controller/',
   			'pattern'=>'CalemSubProjectForm')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetDowntimeView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/form/view/',
   			'pattern'=>'CalemSubProjectView'),
   		'file_patterns'=>array(
		   	'note'=>'project_no'
		   )
   	),
   	
   	//asset_comment -> project workorder
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetCommentForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/form/controller/',
   			'pattern'=>'CalemProjectWoForm'),
   		'file_patterns'=>array(
		   	'asset_comment'=>'workorder'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetCommentView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/project/form/view/',
   			'pattern'=>'CalemProjectWoView'),
   		'file_patterns'=>array(
   			'asset_comment'=>'workorder',
		   	'comment'=>'wo_no'
		   )
   	)
   	
   ),
   'file_patterns'=>array(
	      'CalemAssetType'=>'CalemProjectType',
			'CalemAssetComment'=>'CalemProjectWo',
			'CalemAssetDowntime'=>'CalemSubProject',
	      'CalemAsset'=>'CalemProject',
	   	'asset_type'=>'project_type',
	   	'asset_comment'=>'workorder',
	   	'asset_downtime'=>'project',
	   	'asset'=>'project'
	   )
);

?>
