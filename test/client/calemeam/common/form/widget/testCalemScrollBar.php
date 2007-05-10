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
            return ['testCalemScrollBar']; //'testCalemScrollBarLayout',
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
        
        /** ScrollBar Layout test */
        function testCalemScrollBarLayout() {
            var upBtn=new CalemScrollButton(shell, 'CalemScrollButtonUp');

            var downBtn=new CalemScrollButton(shell, 'CalemScrollButtonDown');
            var moveListener=new AjxListener(null, _moveData);
            upBtn.init(moveListener);
            downBtn.init(moveListener);
            upBtn.zShow(true);
            downBtn.zShow(true);
            //Assign buttons
            var upBtnEl = document.getElementById('upBtn');
            upBtnEl.appendChild(upBtn.getHtmlElement());
            
            var bottomBtnEl=document.getElementById('bottomBtn');
            bottomBtnEl.appendChild(downBtn.getHtmlElement());

            //Slider
            var slider=new CalemScrollSlider(shell);
            slider.registerCallback(_onScroll, null)
            
            //Get bounds for the table.
 				var barEl=document.getElementById('sbLayoutTable');
				var bz=Dwt.getBounds(barEl);
				
				slider.setBounds(bz.x, bz.y+40, bz.width, 1);
				var bz=slider.getBounds();
				DBG.println("min slider height="+bz.height);
				
				//figure out the mid row and col size
				var el=document.getElementById('midTr');
				bzTr=Dwt.getBounds(el);
				el=document.getElementById('midTd');
				bzTd=Dwt.getBounds(el);
				printBounds('midTr', bzTr);
				printBounds('midTd', bzTd);
				el=document.getElementById('sbLayoutTable');
				bzTb=Dwt.getBounds(el);
				printBounds('scrollBarTable', bzTb);
				//Dwt.setBounds(el, bzTb.z, bzTb.y, bzTb.width, 100);	
        }
        
        /** 
         * Test scroll bar
         */
        function testCalemScrollBar() {
        	   var controller=new CalemScrollBarController();
        	   var el=document.getElementById('scrollId');
				var scrollBar=new CalemScrollBar(shell);
				scrollBar.zShow(true);
				scrollBar.setParentEl(el);
				//scrollBar.init(1, 10, 5, controller); 
				var bz=Dwt.getBounds(scrollBar.getHtmlElement());
				printBounds("scrollbar", bz);   
				CalemDebug.printBoundsById('scrollId');  		
        }
        
        function printBounds(txt, bz) {
        		DBG.println(txt+" - {"+bz.x+", "+bz.y+", "+bz.width+", "+bz.height+"}");
        }
        
        function setClassName() {
        		var el=document.getElementById('topDiv');
        		el.className=['CalemScrollSlider', '_Top_Move', ''].join('');
        		el=document.getElementById('fillUp');
        		el.className=['CalemScrollSlider', '_Fill_Move', ''].join('');
        		el=document.getElementById('gripDiv');
        		el.className=['CalemScrollSlider', '_Grip_Move', ''].join('');
        		el=document.getElementById('fillDown');
        		el.className=['CalemScrollSlider', '_Fill_Move', ''].join('');
        		el=document.getElementById('bottomDiv');
        		el.className=['CalemScrollSlider', '_Bottom_Move', ''].join('');
        }
        
        function _moveData() {
        	 DBG.println("move data");
        }
        
        function _onScroll(delta) {
        	 DBG.println("delta="+delta);
        	 return delta;
        }
        
        /**
         * controller function for scrollbar
         */
        function CalemScrollBarController() {
        }
        
        CalemScrollBarController.prototype.scrollTo =
        function(start, viewSize) {
          DBG.println("scroll to : "+start+", viewSize="+viewSize);
        }
        
        function startTest() {
        		setUp();
        		testCalemScrollBarLayout();
        		testCalemScrollBar();        		
        }
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body style="background: white">

<div style="position: absolute; top:10px; left: 600px; width:22px; height: 200px">
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
