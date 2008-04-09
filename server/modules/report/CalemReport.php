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

require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
require _CALEM_DIR_ . 'server/modules/report/CalemReportMap.php';

/** 
 * Couple special cases:
 * <p> "\'" was replacing "'" by system urldecode so get rid of it here </p>
 * <p> "%" is used in SQL query and by urlencode so "(%)" are used at client side, now restore it </p>
 */
function decodeUrlEx($st) {return str_replace(array("\'", "(%)"), array("'", "%"), urldecode($st)); }
 
//Get data item
$query=array();
if ($_REQUEST['cid']) {
	$query['cid']= $_REQUEST['cid'];
} else if ($_REQUEST['xid']) {
	$query['xid']=decodeUrlEx($_REQUEST['xid']);
} else {
	$query['all']=true;
}

//Report id
$rid=$_REQUEST['rid'];

//Locale info.
$lid=$_REQUEST['lid'];
if ($lid) {
	$lids=decodeUrlEx($lid);
	require_once _CALEM_DIR_ . 'server/include/JSON/JSON.php'; //Pear's JSON
	$json = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
	$loc_conf=$json->decode($lids);
	
}
if ($logger->isInfoEnabled()) $logger->info('rid=' . $rid . ', query=' . var_export($query, true) . ', locInfo=' . var_export($loc_conf, true));

$calemImgCss=$calemRootUrl . '/client/themes/' . $theme . "/" . $theme . "_img.css";
$dwtImgCss=$calemRootUrl . '/client/themes/image/hiRes/dwtimgs.css';
$calemReportCss=$calemRootUrl . '/client/themes/' . $theme . "/" . $theme . "_print.css";
$customReportIcon=null;
$clg= ($_CALEM_conf['report_conf']['custom_logo'] ? $_CALEM_conf['report_conf']['custom_logo'] : 'custom_logo.png');
if (is_file(_CALEM_DIR_ . 'client/themes/' . $clg)) {
  $customReportIcon=$calemRootUrl . '/client/themes/' . $clg;
}
$calemReportIcon=$calemRootUrl . '/client/themes/calemeam.png';
$calemReportPrintIcon=$calemRootUrl . '/client/themes/' . $theme . "/icons/printer.png";
//Identify controller
$controller= CalemReportMap::getController($rid, $query);
$doc=$controller->render();
$reportTitle=$controller->getReportTitle();

include _CALEM_DIR_ . 'server/modules/report/doc/CalemReportHeader.php';
print $doc;
include _CALEM_DIR_ . 'server/modules/report/doc/CalemReportFooter.php';
?>
