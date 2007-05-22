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
    'table_name'=>'wo_tool',
    'module'=>'modCalemWo',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'in_id', 'order'=>'ASC'),
    'dbo'=>array(
    	'path'=>'server/modules/workorder/',
    	'name'=>'CalemWoToolDbo',
    ),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_wo_tool'=>array('wo_id', 'in_id')
    ),
    'indexes'=>array(
    	'idx_wo_tool_in_id'=>array('in_id')
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'wo_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'workorder',
    		'md'=>true
    	),
    	'in_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'inventory',
    		'required'=>true,
    		'label'=>'tool_in_id'
    	),
    	'qty_checkout'=>array(
    		'type'=>'double'
    	),
    	'qty_return'=>array(
    		'type'=>'double'
    	),
    	'line_cost'=>array(
    		'type'=>'sys_currency'
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
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
