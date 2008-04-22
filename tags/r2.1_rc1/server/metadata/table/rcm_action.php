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
    'table_name'=>'rcm_action',
    'module'=>'modCalemRcm',
    'cache_type'=>'database',
    'primary_key'=>array(
    	'id'
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'action'
    ),
    'indexes'=>array(
    	'idx_rcm_action'=>array(
    		'failure_id'
    	),
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'failure_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'rcm_failure'
    	),
    	'cause'=>array(
    		'type'=>'varchar',
    		'length'=>50,
    		'required'=>true
    	),
    	'action'=>array(
    		'type'=>'varchar',
    		'length'=>50,
    		'required'=>true
    	),
    	'cause_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'rcm_cause_type'
    	),
    	'description'=>array(
    		'type'=>'text',
            'label'=>'action_description'
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
