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

/**
 * This is the class with version info.
 */
class CalemVersion {
	protected $vid;
	protected $note;
	protected $props;
	
	public function __construct($vid=null, $note=null, $props=null) {
		$this->vid = $vid;
		$this->note= $note;
		$this->props = $props;
	}
	
	public static function decode($row) {
		if ($row['props']) $props=unserialize($row['props']);
		return new CalemVersion($row['vid'], $row['note'], $props);
	}
	
	public static function getCurrentVersion() {
		include _CALEM_DIR_ . 'server/conf/version_def.php';
		return new CalemVersion($_CALEM_version['vid'], $_CALEM_version['note'], $_CALEM_version['props']);	
	}
	
	public function getVid() {return $this->vid;}
	public function getNote() {return $this->note;}
	public function getProps() {return $this->props;}
	
	public function getProp($key) {
		return ($this->props ? $this->props[$key] : null);
	}
	
	public function getEncodedProps() {
		return ($this->props ? serialize($this->props) : null);
	}
}
?>
