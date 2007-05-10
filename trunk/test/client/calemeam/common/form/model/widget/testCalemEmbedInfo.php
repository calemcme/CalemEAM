<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<?php
   chdir('../../../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
	
	require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';
	require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

?>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>CalemDb test</title>
    
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=CalemMsg"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Metadata"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Ajax"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Calem"></script>
    
    <link rel="stylesheet" type="text/css" href="<?php print $calemRootUrl ?>/test/client/jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/test/client/jsunit/app/jsUnitCore.js"></script>
    
    <script language="JavaScript" type="text/javascript">
        function exposeTestFunctionNames() {
            return ['testCalemEmbedInfo', 'testDesignTarget'];
        }
        
        function setUp() {
        	   CalemDebug.initDebug(location);
        		cc=CalemContext.getInstance();
				cc.init(); //Initialize context.
   			//Init registry
   			var regMgr=CalemConf.registry_manager;
   			var reg=eval(["new ", regMgr.impl, "()"].join(""));
   			reg.initForTest(regMgr.names)
   			cc.setRegistry(reg);        	
        }
       
        function testCalemEmbedInfo() {
        	 debug("<b>testCalemEmbedInfo</b>");
        	 var ebInfo=new CalemEmbedInfo(CalemContext.getInstance().getShell(), 'CalemUserFormNew');
        	 debug("embed formId="+ebInfo.getId()+", ebInfo="+ebInfo);
        	 assertTrue(ebInfo.getId()=='CalemUserFormNew'); 
        	 debug("embedInfo done");
        }
        
        function testDesignTarget() {
        	  var str="{sid: '12345', uid: '1000000', gid: 'CUSTOM_SYSTEM'}";
        	  AjxCookie.setCookie(document, 'CALEM_SID', Base64.encode(str)); 
        	  cc.init();
        	  var target=CalemDesignTargetInfo.getFormDesignTarget();
        	  debug("testTarget: isGroup="+target.isGroup()+", id="+target.getId());
        	  assertTrue(target.isGroup());
        	  assertTrue(target.getId()==CalemConst.CUSTOM_SYSTEM);
        }
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        

        function startTest() {
        		setUp();
        		testCalemEmbedInfo();
        		testDesignTarget();
        }
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        var cc;
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemFormInfo tests</h1>

<p>This page tests CalemFormInfo class.</p>
<div id=outputDiv></div>

</body>
</html>
