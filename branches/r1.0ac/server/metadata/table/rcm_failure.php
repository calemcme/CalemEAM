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
    'table_name'=>'rcm_failure',
    'module'=>'modCalemRcm',
    'cache_type'=>'database',
    'dbo'=>array(
    	'path'=>'server/modules/rcm/',
    	'name'=>'CalemRcmFailureDbo',
    ),
    'primary_key'=>array(
    	'id'
    ),
    'order_by'=>array('field'=>'failure', 'order'=>'ASC'),
    'unique_indexes'=>array(
    	'uidx_rcm_failure'=>array('failure')
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'failure',
		'extra'=>array(
	    	'is_evident',
	    	'note'
	    )
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'failure'=>array(
    		'type'=>'varchar',
    		'length'=>'50',
    		'required'=>true
    	),
    	'is_evident'=>array(
    		'type'=>'boolean'
    	),
    	'function_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'rcm_function',
    		'required'=>true
    	),
    	'template_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'rcm_template'
    	),
    	'description'=>array(
    		'type'=>'text'
    	),
    	'modified_time'=>array(
    		'type'=>'datetime'
    	),
    	'modified_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	),
    	'created_time'=>array(
    		'type'=>'datetime'
    	),
    	'created_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	)    	
    ) //End of fields list    
)
?>
