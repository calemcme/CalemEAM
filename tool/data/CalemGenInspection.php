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
	'title'=>' Inspection module ' . "<br>",
   'regenerate'=>true,
   'overwrite'=>false,
   'dataList'=>array(
      array( //list include
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/',
				'pattern'=>'JsListAsset'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/inspection/',
   			'pattern'=>'JsListInspection'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemInspection',
		      'CalemAssetDowntime'=>'CalemInsCitation',
		      'asset'=>'inspection'
		   )
   	),
   	array( //module def
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/',
				'pattern'=>'CalemAsset'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/inspection/form/',
   			'pattern'=>'CalemInspection'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemInspection',
		      'CalemAssetDowntime'=>'CalemInsCitation',
		      'CalemAsset'=>'CalemInspection',
		   	'asset_type'=>'inspection',
		   	'asset_downtime'=>'ins_citation'
		   )		    
   	),

      array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetTypeForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/inspection/form/controller/',
   			'pattern'=>'CalemInspectionForm'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemInspection',
		   	'asset_type'=>'inspection',
		   	'asset'=>'inspection'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetTypeView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/inspection/form/view/',
   			'pattern'=>'CalemInspectionView'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemInspection',
		   	'asset_type'=>'inspection',
		   	'asset'=>'inspection'
		   )
   	),
   	//citation
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetDowntimeForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/inspection/form/controller/',
   			'pattern'=>'CalemInsCitationForm'),
   		'file_patterns'=>array(
		      'CalemAssetDowntime'=>'CalemInsCitation',
		   	'asset_downtime'=>'ins_citation'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetDowntimeView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/inspection/form/view/',
   			'pattern'=>'CalemInsCitationView'),
   		'file_patterns'=>array(
		      'CalemDowntime'=>'CalemInsCitation',
		   	'asset_type'=>'ins_citation',
		   	"'note'"=>'inspection_id'
		   )
   	)
   ),
   'file_patterns'=>array(
		'CalemAsset'=>'CalemInspection'			
   )
);

?>
