<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<?php
   chdir('../../../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
	
	require_once _CALEM_DIR_ . 'server/include/util/CalemGzip.php';
	require_once _CALEM_DIR_ . 'server/include/log4php/LoggerManager.php';

?>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>CalemDb test</title>
    
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=CalemMsg"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Metadata"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Ajax"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Calem"></script>
    
    <link rel="stylesheet" type="text/css" href="<?php print $calemRootUrl ?>/test/client/jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/test/client/jsunit/app/jsUnitCore.js"></script>
    
    <script language="JavaScript" type="text/javascript">
        function exposeTestFunctionNames() {
            return ['testCalemCachedItemStaleQueries', 'testCalemCachedItemStaleQueriesNoQueries', 
                    'testCalemCachedItemUpdates'];
        }
        
        //testing
        function setUp() {
        	   CalemDebug.initDebug(location);
        		var cc=CalemContext.getInstance();
				cc.init(); //Initialize context.
   			//Init registry
   			var regMgr=CalemConf.registry_manager;
   			reg=eval(["new ", regMgr.impl, "()"].join(""));
   			reg.initForTest(regMgr.names)
   			cc.setRegistry(reg);  
   			cache=reg.getCache();      	
        }

        
        function testCalemCachedItemStaleQueries() {
        	 debug("<b>testCalemCachedItemStalyQueries</b>");
        	 var qry=getBudgetQuery();
        	 var rawResult=getRawResult();
        	 var ci=new CalemCachedItem(qry, rawResult, cache);
        	 //Check time stamp: 
        	 var dt=new Date();
        	 debug("current="+dt+", budget _lastLocalDeletedTime="+ ci._lastLocalDeletedTime+", _lastLocalUpdatedTime"+ci._lastLocalUpdatedTime);
        	 debug("serverDeletedTime: "+ci._lastServerDeletedTime+", serverUpdated: "+ci._lastServerUpdatedTime);
        	 var dbQry=new CalemDbQuery();
        	 //get staled queries
        	 ci.addStaledQueries(dbQry);
        	 var map=dbQry.getQueryMap();
        	 for (var i in map) {
        	 	debug("hello");
        	 	debug("query i = "+i+", query json="+map[i].getJson());
        	 	this.assertTrue(i == 'budget' || i == 'recycle_bin_budget');
        	 	var tblQuery=map[i];
        	 	debug(i+" sql="+tblQuery.getSql());
        	 }
        	 debug("nothing");
        	 this.assertTrue(dbQry.size()==2);
        }
        
        function testCalemCachedItemStaleQueriesNoQueries() {
        	 debug("<b>testCalemCachedItemStaleQueriesNoQueries</b>");
        	 var qry=getBudgetQuery();
        	 var rawResult=getRawResultFromNow(100000);
        	 var ci=new CalemCachedItem(qry, rawResult, cache);
        	 var dbQry=new CalemDbQuery();
        	 //get staled queries
        	 ci.addStaledQueries(dbQry);
        	 var map=dbQry.getQueryMap();
        	 for (var i in map) {
        	 	this.assertTrue(i == 'budget' || i == 'recycle_bin_budget');
        	 	var tblQuery=map[i];
        	 	debug(i+" sql="+tblQuery.getSql());
        	 }
        	 this.assertTrue(dbQry.size()==0);
        }
        
        var updateEvent=null;
        function testCalemCachedItemUpdates() {
        		debug("<b>testCalemCachedItemUpdates</b>");
        		var qry=getBudgetQuery();
        	   var rawResult=getRawResult();
        	   var ci=new CalemCachedItem(qry, rawResult, cache);
        	   var lis=new CacheListener();
        	   var listener=new AjxListener(lis, lis.onUpdateEvent);
        	   ci.addChangeListener(listener);
        	   var change=[];
        	   change.push(getDeletedRaw());
        	   change.push(getUpdatedRaw());
        	   ci.onServerUpdates(change);
        	   setTimeout('verifyCacheUpdates()', 1000);
        }
     
        function verifyCacheUpdates() {
        	 this.assertTrue(updateEvent!=null);
        	 var event=updateEvent;
        	 this.assertTrue(event.getDeleted().size()==5);
        	 this.assertTrue(event.getUpdated().size()==4);
        	 this.assertTrue(event.getInserted().size()==3);
        }
        
        function CacheListener() {
        }
        
        CacheListener.prototype.onUpdateEvent =
        function (event) {
        	   debug("<b>Got update event: </b>"+event+", deleted="+event.getDeleted().size()
        	   				+", updated="+event.getUpdated().size()
        	   				+", inserted="+event.getInserted().size());
        		updateEvent=event;
        }
        
        function getDeletedRaw() {
        	  return {table: 'budget', type:'DELETED', count: 5, fields:['id'], data: ['1','2','3','4','5'],
        	  	       serverTime: '2006-10-29 22:50:05', localTime: '2006-10-29 16:50:05'};
        }
        
        function getUpdatedRaw() {
        	  dataListSize=58;
        	  var dataList=getBudDataList();
        	  var dList=dataList.splice(51, 7);
        	  for (var i=0; i< 4; i++) {
        	  	 dList[i][0]=40+i;
        	  }
        	  return {table: 'budget', type: 'UPDATED', count: 7, fields: getBudgetFieldList(), data: dList,
        	           serverTime: '2006-10-29 22:50:05', localTime: '2006-10-29 16:50:05'};
        }
        
        function getBudgetQuery() {
        		var qry=new CalemTableQuery('budget', 'budget');
        		var sel=new CalemSelectField('budget');
        		qry.addSelect(sel);
        		debug("qry="+qry.getSql());
        		return qry;
        }
        
        function getRawResult() {
        	 return {table: 'budget', type: 'GET', count: 50, serverTime: '2005-10-30 16:40:00', localTime: '2005-10-30 12:40:00',
        	 	      fields: getBudgetFieldList(), data: getBudDataList()};  
        }
        
        function getTwoDigit(val) {
          val = val < 10 ? '0'+val : ''+val;
          return val;
        }
        
        function getRawResultFromNow(delta) {
          var dt=new Date();
          var delta= Math.floor(delta/60000);
          var min=dt.getMinutes();
          dt.setMinutes(min-delta);
          debug("min delta="+delta+", date="+dt);
          var dtStr=["'", dt.getFullYear(), "-", getTwoDigit(dt.getMonth()+1), '-', getTwoDigit(dt.getDate()), ' ',
                     getTwoDigit(dt.getHours()), ':', getTwoDigit(dt.getMinutes()),":",getTwoDigit(dt.getSeconds()),
                     "'"].join('');
			 debug("dtStr="+dtStr);                     
          return {table: 'budget', type: 'GET', count: 50, serverTime: dtStr, localTime: dtStr,
        	 	      fields: getBudgetFieldList(), data: getBudDataList()};
        }
        
        //RecordList creation
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

  

		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        } 
       
        function startTest() {
        		setUp();
        		testCalemCachedItemStaleQueries();
        		testCalemCachedItemStaleQueriesNoQueries();
        		testCalemCachedItemUpdates(); 		
        }
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        //var reg;
        //var cache;
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemDb tests</h1>

<p>This page tests CalemDb class.</p>
<div id=outputDiv></div>

</body>
</html>
