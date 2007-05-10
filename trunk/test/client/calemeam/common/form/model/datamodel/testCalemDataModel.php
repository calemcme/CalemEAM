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
    <title>CalemTableDd test</title>
    
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=CalemMsg"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Metadata"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Ajax"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Calem"></script>
    
    <link rel="stylesheet" type="text/css" href="<?php print $calemRootUrl ?>/test/client/jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/test/client/jsunit/app/jsUnitCore.js"></script>
    
    <script language="JavaScript" type="text/javascript">
        function exposeTestFunctionNames() {
            return ['testCalemDataModelSingle']; 
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
        		div.innerHTML = st+"<br>"+div.innerHTML;
        } 
        
        /**
         * testCalemDataModel
         */
        var singleDm=null;
        function testCalemDataModelSingle() {
        	   debug("<b>testCalemDataModelSingle</b>");
        		//Need to login for this to happen.
            login();
            //Now creating a datamodel
            var controller = new Controller();
            singleDm=new CalemDataModel('budget_title', controller);
            singleDm.load();
            setTimeout('verifyDataModelSinglLoaded()', 2000);
        }
        
        function Controller() {}
        
        Controller.prototype.initQueryByForm =
        function(tq) {
        	 return tq;
        }
        
        function verifyDataModelSinglLoaded() {
        		debug("verifyDataModelSinglLoaded ... ");
        		var recList=singleDm.getModelItem().getRecordList();
        		this.assertTrue(recList.getId() == 'budget_title');
        		debug("budget_list size="+recList.getSize());
        		for (var i=0; i< recList.getSize() && i < 3; i++) {
        			var rec=recList.getRecord(i);
        			debug("Record: "+i+'; title='+rec.getField('title').getRawValue());
        		}	
        		
        		//Verify lookup validation
        		var cache=CalemContext.getInstance().getRegistry().getCache();
        		var cached=cache.get('budget_title');
        		var rec=cached.findRecordByValue('title', '2005 Budget');
        		debug("rec value="+rec.getField('title').getValue());
        		this.assertTrue(rec!=null && rec.getField('title').getValue()=='2005 Budget');
        		
        		//Verify lookup validation negative case
        		var cache=CalemContext.getInstance().getRegistry().getCache();
        		var cached=cache.get('budget_title');
        		var rec=cached.findRecordByValue('title', '2005 Budget2');
        		debug("rec value="+rec);
        		this.assertTrue(rec==null);
        		
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
		  } 
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        
        function startTest() {
        		setUp();
        		testCalemDataModelSingle();
        }
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemRecordList tests</h1>

<p>This page tests CalemRecordList class.</p>
<div id=outputDiv></div>
</body>
</html>
