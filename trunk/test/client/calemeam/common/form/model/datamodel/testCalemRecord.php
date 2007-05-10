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
            return ['testCalemRecord'];
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
        
        /**
         * Use small record set to test record/field validity
         */
        function testCalemRecord() {
        	  //To delay a while before starting
        	  debug("<b>testCalemRecord - record/field validity test. </b>");
        	  var dt=new Date();
        	  //Find out performance info about query and clone.
        	  var fldList=getBudgetFieldList();
        	  var recList=new CalemRecordList('budget');
        	  //Verify timing here as well
        	  debug("<b>testCalemRecordList performance 500</b>");
        	  dataListSize=500;
        	  var dataList=getBudDataList();
        	  debug("Creating raw data before populating takes: "+(new Date() - dt));
        	  var recList=new CalemRecordList('budget');
        	  var dt=new Date();
        	  recList.populateList(null, fldList, dataList);
  
        	  var dt2=new Date();
        	  debug("populating: "+recList.getSize() + " takes: "+(dt2-dt));
        	  this.assertTrue((dt2-dt) < 2000);
        	  //Let's verify field
        	  var rec=recList.getRecord(0);
        	  var raw=rec.getField("budgeted").getRawValue();
        	  debug("budgeted raw value type="+(typeof raw)+", raw value="+raw);
        	  this.assertTrue(typeof raw=='number');
        	  
        	  var raw=rec.getField("start_date").getRawValue();
        	  debug("budgeted raw value type="+(raw instanceof Date));
        	  this.assertTrue(raw instanceof Date);
        	  
        	  raw=rec.getField("budget").getRawValue();
        	  debug("budget type="+(typeof raw));
        	  this.assertTrue(typeof raw=='string');
        	  //Verify ordering
        	  var st1="budget 2001";
        	  var st2="budget 02";
        	  debug("comparing st1="+st1+", st2="+st2+", result="+CalemField.compareString(st1, st2));
        }
        
        function startTest() {
        		setUp();
        		testCalemRecord();
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
