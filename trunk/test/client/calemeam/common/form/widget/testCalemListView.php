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
            return ['testCalemListView']; 
        }
        
        function setUp() {
        	   CalemDebug.initDebug(location);
        		var cc=CalemContext.getInstance();
				cc.init(); //Initialize context.
   			//Init registry
   			var regMgr=CalemConf.registry_manager;
   			reg=eval(["new ", regMgr.impl, "()"].join(""));
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
        
        function getBudgetColList() {
        	return [
        				{id: 'budget', width: 70},
		  			   {id: 'budgeted', width: 80},
		  			   {id: 'app', width: 80},
		  			   {id: 'accounting', width: 90}
        	       ];
        }
        
        /**
         * prepare budget data
         */
        var dataListSize=10;
        function getBudgetList(colList, height) {
        	 var dataList=new AjxVector();
        	 for (var i=0; i< dataListSize; i++) {
        	   var ar=['budget_'+i, 'period_'+i, i+100, i+120, i+130];
        	   var row=new CalemRow(i, colList, ar);
        	   dataList.add(row);
        	 }
        	 return dataList;
        }
        
        function CalemRow(id, fields, row) {
        	 this.id=id;
        	 for (var i=0; i< fields.length; i++) {
        	 	this.setValue(fields[i].id, row[i]);
        	 }
        }
        CalemRow.prototype.setValue =
        function(fld, value) {
        	this[fld]=value;
        }
        CalemRow.prototype.getValue =
        function(fld, value) {
        		return this[fld];
        }
        CalemRow.prototype.getTableDd =
        function() {
        	return CalemContext.getInstance().getRegistry().getTableDd('budget');
        }
       
        
        
        /** 
         * CalemListView
         */
        function testCalemListView() {
        	   var budgetDd=reg.getTableDd('budget');
        	   var fl=budgetDd.getFields();
        	   var colList=getBudgetColList();
        	   var gridInfo=CalemJson.setJson(getGridInfo());
        	   var ci={acl: {}, listInfo: gridInfo.getListInfo()};
				var listView=new CalemListView(shell, null, null, budgetDd, ci, null, true);
				listView.setBounds(10, 20, 700, 400); 
				listView.zShow(true);
				//set up some data for display
				var data=getBudgetList(colList, 400);
				listView.set(data);	
				CalemDebug.printBoundsByEl('listViewTd', listView._listViewEl);
				CalemDebug.printBoundsByEl('_scrollBarEl', listView._scrollBarEl);
        }
        
        function getGridInfo() {
        	return {CalemDataGridInfo: {
						type: 'CalemDataGrid',
						model: {CalemModelInfo: {table: 'budget_title'}},
						listInfo: {
					  	   CalemListInfo: {
					  			noMaximize: true,
					  			colList: [
					  			   {CalemCol: {id: 'budget', width: 100}},
					  			   {CalemCol: {id: 'budgeted', width: 90}},
					  			   {CalemCol: {id: 'app', width: 150}},
					  			   {CalemCol: {id: 'accounting', width: 120}}
					  			]	 
					  		} 		
				      }}};
        }
        
        function ListViewController() {
        }
        ListViewController.prototype.onSelect =
        function() {
        }
        
        function printBounds(txt, bz) {
        		DBG.println(txt+" - {"+bz.x+", "+bz.y+", "+bz.width+", "+bz.height+"}");
        }
        
        function startTest() {
        		setUp();
        		testCalemListView();        		
        }
        
        //Global variables
        var reg;
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body >

<div style="width:80%;height:90%;"></div>


</body>
</html>
