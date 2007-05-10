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
            return ['testCalemSearchInfo'];
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
       
        function testCalemSearchInfo() {
        	  debug("<b>testCalemSearchInfo</b>");
        	  var dbField=new CalemDbField('users', 'username');
        	  var dbVal=new CalemDbString('calem');
        	  
        	  var json=dbField.getJson();
        	  debug('dbField json='+json);
        	  eval("var obj="+json);
        	  debug("fld obj="+obj);
        	  var fld=CalemJson.setJson(obj);
        	  
        	  var expr=new CalemDbExpr(dbField, CalemDbExpr.EQ, dbVal);
			  debug("expr json="+expr.getJson());
			  eval("var i="+expr.getJson());
			  debug("expr deserialized="+i);
			  var newExpr=CalemJson.setJson(i);
			  debug("newExpr="+newExpr);
			          	                             
        	  var map=new Object();
        	  map['username']=expr;
        	  var tblSearch=new CalemTableSearchInfo('users', map);
        	  debug("jason="+tblSearch.getJson());
        	  var searchMap=new Object();
        	  searchMap['users']=tblSearch;
        	  debug("tblSearch json="+tblSearch.getJson());
        	  var json=tblSearch.getJson();
        	  eval("var ss="+json);
        	  debug("validity of tblSearch json="+ss);
        	  var newTs=CalemJson.setJson(ss);
        	  debug("deserialized newTs.getJson="+newTs.getJson());
        	  ///
        	  debug("testing searchInfo");
        	  var searchInfo=new CalemSearchInfo('users-001-001', 'users-calem', 'users', true, 
        	  									'admin_on_install', searchMap);
			  debug("searchInfo="+searchInfo.getJson()); 
			  //Verify sql
			  var sql=searchInfo.getSql();
			  debug("sql="+sql);
			  this.assertTrue(sql.indexOf('=')!==false && sql.indexOf('users.username')!==false
			                  && sql.indexOf('calem')!==false);
			                  
			  var json=searchInfo.getJson();
			  eval("var newSi="+json);
			  debug("newSi="+newSi);
			  //Try agagin
			  var newSi=CalemJson.setJson(newSi);
			  debug("deserialized obj="+newSi.getJson());
			  this.assertTrue(newSi.getSql()==searchInfo.getSql());
			  
			  //searchInfo
			  var si={CalemSearchInfo: {id: '821b39d537ada6055d3f99d17622964c', name: 'users-active', table: 'users', shared: false, axoId: '1000000', search: {users: {CalemTableSearchInfo: {table: 'users', search: {status_id: {CalemDbExpr: {field: {CalemDbField: {table: 'users', field: 'status_id'}}, op: 'IN', value: {CalemDbDropdown: ['us_active']}}}}}}}}};
			  var siInfo=CalemJson.setJson(si);      	              
        }
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        function startTest() {
        		setUp();
        		testCalemSearchInfo();
        }
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemButtonInfo tests</h1>

<p>This page tests CalemSearchInfo class.</p>
<div id=outputDiv></div>

</body>
</html>
