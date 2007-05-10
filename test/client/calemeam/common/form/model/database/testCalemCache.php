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
            return ['testCalemCacheBuildAllGetQuery', 'testPrepareSoapForTable', 
                    'testBulkLoadFirstTime', 'testBulkLoadNonFirstTime',
                    'testCalemBudgetQuery'];
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
   			//@todo to figure out why setting shell will cause it to fail.
   			//shell = new DwtShell("MainShell");
   			//CalemContext.getInstance().setShell(shell);        	
        }

        /**
         * Test code
         */
		  function login() {
		  		var soapDoc=CalemSoapClient.createSoapDoc("Login", null);
   			soapDoc.set("username", 'calem');
   			soapDoc.set("password", 'calem');
   			var client=new CalemSoapClient(soapDoc);
   			var cr=client.service(); 
   			this.assertTrue(!cr.getException());  			
			   resp=cr.getResponse().LoginResponse;
			   debug("<b>Logged in. </b> sessionId="+resp.sessionId+", validityPeriod="+resp.validityPeriod);
			   //Init sid for client to use
			   //Init sid for client to use
			   CalemContext.getInstance()._userInfo=new Object();
			   CalemContext.getInstance()._userInfo.sid=resp.sessionId;	 
		  } 
		  
		  /**
		   * testCalemCacheBuildAllGetQuery
		   */
		  function testCalemCacheBuildAllGetQuery() {
		  	   debug("<b>testCalemCacheBuildAllGetQuery</b>");
		  		var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            var budDd=reg.getTableDd('budget');
            var tblQuery=budDd.buildGetAllQuery();
            debug("budget query json: " + tblQuery.getJson());
            debug("budiget sql: "+tblQuery.getSql());
            this.assertTrue(tblQuery.getSql().indexOf('start_date DESC')!=-1);
            this.assertTrue(tblQuery.getJson().indexOf("type: 'GET'")!=-1);
            
            debug("---");
            
            //Workorder case
            var woDd=reg.getTableDd('workorder');
            tblQuery=woDd.buildGetAllQuery();
            debug("workorder sql: "+tblQuery.getSql());
            debug("workorder json: "+tblQuery.getJson());
            this.assertTrue(tblQuery.getJson().indexOf('sched_finish_time')!=-1);
            this.assertTrue(tblQuery.getSql().indexOf('ORDER BY sched_finish_time DESC')!=-1);
		  }		
		  
		  /**
		   * testPrepareSoapForTable
		   */
		  function testPrepareSoapForTable() {
		  	   debug("<b> testPrepareSoapForTable </b>");
		  		var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            var budDd=reg.getTableDd('budget');
            var tblQuery=budDd.buildGetAllQuery();
            var cache=reg.getCache();
            var soapQuery=new CalemDbQuery();
            cache._prepareSoapForTable(tblQuery, soapQuery);
            //Try out the system here.
            var map=soapQuery.getQueryMap();
            debug("parents table for <font style='color:green'>budget</font>");
            for (var i in map) {
            	debug(i +", "+map[i].getSql());	
            }
            this.assertTrue(soapQuery!=null && soapQuery.getQuery('users')!=null);      
		  }   
		  
		  function testBulkLoadFirstTime() {
		  		debug("<b>testBulkLoadFirstTime</b>");
		  		var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            //Need to mimic a sessionId so the call can go through.
            login();
            //also get a cache handle
            var cache=reg.getCache();
            //Creating a callback
            var callback=new AjxCallback(null, onQryResults);
            //Now prepare to launch it.
            var dbQry=new CalemDbQuery();
            dbQry.add(getBudgetQuery());
            cache.bulkLoad(dbQry, callback);
            setTimeout('verifyBulkLoadFirstTime()', 2000);		  	
		  }
		  
		  var bulkLoadResFirstTime=null;
		  function onQryResults(res) {
		  	  bulkLoadResFirstTime=res;
		  	  debug("Got bulk query results="+res);
		  }
		  
		  //Verify bulkLoad
		  function verifyBulkLoadFirstTime() {
		  	 debug("verifyBulkLoadFirstTime ... ");
		  	 this.assertTrue(bulkLoadResFirstTime['budget']!=null);
		  	 var recList=bulkLoadResFirstTime['budget'];
		  	 debug("recList size="+recList.getSize());
		  	 for (var i=0; i< 5 && i < recList.getSize(); i++) {
		  	   var rec=recList.getRecord(i);
		  	 	debug(i+"'s id="+rec.id+", budget="+rec.getField('budget').getValue()
		  	 	   +", start_date="+rec.getField('start_date').getValue()
		  	 	   );
		  	 }
		  }
		  
		  /**
		   * testBulkLoadNonFirstTime
		   */
		  function testBulkLoadNonFirstTime() {
		  		setTimeout("testBulkLoadNonFirstTime_start()", 2200);
		  }
		  
		  function testBulkLoadNonFirstTime_start() {
		  		debug("<b>testBulkLoadNonFirstTime_start</b>");
		  		//Now all the query should go by local processing.
		  		var tq=new CalemTableQuery('users', 'users');
		  		var sel=new CalemSelectField('users');
		  		tq.addSelect(sel);
		  		//Now query cache about the table
		  		var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            var cache=reg.getCache();
            //Creating a callback
            var callback=new AjxCallback(null, onUsersReponse);
            //Now prepare to launch it.
            var dbQry=new CalemDbQuery();
            dbQry.add(tq);
            //Let's review the queries for soap.
            var soapQuery=new CalemDbQuery();
            cache._prepareSoapForTable(tq, soapQuery);
            var map=soapQuery.getQueryMap();
          	var total=0;
          	debug("parents table for <font style='color:green'>users</font>");
          	var users=cache.get('users');
          	var dt=new Date();
          	debug("current="+dt+", users _lastLocalDeletedTime="+ users._lastLocalDeletedTime+", _lastLocalUpdatedTime"+users._lastLocalUpdatedTime);
          	for (var i in map) {
          		debug("users query: "+i+" = "+map[i]+", json="+map[i].getJson());
          		total++;
         		debug(i +", "+map[i].getSql()+", total="+total);	
          	}

            cache.bulkLoad(dbQry, callback);
            setTimeout('verifyBulkLoadNonFirstTime()', 2000);		
		  }
		  
		  var secondRes;
		  function onUsersReponse(res) {
		  	 secondRes=res;
		  	 var dt=new Date();
		  	 var dtGmt=new Date(dt.getTime());
		  	 var min=dtGmt.getMinutes()+dtGmt.getTimezoneOffset();
		  	 dtGmt.setMinutes(min);
		  	 debug("got 2nd response, localTime="+dt+", serverTime="+dtGmt);
		  	 //Now let's get staled queries they should be empty.
		  	 verifySoapQueryBeingEmpty();
		  }
		  
		  function verifySoapQueryBeingEmpty() {
		  	 debug("<b>verifySoapQueryBeingEmpty - users</b>");
		  	 var ctxt=CalemContext.getInstance();
          var reg=ctxt.getRegistry();
          var userDd=reg.getTableDd('users');
          var tblQuery=userDd.buildGetAllQuery();
          var cache=reg.getCache();
          var soapQuery=new CalemDbQuery();
          //Find out the local timestamp
          var dept=cache.get('dept');
          var dt=new Date();
          debug("current="+dt+", dept _lastLocalDeletedTime="+ dept._lastLocalDeletedTime+", _lastLocalUpdatedTime"+dept._lastLocalUpdatedTime);
          var dbQuery = new CalemDbQuery();
          dept.addStaledQueries(dbQuery);
          debug("dept staledQueries count="+ dbQuery.size());
          this.assertTrue(dbQuery.size()==0);
          cache._prepareSoapForTable(tblQuery, soapQuery);
          //Try out the system here.
          var map=soapQuery.getQueryMap();
          var total=0;
          debug("parents table for <font style='color:green'>users</font>");
          for (var i in map) {
          	total++;
         	debug(i +", "+map[i].getSql()+", total="+total);	
          }
          this.assertTrue(total==0); 
		  }
		  
		  function verifyBulkLoadNonFirstTime() {
		  	 this.assertTrue(secondRes['users']!=null);
		  	 var recList=secondRes['users'];
		  	 debug("users size="+recList.getSize());
		  	 var rec=recList.getRecord(0);
		  	 debug("username="+rec.getField('username').getRawValue()+", full_name="+rec.getField('full_name').getRawValue());
		  }
		  
		  function getBudgetQuery() {
		  		var qry=new CalemTableQuery('budget', 'budget');
		  		var sf=new CalemSelectField('budget');
		  		qry.addSelect(sf);
		  		return qry;
		  }
		  
		  // budget query with sub query.
        function testCalemBudgetQuery() {
        	 debug("<b>testCalemBudgetQuery</b>");
        	 var reg=CalemContext.getInstance().getRegistry();
			 var budgetDd=reg.getTableDd('budget');
			 var qry=budgetDd.buildGetAllQuery();
			 //Query condition
			 var val=new CalemDbString('2');
			 var fld=new CalemDbField('budget', 'title_id');
			 var dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
			 qry.setWhere('budget', dbExpr);
			 debug("qry="+qry.getSql());
			 var dbQry=new CalemDbQuery();
			 dbQry.add(qry)
			 //Now do a bulk query with a callback
			 var obj=new OnDeleteResult();
			 reg.getCache().bulkLoad(dbQry, new AjxCallback(obj, obj.onDeleteFetchResult));
			}
			
			function OnDeleteResult() {}
			OnDeleteResult.prototype.onDeleteFetchResult =
			function(result) {
				var recList=result['budget'];
				//@cl-del
				debug("recList size from BO: "+recList.getSize());
				if (recList.getSize() != 3) {
					debug("<font style='color:red;'>recList size is not 3!!</font>");
					debugDebug("this is wrong!");
				}
			}
			
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        function startTest() {
        		setUp();
        		testCalemCacheBuildAllGetQuery();
        		testPrepareSoapForTable();
        	   testBulkLoadFirstTime();
        		testBulkLoadNonFirstTime();
        		testCalemBudgetQuery();	
        }
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        
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
