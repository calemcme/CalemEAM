<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<?php
   chdir('../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');	
	
	require_once _CALEM_DIR_ . 'server/conf/calem.php';
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
            return ['testCalemLoginAndOut'];
        }
        
        function setUp() {
        	   CalemDebug.initDebug(location);
        		var cc=CalemContext.getInstance();
				cc.init(); //Initialize context.
   			//Init registry
   			var regMgr=CalemConf.registry_manager;
   			var reg=eval(["new ", regMgr.impl, "()"].join(""));
   			reg.initForTest(regMgr.names)
   			cc.setRegistry(reg);   
   			shell = new DwtShell("MainShell", false, null, null, true);
   			CalemContext.getInstance().setShell(shell);      	
        }
        
        //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }   

        function testCalemLoginAndOut() {
            var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            //Need to mimic a sessionId so the call can go through.
            login();
            //Logout
            logout();
        }
        
        /**
         * Test code
         */
		  function login() {
		  		var soapDoc=CalemSoapClient.createSoapDoc("Login", null);
   			soapDoc.set("username", 'calem');
   			soapDoc.set("password", 'calem');
   			var client=new CalemSoapClient(soapDoc);
   			var cr=client.service(); 
   			this.assertTrue(!cr.getException());  			
			   resp=cr.getResponse().LoginResponse;
			   debug("<b>Logged in. </b> sessionId="+resp.sessionId+", validityPeriod="+resp.validityPeriod);
			   //Init sid for client to use
			   //Init sid for client to use
			   CalemContext.getInstance()._userInfo=new Object();
			   CalemContext.getInstance()._userInfo.sid=resp.sessionId;
			   this.assertTrue(resp.sessionId!=null);	 
		  } 
		  
		  function logout() {
		  		var soapDoc=CalemSoapClient.createSoapDoc("Logout", null);
		  		soapDoc.set("sessionId", CalemContext.getInstance().getSessionId() );
   			var client=new CalemSoapClient(soapDoc);
   			var cr=client.service(); 
   			this.assertTrue(!cr.getException());  			
			   resp=cr.getResponse().LogoutResponse;
			   debug("<b>Logged out. </b> sessionId="+resp.sid+", removed="+resp.removed);
			   //Init sid for client to use
			   this.assertTrue(resp.sid==CalemContext.getInstance().getSessionId() && resp.removed==1);	 
		  } 
        
        function startTest() {
        		setUp();
        		testCalemLoginAndOut();
        }
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemDb tests</h1>

<p>This page tests CalemDb class.</p>
<div id=outputDiv></div>

</body>
</html>
