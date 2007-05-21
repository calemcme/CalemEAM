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

require_once _CALEM_DIR_ . 'server/include/core/CalemSoapRequest.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';
require_once _CALEM_DIR_ . 'server/modules/database/CalemDataBoException.php';
require_once _CALEM_DIR_ . 'build/CalemZipCustomDropdownJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipCustomMessageJs.php';

/**
 * This class handles custom field and labels.
 */
class CalemCustomDropdownSo extends CalemSoapRequest {
	
 	//Add field
 	public function AddDropdown() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Add dropdown, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $fldObj) {
 			$fldAr=CalemJson::objToArray($fldObj);
 			//Update dropdown
 			$rt=$this->addDropdownEntry($fldAr);
 			if ($rt['status']!=0) {
 				$result[]=$rt;
 				continue;	
 			}
 			//Update text
 			$result[]=$this->updateMessage($fldAr);
 		}
		return $result; 			
 	}
 	
 	//Delete field
 	public function DeleteDropdown() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Delete dropdown, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $fldObj) {
 			$fldAr=CalemJson::objToArray($fldObj);
 			//Update dropdown
 			$result[]=$this->deleteDropdownEntry($fldAr);
 		}
		return $result; 			
 	}
 	
 	//Modify field name
 	public function ModifyDropdown() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Modify field name, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $fldObj) {
 			$fldAr=CalemJson::objToArray($fldObj);
 			//Update dropdown
 			$rt=$this->modifyDropdownEntry($fldAr);
 			if ($rt['status']!=0) {
 				$result[]=$rt;
 				continue;	
 			}
 			//Update text
 			$result[]=$this->updateMessage($fldAr);
 		}
		return $result; 			
 	}
 	
 	//Modify field name
 	public function SwapDropdown() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Swap field name, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $fldObj) {
 			$fldAr=CalemJson::objToArray($fldObj);
 			//Update dropdown
 			$result[]=$this->swapDropdownEntry($fldAr);
 		}
		return $result; 			
 	}
 	
 	public function loadDataFromFile($fullPath, $path, $file, $fldAr) {
 		if (is_file($fullPath)) {
			$this->backupFile($path, $file);
			$dn=file_get_contents($fullPath);
			$data=unserialize($dn);
		} else {
			//Load from setup directory.
			require _CALEM_DIR_ . 'server/setup/dropdown/'. $fldAr['tableId'] . '.php';
		}
		return $data;
 	}
 		
   
   //Add a dropdown entry.
   public function addDropdownEntry($fldAr) {
   	//Modifying files
		$path=_CALEM_DIR_ . 'custom/global/dropdown/';
		$file=$fldAr['tableId'] . '.dropdown';
		$fullPath= $path . $file;
		$data=$this->loadDataFromFile($fullPath, $path, $file, $fldAr);
		$entry = $this->getDropdownEntry($fldAr);
		$data[$fldAr['id']]=$entry;
		//Now write the file back.
		$rt=$this->storeFile($fldAr, $data, $fullPath);
		if ($rt['status']!=0) return $rt;
		
		//Let's repackage dropdown
		$cm=new CalemZipCustomDropdownJs();
		$cm->package();
		//So this is a success
		return array('id'=>$fldAr['id'], 'status'=>0);
	}
	
	//Delete dropdown entry
   public function deleteDropdownEntry($fldAr) {
   	//Delete the dropdown
		$path=_CALEM_DIR_ . 'custom/global/dropdown/';
		$file=$fldAr['tableId'] . '.dropdown';
		$fullPath= $path . $file;
		$md=$this->loadDataFromFile($fullPath, $path, $file, $fldAr);
		unset($md[$fldAr['id']]);
		if (count($md) == 0) {
			unlink($fullPath);
		} else {
			$rt=$this->storeFile($fldAr, $md, $fullPath);
			if ($rt['status']!=0) return $rt;
		}		
		//Let's repackage dropdown
		$cm=new CalemZipCustomDropdownJs();
		$cm->package();
		//So this is a success
		return array('id'=>$fldAr['id'], 'status'=>0);
	}
	
	//Update dropdown for field name change
   public function modifyDropdownEntry($fldAr) {
   	//Modifying files
		$path=_CALEM_DIR_ . 'custom/global/dropdown/';
		$file=$fldAr['tableId'] . '.dropdown';
		$fullPath= $path . $file;
		$md=$this->loadDataFromFile($fullPath, $path, $file, $fldAr);

		$entry= $this->getDropdownEntry($fldAr);
		//Should copy array so the order is preserved.
		$newMd=array();
		foreach ($md as $key=>$value) {
			if ($key==$fldAr['oldId']) {
				$newMd[$fldAr['id']]=$entry;
			} else {
				$newMd[$key]=$value;
			}
		}
		//Now write the file back.
		$rt=$this->storeFile($fldAr, $newMd, $fullPath);
		if ($rt['status']!=0) return $rt;
		
		//Let's repackage dropdown
		$cm=new CalemZipCustomDropdownJs();
		$cm->package();
		//So this is a success
		return array('id'=>$fldAr['id'], 'status'=>0);
	}
	
	//Swap dropdown.
   public function swapDropdownEntry($fldAr) {
   	//Modifying files
		$path=_CALEM_DIR_ . 'custom/global/dropdown/';
		$file=$fldAr['tableId'] . '.dropdown';
		$fullPath= $path . $file;
		$md=$this->loadDataFromFile($fullPath, $path, $file, $fldAr);
		//Swap two keys
		$mdNew=array();
		foreach ($md as $key=>$value) {
			if ($key==$fldAr['id']) {
				$mdNew[$fldAr['swapId']]=$md[$fldAr['swapId']];
			} else if ($key==$fldAr['swapId']) {
				$mdNew[$fldAr['id']]=$md[$fldAr['id']];	
			} else {
				$mdNew[$key]=$md[$key];
			}
		}
		//Now write the file back.
		$rt=$this->storeFile($fldAr, $mdNew, $fullPath);
		if ($rt['status']!=0) return $rt;
		
		//Let's repackage dropdown
		$cm=new CalemZipCustomDropdownJs();
		$cm->package();
		//So this is a success
		return array('id'=>$fldAr['id'], 'status'=>0);
	}
	
	//Update message
	public function updateMessage($fldAr) {
		$path=_CALEM_DIR_ . 'custom/global/message/';
		$locale='';
		if (isset($fldAr['locale']) && strlen($fldAr['locale'])>0) {
			$locale='_' . $fldAr['locale'];
		}
		$file='custom' . $locale . '.message';
		$fullPath= $path . $file;
		if (is_file($fullPath)) {
			$this->backupFile($path, $file);
			$data=file_get_contents($fullPath);
			$md=unserialize($data);
		} else {
			$md=array();
		}
		$md[$fldAr['id']]=$fldAr['label'];
		
		//Now store file
		$rt = $this->storeFile($fldAr, $md, $fullPath);
		if ($rt['status']!=0) return $rt;
		
		//Let's repackage
		$cm=new CalemZipCustomMessageJs($file);
		$cm->package();
		//So this is a success
		return array('id'=>$fldAr['id'], 'status'=>0);
	}
	
	public function storeFile($fldAr, $md, $fullPath) {
		if (file_put_contents($fullPath, serialize($md))) {
			$rt=array('id'=>$fldAr['id'], 'status'=>0);
		} else {
			$rt=array('id'=>$fldAr['id'], 
								    'status'=> ERROR_WRITE_FILE,
				                'errorInfo'=>array('id'=>'CalemWriteFileException'));
		}
		return $rt;
	}
   
   //backup current file.
   public function backupFile($path, $file) {
   	if (is_file($path . $file)) {
			//Creating a backup directory if it's not created yet.
			$doIt=true;
			if (!is_dir($path . "backup")) {
				$doIt=mkdir($path . "backup", 0666);		
			}
			if ($doIt) {
				copy($path . $file, $path . "backup/" . $file . '_' . date('Y_M_d__H_i_s', time()));
			}
		}
   }
   
   //Creating dropdown entry based on DD
   public function getDropdownEntry($fldAr) {
   	$rsMgr=CalemFactory::getResourceManager();
   	$tbDd=$rsMgr->getTableDd($fldAr['tableId']);
   	$fldList=$tbDd->getFields();
   	$ar=array();
   	foreach ($fldList as $key => $val) {
   		if ($key=='id') continue;
   		$ar[$key]=isset($fldAr[$key]) ? $fldAr[$key] : null;
   	}
   	return $ar;
   }
   
}
?>
