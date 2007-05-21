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
    'table_name'=>'contact', //No translation needed.
    'module'=>'modCalemContact',
    'cache_type'=>'memory',
    'order_by'=>array('field'=>'full_name', 'order'=>'ASC'),
    'primary_key'=>array(
    	'id'
    ),
    'unique_indexes'=>array(
    	'uidx_contact_full_name'=>array(
    		'full_name'
    	),
    ),
    'lookup_mapping'=>array(
    	'field'=>'id',
		'primary'=>'full_name',
		'extra'=>array(
	    	'full_name',
	    	'phone_work',
	    	'phone_mobile',
	    	'email_work'
	    )
    ),
    'fields'=>array(
    	'id'=>array(
    		'type'=>'guid'  		
    	),
    	'full_name'=>array(
    		'type'=>'varchar',
    		'length'=>50,
    		'required'=>true
    	),
    	'job_title'=>array(
    		'type'=>'varchar',
    		'length'=>30
    	),
    	'type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'contact_type'
    	),
    	'note'=>array(
    		'type'=>'varchar',
    		'length'=>76
    	),
    	'phone_work'=>array(
    		'type'=>'varchar',
    		'length'=>24
    	),
    	'phone_home'=>array(
    		'type'=>'varchar',
    		'length'=>16
    	),
    	'phone_mobile'=>array(
    		'type'=>'varchar',
    		'length'=>16
    	),
    	'email_work'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'email_other'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'im1_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'im_type'
    	),
    	'im1_id'=>array(
    		'type'=>'varchar',
    		'length'=>30
    	),
    	'im2_type_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'im_type'
    	),
    	'im2_id'=>array(
    		'type'=>'varchar',
    		'length'=>30
    	),
    	'fax'=>array(
    		'type'=>'varchar',
    		'length'=>16
    	),
    	'company'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'street1'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'street2'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'city'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'state'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'zip'=>array(
    		'type'=>'varchar',
    		'length'=>16
    	),
    	'country'=>array(
    		'type'=>'varchar',
    		'length'=>50
    	),
    	'asset_id'=>array(
    		'type'=>'guid',
    		'lookup'=>'asset'
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
