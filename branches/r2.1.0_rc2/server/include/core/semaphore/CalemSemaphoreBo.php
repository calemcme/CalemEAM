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

require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/core/semaphore/CalemSemaphore.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemText.php';

/**
 * This is the CalemSemaphoreBo class that handles semaphores
 */
class CalemSemaphoreBo {
	protected $dbo;
	private $logger;
	
	/**
	 * constructor
	 */
	public function __construct($sid=null, $data=null) {
		$this->dbo=CalemFactory::getDbo('semaphore');
		$this->logger=&LoggerManager::getLogger("CalemSemaphoreBo");
	}
	
	public function get($id) {
		$rtn=null;
		try {
			$sem=$this->dbo->fetchById($id);	
			$exp=CalemText::parseServerDateTime($sem['expire_time']);
			$rtn=new CalemSemaphore($id, $exp);
		} catch (CalemDboDataNotFoundException $e) {
		}
		return $rtn;
	}
	
	public function set($sem) {
		$ar=array("expire_time"=>CalemText::getServerDateTime($sem->getExpireTime()));
		try {
			$ps=$this->dbo->fetchById($sem->getId());
			//Doing an update here.
			$this->dbo->setChangeBulk($ar);
			$this->dbo->setIdForUpdate($sem->getId());
			$this->dbo->update();
		} catch (CalemDboDataNotFoundException $e) {
			//Doing an insertion here.
			$ar['id']=$sem->getId();
			$this->dbo->setChangeBulk($ar);
			$this->dbo->insert();
		}
		
	}
	
	public function clear($id) {
		try {
			$sem=$this->dbo->deleteById($id);	
		} catch (Exception $e) {
			$this->logger->debug("Error in deleting $id, error=" . $e->getMessage());
		}
	}
	
	
}

?>