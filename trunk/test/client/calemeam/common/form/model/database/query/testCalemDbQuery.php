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
            return ['testCalemDbExpr', 'testCalemTableQuery', 'testCalemUpdatedQuery', 'testCalemDbQuery', 'testCalemDbQueryDeserialization'];
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
		  /**
		   * Expr test
		   */
        function testCalemDbExpr(nodebug) {
            var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            
            //Starting from a composite.
            var andExpr=new CalemExprAnd();
            //modified_time query.
            var fld1=new CalemDbField('workorder', 'modified_time');
            var st=fld1.getJson();
            var sql=fld1.getSql();
            debug("<b>fld1:  </b>"+st, nodebug);
            debug("<b>fld1 sql: </b>"+sql, nodebug);
            this.assertTrue(st.indexOf("{CalemDbField: {table: 'workorder', field: 'modified_time'}}")!= -1);
            this.assertTrue(sql=='workorder.modified_time');
            
            //Value
            var val1=new CalemDbString('2006-10-22 12:30:44');
            st=val1.getJson();
            sql=val1.getSql();
            debug("<b>ExprValue: </b> "+st, nodebug);
            debug("<b>ExprValue sql: </b> "+sql, nodebug);
            this.assertTrue(st.indexOf("{CalemDbString: '2006-10-22%2012%3A30%3A44'}")!= -1);
            this.assertTrue(sql=="'2006-10-22 12:30:44'");
            
            //Expr
            var expr1=new CalemDbExpr(fld1, CalemDbExpr.GT, val1);
            st=expr1.getJson();
            sql=expr1.getSql();
            debug("<b>DbExpr: </b> "+st, nodebug);
            debug("<b>DbExpr sql: </b> "+sql, nodebug);
            this.assertTrue(st.indexOf("{CalemDbExpr: {field: {")!= -1 && st.indexOf("op: '>'") != -1); 
            this.assertTrue(sql=="workorder.modified_time > '2006-10-22 12:30:44'"); 
                                   
            //like query
            var fld2= new CalemDbField('workorder', 'project_id');
            var val2=new CalemDbString('PJ123');
            var expr2=new CalemDbExpr(fld2, CalemDbExpr.LIKE, val2);
            st=expr2.getJson();
            sql=expr2.getSql();
            debug("<b>projectId's expr: </b> "+st, nodebug);
            debug("<b>projectId's sql: </b> "+sql, nodebug);
            this.assertTrue(st.indexOf("{CalemDbExpr: {field: {")!=-1);
            this.assertTrue(sql.indexOf("workorder.project_id LIKE '%PJ123%'")!=-1);
            
            //Quote testing - verify single quote and double quote
            var valQuote=new CalemDbString("I'm glad \" you're fine\", oh my!");
            var exprQuote=new CalemDbExpr(fld2, CalemDbExpr.EQ, valQuote);
            st=exprQuote.getJson();
            sql=exprQuote.getSql();
            debug("<b>Quote json: </b> "+st);
            debug("<b>Quote sql: </b> "+sql);
            this.assertTrue(st.indexOf("{CalemDbExpr: {field: {CalemDbField: ")!=-1
                         && st.indexOf("{CalemDbString: 'I%27m%20glad%20%22%20you%27re%20fine%22%2C%20oh%20my%21'")!=-1);
				this.assertTrue(sql.indexOf("workorder.project_id = 'I%27m glad %22 you%27re fine%22, oh my!'")!=-1); 				                                                      
            
            //Now let's put into an and.
            andExpr.add(expr1);
            andExpr.add(expr2);
            //Adding quote here.
            andExpr.add(exprQuote);
            
            //Verify expr can be for two fields join
            var exprFld=new CalemDbExpr(fld1, CalemDbExpr.GT, fld2);
            st=exprFld.getJson();
            sql=exprFld.getSql();
            debug("<b>field expr</b> "+st, nodebug);
            debug("<b>field sql</b> "+sql, nodebug);
            this.assertTrue(st.indexOf("{CalemDbExpr: {field: {CalemDbField: {")!=-1);
            this.assertTrue(sql.indexOf("workorder.modified_time > workorder.project_id")!=-1);
            
            //Let's use a dropdown here
            var fld3=new CalemDbField('workorder', 'priority_id');
            var val=new CalemDbDropdown(['wop_safety', 'wop_project']);
            var expr3=new CalemDbExpr(fld3, CalemDbExpr.IN, val);
            st=expr3.getJson();
            sql=expr3.getSql();
            debug("<b>expr3 json: </b>"+st, nodebug);
            debug("<b>expr3 sql is: </b>"+sql, nodebug);
            this.assertTrue(st.indexOf("'wop_safety'")!=-1 && st.indexOf("'wop_project'")!=-1);
            this.assertTrue(sql == "workorder.priority_id IN ('wop_safety', 'wop_project')");
            
            //Add to and
            andExpr.add(expr3);  
            st=andExpr.getJson();
            sql=andExpr.getSql();
            debug("<b>andExpr3: </b>"+st, nodebug);
            debug("<b>andExpr3 sql : </b> "+sql, nodebug); 
            this.assertTrue(st.indexOf("{CalemExprAnd: [")!=-1);
            this.assertTrue(sql.indexOf("workorder.priority_id IN ")!=-1
                           && sql.indexOf(" AND ")!=-1); 
            //Last check, the object is a valid json object
            var filter=null;
            eval("filter="+st);
            debug("filter obj="+filter, nodebug);
            this.assertTrue((filter ? true : false)); 
            return andExpr;
        }
        
        /**
         * Table Query test
         */
        function testCalemTableQuery(nodebug) {
            var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();  
                   
            //QueryRange
            var range=new CalemQueryRange(0, CalemQueryRange.ALL);
            var st=range.getJson();
            var sql=range.getSql();
            debug("<b>Range json: </b>" + st, nodebug);
            debug("<b>Range sql: </b>" + sql, nodebug);
            this.assertTrue(st.indexOf("{CalemQueryRange: {start: 0, size: "+CalemQueryRange.ALL+"}}")!=-1);
            this.assertTrue(sql.indexOf("LIMIT 0, "+CalemQueryRange.ALL)!=-1);
            
            
            //Order By
            var sel2=new CalemSelectField('project', 'project_no', 'project_id__project_no');
            st=sel2.getJson();
            sql=sel2.getSql();
            debug("<b>Select from another table: </b>"+st, nodebug);
            debug("<b>Select sql: </b>"+sql, nodebug);
            this.assertTrue(st.indexOf("{CalemSelectField: {table: 'project', field: 'project_no', alias: 'project_id__project_no'}}")!=-1);
            this.assertTrue(sql.indexOf("project.project_no AS project_id__project_no")!=-1);
            
            //Verify select all case.
            var seln=new CalemSelectField('workorder');
            st=seln.getJson();
            sql=seln.getSql();
            this.assertTrue(st.indexOf("{CalemSelectField: {table: 'workorder'}}")!=-1);
            this.assertTrue(sql.indexOf("workorder.*")!=-1);
            debug("<b>seln json: </b>"+st, nodebug);
            debug("<b>seln sql: </b>"+sql, nodebug);
   
            var orderBy=new CalemQueryOrderBy(sel2, CalemQueryOrderBy.DESC);
            st=orderBy.getJson();
            sql=orderBy.getSql();
            debug("<b>Order by json: </b> " + st, nodebug);
            debug("<b>Order by sql: </b> " + sql, nodebug);
            this.assertTrue(st.indexOf("{CalemQueryOrderBy: {field: {CalemSelectField: {table: 'project', field: 'project_no', alias: 'project_id__project_no'}}, order: 'DESC'}}")!=-1);
            this.assertTrue(sql.indexOf("ORDER BY project_id__project_no DESC")!=-1);
             
            //Where - join and where stuff.
            var tableJoin=new CalemTableJoin('LEFT', 'workorder', 'project_id', 'project', 'id');
            st=tableJoin.getJson();
            sql=tableJoin.getSql();
            debug("<b>TableJoin json: </b> "+st, nodebug);
            debug("<b>TableJoin sql: </b> "+sql, nodebug);
            this.assertTrue(st.indexOf("{CalemTableJoin: {type: 'LEFT', leftTbl: 'workorder', leftFld: 'project_id', rightTbl: 'project', rightFld: 'id'}}")!=-1);
            this.assertTrue(sql.indexOf("LEFT JOIN project ON workorder.project_id=project.id")!=-1);
            
            //get Exprs built already.
            var expr=testCalemDbExpr(true);
            
            var where=new CalemQueryWhere();
            where.set('workorder', expr, tableJoin);
            where.set('project', expr, tableJoin);
            st=where.getJson();
            sql=where.getSql();
            debug("<b>Where json: </b>"+st, nodebug);
            debug("<b>Where sql: </b>"+sql, nodebug);
            this.assertTrue(st.indexOf("{CalemQueryWhere: [{CalemWhereItem: {table: 'workorder'")!=-1
                           && st.indexOf(", tblJoin: {CalemTableJoin: {type: 'LEFT', leftTbl: 'workorder', leftFld: 'project_id'")!=-1);
				debug("left join project index="+sql.indexOf("LEFT JOIN project ON ")); 
				this.assertTrue(sql.indexOf("LEFT JOIN project ON ")!=-1);                           

            //From portion - ignored (no need to record it)
            //Select portion.
            //select all from work order
            var sel1=new CalemSelectField('workorder');
            st=sel1.getJson();
            sql=sel1.getSql();
            debug("<b>Select all json: </b>"+st, nodebug);
            debug("<b>Select all sql: </b>"+sql, nodebug);
            this.assertTrue(st.indexOf("{CalemSelectField: {table: 'workorder'}}")!=-1);
				this.assertTrue(sql.indexOf("workorder.*")!=-1);
				      
				//build select
				var select=new CalemQuerySelect();                  
            select.add(sel1);
            select.add(sel2);
            st=select.getJson();
            sql=select.getSql();
            debug("<b>Select json: </b>"+st);
            debug("<b>Select sql: </b>"+sql);
            this.assertTrue(st.indexOf("{CalemQuerySelect: [{CalemSelectField: {table: 'workorder'")!=-1
                            && st.indexOf("{CalemSelectField: {table: 'project'")!=-1);
				this.assertTrue(sql.indexOf("workorder.* , project.project_no AS project_id__project_no")!=-1);                            
            
            //Now let's figure out the query stuff
            var queryUpd=new CalemTableQuery('workorder', 'workorder'); 
            queryUpd.setRange(range);
            queryUpd.setOrderBy(orderBy);
            queryUpd.setWhere('workorder', expr, tableJoin);
            //Add select to query
            queryUpd.addSelect(sel1);
            queryUpd.addSelect(sel2);
            //Verification that updated is valid.
            st=queryUpd.getJson();
            sql=queryUpd.getSql();
            countSql=queryUpd.getCountSql();
            debug("<b>Query json </b>"+st, nodebug);
            debug("<b>Query sql </b>"+sql, nodebug);
            debug("<b>Count sql </b>"+countSql, nodebug);
            this.assertTrue(st.indexOf("{CalemTableQuery: {type: 'GET'")!=-1
                            && st.indexOf("{CalemQueryWhere: ")!=-1
                            && st.indexOf("{CalemQuerySelect: [")!=-1);
				this.assertTrue(countSql.indexOf("SELECT count(*) FROM workorder")!=-1
				               && countSql.indexOf("WHERE")!=-1);                            
            //Verify JSON object
            var query1=null;
            eval("query1="+st);
            debug("<b> Query obj=</b>"+query1, nodebug);
            this.assertTrue((query1 ? true : false)); 
                            
				//Try deleted query
		      var queryDeleted=new CalemTableQuery('recycle_bin', 'recycle_bin', CalemTableQuery.DELETED); 
		      //GTEQ
		      //Table name
		      var val1=new CalemDbString('workorder');
		      var fld1=new CalemDbField('recycle_bin', 'table_name');
		      var expr1=new CalemDbExpr(fld1, CalemDbExpr.EQ, val1);
		      //Deletion time.
		      val1= new CalemDbString('2006-10-23 12:33:45');
		      fld1=new CalemDbField('recycle_bin', 'created_time');
		      var expr2=new CalemDbExpr(fld1, CalemDbExpr.GTEQ, val1);
		      //Use an composite to put them together.
		      var compo=new CalemExprAnd();
		      compo.add(expr1);
		      compo.add(expr2);
		      //Selection
		      var sel1=new CalemSelectField('recycle_bin', 'rec_id');
		      //add to query
		      queryDeleted.setWhere('recycle_bin', compo);
		      queryDeleted.addSelect(sel1);
		      //Validation
		      st=queryDeleted.getJson();
		      sql=queryDeleted.getSql();
		      debug("<b>QueryDeleted json: </b>"+ st, nodebug);
		      debug("<b>QueryDeleted sql: </b>"+ sql, nodebug);
		      this.assertTrue(st.indexOf("{CalemTableQuery: {type: 'DELETED', table: 'recycle_bin'")!=-1
		                   && st.indexOf("{CalemSelectField: {table: 'recycle_bin', field: 'rec_id'}}")!=-1
		                   && st.indexOf("{CalemExprAnd: [{CalemDbExpr: {")!=-1);
				this.assertTrue(sql.indexOf("SELECT recycle_bin.rec_id FROM recycle_bin WHERE (recycle_bin.table_name = 'workorder' AND recycle_bin.created_time >= '2006-10-23 12:33:45')")!=-1);
						
				//New way to do deleted query
				var qd=new CalemQueryDeleted('budget', 'budget', '2006-10-23 12:33:45');
		      //Validation
		      st=qd.getJson();
		      sql=qd.getSql();
		      var countSql=qd.getCountSql();
		      debug("<b>QD json: </b>"+ st, nodebug);
		      debug("<b>QD sql: </b>"+ sql, nodebug);
		      debug("<b>QD countSql </b>"+sql, nodebug);		      
										                                       
         	var query2=null;
            eval("query2="+st);
            debug("<b> Query obj=</b>"+query2, nodebug);
            this.assertTrue((query2 ? true : false)); 
            return {queryUpdated: queryUpd, queryDeleted: qd};
        }
        
        /**
         * New type: updatedQuery/DeletedQuery
         */
        function testCalemUpdatedQuery() {
        	   //Field comparisons.
				var fd=new CalemSelectField('workorder', 'priority_id');
				var fd2=new CalemSelectField('workorder', 'project_id');
				var fd3=new CalemSelectField('workorder', 'project_id', 'project_id__project_no');
				this.assertTrue(fd.equals(fd));
				this.assertTrue(fd3.equals(fd3));
				this.assertFalse(fd.equals(fd3));
				this.assertFalse(fd2.equals(fd3));  
				
				//Verify updated query
				var uq=new CalemQueryUpdated('workorder','workorder', '2006-10-17 12:30:45');
				debug("<b>CalemQueryUpdated: </b>"+uq.getSql());
				debug("<b>CalemQueryUpdated countSql: </b> "+uq.getCountSql());
				this.assertTrue(uq.getJson().indexOf("{CalemQueryUpdated: ")!=-1);
				this.assertTrue(uq.getSql().indexOf("SELECT workorder.* FROM workorder")!=-1
				             && uq.getSql().indexOf("workorder.modified_time >= ")!=-1);   
				this.assertTrue(uq.getCountSql().indexOf("SELECT count(*) FROM workorder")!=-1);				                	
        }
        
        /**
         * DB query
         */
        function testCalemDbQuery(nodebug) {
        	   debug("<font style='color:purple;'>testCalemDbQuery</font>");
        		queryList=testCalemTableQuery(true);
        		var dbQuery=new CalemDbQuery();
        		dbQuery.add(queryList.queryDeleted);
        		dbQuery.add(queryList.queryUpdated);
        		var obj=dbQuery.getSoap();
        		debug("<b>CalemDbQuery: </b>"+obj.workorder.sql+" <br><br>"+obj.recycle_bin_budget.sql);
        		this.assertTrue(obj.workorder.sql.indexOf("workorder.*")!=-1
        		             && obj.workorder.sql.indexOf("project.project_no AS project_id__project_no")!=-1
        		             && obj.workorder.sql.indexOf("LEFT JOIN project ON workorder.project_id=project.id")!=-1
        		             && obj.workorder.countSql.indexOf("SELECT count(*) FROM workorder")!=-1);
        		this.assertTrue(obj.recycle_bin_budget.sql.indexOf("SELECT recycle_bin.rec_id FROM recycle_bin WHERE (recycle_bin.created_time >=")!=-1
        		                && !obj.recycle_bin_budget.countSql);        		                  		             
        }
        
        /**
         * Test query deserialization
         */
		  function testCalemDbQueryDeserialization(nodebug) {
		  	   debug("<font style='color:purple;'>testCalemDbQueryDeserialization</font>");
		  	   //Two format of table query
		  		queryList=testCalemTableQuery(true);
		  		debug("<font style='color:blue;'>done getting testCalemTableQuery</font>");
		  		var tblUq=queryList.queryUpdated;
		  		verifyJsonDeserialization("upd TableQuery", tblUq);
		  		var tblDq=queryList.queryDeleted;
		  		verifyJsonDeserialization("del TableQuery", tblDq);
		  		
		  		
		  		//Specialized updated and deleted
		  		var uq=new CalemQueryUpdated('workorder','workorder', '2006-10-17 12:30:45');
		  		verifyJsonDeserialization("QueryUpdated", uq);
		  		var dq=new CalemQueryDeleted('workorder','workorder', '2006-10-17 12:30:45');
		  		verifyJsonDeserialization("QueryDeleted", dq);
		  }  
		  
		  function verifyJsonDeserialization(text, srcQry) {
		  	   debug("<b>Verifying "+text+"</b>");
		  		var sql=srcQry.getSql();
		  		var json=srcQry.getJson();
		  		debug("<b>src "+text+" json</b>" + json);
		  		debug("<b>src "+text+" sql: </b>"+sql);
		  		
		  		var tblUqObj;
		  		eval("tblUqObj="+json);
		  		//Show the object tree
		  		var qry=CalemJson.setJson(tblUqObj);
		  		debug("<b> deserialized json: </b>"+qry.getJson());
		  		debug("<b> deserialized sql: </b>"+qry.getSql());
		  		this.assertTrue(qry.getSql() == sql && json == qry.getJson());
		  		debug("<b>"+text+" verified!</b>");
		  }       
        
        function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }
        function startTest() {
        		setUp();
        		debug("<font style='color:red'>testCalemDbExpr</font>");
        		testCalemDbExpr();
        		debug("<font style='color:red'>testCalemTableQuery</font>");
        		testCalemTableQuery();
        		debug("<font style='color:red'>testCalemUpdateQuery</font>");
        		testCalemUpdatedQuery();
        		debug("<font style='color:red'>testCalemDbQuery</font>");
        		testCalemDbQuery();
        		debug("<font style='color:red'>testCalemDbQueryDeserialization</font>");
        		testCalemDbQueryDeserialization();
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
