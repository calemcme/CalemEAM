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
	'title'=>' Requisition module ' . "<br>",
   'regenerate'=>true,
   'overwrite'=>false,
   'dataList'=>array(
      array( //list include
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/project/',
				'pattern'=>'JsListProject'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/requisition/',
   			'pattern'=>'JsListRequisition')
   	),
   	array( //module def
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/project/form/',
				'pattern'=>'CalemProject'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/',
   			'pattern'=>'CalemRequisition'),
   				    
   	),
   	
   	//project -> requisition
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/project/form/controller/',
				'pattern'=>'CalemProjectForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/controller/',
   			'pattern'=>'CalemReqForm'),
   		'file_patterns'=>array(
		   	'CalemProjectForm'=>'CalemReqForm'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/project/form/view/',
				'pattern'=>'CalemProjectView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/view/',
   			'pattern'=>'CalemReqView'),
   		'file_patterns'=>array(
   			'CalemProjectView'=>'CalemReqview',
		   	'project_no'=>'req_no'
		   )
   	),
   	
   	//sub project -> requisition_item
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/project/form/controller/',
				'pattern'=>'CalemSubProject'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/controller/',
   			'pattern'=>'CalemReqItemForm')
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/project/form/view/',
				'pattern'=>'CalemSubProjectView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/view/',
   			'pattern'=>'CalemReqItemView'),
   		'file_patterns'=>array(
		   	'project_no'=>'requisition_no',
		   	'project'=>'req_item'
		   )
   	),
   	
   	// wo status log -> requisition status log
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/controller/',
				'pattern'=>'CalemWoStatusLog'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/controller/',
   			'pattern'=>'CalemReqStatusLog'),
   		'file_patterns'=>array(
   			'CalemWoStatusLog'=>'CalemReqStatusLog',
		   	'wo_status_log'=>'req_status_log'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/workorder/form/view/',
				'pattern'=>'CalemWoStatusLog'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/requisition/form/view/',
   			'pattern'=>'CalemReqStatusLog'),
   		'file_patterns'=>array(
   			'wo_status_log'=>'req_status_log',
		   	'CalemWoStatusLog'=>'CalemReqStatusLog'
		   )
   	)
   	
   ),
   'file_patterns'=>array(
			'CalemSubProject'=>'CalemReqItem',
	      'CalemProject'=>'CalemReq',
	   	'project'=>'requisition'
	   )
);

?>
