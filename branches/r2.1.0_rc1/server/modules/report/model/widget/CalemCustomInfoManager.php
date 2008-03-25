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

require_once _CALEM_DIR_ . 'server/include/util/CalemJson.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemReportUtil.php';
require_once _CALEM_DIR_ . 'server/include/core/CalemFactory.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';
	
/**
 * CalemCustomInfoManager
 */
class CalemCustomInfoManager {
	private $logger;
	
	public function CalemCustomInfoManager() {
		$this->logger=&LoggerManager::getLogger("CalemCustomInfoManager");
	}
	
	/**
	 * Get my custom acl. 
	 * Needs to traverse the hierarchy to till the top.
	 */
	public function getMyCustomInfo($id, $target) {
		$uid=CalemReportUtil::getUid();
		$isGroup= ($target && $target->isGroup());
		$gid= $isGroup ? $target->getId() : CalemReportUtil::getGid();
		return $this->getCustomInfo($id, $uid, $gid, $isGroup, false, true); //The first one found, stop.
	}
	
	/**
	 * Get parent acl for design
	 */
	public function getParentCustomInfo($id, $target) {//This is for design case.
	   $isGroup= ($target && $target->isGroup());
		$gid= $isGroup ? $target->getId() : CalemReportUtil::getGid();
		return $this->getCustomInfo($id, null, $gid, true, $isGroup, false); //skipping current one and all the way up.
	}
	
	/**
	 * Get all the Acls and first layout that's valid if applicable.
	 */
	public function getFullCustomInfo($id, $target) {
		$isGroup= ($target && $target->isGroup());
		$gid= $isGroup ? $target->getId() : CalemReportUtil::getGid();
		return $this->getCustomInfo($id, CalemReportUtil::getUid(), $gid, $isGroup, false, false);
	}
	
	/**
	 * Assemble a view's acl based on current user, group and default system info.
	 */
	public function getCustomInfo($id, $uid, $gid, $excludeUser, $excludeMyGroup, $stopWhenFound) {
		//Creating a customInfo for result.
		$customInfo=$this->getEmptyCustomInfo($id);
		$foundIt=false;
		//Aggregate user
		if (!$excludeUser) {
			list($foundIt, $customInfo) = $this->aggregate($id, $uid, $customInfo, true);
			if ($stopWhenFound && $foundIt) return $customInfo;
		}
		
		//Aggregate group
		if (!$excludeMyGroup) {
			list($foundIt, $customInfo) = $this->aggregate($id, $gid, $customInfo, false);
			if ($stopWhenFound && $foundIt) return $customInfo;
		}
		
		$cache=CalemFactory::getDataCacheManager();
		$cachedGroups=$cache->load('acl_group');
		$parents=$cachedGroups['parentMap'][$gid];
		if ($this->logger->isDebugEnabled()) $this->logger->debug("gid=" . $gid . ", parents=" . var_export($parents, true));
		if ($parents) {
			foreach ($parents as $parent) {
				list($foundIt, $customInfo) = $this->aggregate($id, $parent, $customInfo, false);
				if ($stopWhenFound && $foundIt) return $customInfo;
			}
		}
		return $customInfo;
	}
	
	/**
	 * Aggregate all ACLs but only the very first layout is used as the layout.
	 */
	public function aggregate($id, $aid, $customInfo, $isUser) {
		$cInfo=$this->getCustomInfoById($id, $aid, $isUser);
		if ($cInfo) {
			$rtn=$customInfo->getAcl()->aggregate($cInfo->getAcl());
			if (!$customInfo->getLayout() && $cInfo->getLayout()) $customInfo->setLayout($cInfo->getLayout());
		}
		return array($cInfo, $customInfo);
	}
	
	//CustomInfo check
	public function getCustomInfoById($id, $oid, $isUser) {
		$info=CalemReportUtil::getCustomReportById($id, $oid, $isUser); 
		return $info;
	}
}
	
/**
 * CalemCustomViewManager
 */
class CalemCustomViewManager extends CalemCustomInfoManager {
	private static $inst;
	
	public static function getInstance() {
		if (!self::$inst) {
			$c = __CLASS__;
         self::$inst = new $c;
		}
		return self::$inst;
	}
	
	/**
	 * Creating an empty CustomViewInfo.
	 */
	public function getEmptyCustomInfo($id) {
		$viewAcl=new CalemViewAclInfo(new CalemAclInfo(array()), new CalemAclInfo(array()));
		return new CalemViewCustomInfo($id, $viewAcl, null);
	}
}
	 
/**
 * CalemCustomFormManager
 */
class CalemCustomFormManager extends CalemCustomInfoManager {	
	private static $inst;
	
	public static function getInstance() {
		if (!self::$inst) {
			$c = __CLASS__;
         self::$inst = new $c;
		}
		return self::$inst;
	}
	
	/**
	 * Creating an empty CustomViewInfo.
	 */
	public function getEmptyCustomInfo($id) {
		$formAcl=new CalemFormAclInfo(new CalemAclInfo(array()), new CalemAclInfo(array()));
		return new CalemFormCustomInfo($id, $formAcl, null);
	}
}
?>