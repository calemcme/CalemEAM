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
   $sid=isset($_REQUEST['sessionId'])?$_REQUEST['sessionId']:null;
   if ($sid == null) {
   	die("sid is not defined, must launch this form via another form");	
   }
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
   //Now launch custom loading
   //Load custom info
   print "<script type=\"text/javascript\" src=\"" . $calemRootUrl 
   		   . "/client/jsPkgCustom.php?sessionId=" . $sid . "&loadmode=" . $loadmode . "\"></script>";
   
?>	
	<script language="JavaScript">
	   var sid='<?php print $sid ?>';
	   //Test form opening
		function setUp() {
         //Memory stress test of opening and closing forms
         mainController=desktop._mainController;
         formTabView=mainController._view;
         reg=CalemContext.getInstance().getRegistry();
         modBudget=reg.getModule('modCalemBudget');
         ev=new Object();
         ev.item=new EventItem();
         //progress info
         progEl=document.getElementById("theme_headline_center");
       	progEl.style.fontFamily = "Arial";
 			progEl.style.fontSize = "16px";
		}
	   
	   
		function launch() {
			CalemDebug.initDebug(location);
			//Need to set up a cookie with encoded data for it to work.
			var sidStr=["{sid: '", sid, "', uid: '1000000', gid: 'CUSTOM_SYSTEM'}"].join('');
			AjxCookie.setCookie(document, 'CALEM_SID', Base64.encode(sidStr));
			//Now verify CalemData info.
			var groups=CalemData['acl_group'];
			var data=groups.data;
			var parentMap=groups.parentMap;
			if (!((data instanceof Array) && data.length > 0) ) {
				throw "Data of CalemData['acl_group] is not array";	
			}
			var count=0;
			var countInner=0;
			for (var i in parentMap) {
				count++;
				var ar=parentMap[i];
				for (var j=0; j< ar.length; ar++) {
					countInner++;
					DBG.println(i+" parent: "+ar[j]);
				}
			}
			if (count<=0 || countInner <=0) {
				throw "Acl group's parent count is 0";	
			}
	   	desktop=CalemDesktop.launch();
	   	//Now verify the cache item here.
	   	var reg=CalemContext.getInstance().getRegistry();
	   	var cache=reg.getCache();
	   	var cachedGroup=cache.get('acl_group');
	   	var parentGroup=cachedGroup.getParentMap();
	   	var count=0;
	   	var countParent=0;
	   	for (var i in parentGroup) {
	   		count++;
	   		var ar=parentGroup[i];
	   		for (var j=0; j < ar.length; j++) {
	   			DBG.println(i+" parent="+ar[j]);
	   			countParent++;
	   		}	
	   	}
	   	if (!(count>0 && countParent>0)) {
	   		//alert("count and parent count are both 0s, custom info not loaded properly");
	   		throw "Count and parent count are both 0s.";	
	   	}
	   	setUp();
	   	//Stress test memory use start
	   	
	   	//No delayed - this is a theory test so it's not used.
	   	//testCalemFormTabViewNoDelay();
         //testCalemFormTabViewWithDelay();
         
         /** Test available forms */
         cycleForms();
		}
		
		var fmList=[
			'CalemBudgetTitleFormList',
			'CalemBudgetTitleFormRead',
			'CalemBudgetFormList'
		];
		
		function cycleForms() {
			for (var i=0; i < fmList.length; i++) {
				setTimeout("openOneForm()", i*1000);
			}
		}
		
		var formIdx=0;
		function openOneForm() {
			mainController.openForm(fmList[formIdx++]);
		}		
		
		  function EventItem() {
		  }
		  EventItem.prototype.setData = function(data) { this._data=data;}
		  EventItem.prototype.getData = function(data) {return this._data;}

		  //This is more a theory test so it's not enabled.
        function testCalemFormTabViewNoDelay() {            
            for (var i=0; i< loopCount; i++) {
               progEl.innerHTML="----- <b>No-delay Test run start - "+i+"<b>";
               openForms();
	            closeTopForms();
	            closeVisibleForms();
	            progEl.innerHTML="----- <b>No-delay Test run complete - "+i+"<b>";
	         }          
        }
        
        //Delay is more reasonable for user interaction.
        function testCalemFormTabViewWithDelay() {
        	   if (loopCount>0) setTimeout("startDelayedTest()", 1000);    
        }
        
        function startDelayedTest() {
	       loopCount--;
	       if (loopCount>=0) {
	       	progEl.innerHTML="----- <b>Delayed Test run - "+loopCount+" ("+ totalTestRun +")<b>";
	       	setTimeout("openForms()", 1000);
	         setTimeout("closeTopForms()", 2000);
	         setTimeout("closeVisibleForms()", 3000);
	       	setTimeout("startDelayedTest()", 4000);
	       } else {
	       	progEl.innerHTML="----- <b>Delayed Test run - DONE ("+totalTestRun+")</b>";
	       }     
        }
        
        function openForms() {
           //Open forms first
           for (var j=0; j< formsToOpen; j++) {
           	  mainController.openDefaultForm(modBudget);
           }
        }
        
        function closeTopForms() {
        	  //at the top one first
           for (var j=formsToOpen-1; j>=tabCount-1 ; j--) {
           	  ev.item.setData(tabCount-1);
           	  formTabView.onFormClose(ev);
           }  
        }
        
        function closeVisibleForms() {
        	  //lower forms.
           for (var j=0; j< tabCount-1; j++) {
           	  ev.item.setData(0);
           	  formTabView.onFormClose(ev);
           }  
        }
        
      
        
        
		//debugger reference:
		var DBG;
		//Set the url
		calemRootUrl='<?php print $calemRootUrl ?>';
		calemRequestUrl='<?php print $calemRequestUrl ?>';
		calemSoapUrl='<?php print $calemSoapUrl ?>';
		//desktop
		var desktop;
	   
	   //Test parameters
	   loopCount=<?php print $loopCount ?>;
	   totalTestRun=loopCount;
      formsToOpen=10;
      tabCount=CalemConf['desktop_mainView']['displayTabs'];
      slowDown=1000;
      pauseBetween=3000;
      
      //Global variables
      var desktop;
      //Memory stress test of opening and closing forms
      var mainController;
      var formTabView;
      var reg;
      var modBudget;
      var ev;
      var progEl;
        
      //@todo - to rebuild the test.
	   AjxCore.addOnloadListener(launch);
	</script>
</head>
    <body>
    <?php 
    	require _CALEM_DIR_ . 'client/themes/' . $theme . '/' . $theme . '.html';
    ?>
    </body>
</html>
