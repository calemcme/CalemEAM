<?php
   chdir('../../../../../../../..');
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
    <title>CalemDbExpr test</title>
    
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=CalemMsg"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Metadata"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Ajax"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Calem"></script>
    
    <link rel="stylesheet" type="text/css" href="<?php print $calemRootUrl ?>/test/client/jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/test/client/jsunit/app/jsUnitCore.js"></script>
    
    <script language="JavaScript" type="text/javascript">
        function exposeTestFunctionNames() {
            return ['testCalemDbValue',  'testCalemDbExpr', 'testCalemDbExprQuery'];
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
		  
		  //CalemDbValue tests
		  function testCalemDbValue() {
		  		debug("<b>CalemDbNumber</b>");
		  		var cn=new CalemDbNumber(123);
		  		this.assertTrue(cn.getRawValue()==123);
		  		
		  		debug("<b>CalemDbString</b>");
		  		var val="Hello worlD!";
		  		cn=new CalemDbString(val);
		  		debug("val="+val+", raw="+cn.getRawValue()+", like="+cn.getLikeValue());
		  		this.assertTrue(cn.getRawValue()=='Hello worlD!');
		  		this.assertTrue(cn.getLikeValue()=='hello world!');
		  		
		  		
		  		debug("<b>CalemDbUser - TBD</b>");
		  		cn=new CalemDbUser(val);
		  		this.assertTrue(cn.getRawValue()==null);
		  		
		  		debug("<b>CalemDbDate</b>");
		  		cn=new CalemDbDate();
		  		cn.setJson('2003-10-22');
		  		var val=cn.getRawValue();
		  		debug("date raw="+val);
		  		this.assertTrue(val.getFullYear()==2003 && val.getMonth()==9 && val.getDate()==22);		  		
		  		
		  		debug("<b>CalemDbDateTime</b>");
		  		cn=new CalemDbDateTime();
		  		cn.setJson('2003-10-22 10:30:20');
		  		var val=cn.getRawValue();
		  		this.assertTrue(val.getFullYear()==2003 && val.getMonth()==9 && val.getDate()==22
		  							&& val.getHours()==10 && val.getMinutes()==30 && val.getSeconds()==20);
		  									  							
				debug("<b>CalemDbTime</b>");
		  		cn=new CalemDbTime();
		  		cn.setJson('10:30:20');
		  		var val=cn.getRawValue();
		  		debug("time val="+val);
		  		this.assertTrue(val.getHours()==10 && val.getMinutes()==30 && val.getSeconds()==20);
		  		
		  		debug("Done CalemDbValue test");							  		
		  } 
		  
		  function testCalemDbExpr() {
		  		debug("<b>testCalemDbExpr</b>");
		  		var fld=new CalemDbField('in_tran', 'qty_available');
		  		var expr=new CalemDbExpr(fld, CalemDbExpr.GT, new CalemDbNumber(0));
		  		debug("expr sql=" + expr.getSql());
		  		assertTrue(expr.getSql().indexOf('0')>0);
		  }  
		  
		  //DbExpr query
		  function testCalemDbExprQuery() {
		  	 debug("<b>testCalemDbExprQuery</b>");
		  	 var fldList=getBudgetFieldList();
		  	 var dataList=getBudDataList();
		  	 var recList=CalemCacheRecordList.createByRawResult(null, {table:'budget', count:50, fields: fldList, data: dataList});
		  	 debug("recList.getSize() = "+recList.getSize());
		  	 this.assertTrue(recList.getSize()==50);
			 //Let's build a query expression
			 var and=new CalemExprAnd();	
			 fld =new CalemDbField('budget', 'budget');
			 val=new CalemDbString('%even%');
			 and.add(new CalemDbExpr(fld, CalemDbExpr.LIKE, val));
			 fld=new CalemDbField('budget', 'start_date');	
			 val=new CalemDbDate();
			 val.setJson('2003-10-20');
			 and.add(new CalemDbExpr(fld, CalemDbExpr.GT, val));
			 //
			 var result=[];
			 for (var i=0; i< recList._recList.length; i++) {
			 	if (and.query(recList._recList[i])) {
			 		result.push(recList._recList[i]);
			 		//
					//debug(i+" :  "+recList._recList[i].id + ", budget="+ recList._recList[i].getField('budget').getQueryValue());
			 	}
			 }
			 //Verify answer
			 this.assertTrue(result.length==25);
			 debug("done testCalemDbExprQuery");
			 
			 //Use a simple table query to make sure result is the same
			 qry=new CalemTableQuery('budget', 'budget');
			 qry.setWhere('budget', and);
			 var result=[];
			 for (var i=0; i< recList._recList.length; i++) {
			 	if (qry.query(recList._recList[i])) {
			 		result.push(recList._recList[i]);
			 		//
					//debug(i+" :  "+recList._recList[i].id + ", budget="+ recList._recList[i].getField('budget').getRawValue());
			 	}
			 }
			 //Verify answer
			 this.assertTrue(result.length==25);
		  }  
		  
		  //RecordList data
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
        		      else if (bd.isDateTimeField(fldList[j]) || bd.isDateField(fldList[j])) v='2004-10-20 14:20:30';
        		      else if (bd.isNumberField(fldList[j]) || bd.isCurrencyField(fldList[j])) {
        		      	v=12345.788+i;
        		      } else if (bd.isIntegerField(fldList[j])) {
        		         v=1234+i;
        		      } else {
        		         if (i%2==0) {
        		      		v=['even_budget', '_',i,'_', j].join('');
        		      	} else {
        		      		v=['odd_budget', '_',i,'_', j].join('');
        		      	}
        		      }
        		   	ar.push(v);
        		   }
	        	   dataArr.push(ar);
        		}
        		return dataArr;
        } 
        
        function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }
        function startTest() {
        		setUp();
        		testCalemDbValue(); 
        		testCalemDbExpr();
        		testCalemDbExprQuery();
        }
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemDbExpr tests</h1>

<p>This page tests CalemDbExpr classes.</p>
<p>Debug output:</p>
<div id=outputDiv></div>
</body>
</html>
