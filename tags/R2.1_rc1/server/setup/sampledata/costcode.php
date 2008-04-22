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

$data=array(
   array('id'=>'100',
   'costcode'=>'3500',
   'note'=>'Labor cost',
   'dept_id'=>'0',
   'rollup_cost'=>false,
   'cost_type_id'=>'cost_labor',
	),
	array('id'=>'200',
   'costcode'=>'4500',
   'note'=>'Material cost',
   'dept_id'=>'0',
   'rollup_cost'=>false,
   'cost_type_id'=>'cost_material',
	),
	array('id'=>'300',
   'costcode'=>'5500',
   'note'=>'Training cost',
   'dept_id'=>'0',
   'rollup_cost'=>false,
   'cost_type_id'=>'cost_training',
	),
	array('id'=>'101',
   'costcode'=>'3500-200-100',
   'note'=>'Employee labor',
   'dept_id'=>'200',
   'parent_id'=>'100',
   'rollup_cost'=>true,
   'cost_type_id'=>'cost_employee_labor',
	),
	array('id'=>'102',
   'costcode'=>'3500-200-200',
   'note'=>'Contractor labor',
   'dept_id'=>'200',
   'parent_id'=>'100',
   'rollup_cost'=>true,
   'cost_type_id'=>'cost_contractor_labor',
	),
	array('id'=>'201',
   'costcode'=>'4500-200-300',
   'note'=>'Internal material',
   'dept_id'=>'200',
   'parent_id'=>'200',
   'rollup_cost'=>true,
   'cost_type_id'=>'cost_internal_material',
	),
	array('id'=>'202',
   'costcode'=>'4500-200-400',
   'note'=>'Contractor material for maintenance dept',
   'dept_id'=>'200',
   'parent_id'=>'200',
   'rollup_cost'=>true,
   'cost_type_id'=>'cost_contractor_material',
	),
	array('id'=>'301',
   'costcode'=>'5500-200-500',
   'note'=>'Training cost for maintenance dept',
   'dept_id'=>'200',
   'parent_id'=>'300',
   'rollup_cost'=>true,
   'cost_type_id'=>'cost_training',
	),
	array('id'=>'401',
   'costcode'=>'6500',
   'note'=>'Production',
   'dept_id'=>'500',
   'cost_type_id'=>'cost_operations',
	),
)
?>