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
    'table_name'=>'craft', //No translation needed.
    'module'=>'modCalemWo',
    'cache_type'=>'memory',
    'order_by'=>array('field'=>'craft', 'order'=>'ASC'),
    'primary_key'=>array(
    	'id'
     ),
    'unique_indexes'=>array(
    	'uidx_craft_craft'=>array(
    		'craft'
    	),
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'craft',
		'extra'=>array(
	    	'craft'
	    )
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'craft'=>array(
    		'type'=>'varchar',
    		'length'=>30,
    		'required'=>true,
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
    	),
    	'rate'=>array(
    		'type'=>'sys_currency'
    	),
    	'ot_factor'=>array(
    		'type'=>'double'
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
