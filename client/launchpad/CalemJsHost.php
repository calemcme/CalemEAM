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


/**
 * Host configuration.
 */
 
 //Checking basic initialization
 if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);
   
   //Check for https
   $calemAlternateColor=isset($_REQUEST['alternatecolor']) ? $_REQUEST['alternatecolor'] : 0;
   $url= isset($_SERVER['HTTPS']) ? $_CALEM_conf['calem_host']['https'] : $_CALEM_conf['calem_host']['http'];
   $url .= $_SERVER['HTTP_HOST'];
 	//$query= (isset($_SERVER['argv']) && isset($_SERVER['argv'][0])) ? ('?' . $_SERVER['argv'][0]) : '';
	$calemRootUrl=$url . $_CALEM_conf['calem_root_uri'];
	$calemRequestUrl=$url . $_CALEM_conf['calem_request_uri']; // . $query;
	$calemSoapUrl= $url . $_CALEM_conf['calem_soap_uri'];
?>
