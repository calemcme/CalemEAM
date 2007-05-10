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
 * UI test page
 */
 
 
   chdir('../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
define('LOG4PHP_CONFIGURATION', _CALEM_DIR_ . 'log4php.properties');

require_once _CALEM_DIR_ . 'server/conf/calem.php';
require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';
require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

 	/**
 	 * Note session data has been loaded already: $lang, $loadmode,
 	 * $theme all set.
 	 */
   $logger=&LoggerManager::getLogger('UiTestMain'); 	 
   if ($logger->isDebugEnabled()) $logger->debug("theme=$theme, loadMode=$loadmode, lang=$lang");
 	$url='http://'. $_CALEM_conf['calem_application_host'];
	if ($_CALEM_conf['calem_application_port']) {
		$url .=":" . $_CALEM_conf['calem_application_port'];
	}
	
	$lang=isset($_REQUEST[CALEM_PARAM_LANG])?$_REQUEST[CALEM_PARAM_LANG]:$_CALEM_conf['client_language'];
   $loadmode=isset($_REQUEST[CALEM_PARAM_LOAD_MODE])?$_REQUEST[CALEM_PARAM_LOAD_MODE]:$_CALEM_conf['client_js_load_mode'];
   $theme=isset($_REQUEST[CALEM_PARAM_THEME])?$_REQUEST[CALEM_PARAM_THEME]:$_CALEM_conf['client_theme'];
	$loopCount=isset($_REQUEST['loopCount'])?$_REQUEST['loopCount'] : 1;
	
	setCookie('CALEM_SID', '112233445566');
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>Calem</title>
    <style type="text/css">
      <!--
        @import url(<?php print $calemRootUrl ?>/client/themes/image/hiRes/dwtimgs.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/dwt.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/common.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/<?php print $theme ?>/<?php print $theme.'_img' ?>.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/<?php print $theme ?>/<?php print $theme ?>.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/dv.css)       
       -->
    </style>
<?php
   if ($loadmode=='indv') {
   	print "<script type=\"text/javascript\" src=\"" . $calemRootUrl . "/client/JsMessages.php?lang=" . $lang . "\"></script>";
   	print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
      		   . "/client/jsPkg.php?js=Metadata&lang=" . $lang . "&loadmode=aggr" . "\"></script>";
		require_once _CALEM_DIR_ . 'client/JsAjax.php';
		require_once _CALEM_DIR_ . 'client/JsCalem.php';
   } else {//JS is downloaded in one big file here.
      print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
      		   . "/client/jsPkg.php?js=CalemMsg&lang=" . $lang . "&loadmode=" . $loadmode . "\"></script>";
      print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
      		   . "/client/jsPkg.php?js=Metadata&lang=" . $lang . "&loadmode=" . $loadmode . "\"></script>";      		   
      print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
      		   . "/client/jsPkg.php?js=Ajax&lang=" . $lang . "&loadmode=" . $loadmode . "\"></script>";
      print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
      		   . "/client/jsPkg.php?js=Calem&lang=" . $lang . "&loadmode=" . $loadmode . "\"></script>";
   }
?>	
	<script language="JavaScript">	   
	   //debugger reference:
		var DBG;
		//Set the url
		calemRootUrl='<?php print $calemRootUrl ?>';
		calemRequestUrl='<?php print $calemRequestUrl ?>';
		calemSoapUrl='<?php print $calemSoapUrl ?>';
		
		function launch() {
	   	loginAndLaunch();
		}
		
		function loginAndLaunch() {
			CalemDebug.initDebug(location);
			
		  		var soapDoc=CalemSoapClient.createSoapDoc("Login", null);
   			soapDoc.set("username", 'calem');
   			soapDoc.set("password", 'calem');
   			var client=new CalemSoapClient(soapDoc);
   			var cr=client.service();
   			DBG.println("is cr instance of CalemSoapResponse? "+ (cr instanceof CalemSoapResponse));
   			DBG.println("getException= "+cr.getException());
   			DBG.println("do dump response"); 
   			DBG.dumpObj(cr);
   			///this.assertTrue(typeof(cr.getException())=='undefined');  			
			   resp=cr.getResponse().LoginResponse;
			   //debug("<b>Logged in. </b> sessionId="+resp.sessionId+", validityPeriod="+resp.validityPeriod);
			   //Init sid for client to use
			   //Init sid for client to use
			   CalemContext.getInstance()._userInfo=new Object();
			   CalemContext.getInstance()._userInfo.sid=resp.sessionId;
			   ///this.assertTrue(resp.sessionId!=null);	 
			   
			   var rdForm = document.createElement('form');
				document.body.appendChild(rdForm);
				rdForm.innerHTML="<input type='hidden' name='sessionId' value='"+resp.sessionId+"'>"
				              + "<input type='hidden' name='validityPeriod' value='"+resp.validityPeriod+"'>";
				rdForm.action='<?php print $calemRootUrl ?>/test/client/calemeam/common/desktop/systemTestCalemFormTabViewCustom.php'+window.location.search;
				rdForm.method="post";
				rdForm.submit();
		} 
        
      //@todo - to rebuild the test.
	   AjxCore.addOnloadListener(launch);
	</script>
</head>
    <body>
    <p>My job is to launch the form properly. My job is done!</p>
    </body>
</html>
