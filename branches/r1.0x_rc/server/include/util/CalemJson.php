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

define("JS_SINGLE_QUOTE", "%27");
define("JS_DOUBLE_QUOTE", "%22");

require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemAclInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemEmbedInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemModuleInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemDataGridInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemViewInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemViewCustomInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemFormInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemFormCustomInfo.php';
require_once _CALEM_DIR_ . 'server/modules/report/model/widget/CalemScheduleInfo.php';

require_once _CALEM_DIR_ . 'server/include/JSON/JSON.php'; //Pear's JSON

/**
 * Helper function for dealing with JSON types from clients.
 */
class CalemJson {
	public static function unescape($sql) {
		if (!(strpos($sql, JS_SINGLE_QUOTE)===false)) {
			$sql=str_replace(JS_SINGLE_QUOTE, "''", $sql);	
		}
		if (!(strpos($sql, JS_DOUBLE_QUOTE)===false)) {
			$sql=str_replace(JS_DOUBLE_QUOTE, "\"", $sql);	
		}
		return $sql;
	}
	
	/**
	 * Iterating an JSON object to construct an array.
	 */
	public static function objToArray($obj) {
		$ar=array();
		if ($obj) {
			foreach ($obj as $attr=>$value) {
				$ar[$attr]=$value;	
			}
		}
		return $ar;
	}
	
	public static function arrayToSql($ar, $sep) {
		if ($sep) {
			$sep = ' ' . $sep . ' ';
		} else {
			$sep=", ";
		}
		$rtn='';
		$first=true;
		foreach ($ar as $el) {
			if (!$first) $rtn .= $sep;
			else $first=false;
			if (is_string($el)) {
				$rtn .= "'" . $el . "'";
			} else {
				$rtn .= $el->getSql();
			}
		}
		return $rtn;
	}
	
	/*
	 * Deserialize ported from web client
	 */
	public static function setJson($obj) {
		if (!$obj) return null;
		foreach ($obj as $key=>$val) {
			$o= new $key;
			$o->setJson($val);
			return $o;
		}	
	}
	
	//deserialize array - thisObj must support add function.
	public static function setJsonAsArray($ar) {
		if (!$ar) return null;
		$newAr=array();
		foreach ($ar as $el) {
			$nel= (is_scalar($el) ? $el : CalemJson::setJson($el));
			array_push($newAr, $nel);
		}
		return $newAr;
	}
	
	//Deserialize a map
	public static function setJsonByMap($map) {
		if (!$map) return null;
		$rtn=array();
		foreach ($map as $key=>$val) {
			$o=CalemJson::setJson($val);
			$rtn[$key]=$o;
		}
		return $rtn;
	}
	
	//json decode from string to php
	public static function jsonToPhp($js) {
		$json= new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
		return $json->decode($js);
	}
}
?>
