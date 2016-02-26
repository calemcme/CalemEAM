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

require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemBo.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/modules/admin/CalemVersion.php';

/**
 * This is the security class implementing SecurityBo interface.
 * It provides all the access control functions and is a singleton.
 */
class CalemVersionBo extends CalemBo {
	
	protected $dbo;
	protected $dboLog;
	protected $conf;
	protected $firstVersion;
	
	//Constructor method
	public function __construct() {
		parent::__construct();
   	global $_CALEM_conf;
   	$this->conf=$_CALEM_conf['admin_conf'];
   	$fv=$_CALEM_conf['admin_conf']['first_version'];
   	$this->firstVersion=new CalemVersion($fv['vid'], $fv['note'], $fv['props']);   		
   }
   
   /**
    * To use this object in installation so cannot assume db is available to start with.
    */
   private function initDbo() {
   	if (!$this->dbo) {
			$this->dbo=CalemFactory::getDbo('version');
		}	
		if (!$this->dboLog) {
			$this->dboLog=CalemFactory::getDbo('version_upgrade_log');	
		}
   }
   
   public function getCurrentVersion($useFirst=true) {
   	$rtn= $useFirst ? $rtn=$this->firstVersion : null;
   	try {
   		$this->initDbo();
   	$dh=CalemFactory::getDbHandler();
   	if (!$dh->tableExists($this->dbo, 'version')) return $rtn;
   		$row=$this->dbo->fetchById(VERSION_ID);
   		if ($this->logger->isInfoEnabled()) $this->logger->info('Version row=' . var_export($row, true));
   		$rtn=CalemVersion::decode($row);	
   	} catch (CalemDboDataNotFoundException $dn) {
   		require_once _CALEM_DIR_ . 'server/include/util/CalemDebug.php';
   		$this->logger->warn('Data not found: ' . CalemDebug::toStackTrace($dn));
   	}
   	return $rtn;   		
   }
   
   public function getNewVersion() {
   	include _CALEM_DIR_ . 'server/conf/version_def.php';
   	$rtn=new CalemVersion($_CALEM_version['vid'], $_CALEM_version['note'], $_CALEM_version['props']);
   	return $rtn;   		
   }
   
   public function save(CalemVersion $version) {
   	try {
   		$this->initDbo();
   		$row=$this->dbo->fetchById(VERSION_ID);
   		$this->dbo->setChangeBulk(array(
   			'vid'=>$version->getVid(),
   			'note'=>$version->getNote(),
   			'props'=>$version->getEncodedProps()));
   		$this->dbo->setIdForUpdate(VERSION_ID);
   		$this->dbo->update();
   	} catch (CalemDboDataNotFoundException $fe) {
   		$this->dbo->setChangeBulk(array(
   			'id'=>VERSION_ID,
   			'vid'=>$version->getVid(),
   			'note'=>$version->getNote(),
   			'props'=>$version->getEncodedProps()));
   		$this->dbo->insert();   		
   	}	
   }
   
   //Upgrade handling
   public function startUpgrade(CalemVersion $vNew, CalemVersion $vOld) {
   	$this->initDbo();
   	$this->dboLog->setChangeBulk(array(
   		'vid'=>$vNew->getVid(),
   		'ver_note'=>$vNew->getNote(),
   		'prev_vid'=>$vOld->getVid(),
   		'prev_ver_note'=>$vOld->getNote(),
   		'prev_props'=>$vOld->getProps(),
   		'status_id'=>$this->conf['upgrade_status']['started'],
   		'start_time'=>CalemText::getServerDatetime()
   	));
   	return $this->dboLog->insert();
   }
   
   public function failUpgrade($id, $results) {
   	$this->setLogStatus($id, $this->conf['upgrade_status']['failed'], $results);
   }
   
   public function completeUpgrade($id, $results) {
   	$this->setLogStatus($id, $this->conf['upgrade_status']['done'], $results);
   }
   
   public function setLogStatus($id, $statusId, $results) {
   	$this->initDbo();
   	$this->dboLog->setChangeBulk(array(
   		'status_id'=>$statusId,
   		'end_time'=>CalemText::getServerDatetime(),
   		'results'=>$results
   	));
   	$this->dboLog->setIdForUpdate($id);
   	$this->dboLog->update();
   }
   
   public function getUpgradeHdlr($newVersion, $currVersion) {
   	$rtn=null;
		if ($currVersion) {
			require_once _CALEM_DIR_ . 'server/upgrade/CalemUpgradeMap.php';
			$rtn=CalemUpgradeMap::getHandler($newVersion, $currVersion);	
		}
		if ($this->logger->isInfoEnabled()) $this->logger->info('newVer=' . $newVersion->getVid() . ", currVer=" . ($currVersion ? $currVersion->getVid() : '') . ', hdlr=' . ($rtn ? get_class($rtn) : ''));
		return $rtn;
   }
}
?>
