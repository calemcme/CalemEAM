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

require_once _CALEM_DIR_ . 'server/modules/admin/CalemVersionBo.php';
require_once 'CalemUpgradeMap.php';
 
class CalemUpgrade {	
	protected $vNew;
	protected $vCurr;
	protected $verBo;
	
	public function __construct($nId=null, $cId=null) {
		$this->verBo=new CalemVersionBo();
		$nVer=$this->verBo->getNewVersion();
		$cVer=$this->verBo->getCurrentVersion();
		if ($nId && $cId) {
			$this->vNew = ($nId==$nVer->getVid()) ? $nVer : (new CalemVersion($nId));
			$this->vCurr= ($cId==$cVer->getVid()) ? $cVer : (new CalemVersion($cId));	
		} else {
			$this->vNew=$this->verBo->getNewVersion();
		   $this->vCurr=$this->verBo->getCurrentVersion();
		}	
	}
	
	public function execute() {
		if ($this->vNew->getVid()==$this->vCurr->getVid()) {
			echo "Current system is the same version as the version installed. Upgrade is aborted.\n";
			return;
		}
		$handler=CalemUpgradeMap::getHandler($this->vNew, $this->vCurr);
		if (!$handler) {
			echo "No handler is found for upgrading from " . $this->vCurr->getVid() . ' to ' . $this->vNew->getVid() . "\n";
			return;	
		}
		$results=$handler->upgrade();
		return $results;
	}
}
?>
