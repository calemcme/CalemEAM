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
            return ['testCalemCacheQuery', 'testCalemCacheLookupQuery'];
        }
        
        function setUp() {
        	   CalemDebug.initDebug(location);
        		cc=CalemContext.getInstance();
				cc.init(); //Initialize context.
   			//Init registry
   			var regMgr=CalemConf.registry_manager;
   			reg=eval(["new ", regMgr.impl, "()"].join(""));
   			reg.initForTest(regMgr.names)
   			cc.setRegistry(reg);        	
        }
		  
		  function testCalemCacheQuery() {
		  	 loadGroupCacheData();
		  	 //Let's try a few queries here.
			 var groupDd=reg.getTableDd('acl_group');
			 var qry=groupDd.buildGetAllQuery();
			 //Query condition
			 var val=new CalemDbString('Admin');
			 var fld=new CalemDbField('acl_group', 'acl_group');
			 var dbExpr=new CalemDbExpr(fld, CalemDbExpr.LIKE, val);
			 qry.setWhere('acl_group', dbExpr);
			 //get cached data.
			 var cache=reg.getCache();
			 var groups=cache.get('acl_group');
			 //Query it
			 var result=groups.bulkFetchByQuery(qry);
			 //Verify that only one match.
			 debug("find result: " + result.getSize());
			 assertTrue(result.getSize() == 1);		
			 var group=result.getRecord(0).getField('acl_group').getValue();
			 debug("acl_group found: "+group);
			 assertTrue(group.indexOf('Admin')>=0);
			   	
		  }       
		  
		  function testCalemCacheLookupQuery() {
		  	 loadGroupCacheData();
		  	 loadUserCacheData();
		  	 //Let's try a few queries here.
			 var groupDd=reg.getTableDd('users');
			 var qry=groupDd.buildGetAllQuery();
			 //Query condition
			 var val=new CalemDbString('TEST_group');
			 var fld=new CalemDbField('users', 'acl_group_id');
			 var dbExpr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
			 qry.setWhere('users', dbExpr);
			 //check the sql stmt
			 debug("sql="+qry.getSql());
			 //get cached data.
			 var cache=reg.getCache();
			 var users=cache.get('users');
			 //Query it
			 var result=users.bulkFetchByQuery(qry);
			 //Verify that only one match.
			 debug("find result: " + result.getSize());
			 assertTrue(result.getSize() == 1);		
			 var group=result.getRecord(0).getField('acl_group_id').getValue();
			 debug("acl_group_id found: "+group);
			 assertTrue(group.indexOf('Admin')>=0);
			   	
		  }       
        
        var groups;
        function loadUserCacheData() {
        	 var userDd=reg.getTableDd('users');
        	 var userAr=[];
        	 var fields=userDd.getFields();
        	 for (var i=0; i< 2; i++) {
        	 	//Adding two users
        	 	var userRow=[];
        	 	for (var j in fields) {
        	 		if (j=='id') userRow.push('user'+j);
        	 		else if (j=='acl_group_id') {
        	 			if (i==0) userRow.push('TEST_group');
        	 			else userRow.push('test_2');
        	 		} else userRow.push('');
        	 	}
        	 	userAr.push(userRow);
        	 }
			 var cache=reg.getCache();
			 var users=new CalemLocalCachedItem(cache, 'users', userAr); 
			 cache.put(users);
			 //Let's verify that groups have values.
			 var recList=users.getRecordList();
			 assertTrue(recList.getSize()==2);   
			 debug("recList size="+recList.getSize());   	 	          
        }
        
        function loadGroupCacheData() {
        	 var groups={data: [['TEST_group', 'Admin group', 'parent_group_id', 'test', '', '', '', ''],
        	 	                 ['test_2', 'Group user', 'TEST_group', 'test_2', 'test', '', '', '', '']],
        	 	          parentMap: {test: ['test_group']}};
			 CalemData['acl_group']=groups;
			     	 	          
			 var reg=cc.getRegistry();
			 var cache=reg.getCache();
			 var groups=new CalemCachedGroups(cache); 
			 cache.put(groups);
			 //Let's verify that groups have values.
			 var recList=groups.getRecordList();
			 assertTrue(recList.getSize()==2);   
			 debug("recList size="+recList.getSize());   	 	          
        }
        
        function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }
        function startTest() {
        		setUp();
        		debug("<font style='color:red'>testCalemCacheQuery</font>");
        		testCalemCacheQuery();
        		debug("<font style='color: red;'>testCalemCacheLookupQuery</font>");
        		testCalemCacheLookupQuery();
        }
        
        var cc;
        var reg;
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
