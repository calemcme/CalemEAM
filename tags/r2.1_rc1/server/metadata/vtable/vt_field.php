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

$_CALEM_table=array(
    'table_name'=>'vt_field',
    'module'=>'modCalemAdmin',
    'cache_type'=>'memory',
    'primary_key'=>array(
    	'id'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid',
    		'label'=>'field_name',
    		'required'=>true  		
    	),
    	'field_type'=>array(
    		'type'=>'guid',
    		'lookup'=>'vt_field_type'
    	),
    	'required'=>array(
    		'type'=>'boolean'
    	),
    	'field_length'=>array(
    		'type'=>'int',
    		'max'=>256
    	),
    	'field_label'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'lookup'=>array(
    		'type'=>'varchar',
    		'length'=>30
    	)	  
    )
)
?>
