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
    'table_name'=>'recycle_bin',
    'module'=>'modCalemRecycleBin',
    'cache_type'=>'database',
    'dbo'=>array(
        'path'=>'server/modules/recycle_bin/',
        'name'=>'CalemRecycleBinDbo'),
    'primary_key'=>array(
    	'id'
    ),
    'indexes'=>array(
    	'idx_recycle_bin_table_name' => array('table_name'),
    	'idx_recycle_bin_rec_id'=>array('rec_id')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid' 		
    	),
    	'parent_id'=>array(
    		'type'=>'guid'
    	),
    	'description'=>array(
    		'type'=>'varchar',
    		'length'=>256,
            'label'=>'rb_desc'
    	),
    	'table_name'=>array(
    		'type'=>'varchar',
    		'length'=>30
    	),
    	'rec_id'=>array(
    		'type'=>'guid'
    	),
    	'value_deleted'=>array(
    		'type'=>'TEXT',
    	),
    	'created_time'=>array(
    		'type'=>'datetime'
    	),
    	'created_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'users'
    	)    
    )
)
?>
