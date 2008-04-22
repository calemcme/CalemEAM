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
//Base CalemDao
require_once _CALEM_DIR_ . 'server/include/core/database/CalemDbo.php';

require_once _CALEM_DIR_ . 'build/cache/CalemCacheAclGroup.php';

/**
 * This action is invoked when an access was attempted without a valid session.
 */
class CalemAclGroupDbo extends CalemDbo {		
	//Getting all groups
	public function getAll() {
		return $this->fetchBySql("select * from acl_group");
	}
	
	/**
	 * Rebuild cache when groups are changed.
	 */

 	//Insertion
 	public function insert() {
 		parent::insert();
 		$this->updateCache();
 	}
	
	/**
	 * Delete function
	 * 
	 */
	public function delete($recycle=false) {
 		parent::delete($recycle);
 		$this->updateCache();
 	}
 	
 	/**
 	 * Update function
 	 */
 	public function update() {
 		parent::update();
 		$this->updateCache();
 	}
 	
 	/**
 	 * Updating cache for aclGroups
 	 */
 	public function updateCache() {
 		if ($this->logger->isDebugEnabled()) $this->logger->debug("Reload cache for acl_group");
 		$loader=new CalemCacheAclGroup();
 		$loader->load();	
 	}
}

?>