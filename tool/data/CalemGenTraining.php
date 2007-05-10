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
	'title'=>' Training module ' . "<br>",
   'regenerate'=>true,
   'overwrite'=>false,
   'dataList'=>array(
      array( //list include
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/',
				'pattern'=>'JsListAsset'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/',
   			'pattern'=>'JsListTraining')
   	),
   	array( //module def
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/',
				'pattern'=>'CalemAsset'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/',
   			'pattern'=>'CalemTraining'),
   				    
   	),
		//asset_type -> training_course_type
      array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetTypeForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/controller/',
   			'pattern'=>'CalemTrainingCourseTypeForm'),
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetTypeView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/view/',
   			'pattern'=>'CalemTrainingCourseTypeView'),
   	),
   	
   	//meter_type -> training_course
      array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemMeterTypeForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/controller/',
   			'pattern'=>'CalemTrainingCourseForm'),
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemMeterTypeView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/view/',
   			'pattern'=>'CalemTrainingCourseView'),
   	),
   	
   	//manufacturer -> training_certificate
      array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemManufacturerForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/controller/',
   			'pattern'=>'CalemTrainingCertificateForm'),
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemManufacturerView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/view/',
   			'pattern'=>'CalemTrainingCertificateView'),
   	),
   	
   	//asset_downtime -> training_user
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetDowntimeForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/controller/',
   			'pattern'=>'CalemTrainingUserForm')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetDowntimeView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/view/',
   			'pattern'=>'CalemTrainingUserView'),
   		'file_patterns'=>array(
		   	'note'=>'user_id'
		   )
   	),
   	//asset -> training
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/controller/',
   			'pattern'=>'CalemTrainingForm')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/training/form/view/',
   			'pattern'=>'CalemTrainingView'),
   		'file_patterns'=>array(
		   	'asset_no'=>'training'
		   )
   	)
   ),
   'file_patterns'=>array(
	      'CalemAssetType'=>'CalemTrainingCourseType',
			'CalemMeterType'=>'CalemTrainingCourse',
			'CalemManufacturer'=>'CalemTrainingCertificate',
			'CalemAssetDowntime'=>'CalemTrainingUser',
	      'CalemAsset'=>'CalemTraining',
	   	'asset_type'=>'training_couse_type',
	   	'meter_type'=>'training_couse',
	   	'manufacturer'=>'training_certificate',
	   	'asset'=>'training'
	   )
);

?>
