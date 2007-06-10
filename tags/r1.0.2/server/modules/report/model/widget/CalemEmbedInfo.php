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

require_once _CALEM_DIR_ . 'server/include/util/CalemReportUtil.php';

/**
 * Design target info
 * @param: target is an object with property and value.
 */
class CalemDesignTargetInfo {
	const USER='user';
	const GROUP='group';
	
	private $type;
	private $id;
	private $value;
	
	private static $sysTarget;
	
	public function CalemDesignTargetInfo($type, $id, $value) {
		$this->type=$type;
		$this->id=$id;
		$this->value=$value;	
	}
	
	public static function setSystemDesignTarget($designTarget) {
		self::$sysTarget=$designTarget;
	}
	
	public static function getReportDesignTarget() {
		global $_CALEM_conf;
		if (CalemReportUtil::getUid() == $_CALEM_conf['design_target']['dev_admin_id'] 
		    && $_CALEM_conf['design_target']['devDesignPhase']
		    && CalemReportUtil::getGid() == CUSTOM_SYS) {
			$grp=$_CALEM_conf['design_target']['devDesignGroup'];
			$rtn=new CalemDesignTargetInfo(CalemDesignTargetInfo::GROUP, $grp, '');		
		} else {//Design for CUSTOM_SYSTEM
			$rtn=new CalemDesignTargetInfo(CalemDesignTargetInfo::GROUP, CUSTOM_SYSTEM, '');
		}
		return $rtn;
	}
	
	public function getType() {return $this->type;}
	public function getId() {return $this->id;}
	public function getValue() {return $this->value;}
	public function isGroup() {return $this->type==CalemDesignTargetInfo::GROUP;}
}
?>
