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
            return ['testCalemEditDate'];
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
   			shell = new DwtShell("MainShell", false, null, null, true); 
   			cc.setShell(shell); 
   			shell.setVirtual();
        }
       
        var editDate;
        function testCalemEditDate() {
        	  editDate=new CalemEditDate({parent: shell, type: DwtInputField.STRING, 
	              size: 11,
	              errorIconStyle: CalemConf['view_engine']['field']['inputErrorIcon']}); 
        	  testField('leftDiv');   	 
        }
        
        function testField(id) {
        		var el=document.getElementById(id);
        		debug("el="+el+", editdate html="+editDate.getHtmlElement());
        		//el.appendChild(editDate.getHtmlElement());
        		editDate._dateLookup.onButtonClick();
        		setTimeout("closeDateLookup()", 3000);
        		
        }
        function closeDateLookup() {
        	  editDate._dateLookup.onDateSelection({type: DwtCalendar.DATE_DBL_CLICKED});
        	  /*
        	  if (editDate.getHtmlElement().parentNode.id=='btmDiv') return;
        	  if (editDate.getHtmlElement().parentNode.id=='leftDiv') 
        	     testField('rightDiv');
        	  else 
        	     testField('btmDiv');
        	  */  
        }
        
        function lookupDateM(id) {
           testField(id);        
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
		   
		   function testBtn() {
		   	var el=document.getElementById('btnId1');
		   	var btn=new DwtButton(shell);
		   	btn.setText("Hellow");
		   	el.appendChild(btn.getHtmlElement());
		   	
		   	var el=document.getElementById('btnId2');
		   	btn2=new DwtButton(shell);
		   	btn2.setImage('DateLookup');
		   	el.appendChild(btn2.getHtmlElement());	
		   }
        
        function startTest() {
        		setUp();
        		testCalemEditDate();
        		testBtn();
        		debug("val="+(17 & 8 != 0));
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



<div id=leftDiv style='padding-left:50px;'><input id=lookupLeftId type='button' size=10 tabindex=1 value="Validate" onclick="lookupDateM('leftDiv')"></input></div>
<div id=rightDiv style='padding-left:500px'><input id=lookupRightId type='button' size=10 tabindex=1 value="Validate" onclick="lookupDateM('rightDiv')"></input></div>
<div id=btmDiv style='padding-top:200px'><input id=btmId type='button' size=10 tabindex=1 value="Validate" onclick="lookupDateM('btmDiv')"></input></div>


<table> 
  <tr><td id=btnId1></td>
      <td id=btnId2 ></td>
  </tr>
</table>


<p>This page tests CalemButtonInfo class.</p>
<div id=outputDiv></div>

</body>
</html>
