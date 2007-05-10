<?php
   chdir('../../../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
	
	require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';
	require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

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
            return ['testCalemColMap', 'testCalemRecordListSort', 'testCalemRecordListValidity', 'testCalemRecordListPerf1k', 'testCalemRecordListPerf5k'];
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
   			//shell = new DwtShell("MainShell", false, null, null, true); 
   			//cc.setShell(shell);       	
        }
        
        //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>"+div.innerHTML;
        } 
        
        //ColMap test
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
        
        //ColMap test first
        function testCalemColMap() {
        	   debug("<b>testCalemColMap</b>");
        		var fldList=getBudgetFieldList();
        		debug("fldList="+fldList.join(','));
        		var fldMap=new CalemFieldMap(fldList);
        		var j=0;
        		for (var i in fldMap) {
        			debug("map: "+i+"="+fldMap[i]);	
        			this.assertTrue(i==fldList[j++]);
        		}
        }

		  var dataListSize=50;
        var recList;
        function getBudDataList() {
        		var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            var bd=reg.getTableDd('budget');
            
        		var dataArr=new Array();
        		var fldList=getBudgetFieldList();
        		var v;
        		for (var i=0; i< dataListSize; i++) {
        		   var ar=[];
        		   var dt=new Date();
        		   dt.setHours(dt.getHours()+i);
        		   var dtStr=CalemTextUtil.getFormatter(CalemTextUtil.DATETIME_SERVER_FORMATTER).format(dt);
        		   if (i==0) debug("GMT new date is: "+dt+", dtStr="+dtStr);
        		   for (var j=0; j< fldList.length; j++) {
        		      if (fldList[j]=='id') v=i;
        		      else if (bd.isDateTimeField(fldList[j])) v=dtStr;
        		      else if (bd.isNumberField(fldList[j]) || bd.isCurrencyField(fldList[j]) || bd.isSysCurrencyField(fldList[j]) ) {
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
        
        /**
         * test sort
         */
        function testCalemRecordListSort() {
        	  dataListSize=10;        	  
        	  debug("<b>testCalemRecordListSort</b>");
        	  debug("sort by modified_time DESC");
        	  var fldList=getBudgetFieldList();        	  
        	  var dataList=getBudDataList();
        	  recList=CalemCacheRecordList.createByRawResult(null, {table: 'budget', fields: fldList, data: dataList});
        	  //Try a date value 
        	  var rec=recList.getRecord(0);
        	  var fld=rec.getField('modified_time');
        	  debug("0 record: value="+fld.getValue() +", raw="+fld.getRawValue());
        	  var fld=new CalemSelectField('budget', 'modified_time');
        	  var orderBy=new CalemQueryOrderBy(fld, CalemQueryOrderBy.DESC);
        	  recList.sort(orderBy, false, true);
        	  var dt;
        	  for (var i=0; i< recList.getSize(); i++) {
        	  	 var rec=recList.getRecord(i);
        	  	 var fld=rec.getField('modified_time');
        	  	 if (!dt) {
        	  	 	dt= fld.getRawValue();
        	  	 	debug("first raw="+dt+", value="+fld.getValue());
        	  	 } else {
        	  	   var newDt=fld.getRawValue();
        	  	   this.assertTrue(newDt < dt);
        	  	   dt=newDt;
        	  	 }
        	  	 debug(i+"="+fld.getValue());
        	  }
        	  
        	  //Budget title.
        	  debug("sort by budget DESC");
        	  var fld=new CalemSelectField('budget', 'budget');
        	  var orderBy=new CalemQueryOrderBy(fld, CalemQueryOrderBy.DESC);
        	  recList.sort(orderBy, false, true);
        	  var budget;
        	  for (var i=0; i< recList.getSize(); i++) {
        	  	 var rec=recList.getRecord(i);
        	  	 var fld=rec.getField('budget');
        	  	 if (!budget) {
        	  	 	budget= fld.getRawValue();
        	  	 	debug("first budget="+budget);
        	  	 } else {
        	  	   var newBudget=fld.getRawValue();
        	  	   this.assertTrue(newBudget < budget);
        	  	   budget=newBudget;
        	  	 }
        	  	 debug(i+"="+fld.getValue());
        	  }        
        }
        
        /**
         * Validity test - at most 100 records for sync operation.
         */
        function testCalemRecordListValidity() {
        	  var fldList=getBudgetFieldList();        	  
        	  //Validity first.
        	  debug("<b>testCalemRecordList validity</b>");
        	  dataListSize=200;
        	  var dataList=getBudDataList();
        	  var dt=new Date();
        	  recList=CalemCacheRecordList.createByRawResult(null, {table: 'budget', fields: fldList, data: dataList});
        	  var dt2=new Date();
        	  debug("populating: "+recList.getSize() + " takes: "+(dt2-dt));
        	  this.assertTrue((dt2-dt) < 100);
        	  //Let's verify it.
        	  var rec=recList.getRecord(10);
        	  //verify a few fields
        	  debug("rec.id="+rec.id);
        	  this.assertTrue(rec.id==10);
        	  
        	  //Datetime field
        	  var fld=rec.getField('modified_time');
        	  debug("modified_time fld="+fld+", value="+fld.getValue());
        	  var val=rec.getValue('modified_time');
        	  debug("modified_time ="+val);
        	  this.assertTrue(val.indexOf(',')!==false);
        	  
        	  //Number field
        	  var val=rec.getValue('budgeted');
        	  var fld=rec.getField('budgeted');
        	  debug("budgeted="+val+", raw="+fld.getRawValue()+", fld="+fld);
        	  this.assertTrue(val=='12,355.79' && fld.getRawValue()==12355.788); 
        	  
        	  //Quickly do a sort
        	  var fld=new CalemSelectField('budget', 'budget');
        	  var orderBy=new CalemQueryOrderBy(fld, CalemQueryOrderBy.DESC);
        	  var dt=new Date();
        	  recList.sort(orderBy, false, true);
        	  dt2=new Date();
        	  debug("sort "+recList.getSize() + " desc takes: "+(dt2-dt));
        	  
        	  //Try slice operation
        	  for (var i=50; i< 52 ; i++) {
	        	  rec=recList.getRecord(i);
	        	  debug(i+"_th record after sort desc: "+ rec.id +", budget="+rec.getValue('budget'));
        	  }

        	  var ar=recList._sliceByVector(50, 10);
        	  debug("slice 50, 10: " + ar.size() +", ar[0].id="+ ar.get(0).id);
        	  assertTrue(ar.size()==10 && ar.get(0).id==54);
        	  
        	  var ar=recList._sliceByVector(50, 1000);
        	  debug("slice 50, 10: " + ar.size() +", ar[0].id="+ ar.get(0).id);
        	  assertTrue(ar.size()==dataListSize-50 && ar.get(0).id==54);
        	  
        	  var ar=recList._sliceByVector(300, 1000);
        	  debug("slice 50, 10: " + ar.size());
        	  assertTrue(ar.size()==0);

        }
        
        /**
         * Perf test
         */
        function testCalemRecordListPerf1k() {
        	  var fldList=getBudgetFieldList();
        	  //Verify timing here as well
        	  debug("<b>testCalemRecordList performance 1K</b>");
        	  dataListSize=1000;
        	  var dataList=getBudDataList();
        	  var dt=new Date();
        	  recList=CalemCacheRecordList.createByRawResult(null, {table: 'budget', fields: fldList, data: dataList});
        	  recList.populateList(null, fldList, dataList);
        	  var dt2=new Date();
        	  debug("populating: "+recList.getSize() + " takes: "+(dt2-dt));
        	  this.assertTrue((dt2-dt) < 1000);
    	  
        	  //test sort 
        	  debug("<b>testCalemRecordList sort by budget desc</b>");
        	  var fld=new CalemSelectField('budget', 'budget');
        	  var orderBy=new CalemQueryOrderBy(fld, CalemQueryOrderBy.DESC);
        	  var dt=new Date();
        	  recList.sort(orderBy, false, true);
        	  var dt2=new Date();
        	  debug("sorting: "+recList.getSize() + " takes: "+(dt2-dt));
        	  this.assertTrue((dt2-dt) < 2000);
        	  rec=recList.getRecord(0);
        	  this.assertTrue(rec.getValue('budget')=='budget_9_2');
        	  //Verify reverse sort
        	  for (var i=0; i< 3; i++) {
	        	  rec=recList.getRecord(i);
	        	  debug(i+"_th record after sort desc: "+ rec.id +", budget="+rec.getValue('budget'));
        	  }
        	  //Ensure this orderBy will not do anything
        	  dt=new Date();
        	  recList.sort(orderBy, false, true);
        	  dt2=new Date();
        	  debug("orderBy one more time, time="+(dt2-dt));
        	  this.assertTrue((dt2-dt)<50);
        	  
        	  //Now sort by a number field
        	  debug("<b>sort by budgeted desc</b>");
        	  var fld=new CalemSelectField('budget', 'budgeted');
        	  var orderBy=new CalemQueryOrderBy(fld, CalemQueryOrderBy.DESC);
        	  var dt=new Date();
        	  recList.sort(orderBy, false, true);
        	  var dt2=new Date();
        	  debug("sorting: "+recList.getSize() + " takes: "+(dt2-dt));
        	  this.assertTrue((dt2-dt) < 2000);
        	  rec=recList.getRecord(0);
        	  this.assertTrue(rec.id==999);
        	  //Verify reverse sort
        	  for (var i=0; i< 3; i++) {
	        	  rec=recList.getRecord(i);
	        	  debug(i+"_th record after sort desc: "+ rec.id +", budgeted="+rec.getValue('budgeted'));
        	  }
       }
        
        /**
         * Perf 5K
         */
        function testCalemRecordListPerf5k() {
        		//To delay a while before starting
        		debug("<b>testCalemRecordListPerf5k - deferred for timing issues with 1K test </b>");
        		var timerID = setTimeout("testCalemRecordListPerf5k_start()",5000)
        }
        
        function testCalemRecordListPerf5k_start() {
        	  var fldList=getBudgetFieldList();
        	  //Verify timing here as well
        	  debug("<b>testCalemRecordList performance 5K</b>");
        	  dataListSize=5000;
        	  var dt=new Date();
        	  var dataList=getBudDataList();
        	  var dt2=new Date();
        	  debug("creating data list takes: "+(dt2-dt));
        	  var dt=new Date();
        	  var recList=recList=CalemCacheRecordList.createByRawResult(null, {table: 'budget', fields: fldList, data: dataList});
        	  recList.populateList(null, fldList, dataList);
        	  var dt2=new Date();
        	  debug("populating: "+recList.getSize() + " takes: "+(dt2-dt));
        	  this.assertTrue((dt2-dt) < 2000);
	  
        	  //test sort 
        	  //Use callback for sort here
        	  debug("<b>testCalemRecordList sort by budget desc</b>");
        	  var fld=new CalemSelectField('budget', 'budget');
        	  var orderBy=new CalemQueryOrderBy(fld, CalemQueryOrderBy.DESC);
        	  var dt=new Date();
        	  var callback=new AjxCallback(null, on5kBudgetSortDone, {dt: dt, recList: recList, orderBy: orderBy});
        	  recList.sort(orderBy, callback, true);
        }
        
        function on5kBudgetSortDone(params) {
        	  var dt2=new Date();
        	  var dt=params.dt;
        	  var recList=params.recList;
        	  var ob=params.orderBy;
        	  debug("sorting: "+recList.getSize() + " takes: "+(dt2-dt) +", orderBy: "+ob.getField() +", order: "+ob._order);
        	  this.assertTrue((dt2-dt) < 13000);
        	  rec=recList.getRecord(0);
        	  //this.assertTrue(rec.getValue('budget')=='budget_9_2');
        	  //Verify reverse sort
        	  for (var i=0; i< 3; i++) {
	        	  rec=recList.getRecord(i);
	        	  debug(i+"_th record after sort desc: "+ rec.id +", budget="+rec.getValue('budget'));
        	  }
        	  //Ensure this orderBy will not do anything
        	  dt=new Date();
        	  recList.sort(orderBy, false, true);
        	  dt2=new Date();
        	  debug("orderBy one more time, time="+(dt2-dt));
        	  this.assertTrue((dt2-dt)<50);
        	  //Now let's lunch another sort async
        	  //Now sort by a number field
        	  debug("<b>sort by budgeted desc</b>");
        	  var fld=new CalemSelectField('budget', 'budgeted');
        	  var orderBy=new CalemQueryOrderBy(fld, CalemQueryOrderBy.DESC);
        	  var dt=new Date();
        	  var callback=new AjxCallback(null, on5kBudgetedSortDone, {dt: dt, recList: recList, orderBy: orderBy});
        	  recList.sort(orderBy, callback, true);
        }
        
        function on5kBudgetedSortDone(params) {
        	  var dt2=new Date();
        	  var dt=params.dt;
        	  var recList=params.recList;
        	  var ob=params.orderBy;
        	  debug("sorting: "+recList.getSize() + " takes: "+(dt2-dt));
        	  this.assertTrue((dt2-dt) < 10000);
        	  rec=recList.getRecord(0);
        	 // this.assertTrue(rec.id==999);
        	  //Verify reverse sort
        	  for (var i=0; i< 3; i++) {
	        	  rec=recList.getRecord(i);
	        	  debug(i+"_th record after sort desc: "+ rec.id +", budgeted="+rec.getValue('budgeted'));
        	  }
        	  
        }
        
        function startTest() {
        		setUp();
        		testCalemColMap();
        		testCalemRecordListSort();
        		testCalemRecordListValidity();
        		testCalemRecordListPerf1k();
        		testCalemRecordListPerf5k();
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
