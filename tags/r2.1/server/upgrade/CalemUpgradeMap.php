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
 
class CalemUpgradeMap {	
	public static function getHandler(CalemVersion $new, CalemVersion $curr) {
		include  _CALEM_DIR_ . 'server/upgrade/upgrade_map.php';
		@include _CALEM_DIR_ . 'server/upgrade/upgrade_map.custom.custom.php';
		$entry=$_CALEM_upgrade[$new->getVid()];
		if (!$entry) return null;
		$hi=$entry['from'][$curr->getVid()];
		if (!$hi) return null;
		$path = _CALEM_DIR_ . $hi['path'] . '/';
		require_once $path . $hi['class'] . '.php';
		$obj=new $hi['class'];
		$obj->init($new, $curr);
		return $obj;	
	}	
}
?>
