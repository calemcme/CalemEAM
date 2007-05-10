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
            return ['testCalemModListCustomInfo', 'testCalemModCustomInfo']; // TBD later;  'testModListCustomTree', 'testModCustomTree']; //
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
        }
        
        function testCalemModListCustomInfo() {
        	 debug("<b>testCalemModListCustomInfo</b>");
        	 var acl=new CalemAclInfo({test: 1});
        	 var layout=['modCalemAdmin', 'modCalemBudget'];
        	 var modList=new CalemModListCustomInfo(acl, layout);
        	 assertTrue(modList.getId()=='CalemModListCustomInfo');
        	 assertTrue(!modList.checkAcl('test') && modList.checkAcl('test1'));
			 var json=modList.getJson();
			 debug("json="+json);
			 eval ('var a='+json);
			 debug("a="+a);        	
        }
        
        function testCalemModCustomInfo() {
        	 debug("<b>testCalemModCustomInfo</b>");
        	 var acl=new CalemAclInfo({test: 1});
        	 //Layout is a toolbar layout.
        	 var mod=CalemJson.setJson(CalemModuleDef["modCalemBudget"]);
        	 var tb=mod.getToolBar();
        	 var modCustom=new CalemModuleCustomInfo('modCalemBudget', acl, tb);
        	 assertTrue(modCustom.getId()=='modCalemBudget');
        	 assertTrue(!modCustom.checkAcl('test') && modCustom.checkAcl('test1'));
			 var json=modCustom.getJson();
			 debug("json="+json);
			 eval ('var a='+json);
			 debug("a="+a);        	
        }
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        function startTest() {
        		setUp();
        		testCalemModListCustomInfo();
        		testCalemModCustomInfo();
        		//@todo
        		//testModListCustomTree();
        		//testModCustomTree();
        }
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemButtonInfo tests</h1>

<p>This page tests CalemButtonInfo class.</p>
<div id=outputDiv></div>

</body>
</html>
