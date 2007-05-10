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
 
 require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
 
 //Check for user customization
 $lang=isset($_REQUEST['lang'])?$_REQUEST['lang']:$_CALEM_conf['client_language'];
 if ($lang) {
 	if (!is_file(_CALEM_DIR_ . 'client/launchpad/resource/CalemMsg_' . $lang . ".js")) {
 		$lang=$_CALEM_conf['client_language'];
 	}
 }
 $loadmode=isset($_REQUEST['loadmode'])?$_REQUEST['loadmode']:$_CALEM_conf['client_js_load_mode'];
 $theme=isset($_REQUEST['theme'])?$_REQUEST['theme']:$_CALEM_conf['client_theme'];
 if (!is_dir(_CALEM_DIR_ . 'client/themes/' . $theme)) {
 	 $theme=$_CALEM_conf['client_theme'];
 }
   
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>CalemEAM - Open Source Enterprise Asset Management</title>
    <style type="text/css">
      <!--
        @import url(<?php print $calemRootUrl ?>/client/themes/image/hiRes/dwtimgs.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/login.css);
       -->
    </style>
<?php
   require _CALEM_DIR_ . 'client/launchpad/CalemJsResource.php';
?>	
	<script language="JavaScript">
		function launch() {
			CalemDebug.initDebug(location);
			CalemLogin.onload();
		}
		//debugger reference:
		var DBG;
		//Set the url
		calemRootUrl='<?php print $calemRootUrl ?>';
		calemRequestUrl='<?php print $calemRequestUrl ?>';
		calemSoapUrl='<?php print $calemSoapUrl ?>';
	   AjxCore.addOnloadListener(launch);
	</script>
</head>
    <body>
    </body>
</html>
