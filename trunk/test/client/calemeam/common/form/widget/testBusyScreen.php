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
            return ['testBusyScreen']; 
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
        
        function getBudgetFieldList() {
        	return [ 'id', 'budget', 'budgeted','app','accounting'
        	       ];
        }
        
        /**
         * prepare budget data
         */
        var dataListSize=1000;
        var recList;
        function initDataList(colList) {
        		var dataArr=new Array();
        		for (var i=0; i< dataListSize; i++) {
	        	   var ar=[i, 'budget_'+i, i+100, i+120, i+130];
	        	   dataArr.push(ar);
        		}
        		//Now create recordList
        		recList=new CalemRecordList('budget');
        		var fldList=getBudgetFieldList();
        		recList.populateList(null, fldList, dataArr);
        		var dataList=AjxVector.fromArray(recList._recList);
        		return dataList;
        }
        function getScrollData(start, viewSize) {
        	 var dataList=gDataList.clone();
        	 var list=dataList.getArray();
        	 var newList=list.splice(start, viewSize);
        	 var aj=AjxVector.fromArray(newList);
        	 return aj;
        }
        
        /**
         * controller function for scrollbar
         */
        function CalemScrollBarController() {
        }
        
        CalemScrollBarController.prototype.scrollTo =
        function(start, viewSize) {
          if (start + viewSize > dataListSize) {
          	//Find out if I am at the last frame.
          	var data=getScrollData(dataListSize - viewSize, viewSize);
          	if (!listView.isPageDisplayed(data)) {
          		listView.set(data);
          		DBG.println("pageData is not in the listView, scroll data to: "+data.get(0).id);
          	} else {
          		DBG.println("pageData is in the listView, no scrolling is made");	
          	}
          } else {
        	 	var data=getScrollData(start, viewSize);
        	 	listView.set(data);
          }
        }
       
        
        
        /** 
         * CalemListView
         */
        var viewSize=0;
        var listView;
        function testCalemDataGridUnitTest() {
        	   var budgetDd=reg.getTableDd('budget');
        	   var fl=budgetDd.getFields();
        	   var colList=getBudgetColList();
        	   //Building a list view
        	   var gridInfo=CalemJson.setJson(getViewInfo()); 
        	   var controller=new DataGridController(); 
        	   var info={acl: {}, listInfo: gridInfo.getListInfo()};
			   var gd=new CalemDataGrid(shell, 'budget', budgetDd, info, controller);

				listView = gd._listView;
				var height=600;
				listView.setBounds(10, 20, 700, height);	
				listView.zShow(true);
				
				var el=listView.getScrollBarEl();
				var scrollBar=new CalemScrollBar(shell, null);
				scrollBar.setParentEl(el, listView);			
			
				//To give UI adjustment???
				gDataList=initDataList(colList);
				var pageData=getScrollData(1, 1);
				
				var bz=listView.__getHeightByData(pageData);
				DBG.println("bzInfo="+ bz);
				var uh=bz.height;
				DBG.println("each row is: "+uh);
				var bz=listView.__getViewBounds();
				CalemDebug.printBounds('listView bz', bz);
				viewSize= Math.floor(bz.height / uh);

				DBG.println("viewSize="+viewSize);
				
				var pageData=getScrollData(1, viewSize);
				listView.set(pageData);
				
				//building a scrollbar and link to listView.
				//Init the data grid view first.
				var controller = new CalemScrollBarController();
				
				
				scrollBar.init(1, dataListSize, viewSize, controller);
				
				//	
				//Check bounds
				printElBounds("listViewHeaderEl", listView._listColDiv);
				printElBounds("listviewDivEl", listView._listDiv);
				CalemDebug.printBoundsById('CalemListViewTableDataTd', listView._listViewId);
				CalemDebug.printBoundsById('CalemListViewTableScrollBarTd', listView._scrollBarId);
				printElBounds("scrollBarEl", el);
				
				
        }
        
        function ListViewController() {
        }
        ListViewController.prototype.onSelect =
        function() {
        }
        
        function printElBounds(txt, el) {
        		var bz=Dwt.getBounds(el);
        		printBounds(txt, bz);
        }
        
        function printBounds(txt, bz) {
        		DBG.println(txt+" - {"+bz.x+", "+bz.y+", "+bz.width+", "+bz.height+"}");
        }
        
        /**
         * test busy screen
         */
        function testBusyScreen(tm) {
        	 DBG.println("testBusyScreen="+tm);
        	 shell.setBusy(true, 1000000, true, 0, null);
        	 //shell.setBusyDialogText("Busy with dialog");
        	 DBG.println("busy set");
        	 timerID = setTimeout("cancelBusyScreen()",3000);
        	 DBG.println("to wait for clearance.");
        }
        
        function cancelBusyScreen() {
        	 DBG.println("CancelBusyScreen called");
        	 shell.setBusy(false, 1000000);
        	 //Start busy screen without dialog.
        	 shell.setBusy(true, 1002, false, 0, null);
        	 setTimeout("cancelBusyScreenNoDialog()",3000);
        }
        
        function cancelBusyScreenNoDialog() {
        	 shell.setBusy(false, 1002);
        }
        
        //Parent controller
        function DataGridController() {
        }
        
        DataGridController.prototype.getDataBulk =
        function(start, count, sort, tableDd) {
        	 var list=getScrollData(start, count);
        	 return {total: dataListSize, list: list};
        }
        
        DataGridController.prototype.getDataModel =
        function(tableId) {
          CalemModelDef['budget']={master: 'budget'};
        	 return new CalemDataModel('budget', null);
        }
        
        DataGridController.prototype.getModelItem =
        function(tableId) {
        	 CalemModelDef=new Object();
        	 CalemModelDef['budget']={master: 'budget'};
        	 var dm=new CalemDataModel('budget', null);
          return dm.getModelItem();
        }
        
        function getViewInfo() {
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
					  			   {CalemCol: {id: 'accounting', width: 120}},
					  			   {CalemCol: {id: 'title_id', width: 150}}
					  			]	 
					  		} 		
				      }}};
        }
        
        function startTest() {
        		setUp();
        		testCalemDataGridUnitTest(); 
        		setTimeout('testBusyScreen(2000)', 3000);       		
        }
        
        //Global variables
        var reg;
        var gDataList;
        var listView;
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body >


</body>
</html>
