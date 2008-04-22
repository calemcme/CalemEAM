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

class CalemLang {
	private $lang;
	private $id;
	
	public static function getLangList($path) {
		if (!is_dir($path)) {
			return null;
		}
		$d=dir($path);
		$list=array();
		while (false !== ($entry = $d->read())) {
			if (strpos($entry, 'lang_')===false || strpos($entry, '.php') ===false) continue;
			include $path . '/' . $entry;
			$list[substr($entry, 0, strlen($entry)-4)]=$_CALEM_lang['title'];	
		}
		return $list;	
	}
	
	public function __construct($path, $id) {
		include $path . '/' . $id . '.php';
		$this->lang=$_CALEM_lang;
		$this->id=$id;
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getTitle() {
		return $this->lang['title'];	
	}
	
	public function getMsg($id) {
		return $this->lang['def'][$id];
	}
}
?>