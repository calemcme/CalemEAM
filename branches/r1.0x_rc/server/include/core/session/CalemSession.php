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
 * This is the CalemSession Object
 */
class CalemSession {
	private $sid;
	private $data;
	
	/**
	 * constructor
	 */
	public function __construct($sid=null, $data=null) {
		if ($sid) {
			$this->sid=$sid;
		} else {
			$uidObj=CalemFactory::getUidGen();
			$this->sid=$uidObj->getUid();
		}
		if ($data) {
			$this->data=$data;
		} else {
			$this->data=array('sid'=>$this->sid);
		}
	}
	
	/**
	 * Factory method to load session
	 */
	public static function load($sid) {
		$sm=CalemSession::getSessionManager();
		$loaded=$sm->load($sid);
		$ses=null;
		if ($loaded) {
			$ses=new CalemSession($sid, $loaded);
		}
		return $ses;
	}
	//Get sessionManager
	public static function getSessionManager() {
		return CalemFactory::getSessionManager();
	}
	/**
	 * Get by key
	 */
	public function get($key=null) {
		if (!$key) return $this->data;
		$val=isset($this->data[$key]) ? $this->data[$key] : null;
		return $val;
	}
	/**
	 * Conveniece
	 */
	public function getSid() {
		return $this->get('sid');
	}
	/**
	 * Set by key
	 */
	public function set($key, $value) {
		$this->data[$key]=$value;
	}
	/**
	 * Renew session - renew the lease in case of timeout.
	 */
	public function renew() { //Could optimize, but wait till necessary.
		$this->save();
	}
	/**
	 * Save session
	 */
	public function save() {
		$sm=CalemSession::getSessionManager();
		$sm->save($this->data, $this->sid);
	}
	/**
	 * Remove session
	 */
	public function remove() {
		$sm=CalemSession::getSessionManager();
		$sm->remove($this->sid);
	}
	/**
	 * toString function to print out the data
	 */
	public function toString() {
		return 'CalemSession: {sessionId=' . $this->sid . ', data=' . var_export($this->data, true) . '}';
	}
}
