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
    'table_name'=>'budget',
    'module'=>'modCalemBudget',
    'cache_type'=>'database',
    'order_by'=>array('field'=>'start_date', 'order'=>'DESC'),
    'dbo'=>array(
    	'path'=>'server/modules/budget/',
    	'name'=>'CalemBudgetDbo'
    ),
    'unique_indexes'=>array(
			'uidx_budget'=>array('budget')
    ),
    'indexes'=>array(
    	'idx_budget_start_date'=>array('start_date')
    ),
    'primary_key'=>array(
    	'id'
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'budget'
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'title_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'budget_title'
    	),
    	'budget'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true
    	),
    	'state_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'budget_state',
    		'label'=>'state_budget'
    	),
    	'start_date'=>array(
    		'type'=>'date',
    		'required'=>true
    	),
    	'end_date'=>array(
    		'type'=>'date',
    		'required'=>true
    	),
    	'budgeted'=>array(
    		'type'=>'sys_currency',
    	),
    	'app'=>array(
    		'type'=>'sys_currency',
    	),
    	'accounting'=>array(
    		'type'=>'sys_currency',
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
