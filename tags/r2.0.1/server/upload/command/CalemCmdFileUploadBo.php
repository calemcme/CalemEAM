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

require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
 
class CalemCmdFileUploadBo extends CalemBo {
		
   protected $param;
	protected $conf;
	protected $uploadName;
	
	public function __construct() {
		parent::__construct();
		global $_CALEM_conf;
		$this->conf=$_CALEM_conf['upload_conf'];
		$this->uploadName=$this->conf['upload_name'];
	}
	
	public function init($param) {
		$this->param=$param;
		if ($this->logger->isInfoEnabled()) $this->logger->info("Upload param=" . $param);
	}
	
	public function execute() {
		if ($this->logger->isDebugEnabled()) $this->logger->debug("upload is: " . var_export($_FILES, true));
		$dir=$this->conf['dir_map'][$this->param];
		$bn=basename($_FILES[$this->uploadName]['name']);
		$uploadfile = _CALEM_DIR_ . $dir . $bn;
		if (move_uploaded_file($_FILES[$this->uploadName]['tmp_name'], $uploadfile)) {
  			print "{SUCC:".$bn;
  			if ($this->logger->isInfoEnabled()) $this->logger->info("File is uploaded to " . $uploadfile);
		} else {
			print "File uploaded is invalid. The upload failed.";
			if ($this->logger->isInfoEnabled()) $this->logger->info("Upload failed. Cannot move file to " . $uploadfile);
		}
	}
	
	public function toString() {
		return "{conf=" . var_export($this->conf, true) . ", param=" . $this->param . "}";	
	}
}
?>
