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

//Base CalemDao
require_once _CALEM_DIR_ . 'server/include/core/CalemUiException.php';
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';

class CalemDocUploadDbo extends CalemDbo {		
	//Add in number and abc time
	public function beforeInsert($baseTable, $baseData, $customTable, $customData) {
		$baseData['file_upload']=base64_decode($baseData['file_upload']);
		return $baseData;
	}
	
	public function beforeUpdate($baseTable, $baseCurrent, $baseUpdate) {
		if (isset($baseUpdate['file_upload'])) {
			$baseUpdate['file_upload']=base64_decode($baseUpdate['file_upload']);
		}
		return $baseUpdate;
	}
	
	public function onDataUpdated($baseTable, $baseCurrent, $baseUpdate, $customTable, $customCurrent, $customUpdate) {
		if (isset($baseUpdate['access_id']) || isset($baseUpdate['file_upload'])) {//So we moved file location
			global $_CALEM_conf;
			$path=$_CALEM_conf['upload_conf']['dir_map'][$baseCurrent['access_id']];
			$fp=_CALEM_DIR_ . $path . $baseCurrent['file_upload'];
			if (isset($baseUpdate['file_upload'])) { //file is already loaded.
				//Remove old files if the files are different (access mode changed or the file names are different)
				if (is_file($fp) 
				   && (isset($baseUpdate['access_id'])|| $baseUpdate['file_upload']!=$baseCurrent['file_upload']) ) {
					if ($this->logger->isInfoEnabled()) $this->logger->info("To remove file $fp, newAccessId=".$baseUpdate['access_id'].", newFile=".$baseUpdate['file_upload']);
					unlink($fp);	
				}
			} else if (isset($baseUpdate['access_id'])) {
				$np=$_CALEM_conf['upload_conf']['dir_map'][$baseUpdate['access_id']];
				$nfp=_CALEM_DIR_ . $np . $baseCurrent['file_upload'];
				if ($this->logger->isInfoEnabled()) $this->logger->info("To move file to $nfp from $fp");
				rename($fp, $nfp);
			}
		}
	}
}
?>
