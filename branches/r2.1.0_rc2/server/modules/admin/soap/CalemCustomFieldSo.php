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

require_once _CALEM_DIR_ . 'server/include/core/CalemWsFacade.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';
require_once _CALEM_DIR_ . 'server/modules/database/CalemDataBoException.php';
require_once _CALEM_DIR_ . 'build/CalemZipCustomMetadataJs.php';
require_once _CALEM_DIR_ . 'build/CalemZipCustomMessageJs.php';

/**
 * This class handles custom field and labels.
 */
class CalemCustomFieldSo extends CalemWsFacade {
	
 	//Add field
 	public function AddField() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Add field, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $fldObj) {
 			$fldAr=CalemJson::objToArray($fldObj);
 			//DB change first, followed by file changes
 			try { 		
 				$dbHdlr = CalemFactory::getDbHandler();
 				$dbHdlr->addField($fldAr);	
 			} catch (CalemDataBoException $e) {
 				$result[]=array('id'=>$fldAr['id'], 'status'=>-1, 'errorInfo'=>$e->getErrorInfo()->getData());
 				continue;
 			} catch (Exception $e2) {
 				$ei = new CalemErrorInfo('CalemErrorInfo', $fldAr['id'], $e2->getMessage());
 				$result[]=array('id'=>$fldAr['id'], 'status'=>-1, 'errorInfo'=>$ei->getData());
 				continue;
 			}
 			//Update metadata
 			$rt=$this->updateMetadata($fldAr);
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
 	public function DeleteField() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Delete field, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $fldObj) {
 			$fldAr=CalemJson::objToArray($fldObj);
 			//DB change first, followed by file changes
 			try { 		
 				$dbHdlr = CalemFactory::getDbHandler();
 				$dbHdlr->deleteField($fldAr);	
 			} catch (CalemDataBoException $e) {
 				$result[]=array('id'=>$fldAr['id'], 'status'=>-1, 'errorInfo'=>$e->getErrorInfo()->getData());
 				continue;
 			} catch (Exception $e2) {
 				$ei = new CalemErrorInfo('CalemErrorInfo', $fldAr['id'], $e2->getMessage());
 				$result[]=array('id'=>$fldAr['id'], 'status'=>-1, 'errorInfo'=>$ei->getData());
 				continue;
 			}
 			//Update metadata
 			$result[]=$this->deleteMetadata($fldAr);
 		}
		return $result; 			
 	}
 	
 	//Modify field name
 	public function ModifyFieldName() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Modify field name, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $fldObj) {
 			$fldAr=CalemJson::objToArray($fldObj);
 			//DB change first, followed by file changes
 			if ($fldAr['id'] != $fldAr['oldId']) {//need field change.
	 			try { 		
	 				$dbHdlr = CalemFactory::getDbHandler();
	 				$dbHdlr->modifyFieldName($fldAr);	
	 			} catch (CalemDataBoException $e) {
	 				$result[]=array('id'=>$fldAr['id'], 'status'=>-1, 'errorInfo'=>$e->getErrorInfo()->getData());
	 				continue;
	 			} catch (Exception $e2) {
	 				$ei = new CalemErrorInfo('CalemErrorInfo', $fldAr['id'], $e2->getMessage());
	 				$result[]=array('id'=>$fldAr['id'], 'status'=>-1, 'errorInfo'=>$ei->getData());
	 				continue;
	 			}
	 			//Update metadata
	 			$rt=$this->updateMetadataForFieldName($fldAr);
	 			if ($rt['status']!=0) {
	 				$result[]=$rt;
	 				continue;	
	 			}
 			}
 			//Update text
 			$result[]=$this->updateMessage($fldAr);
 		}
		return $result; 			
 	}
 	
 	//Modify field type
 	public function ModifyFieldType() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Modify field type, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $fldObj) {
 			$fldAr=CalemJson::objToArray($fldObj);
 			//DB change first, followed by file changes
 			try { 		
 				$dbHdlr = CalemFactory::getDbHandler();
 				$dbHdlr->modifyFieldType($fldAr);	
 			} catch (CalemDataBoException $e) {
 				$result[]=array('id'=>$fldAr['id'], 'status'=>-1, 'errorInfo'=>$e->getErrorInfo()->getData());
 				continue;
 			} catch (Exception $e2) {
 				$ei = new CalemErrorInfo('CalemErrorInfo', $fldAr['id'], $e2->getMessage());
 				$result[]=array('id'=>$fldAr['id'], 'status'=>-1, 'errorInfo'=>$ei->getData());
 				continue;
 			}
 			//Update metadata - fake an oldId for code reuse.
 			$fldAr['oldId']=$fldAr['id'];
 			$result[]=$this->updateMetadataForFieldName($fldAr);
 		}
		return $result; 			
 	}
 	
 	//Edit label
 	public function EditLabel() {
 		$param=$this->getParamValue(0);
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Edit label, param=" . var_export($param, true));
 		
 		$result=array();
 		//Processing each row by iterating the param object.
 		foreach ($param as $key => $fldObj) {
 			$fldAr=CalemJson::objToArray($fldObj);
 			//Update text
 			$result[]=$this->updateMessage($fldAr);
 		}
		return $result; 			
 	}
   
   //Update metadata
   public function updateMetadata($fldAr) {
   	//Modifying files
		$path=_CALEM_DIR_ . 'custom/global/metadata/';
		$file=$fldAr['tableId'] . '.metadata';
		$fullPath= $path . $file;
		if (is_file($fullPath)) {
			$this->backupFile($path, $file);
			$data=file_get_contents($fullPath);
			$md=unserialize($data);
		} else {
			$md=array('table_name'=>$fldAr['tableId'], 'fields'=>array());
		}
		$fld=array('type'=>$fldAr['type']);
		if ($fldAr['type']==FIELD_VARCHAR) {
			$fld['length']=intval($fldAr['length']);	
		}	
		if ($fldAr['required']) {
			$fld['required']=true;	
		}
		$md['fields'][$fldAr['id']]=$fld;
		//Now write the file back.
		$rt=$this->storeFile($fldAr, $md, $fullPath);
		if ($rt['status']!=0) return $rt;
		
		//Let's repackage metadata
		$cm=new CalemZipCustomMetadataJs();
		$cm->package();
		//So this is a success
		return array('id'=>$fldAr['id'], 'status'=>0);
	}
	
	//Delete metadata
   public function deleteMetadata($fldAr) {
   	//Delete the metadata
		$path=_CALEM_DIR_ . 'custom/global/metadata/';
		$file=$fldAr['tableId'] . '.metadata';
		$fullPath= $path . $file;
		if (!is_file($fullPath)) {
			$this->logger->error("Field deleted but the metadata file is not found, fld=" . var_export($fldAr, true));
			return $rt=array('id'=>$fldAr['id'], 
								    'status'=> ERROR_FILE_NOT_FOUND,
				                'errorInfo'=>array('id'=>'CalemFileNotFoundException'));
		}
		
		$this->backupFile($path, $file);
		$data=file_get_contents($fullPath);
		$md=unserialize($data);
		unset($md['fields'][$fldAr['id']]);
		if (count($md['fields']) == 0) {
			unlink($fullPath);
		} else {
			$rt=$this->storeFile($fldAr, $md, $fullPath);
			if ($rt['status']!=0) return $rt;
		}		
		//Let's repackage metadata
		$cm=new CalemZipCustomMetadataJs();
		$cm->package();
		//So this is a success
		return array('id'=>$fldAr['id'], 'status'=>0);
	}
	
	//Update metadata for field name change
   public function updateMetadataForFieldName($fldAr) {
   	//Modifying files
		$path=_CALEM_DIR_ . 'custom/global/metadata/';
		$file=$fldAr['tableId'] . '.metadata';
		$fullPath= $path . $file;
		if (!is_file($fullPath)) {
			$this->logger->error("Field deleted but the metadata file is not found, fld=" . var_export($fldAr, true));
			return $rt=array('id'=>$fldAr['id'], 
								    'status'=> ERROR_FILE_NOT_FOUND,
				                'errorInfo'=>array('id'=>'CalemFileNotFoundException'));
		}
		
		$this->backupFile($path, $file);
		$data=file_get_contents($fullPath);
		$md=unserialize($data);

		$fld=array('type'=>$fldAr['type']);
		if ($fldAr['type']==FIELD_VARCHAR) {
			$fld['length']=intval($fldAr['length']);	
		}	
		if ($fldAr['required']) {
			$fld['required']=true;	
		}
		//Should copy array so the order is preserved.
		$flds=$md['fields'];
		$newFlds=array();
		foreach ($flds as $key=>$value) {
			if ($key==$fldAr['oldId']) {
				$newFlds[$fldAr['id']]=$fld;
			} else {
				$newFlds[$key]=$value;
			}
		}
		$md['fields']=$newFlds;
		//Now write the file back.
		$rt=$this->storeFile($fldAr, $md, $fullPath);
		if ($rt['status']!=0) return $rt;
		
		//Let's repackage metadata
		$cm=new CalemZipCustomMetadataJs();
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
		
		//Let's repackage metadata
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
				$doIt=mkdir($path . "backup", DIR_WRITE_RIGHTS);		
			}
			if ($doIt) {
				copy($path . $file, $path . "backup/" . $file . '_' . date('Y_M_d__H_i_s', time()));
			}
		}
   }
   
}
?>
