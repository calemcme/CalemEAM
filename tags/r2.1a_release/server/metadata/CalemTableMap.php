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

/**
 * This is the table map class.
 */
class CalemTableMap {
	private $table_map;
	private $table_map_no_dropdown;
	private $table_view_map;

	/**
	 * Get table map ref
	 */
	public function getTableMap() {
		if (!$this->table_map) {
			$this->createTableMap();	
		}	
		return $this->table_map;	
	}
	
	public function getCount() {
		return count($this->table_map);	
	}
	
	public function getTableMapNoDropdown($rsMgr) {
		if (!isset($this->table_map_no_dropdown)) {
			$tm=$this->getTableMap();
			foreach ($tm as $tbl) {
				$tbDd=$rsMgr->getTableDd($tbl);
				if ($tbDd->isDropdown()) continue;
				$this->table_map_no_dropdown[]=$tbl;	
			}	
		}	
		return $this->table_map_no_dropdown;
	}
	
	private function createTableMap() {
		$this->table_map=array();
		//Collect all tables based directory scan
		$tableDir = dir(_CALEM_DIR_ . 'server/metadata/table');
	   while (false !== ($file = $tableDir->read())) {
	   	if (strpos($file, ".php")===false) continue;
	   	$file=substr($file, 0, strlen($file) - 4);
	   	$this->table_map[]=$file;
	   }	
	   $tableDir->close();
	   
	   //Looking for views
	   $vDir = dir(_CALEM_DIR_ . 'server/metadata/wtable');
	   while (false !== ($file = $vDir->read())) {
	   	if (strpos($file, ".php")===false) continue;
	   	$file=substr($file, 0, strlen($file) - 4);
	   	$this->table_view_map[]=$file;
	   }	
	   $vDir->close();		
	}
}

?>