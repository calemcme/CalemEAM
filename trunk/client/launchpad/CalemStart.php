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
 * This is the login form.
 */
 
 //Checking basic initialization
 if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);
 
 	/**
 	 * Note session data has been loaded already: $lang, $loadmode,
 	 * $theme all set.
 	 */
   if ($logger->isDebugEnabled()) $logger->debug("theme=$theme, loadMode=$loadmode, lang=$lang");

   require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>CalemEAM - Open Source Enterprise Asset Management</title>
	<link rel="shortcut icon" href="<?php print $calemRootUrl ?>/client/themes/favicon.ico" type="image/x-icon" />
    <style type="text/css">
      <!--
        @import url(<?php print $calemRootUrl ?>/client/themes/image/hiRes/dwtimgs.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/dwt.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/<?php print $theme ?>/<?php print $theme.'_img' ?>.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/<?php print $theme ?>/<?php print $theme ?>.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/dv.css);
       -->
    </style>
</head>
    <body>
    <?php 
    	require _CALEM_DIR_ . 'client/themes/' . $theme . '/' . $theme . '.html';
    ?>
    </body>
</html>

   	
<?php
   //Load common resources
   require _CALEM_DIR_ . 'client/launchpad/CalemJsResource.php';
   //Load custom info
   print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
   		   . "/public/JsPkgCustom.php?sessionId=" . $sid . "\"></script>";
     //prepare locale list
     $localeList='[';
     $bf=true;
     foreach ($_CALEM_conf['client_lang_select'] as $desc=>$val) {
     	  if ($bf) {
     	  		$bf=false;
     	  } else {
     	  		$localeList .= ',';
     	  }
     	  $id=$val['id'] ? $val['id'] : NULL_LOCALE;
     	  $localeList .= '{id: "' . $id . '", desc: "' . $desc . '"}';     	  	
     }
     $localeList .=']';
     if ($logger->isDebugEnabled()) $logger->debug("localeList=" . $localeList);
     //Product info
     require_once _CALEM_DIR_ . 'server/modules/admin/CalemVersion.php';
     $vi=CalemVersion::getCurrentVersion();
     $calemProdInfo=$vi->getNote();
?>	
	<script language="JavaScript">
		function launch() {
			CalemDebug.initDebug(location);
	   	CalemDesktop.launch();
		}
		//debugger reference:
		var DBG;
		//Set the url
		calemRootUrl='<?php print $calemRootUrl ?>';
		calemRequestUrl='<?php print $calemRequestUrl ?>';
		calemSoapUrl='<?php print $calemSoapUrl ?>';
		calemUseAlternateColor = <?php print $calemAlternateColor ?>;
		calemLocaleList= eval(<?php print $localeList ?>);
		calemProdInfo='<?php print $calemProdInfo ?>';
	   AjxCore.addOnloadListener(launch);
	</script>
