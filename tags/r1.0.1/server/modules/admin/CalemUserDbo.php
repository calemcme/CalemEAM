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

/**
 * This action is invoked when an access was attempted without a valid session.
 */
class CalemUserDbo extends CalemDbo {		
	public function getUsername() {
		return $this->row['username'];
	}
	public function getPassword() {
		return $this->row['password'];	
	}
	public function getLoginAllowed() {
		return (isset($this->row['login_allowed']) 
						&& $this->row['login_allowed']==1);	
	}
	/**
	 * Find a user by user_name
	 * @param string $username
    * @return null|users object
	 * 
	 */
	public static function findByUsername($username) {
		$dbo=CalemFactory::getDbo('users');
		$rows=$dbo->fetchBySqlParam('select * from users where username=?', $username);
		$dbo->resetRow($rows[0]);
		return $dbo;		
	}
	
	/**
	 * Find record by Id
	 */
	public static function findById($id) {
		$dbo=CalemFactory::getDbo('users');
		$row=$dbo->fetchById($id);
		$dbo->resetRow($row);
		return $dbo;		
	}

	public function getPoApprovalLevel() {
		return $this->row['po_approval_id'];	
	}
	
	public function getReqApprovalLevel() {
		return $this->row['req_approval_id'];	
	}
}
