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
    'table_name'=>'training',
    'module'=>'modCalemTraining',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'start_time', 'order'=>'DESC'),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_training'=>array(
    		'training'
    	)
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'training'
    ),
    'indexes'=>array(
    	'idx_training_course'=>array(
    		'course_id'
    	),
    	'idx_training_start'=>array(
    		'start_time'
    	)
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'training'=>array(
    		'type'=>'varchar',
    		'length'=>50,
    		'required'=>true
    	),
    	'course_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'training_course'
    	),
    	'instructor_user_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users',
    	),
    	'instructor_contact_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'contact',
    	),
    	'start_time'=>array(
    		'type'=>'datetime',
    		'required'=>true
    	),
    	'end_time'=>array(
    		'type'=>'datetime',
    		'required'=>true
    	),
    	'certificate_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'training_certificate'
    	),
    	'description'=>array(
    		'type'=>'text',
            'label'=>'training_description'
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
