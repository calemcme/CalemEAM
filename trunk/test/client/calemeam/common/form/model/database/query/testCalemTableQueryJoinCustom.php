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
            return ['testCacheCustomTableQuery', 'testDbCustomTableQuery', 'testWoSelfJoinTableQuery', 
                    'testMdDetailTableQuery', 'testJoinTableQueryWithExpr', 'testPoItemSelectQuery'];
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
   			//custom def
   			customDef={
		  	 	 fields: {
		  	 	 	       test1: {type: 'varchar', length: 25},
		  	 	 	       test2: {type: 'double'}
		  	 	 } 
		  	   };      	
        }
		  
		  //Custom field test
		  function testCacheCustomTableQuery() {
		  	 debug("<b>testCacheCustomTableQuery</b>");
		  	 CalemMetadataCustom['zc_acl_group']=customDef;
		  	 var tbDd=reg.getTableDd('acl_group');
		  	 tbDd._reloadDd();
		  	 var fields=tbDd.getFields();
		  	 assertNotNull(fields['test1'] && fields['test2']);
		  	 var tq=tbDd.buildGetAllQuery();
		  	 var sql=tq.getSql();
		  	 debug("query="+sql);
		  	 assertTrue(sql.indexOf('zc_acl_group.*')>0
		  	          && sql.indexOf('LEFT JOIN zc_acl_group')>0
		  	          && sql.indexOf('zc_acl_group.zc_id')>0);
		  }
        
        //Custom DB field test
		  function testDbCustomTableQuery() {
		  	 debug("<b>testDbCustomTableQuery</b>");
		  	 CalemMetadataCustom['zc_po']=customDef;
		  	 var tbDd=reg.getTableDd('po');
		  	 tbDd._reloadDd();
		  	 var fields=tbDd.getFields();
		  	 assertNotNull(fields['test1'] && fields['test2']);
		  	 var tq=tbDd.buildGetAllQuery();
		  	 var sql=tq.getSql();
		  	 debug("query="+sql);
		  	 assertTrue(sql.indexOf('zc_po.*')>0
		  	          && sql.indexOf('LEFT JOIN zc_po')>0
		  	          && sql.indexOf('zc_po.zc_id')>0);
		  }
		  
		  //Custom Md field test: a) master table; b) detail table.
		  function testWoSelfJoinTableQuery() {
		  	 debug("<b>testWoSelfJoinTableQuery</b>");
		  	 var tbDd=reg.getTableDd('workorder');
		  	 var tq=tbDd.buildGetAllQuery();
		  	 var sql=tq.getSql();
		  	 debug("query="+sql);
		  	 assertTrue(sql.indexOf("workorder1.wo_no")>0 && sql.indexOf('workorder3.wo_no')>0
		  	          && sql.indexOf('workorder4.wo_no')>0);
		  }
		  
		  function testMdDetailTableQuery() {
		  	 debug("<b>testMdDetailTableQuery</b>");
		  	 var tbDd=reg.getTableDd('wo_meter');
		  	 var tq=tbDd.buildGetAllQuery();
		  	 var sql=tq.getSql();
		  	 debug("Md query="+sql);
		  	 assertTrue(sql.indexOf("workorder.wo_no")<0 && sql.indexOf('asset_meter1.meter_no')>0);
		  }
		  
		  function testJoinTableQueryWithExpr() {
		  		debug("<b>testJoinTableQueryWithExpr </b>");
		  		var tbDd=reg.getTableDd('rcm_action');
		  		var tq=tbDd.buildGetAllQuery();
		  		debug("tq="+tq.getSql());
		  		assertTrue(tq.getSql().indexOf('LEFT JOIN rcm_failure')>0);
		  		var fld=new CalemDbField('rcm_action', 'failure_id');
		  		//var val=new CalemDbString('23456');
		  		var lkupVal=new CalemDbLookup('23456', 'This is interesting');
		  		var expr=new CalemDbExpr(fld, CalemDbExpr.EQ, lkupVal);
		  		//tq.addWhereExprLkupDb('rcm_action', 'failure_id', expr, tbDd);
		  		tq.addWhere('rcm_action', null, expr, tbDd);
		  		debug('new sql='+tq.getSql());
		  		assertTrue(tq.getSql().indexOf('rcm_action.failure_id')>0);
		  		assertTrue(tq.getSql().indexOf('LEFT JOIN rcm_failure')>0);
		  		debug('rcm failure: count sql='+tq.getCountSql());
		  		assertTrue(tq.getCountSql().indexOf('rcm_action.failure_id')>0);
		  		assertTrue(tq.getCountSql().indexOf('LEFT JOIN rcm_failure')==-1);
		  }
		  
		  function testPoItemSelectQuery() {
		  		debug("<b>testPoItemSelectQuery </b>");
		  		var tbDd=reg.getTableDd('req_item');
		  		var tq=tbDd.buildGetAllQuery();
		  		debug("tq="+tq.getSql());
		  		assertTrue(tq.getSql().indexOf('LEFT JOIN requisition')>0);
		  		var andExpr=new CalemExprAnd();
		  		//Where vendor_id=... and req status=='approved' and req_item po id is null
		  		var fld=new CalemDbField('req_item', 'vendor_id');
		  		var val=new CalemDbString('1234');
		  		var expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
		  		andExpr.add(expr);
		  		//Add req status
		  		fld=new CalemDbField('requisition1', 'status_id'); //manually fix the table Id.
		  		val=new CalemDbString('req_status_approved');
		  		expr=new CalemDbExpr(fld, CalemDbExpr.EQ, val);
		  		andExpr.add(expr);	  		
		  		//Add po id
		  		fld=new CalemDbField('req_item', 'po_id');
		  		expr=new CalemDbExpr(fld, CalemDbExpr.IS_NULL);
		  		andExpr.add(expr);
		  		tq.addWhere('requisition', null, andExpr, tbDd);
		  		debug('new sql='+tq.getSql());
		  		assertTrue(tq.getSql().indexOf('LEFT JOIN requisition')>0);
		  		assertTrue(tq.getSql().indexOf('requisition1.id')>0);
		  		assertTrue(tq.getSql().indexOf('requisition1.status_id')>0);
		  		assertTrue(tq.getSql().indexOf('req_item.po_id IS NULL')>0);
		  		
		  		//Test count sql
		  	   var sql=tq.getCountSql();
		  	   debug("count sql="+sql);
		  	   assertTrue(tq.getCountSql().indexOf('LEFT JOIN requisition')>0);
		  		assertTrue(tq.getCountSql().indexOf('requisition1.id')>0);
		  		assertTrue(tq.getCountSql().indexOf('requisition1.status_id')>0);
		  		assertTrue(tq.getCountSql().indexOf('req_item.po_id IS NULL')>0);
		  }
		  
        function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }
        function startTest() {
        		setUp();
        		testCacheCustomTableQuery(); 
        		testDbCustomTableQuery(); 
        		testWoSelfJoinTableQuery();
        		testMdDetailTableQuery();
        		testJoinTableQueryWithExpr();
        		testPoItemSelectQuery();
        }
        
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
