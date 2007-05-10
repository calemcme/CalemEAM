<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<?php
   chdir('../../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
?>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>CalemDb test</title>
    
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
        @import url(<?php print $calemRootUrl ?>/client/themes/dv.css);
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
            return ['testCalemDateLookup'];
        }
        
        var shell;
        var cal;
        function setUp() {
        	   CalemDebug.initDebug(location);
        		var cc=CalemContext.getInstance();
				cc.init(); //Initialize context.
   			//Init registry
   			var regMgr=CalemConf.registry_manager;
   			var reg=eval(["new ", regMgr.impl, "()"].join(""));
   			reg.initForTest(regMgr.names)
   			cc.setRegistry(reg);        
   			shell = new DwtShell("MainShell"); 
   			cc.setShell(shell); 
        }
       
        var cal=null;
        function testCalemDateLookup() {
        	  if (!cal) cal=new CalemDateLookup(shell);
        	  var el=document.getElementById('lookupLeftId');
        	  var bz=Dwt.getBounds(el);
        	  cal.popupCalendar(bz);
        	  var cbz=cal.getBounds();
        	  printBz('lookupLeftId');
        	  printBzByEl(cal.getHtmlElement());
        	  this.assertTrue(cbz.y > bz.y && cbz.x==bz.x);
        	  cal._onDismiss();
        	  var el=document.getElementById('lookupRightId');
        	  var bz=Dwt.getBounds(el);
        	  cal.popupCalendar(bz);
        	  var cbz=cal.getBounds();
        	  debug("right cal");
        	  printBz('lookupRightId');
        	  printBzByEl(cal.getHtmlElement());
        	  this.assertTrue(cbz.x<bz.x && cbz.y > bz.y);  
        	  
        	  //Bottom
        	  var el=document.getElementById('btmId');
        	  var bz=Dwt.getBounds(el);
        	  cal.popupCalendar(bz);
        	  var cbz=cal.getBounds();
        	  debug("right cal");
        	  printBz('btmId');
        	  printBzByEl(cal.getHtmlElement());
        	  this.assertTrue(cbz.x==bz.x && cbz.y < bz.y);    	 
        }
        
        function lookupDateM(id) {
           var el=document.getElementById(id);
           var bz=Dwt.getBounds(el);
           cal.popup(bz);        
        }
        
        function lookupDate() {
        	  testCalemDateLookup();
        }
        
        function popdown() {
        	  cal.popdown();
        }
        	
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }  
        
        function getBz(id) {
		   	var el=document.getElementById(id);
		   	return getBzByEl(el);
		   }
		   
		   function getBzByEl(el) {
		   	var bz=Dwt.getBounds(el);
		   	return el.id+" - {"+bz.x+", "+bz.y+", "+bz.width+", "+bz.height+"}";
		   }
		   
		   function printBz(id) {
		   	debug(getBz(id));	
		   }  
		   
		   function printBzByEl(el) {
		   	debug(getBzByEl(el));
		   }  
        
        function startTest() {
        		setUp();
        		testCalemDateLookup();
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



<div style='padding-left:50px;'><input id=lookupLeftId type='button' size=10 tabindex=1 value="Validate" onclick="lookupDateM('lookupLeftId')"></input></div>
<div style='padding-left:500px'><input id=lookupRightId type='button' size=10 tabindex=1 value="Validate" onclick="lookupDateM('lookupRightId')"></input></div>
<div style='padding-top:200px'><input id=btmId type='button' size=10 tabindex=1 value="Validate" onclick="lookupDateM('btmId')"></input></div>


<p>This page tests CalemButtonInfo class.</p>
<div id=outputDiv></div>

</body>
</html>
