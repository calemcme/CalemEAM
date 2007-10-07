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
require_once _CALEM_DIR_ . 'server/modules/admin/CalemVersionBo.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';
 
abstract class CalemUpgradeBo extends CalemBo {	
	protected $newVer;
	protected $currVer;
	protected $verBo;
	protected $id;
	
	public function __construct() {
		parent::__construct();
		$this->verBo=new CalemVersionBo();
	}
	
	public function init(CalemVersion $newVer, CalemVersion $currVer) {
		$this->newVer=$newVer;
		$this->currVer=$currVer;
	}
	
	public function upgrade() {
		$startTime=CalemText::getServerDatetime();
		$cmds=$this->getCmds();
		$succ=true;
		$results='';
		try {
			foreach ($cmds as $key=>$cmdInfo) {
				require_once 'command/' . $cmdInfo['cmd'] . '.php';
				$cmd=new $cmdInfo['cmd'];
				$cmd->init($cmdInfo['param']);
				$result=$cmd->execute();
				$results .= $result;	
			}
			$results = 'Done upgrade. Commands executed: ' . count($cmds) . "\n" .  $results;
		} catch (Exception $e) {
			$results = $e->getMessage();
			$succ=false;
		}
		//Now let's log the version upgrade results if any.
		try {
			$this->id=$this->verBo->startUpgrade($this->newVer, $this->currVer);
			if ($succ) {
				$this->verBo->save($this->newVer);
				$this->verBo->completeUpgrade($this->id, $results);
			} else {
				$this->verBo->failUpgrade($this->id, $results);
			}
		} catch (Exception $e) {
			$this->logger->error("Error in creating upgrade log, error=" . $e->getMessage());
		}
		return $results;
	}
	
	//Each handler must provide a list of cmds.
	abstract public function getCmds();
}
?>
