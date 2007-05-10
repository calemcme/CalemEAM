<?php
   chdir('../../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
?>

<!-- <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> -->
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>CalemTableDd test</title>
    
    <?php 
    	$theme='calem'
    ?>
    
    <style type="text/css">
      <!--
        @import url(<?php print $calemRootUrl ?>/client/themes/image/hiRes/dwtimgs.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/dwt.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/common.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/calemimg.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/<?php print $theme ?>/<?php print $theme ?>.css);
       -->
    </style>
    
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=CalemMsg"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Metadata"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Ajax"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Calem"></script>
    
    <link rel="stylesheet" type="text/css" href="<?php print $calemRootUrl ?>/test/client/jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/test/client/jsunit/app/jsUnitCore.js"></script>
    
    <script language="JavaScript" type="text/javascript">
        function exposeTestFunctionNames() {
            return ['testCalemWidgetUtil']; //'testCalemScrollBarLayout',
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
				
				/* Setting the shell to be virtual tells it that it should remain hidden.
				 * Direct children of the shell will actually have their HTML elements
				 * reparented to the body element. This is handy when we want to mix
				 * components in with existing HTML content
				 */ 
				//shell.setVirtual();      	
        }
        
        //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }  
        
        /** 
         * Test scroll bar
         */
        function testCalemWidgetUtil() {
        	  var el=document.getElementById('upBtn');
        	  debug("el.tagName="+el.tagName+", el.nodeName="+el.nodeName+", el.id="+el.id);
        	  debug("el.parentNode:"+el.parentNode);
        	  var elP=CalemWidgetUtil.getAbsParent(el);
        	  debug('elP='+elP+", id="+elP.id+", style="+elP.style.position);
        	  this.assertTrue(elP!=null);
        	  this.assertTrue(elP.tagName=='DIV' && elP.id=='testDiv');	
        	  //Test visibility
        	  var vb=document.getElementById('upBtn');
        	  //this.assertTrue(CalemWidgetUtil.getVisible(vb)==true);
        	  //debug("visibility of upBtn="+CalemWidgetUtil.getVisible(vb));
        }
        
        function printBounds(txt, bz) {
        		DBG.println(txt+" - {"+bz.x+", "+bz.y+", "+bz.width+", "+bz.height+"}");
        }
        
        function startTest() {
        		setUp();
        		testCalemWidgetUtil();      		
        }
        
        function TestMe() {
        }
        
        TestMe.testNow = 
        function(el) {
        		alert("testNow is invoked");
        }
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body style="background: white">
<p>Test WidgetUtil </p>
<p>
<div id=outputDiv></div>
</p>

<div id=testDiv style="position: absolute; top:10px; left: 600px; width:22px; height: 200px">
<table height=200px>
<tr><td>world</td>
<td height=100%>
<table class=CalemScrollBarTable  id=sbLayoutTable border=1 cellspacing=0 cellpadding=0 >
  <tr><td><div id=upBtn></div></td></tr>
  <tr id=midTr><td style="height:100%" id=midTd></td></tr>
  <tr><td><div id=bottomBtn></div></td></tr>
</table>
</td></tr>
</table>
</div>

<div style="position: static; top:10; left:200; width:22; height:400">
<table height=100% border=1 cellspacing=0 cellpadding=0 >
 <tr > <td>ok</td><td height=100% id=scrollId> </td> </tr>
</table>
</div>
</html>
