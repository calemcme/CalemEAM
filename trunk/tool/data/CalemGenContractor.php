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
	'title'=>' Contractor module ' . "<br>",
   'regenerate'=>true,
   'overwrite'=>false,
   'dataList'=>array(
      array( //list include
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/contact/',
				'pattern'=>'JsListContact'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/contractor/',
   			'pattern'=>'JsListContractor'),
   		'file_patterns'=>array(
		      'CalemContact'=>'CalemContracor',
		      'contact'=>'contractor'
		   )
   	),
   	array( //module def
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/contact/form/',
				'pattern'=>'CalemContact'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/contractor/form/',
   			'pattern'=>'CalemContractor'),
   		'file_patterns'=>array(
		      'CalemContact'=>'CalemContractor',
		   	'contact'=>'contractor'
		   )		    
   	),

      array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/contact/form/controller/',
				'pattern'=>'CalemContactForm'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/contractor/form/controller/',
   			'pattern'=>'CalemContractorForm'),
   		'file_patterns'=>array(
		      'CalemContact'=>'CalemContractor',
		   	'contact'=>'contractor'
		   )
   	),
   	array(
			'file_src'=>array(
				'path'=>_CALEM_DIR_ . 'client/modules/contact/form/view/',
				'pattern'=>'CalemContactView'),
   		'file_dst'=>array(
   			'path'=>_CALEM_DIR_ . 'client/modules/contractor/form/view/',
   			'pattern'=>'CalemContractorView'),
   		'file_patterns'=>array(
		      'CalemContact'=>'CalemContractor',
		   	'contact'=>'contractor'
		   )
   	),
   ),
   'file_patterns'=>array(
		'CalemContact'=>'CalemContractor'			
   )
);

?>
