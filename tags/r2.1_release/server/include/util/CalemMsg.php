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

class CalemMsg {
	private static $inst;
	private $msg;
	private $i18nMsg;
	private $customMsg;
	
	public static function getInstance($langId=null) {
       if (!isset(self::$inst)) {
           $c = __CLASS__;
           self::$inst = new $c;
           self::$inst->init($langId);
       }
       return self::$inst;
   }
	
	public static function getMsg($id) {
		$inst=CalemMsg::getInstance();
		return $inst->getMessage($id);
	}
	
	public function init($langId) {
		global $lang;
		$lf= ($langId ? '_'.$langId : ($lang ? '_' . $lang : ''));
		$fn=_CALEM_DIR_ . 'client/launchpad/resource/CalemMsg' . $lf . '.phpo';
		$dfn=_CALEM_DIR_ . 'client/launchpad/resource/CalemMsg' . '.phpo';
		$fn = file_exists($fn) ? $fn : $dfn;
		$cn=file_get_contents($fn);
		$this->msg=unserialize($cn);
	
		$customFn=_CALEM_DIR_ . 'custom/global/message/custom' . $lf . '.message';
		if (file_exists($customFn)) {
			$f=file_get_contents($customFn);
			$this->customMsg=unserialize($f);	
		}
	}
	
	public function getMessage($id) {
		$msg=null;
		if ($this->customMsg) {
			$msg=$this->customMsg[$id];	
		}	
		if (!$msg) {
			$msg=$this->msg[$id];	
		}
		if (!$msg) {
			$msg=$this->i18nMsg[$id];	
		}
		return $msg;
	}
}
?>
