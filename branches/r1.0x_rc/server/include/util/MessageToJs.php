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


// Checking basic initialization
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

/**
 * This is the helper class to convert messages to JSON.
 */
class MessageToJs {
	/**
	 * Parse a given file and convert to JSON
	 * @param String Object name
	 * @param String file name
	 * @param boolean Add object declaration
	 * @return String JSON format
	 */
 	public static function fileToJs($obj, $fullname) {  
 	  $rtn="//Messages of $obj from " . basename($fullname);
     $handle = @fopen($fullname, "r");
	  if ($handle) {
		while (!feof($handle)) {
			$buffer = fgets($handle);
			if (strpos($buffer, '#')===0) continue;
			$rtn .= self::parseProperty($obj, $buffer);
			$rtn .= CALEM_LFCR;
		}
     	fclose($handle);
	  }
     return $rtn;
 	}
 	/**
 	 * Parse a property and make it JSON element
 	 */
 	public static function parseProperty($obj, $prop) {
 		$tok = strtok($prop, "=");
 		$tok=trim($tok);
 		if (!$tok) return ''; //Nothing here.
 		$rtn=$obj . '["' . $tok . '"] = ';
 		$tok=strtok("=");
 		if (!(strpos($tok, '"')===false)) {
 			$tok=preg_replace('/"/', '\"', $tok);
 		}
 		$rtn .= "\"" . trim($tok). "\";";
 		return $rtn;
 	}
}
?>