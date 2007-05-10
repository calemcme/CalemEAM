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
            return ['testCalemDb'];
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
   			shell = new DwtShell("MainShell");
   			CalemContext.getInstance().setShell(shell);     	
        }

        function testCalemDb() {
            var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            //Need to mimic a sessionId so the call can go through.
            login();
            //Now let's build Db query so we can use
            var dbQuery=getDbQuery();
            //Now let's get db and send off to server
            var db=reg.getDb();
            debug("<b>db=</b> "+db);
            var resp=db.getDataBulk(dbQuery);
            if (resp.getException()) {
            	debug("<b>Soap error received:</b> code="+ resp.code+", error="+resp._errorMsg);
            }
            this.assertTrue(!resp.getException());
            //Continue on to validate results.
            var result=resp.getResponse().BulkFetchResponse;
            this.assertTrue(result!==null);
            //Let's verify the resultset
            this.assertTrue(result instanceof Array &&  result.length==4);
            this.assertTrue(result[0].table=='costcode' && result[0].type=='GET' && result[0].serverTime!=null && result[0].localTime!=null);
            this.assertTrue(result[1].table=='budget_title' && result[1].type=='GET' && result[1].serverTime!=null && result[1].localTime!=null);
            this.assertTrue(result[2].table=='budget' && result[2].type=='DELETED' && result[2].serverTime!=null && result[2].localTime!=null);
            this.assertTrue(result[3].table=='budget' && result[3].type=='GET' && result[3].serverTime!=null && result[3].localTime!=null);
            //Localtime
            debug("localTime for budget="+result[2].localTime);
            var dt=new Date();
            var dtLocalTime=CalemTextUtil.parseServerDateTime(result[2].localTime);
            debug("parsedTime="+dtLocalTime +", current="+dt);
            this.assertTrue(dt.getFullYear()==dtLocalTime.getFullYear() &&
                            dt.getMonth() == dtLocalTime.getMonth() &&
                            dt.getDate() == dtLocalTime.getDate() &&
                            dt.getHours() == dtLocalTime.getHours() &&
                            dt.getMinutes() == dtLocalTime.getMinutes());
            
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
			   CalemContext.getInstance()._userInfo=new Object();
			   CalemContext.getInstance()._userInfo.sid=resp.sessionId;	 
		  } 
		  
		  /**
		   * build db queries
		   * costcode (get)
		   * budgetList (get)
		   * budget (deleted)
		   * budget (get)
		   */
		  function getDbQuery() {
		  	   //create a dbQuery first
		  	   var dbQuery=new CalemDbQuery();
		  	   
		  	   //query to get costcode.
		  		var ccQuery=new CalemTableQuery('costcode', 'costcode');
		  		var sf=new CalemSelectField('costcode');
		  		ccQuery.addSelect(sf);
		  		dbQuery.add(ccQuery);
		  		
		  		//query to get budget_title
		  		var btQuery=new CalemTableQuery('budget_title', 'budget_title');
		  		sf=new CalemSelectField('budget_title');
		  		btQuery.addSelect(sf);
		  		dbQuery.add(btQuery);
		  		
		  		//Deleted from budget
		  		var qd=new CalemQueryDeleted('budget', 'budget', '2006-10-23 12:33:45'); 
		  		dbQuery.add(qd);
		  		
		  		//Select from budget
		  	   fld=new CalemDbField('budget', 'budget');
		  	   val=new CalemDbString("Q2's");
		  	   var expr=new CalemDbExpr(fld, CalemDbExpr.LIKE, val);
		  		var bdQuery=new CalemTableQuery('budget', 'budget');
		  		sf=new CalemSelectField('budget');
		  		bdQuery.addSelect(sf);
		  		bdQuery.setWhere('budget', expr);
		  		dbQuery.add(bdQuery);
		  		
		  		//Let's do a visual verification
		  		var obj=dbQuery.getSoap();
		  		debug("<b>got all the queries: </b> "+ obj.costcode.sql+"<br> "+obj.budget_title.sql+"<br> "+obj.recycle_bin_budget.sql+"<br> "+obj.budget.sql);
		  		this.assertTrue(obj.costcode.sql.indexOf("SELECT costcode.* FROM costcode")!=-1
		  		              && obj.budget_title.sql.indexOf("SELECT budget_title.* FROM budget_title")!=-1
		  		              && obj.recycle_bin_budget.sql.indexOf("SELECT recycle_bin.rec_id")!=-1
		  		              && obj.recycle_bin_budget.sql.indexOf("recycle_bin.created_time")!=-1
		  		              && obj.recycle_bin_budget.sql.indexOf("recycle_bin.table_name = 'budget'")!=-1
                          && obj.budget.sql.indexOf("SELECT budget.* FROM budget")!=-1);
            debug("<b>dbQuery verified</b>");
		  		return dbQuery;
		  }
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        function startTest() {
        		setUp();
        		testCalemDb();
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
