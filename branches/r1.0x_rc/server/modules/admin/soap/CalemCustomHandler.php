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
require_once _CALEM_DIR_ . 'build/CalemZipDirectoryJs.php';

/**
 * This class handle view customization and removal.
 */
class CalemCustomHandler extends CalemSoapRequest {
	
 	/**
 	 * Save view customization. 
 	 */
 	public function save() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Save customInfo, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $customObj) {
 			$path=$this->getPath($customObj) . $customObj->target;
 			if (!is_dir($path)) {
 				if (!mkdir($path, 0666)) { //Read/write rights granted.
 					$result[]=array('id'=>$customObj->id, 
 									    'status'=> ERROR_CREATE_DIR,
 					                'errorInfo'=>array('id'=>'CalemCreateDirException'));
 					continue;
 				}
 			}
 			//Backup the current file
 			$fileName=$this->getFileName($customObj); 
 			$fullPath=$path . "/" . $fileName;
 			if (is_file($fullPath)) {
 				//Creating a backup directory if it's not created yet.
 				$doIt=true;
 				if (!is_dir($path . "/backup")) {
 					$doIt=mkdir($path . "/backup", 0666);		
 				}
 				if ($doIt) {
 					copy($fullPath, $path . "/backup/" . $fileName. '_' . date('Y_M_d__H_i_s', time()));
 				}
 			}
 			//Next copy files over.
 			if (! ($handle=fopen($fullPath, 'w'))) {
 				$result[]=array('id'=>$customObj->id, 
 									    'status'=> ERROR_CREATE_FILE,
 					                'errorInfo'=>array('id'=>'CalemCreateFileException'));
 				continue;
 			}
 			//Write content into the file.
 			if (! fwrite($handle, $this->getContent($customObj))) {
 				$result[]=array('id'=>$customObj->id, 
 									    'status'=> ERROR_WRITE_FILE,
 					                'errorInfo'=>array('id'=>'CalemWriteFileException'));
 				continue;
 			}
 			//Close file
 			if (!fclose($handle)) {
 				$result[]=array('id'=>$customObj->id, 
 									    'status'=> ERROR_CLOSE_FILE,
 					                'errorInfo'=>array('id'=>'CalemCloseFileException'));
 				continue;
 			}
 			//Now store off report if applicable
 			$this->saveReport($customObj);
 			//So this is a success
 			$result[]=array('id'=>$customObj->id, 'status'=>0);
 		}
 		//Update affected pkg.
 		if ($result[0]['status'] == 0) {
 			$this->updateJsPkg($param);
 		}
 		return $result;
 	}
 	
 	/**
 	 * Handle delete search case.
 	 */
 	public function delete() { 
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Delete customInfo, param=" . var_export($param, true));
 	
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $customObj) {
 			$path=$this->getPath($customObj) . $customObj->target;
 			//Backup the current file
 			$fileName=$this->getFileName($customObj);
 			$fullPath=$path . "/" . $fileName;
 			if (is_file($fullPath)) {
 				if (!unlink($fullPath)) {	
	 				$result[]=array('id'=>$customObj->id, 
	 									    'status'=> ERROR_DELETE_FILE,
	 					                'errorInfo'=>array('id'=>'CalemDeleteFileException'));
	 				continue;
	 			}
 			}
 			//So this is a success
 			$result[]=array('id'=>$customObj->id, 'status'=>0);
 		}
 		//Update affected pkg.
 		if ($result[0]['status'] == 0) {
 			$this->updateJsPkg($param);
 		}
 		return $result;
	}
	
	/**
 	 * Handle refresh search case.
 	 */
 	public function reload() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Reload customInfo, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $customObj) {
 			$path=$this->getPath($customObj);
 			//Load the file
 			$fileName= $customObj->target . $this->getPattern();
 			$fullPath=$path . "/" . $fileName;
 			if (is_file($fullPath)) {
 				$js=file_get_contents($fullPath);
 				$result[]=array('target'=>$customObj->target, 'shared'=>$customObj->shared,
                            'status'=>0, 'reload'=>base64_encode($js) );
 			} else {
 				$result[]=array('target'=>$customObj->target, 'shared'=>$customObj->shared, 'status'=>1);
 			}
 		}
 		return $result;
	}
 	
 	/**
	 * Update affected pkg file
	 */
   public function updateJsPkg($param) {
   	//Processing each row by iterating the param object.
 		foreach ($param as $key => $customObj) {
 			$path=$this->getPath($customObj);
 			//repackage the file
 			$srcDir= $path . $customObj->target . '/';
 			$subsets=array($this->getPattern()=>'');
 			$dirHandler=new CalemZipDirectoryJs($srcDir, $path, $subsets, $customObj->target, false);
			$dirHandler->package();
 		}
   }
   
   public function getPath($customObj) {
   	if ($customObj->shared) {
			$path= _CALEM_DIR_ . 'custom/group/';
		} else {
			$path= _CALEM_DIR_ . 'custom/user/';
		}
		return $path;
   }
   
   /**
 	 * Save off report if necessary.
 	 */
 	public function saveReport($customObj) {
 		$id=$customObj->id;
 		if (strpos($id, 'ReportMdTab')>0 || strpos($id, 'ReportRead')>0 || strpos($id, 'ReportList')>0) {
 			require_once _CALEM_DIR_ . 'build/CalemConvertReport.php';
 			$conv=new CalemConvertReport();
 			$path=$this->getPath($customObj) . $customObj->target . '/';
 			$fileName=$this->getFileName($customObj);
 			if ($this->logger->isDebugEnabled()) $this->logger->debug("save off report: path=" . $path . ", fn=" . $fileName);
 			$conv->convert($path, $fileName);	
 		} 			
 	}   
}
?>
