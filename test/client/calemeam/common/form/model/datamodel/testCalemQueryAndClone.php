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
            return ['testCalemQueryAndClone'];
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
        		      else if (fldList[j]=='title_id') {
        		     		if (i % 100 ==0) v='2';
        		     	   else v='3';
        		      }
        		      else if (bd.isDateTimeField(fldList[j])) v='2004-10-20 14:20:30';
        		      else if (bd.isNumberField(fldList[j]) || bd.isCurrencyField(fldList[j])) {
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
         * Use 5K to find out clone and query performance.
         */
        function testCalemQueryAndClone() {
        	  //To delay a while before starting
        	  debug("<b>testCalemQueryAndClone - performance findings. </b>");
        	  var dt=new Date();
        	  //Find out performance info about query and clone.
        	  var fldList=getBudgetFieldList();
        	  var recList=new CalemRecordList('budget');
        	  //Verify timing here as well
        	  debug("<b>testCalemRecordList performance 5K</b>");
        	  dataListSize=5000;
        	  var dataList=getBudDataList();
        	  debug("Creating raw data before populating takes: "+(new Date() - dt));
        	  var recList=new CalemCacheRecordList('budget');
        	  var dt=new Date();
        	  recList.populateList(null, fldList, dataList);
  
        	  var dt2=new Date();
        	  debug("populating: "+recList.getSize() + " takes: "+(dt2-dt));
        	  this.assertTrue((dt2-dt) < 2000);
        	  //Find out about clone.
        	  dt=new Date();
        	  var vList=recList._sliceByVector(0, dataListSize);
        	  this.assertTrue(vList.size() == recList.getSize());
        	  var obj=new Object();
        	  for (var i=0; i< vList.size(); i++) {
        	  		var rec=vList.get(i);
        	  		obj[rec.id]=rec;
        	  }
        	  rec=vList.get(vList.size() -1);
        	  debug("clone array and map of "+ vList.size()+", takes: <b>"+(new Date() - dt)+
        	        "</b>, -- verify results: 4999th Id in list: "+ rec.id +", from Map: "+obj[rec.id].id);
        	  this.assertTrue((new Date() - dt) < 200); //This is wonderful!
        	  
           //Fake a query. 
        	  var result=[];
        	  var dt=new Date();
        	  for (var i=0; i< vList.size(); i++) {
        	  		var rec=vList.get(i);
        	  		if (rec._getRawValue('modified_time')< dt 
        	  		    && rec._getRawValue('budget').indexOf('budget')!=-1) {
        	  			result.push(rec);    
        	  		}
        	  }
        	  var delta=new Date() - dt;
        	  debug("Query on date and budget of "+vList.size()+" takes: "+delta);
        	  this.assertTrue(delta< 2000);
        	  
        	  //Now do a real query
        	  //Creating a tableQuery and then add the condition to do a query.
        	  var ctxt=CalemContext.getInstance();
           var reg=ctxt.getRegistry();
           var bd=reg.getTableDd('budget');
           //get the base query first.
           var tableQuery=bd.buildGetAllQuery();
           //Creating an expression
           var fld=new CalemDbField('budget', 'title_id');
           var val=new CalemDbString('2');
           var dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
           tableQuery.setWhere('budget', dbExpr);
           debug("To apply query to 5000 records, tableQuery="+tableQuery.getSql());
           var dt=new Date();
           var result=recList.query(tableQuery);
           var dtNew=new Date();
           debug("time taken for query: "+(dtNew - dt));
           debug("result size="+result.getSize());
           //Basic validation for it to pass.
           this.assertTrue(result.getSize() == 50);
           this.assertTrue((dtNew - dt) < 3000); 
        }
        
        function startTest() {
        		setUp();
        		testCalemQueryAndClone();
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
