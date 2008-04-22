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
 
/**
 * To run Calem test one must set up the following:
 * - _CALEM_DIR_
 * - _CALEM_DIR_ . 'config/calem.php' is included already.
 */ 


//Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
require_once _CALEM_DIR_ . 'server/conf/calem.php';
require_once _CALEM_DIR_ . 'server/metadata/CalemTableMap.php';
require_once _CALEM_DIR_ . 'build/CalemZipBaseJs.php';

/**
 * This file generate a zip file for all the static meta data.
 */
class CalemZipMetadataJs extends CalemZipBaseJs {
	
	public function package() {
		$defFile= _CALEM_DIR_ . 'build/js/CalemJsMetadata.js';
		$jsSearch = file_get_contents($defFile) . CALEM_LFCR;;
		$js ='';
		
		$count=0;
		$tableMap=new CalemTableMap();
		$tables=$tableMap->getTableMap();
		$table_list=array();
		$dropdown_list=array();
		foreach ($tables as $table) {
			include _CALEM_DIR_ . 'server/metadata/table/' . $table . '.php';
			if ($_CALEM_table['cache_type']=='dropdown') {
				$dropdown_list[]=$_CALEM_table['table_name'];
			} else {
				$table_list[]=$_CALEM_table['table_name'];
			}
			$js .= "CalemMetadata['" . $_CALEM_table['table_name'] . "'] = " .  json_encode($_CALEM_table) . CALEM_LFCR;
			$count++;
		} 	
		//Adding VT tables
		$vt=_CALEM_DIR_ . 'server/metadata/vtable/';
		$js = $this->addOtherTableMetadata($vt, $js);
		//Adding WT tables
		$wt=_CALEM_DIR_ . 'server/metadata/wtable/';
		$js = $this->addOtherTableMetadata($wt, $js);
		
		//Adding dropdown data
		$js = $this->addDropdownData($js);
			
		//Add CalemData
		sort($dropdown_list);
		sort($table_list);
		$js .= "CalemData['vt_table_list'] = " . json_encode($table_list) . CALEM_LFCR;
		$js .= "CalemData['vt_dropdown_list'] = " . json_encode($dropdown_list) . CALEM_LFCR;
		
		$this->logger->info("Metadata - total tables: " . $count . ", size=" . strlen($js) 
		             . ", tables=" . count($table_list) . ", dropdowns=" . count($dropdown_list));
		$js = $jsSearch . CALEM_LFCR . $js;
		
		//Now store off the data in a plain and gz file
		$this->nextProcess('Metadata.js', $js);
	}
	
	function addOtherTableMetadata($path, $js) {
		$dir = dir($path);
		//Enumerate each file.
		$count=0;
		while (false !== ($file=$dir->read())) {
			if (strpos($file, '.php')===false) continue;
			include $path . $file;
			$js .= "CalemMetadata['" . $_CALEM_table['table_name'] . "'] = " .  json_encode($_CALEM_table) . CALEM_LFCR;
			$count++;
		}
		$this->logger->info("$path count=" . $count);
		return $js;
	}
	
	function addDropdownData($js) {
		$path=_CALEM_DIR_ . 'server/setup/dropdown/';
		return $this->addDropdownDataCore($js, $path);
	}
	
	function addDropdownDataCore($js, $path) {
		$dir = dir($path);
		//Enumerate each file.
		$count=0;
		while (false !== ($file=$dir->read())) {
			if (strpos($file, '.php')===false) continue;
			$table=substr($file, 0, strlen($file)-4);
			include $path . $file;
			$ar=array();
			foreach ($data as $key=>$rowValue) {
				$row=array($key);
				foreach ($rowValue as $col) {
					$row[]=$col;
				}
				//Adding a row
				$ar[]=$row;	
			}
			$js .= "CalemDropdown['" . $table . "'] = " .  json_encode($ar) . CALEM_LFCR;
			$count++;
		}
		$this->logger->info("Dropdown loaded count=" . $count);
		return $js;
	}
		
}
?>
