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

require_once _CALEM_DIR_ . 'server/metadata/CalemTableDd.php';

/**
 * This is the Calem table DD class.
 */
class CalemTableDdCustom extends CalemTableDd {
	
	/**
	 * Constructor
	 */
	public function __construct($table_name) {
		$file= _CALEM_DIR_ . 'custom/global/metadata/' . $table_name . '.metadata';
		if (!is_file($file)) {
			throw new CalemTableNotFoundException($table_name . ' at ' . $file);	
		}
		$cDef=file_get_contents($file);
		$def=unserialize($cDef);
		$def['table_name']=$table_name;
		$flds=$def['fields'];
		$fldsNew['zc_id']=array('type'=>'varchar', 'length'=>36);
		$flds=$fldsNew + $flds;
		$def['fields']=$flds;
		//Init as base/all info.
		$this->baseTableDef=$def;
		$this->allTableDef=$def;
		$this->baseFieldList=array_keys($def['fields']);
		$this->allFieldList=$this->baseFieldList;
   }
}
