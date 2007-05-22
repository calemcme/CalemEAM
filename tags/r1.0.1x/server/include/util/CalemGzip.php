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

require_once _CALEM_DIR_ . 'server/include/util/CalemExit.php';
/**
 * This is helper function to output zipped content.
 */
class CalemGzip {
	/**
	 * checking for gzip and x-gzip.
	 */
 	public static function canGzip() {  
     if (headers_sent()) return 0; 
     $encoding=$_SERVER['HTTP_ACCEPT_ENCODING'];
     if (!(strpos($encoding, 'x-gzip') === false)) return "x-gzip";
     if (!(strpos($encoding,'gzip') === false)) return "gzip";
     return 0;
 	}
 	
 	/**
 	 * Assume content is constructed properly based on zip flag. 
 	 */
 	public static function gzEndFlush($zip=false, $encoding=null) {
     if ($zip) {
     	 header("Content-Encoding: ".$encoding);
     }
     ob_end_flush();
     CalemExit::exitCalem();
 	}
 	
 	/**
 	 * Assume content is not constructed properly for zip 
 	 */
 	public static function gzSoapCompressEndFlush($status, $zip=false, $encoding=null, $logger=null) {
 		header($status);
		header("Content-Type: text/xml; charset=UTF-8");
 	   if ($zip) {
     	 	header("Content-Encoding: ".$encoding);
       	$contents = ob_get_contents();
       	ob_end_clean();
       	$zipContents = gzencode($contents);
       	print($zipContents);
       	if ($logger && $logger->isDebugEnabled()) $logger->debug("Zip contents from " . strlen($contents) . " to " . strlen($zipContents));
     } else {
       	ob_end_flush();
     }
     CalemExit::exitCalem();
 	}
 
 	/**
 	 * Zip start
 	 */
 	public static function gzStart() {
 		ob_start();
 		ob_implicit_flush(0);
 	}
}
?>