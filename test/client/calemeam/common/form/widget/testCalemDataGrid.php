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
    <title>CalemDataGrid test</title>
    
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
            return ['testCalemDataGridSort']; //@todo , 'testCalemDataGridDb']; 
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
   			cc.setShell(shell); 	
        }

       
        
        
        /** 
         * CalemDataGrid
         */
        var gd;
        var controller;
        function testCalemDataGrid() {
        	  var budgetDd=reg.getTableDd('budget');
        	  var fl=budgetDd.getFields();
        	  //Cached list test here.
        	  gDataList=new CalemCacheRecordList('budget');
        	  var tblQry=budgetDd.buildGetAllQuery();
        	  var range=new CalemQueryRange(0, 40);
        	  tblQry.setRange(range);
        	  gDataList.populateList(tblQry, getBudgetFieldList(), getBudDataList()); 
        	  var gridInfo=CalemJson.setJson(getViewInfo()); 
        	  controller=new DataGridController(); 
        	  var dm=controller.getDataModel().getModelItem('budget');
        	  dm.onLoadResult(gDataList);
        	  var info={acl: {}, listInfo: gridInfo.getListInfo()};
			  gd=new CalemDataGrid(shell, 'budget', budgetDd, info, controller);		  
			  gd.onLayoutChange({x:10, y:10, width:500, height:300});
			  gd.onLayoutChange({x:10, y:10, width:500, height:500});	
			  gd.showData(); 
			  
			  /* 
			  //Try a resizing here for fun.
			  gd.onLayoutChange({x:10, y:10, width:500, height:400});
			  gd._scrollBar.__onLayoutChange(); 
			  //selection handler
			  var selController=new SelectionListener();
			  var selListener=new AjxListener(selController, selController.onSelection);
			  gd.addSelectionListener(selListener); 
			  //Add a few selections 
			  var data=getScrollData(1, 6);
			  gd._listView.setSelectedItems(data.getArray()); 
			  */	  			
        }
        
        function testCalemDataGridSort() {
        	  testCalemDataGrid();
        	  gd.sortList('budget', false, true);
			  setTimeout("validateSortReverse()", 3000);
        }
        
        /**
         * verify sort result
         */
        function validateSortReverse() {
        	var st="";
        	for (var i=0; i<3; i++) {
        	   var rec=gd._listView._list.get(i);
        	   if (rec) {
        	   	st += "- top "+i +", id="+rec.id+", budget="+rec.getField('budget').getValue();
        	   }
			}
        	//alert(st);
        	if (gd._listView._list && gd._listView._list.get(0)) {
        	   this.assertTrue(gd._listView._list.get(0).id=='9');
        	}
        }
        
        /**
         * Selection listener
         */
        function SelectionListener() {
        }
        
        SelectionListener.prototype.onSelection =
        function(ev) {
        		DBG.println("ev: "+ev.getType()+", ev.size="+ev.size());
        		for (var i=0; i< ev.size(); i++) {
        			DBG.println(i+" = "+ev.get(i).id);
        		}	
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
        
        //Parent controller
        function DataGridController() {
          this._dataModel= new CalemDataModel('budget', null);
        }
        
        DataGridController.prototype.getDataBulk =
        function(start, count, sort, tableDd) {
        	 var list=getScrollData(start, count);
        	 return {total: dataListSize, list: list};
        }
        
        DataGridController.prototype.getDataModel =
        function(tableId) {
          return this._dataModel;
        }
        
        DataGridController.prototype.getModelItem =
        function(tableId) {
          return this._dataModel.getModelItem();
        }
        
        /**
         * Database setup
         */
        function getBudgetColList() {
        	return [
        				{id: 'budget', width: 70},
		  			   {id: 'budgeted', width: 80},
		  			   {id: 'app', width: 80},
		  			   {id: 'accounting', width: 90}
        	       ];
        }
        
        /**
         * prepare data
         */
        var dataListSize=1000;
		  var recList;
        function getBudgetFieldList() {
        		var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            var bd=reg.getTableDd('budget');
            var flds=bd.getFields();
            var fldList=new Array();
            for (var i in flds) {
            	fldList.push(i);
            }
            return fldList;
        }
        
        function getBudDataList() {
        		var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            var bd=reg.getTableDd('budget');
            
        		var dataArr=new Array();
        		var fldList=getBudgetFieldList();
        		var v;
        		for (var i=0; i< dataListSize; i++) {
        		   var ar=[];
        		   for (var j=0; j< fldList.length; j++) {
        		      if (fldList[j]=='id') v=i;
        		      else if (bd.isDateTimeField(fldList[j])) v='2004-10-20 14:20:30';
        		      else if (bd.isNumberField(fldList[j]) || bd.isCurrencyField(fldList[j]) || bd.isSysCurrencyField(fldList[j])) {
        		      	v=12345.788+i;
        		      } else if (bd.isIntegerField(fldList[j])) {
        		         v=1234+i;
        		      } else {
        		      	v=['budget', '_',i,'_', j].join('');
        		      }
        		   	ar.push(v);
        		   }
	        	   dataArr.push(ar);
        		}
        		return dataArr;
        }
        
        /*
        function initDataList(colList) {
        		var dataList=new AjxVector();
        		for (var i=0; i< dataListSize; i++) {
	        	   var ar=['budget_'+i, 'period_'+i, i+120, i+130];
	        	   var row=CalemRecord.createByValues(i, colList, ar);
	        	   dataList.add(row);
        		}
        		return dataList;
        }
        */
        function getScrollData(start, viewSize) {
          return gDataList.sliceByVector(start, viewSize);
        }
        
        function ListViewController() {
        }
        ListViewController.prototype.onSelect =
        function() {
        }
        
		  /**
		   * Main test entry
		   */        
        function startTest() {
        		setUp();
        		testCalemDataGridSort();        		
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

<div style="width:80%;height:90%;"></div>


</body>
</html>
