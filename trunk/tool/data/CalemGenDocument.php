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
	'title'=>' === Generating document module ===' . "<br>",
   'regenerate'=>true,
   'overwrite'=>false,
   'dataList'=>array(
      array( //list include
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/',
				'pattern'=>'JsListAsset'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/document/',
   			'pattern'=>'JsListDocument'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemDoc',
		      'CalemMeterType'=>'CalemDocType',
		      'asset'=>'document'
		   )
   	),
   	array( //module def
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/',
				'pattern'=>'CalemAsset'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/document/form/',
   			'pattern'=>'CalemDoc'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemDoc',
		      'CalemMeterType'=>'CalemDocType',
		      'CalemAsset'=>'CalemDoc',
		   	'asset_type'=>'document',
		   	'asset_meter'=>'doc_type'
		   )		    
   	),
   	array( //bo def
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/bo/',
				'pattern'=>'CalemAssetType'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/document/form/bo/',
   			'pattern'=>'CalemDocType'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemDocType',
		   	'asset_type'=>'doc_type',
		   	'asset'=>'document'
		   )		    
   	),
   	array( //bo def
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/bo/',
				'pattern'=>'CalemAssetType'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/document/form/bo/',
   			'pattern'=>'CalemDoc'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemDoc',
		   	'asset_type'=>'doc_type',
		   	'asset'=>'document'
		   )			    
   	),
   	//doc_type
      array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetTypeForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/document/form/controller/',
   			'pattern'=>'CalemDocTypeForm'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemDocType',
		   	'asset_type'=>'doc_type',
		   	'asset'=>'document'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetTypeView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/document/form/view/',
   			'pattern'=>'CalemDocTypeView'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemDocType',
		   	'asset_type'=>'doc_type',
		   	'asset'=>'document'
		   )
   	),
   	//doc
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/controller/',
				'pattern'=>'CalemAssetTypeForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/document/form/controller/',
   			'pattern'=>'CalemDocForm'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemDoc',
		   	'asset_type'=>'document',
		   	'asset'=>'document',
		   	"'type'"=>'document'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/asset/form/view/',
				'pattern'=>'CalemAssetTypeView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/document/form/view/',
   			'pattern'=>'CalemDocView'),
   		'file_patterns'=>array(
		      'CalemAssetType'=>'CalemDoc',
		   	'asset_type'=>'document',
		   	'asset'=>'document',
		   	"'type'"=>'document'
		   )
   	)
   ),
   'file_patterns'=>array(

   )
);

?>
