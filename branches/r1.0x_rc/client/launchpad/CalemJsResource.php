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
 * This is the common resource.
 */
 
 //Checking basic initialization
 if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

$loaded=false;    
if ($loadmode=='indv') {
	//Meta data in package mode
	if ($_CALEM_conf['calem_mode']==CALEM_DEVELOPMENT) { //dev-mode using individual files.
	   print "<script type=\"text/javascript\" src=\"" . $calemRootUrl . "/client/JsPkg.php?js=Metadata" . "&loadmode=aggr" . "\"></script>";
   	print "<script type=\"text/javascript\" src=\"" . $calemRootUrl . "/client/JsMessages.php?lang=" . $lang . "\"></script>";
		require_once _CALEM_DIR_ . 'client/JsAjax.php';
		require_once _CALEM_DIR_ . 'client/JsCalem.php';
		$loaded=true;
	} else {
	  $loadmode='aggr'; //for custom loading below.	
	}
} 

if (!$loaded) {
   print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
   		   . "/client/JsPkg.php?js=Metadata" . "&loadmode=" . $loadmode . "\"></script>";
   print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
   		   . "/client/JsPkg.php?js=CalemMsg&lang=" . $lang . "&loadmode=" . $loadmode . "\"></script>";      		   
   print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
   		   . "/client/JsPkg.php?js=Ajax" . "&loadmode=" . $loadmode . "\"></script>";
   print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
   		   . "/client/JsPkg.php?js=Calem" . "&loadmode=" . $loadmode . "\"></script>";
}
?>