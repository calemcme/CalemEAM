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
            return ['testCalemDataGridInfo'];
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
       
        function testCalemDataGridInfo() {
        	 var gi={CalemDataGridInfo: {
				type: 'CalemDataGrid',
				model: {CalemModelInfo: {table: 'budget_title'}},
				listInfo: {
			  	   CalemListInfo: {
			  			noMaximize: true,
			  			colList: [
			  			   {CalemCol: {id: 'title', width: 100}},
			  			   {CalemCol: {id: 'start_date', width: 90}},
			  			   {CalemCol: {id: 'end_date', width: 90}},
			  			   {CalemCol: {id: 'note', width: 150}},
			  			   {CalemCol: {id: 'modified_id', width: 120}},
			  			   {CalemCol: {id: 'modified_time', width: 150}}
			  			]	 
			  		} 		
		      }}};

			 var gridInfo=CalemJson.setJson(gi);	
			 this.assertTrue(gridInfo.getClassName() == 'CalemDataGridInfo');
			 this.assertTrue(gridInfo.getListInfo()!=null);
			 var listInfo=gridInfo.getListInfo();
			 this.assertTrue(listInfo.getNoMaximize()==true);
			 this.assertTrue(listInfo.getColList() != null);
        	 var cl=listInfo.getColList();
        	 for (var i=0; i< cl.length; i++) {
        	 	var col=cl[i];
        	 	debug("id="+col.getId()+", width="+col.getWidth());
        	 }
        	 //Test json
        	 var json=gridInfo.getJson();
        	 debug("<b>grid json=</b>"+json);
        	 var jo;
        	 eval("jo="+json);
        }
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        function startTest() {
        		setUp();
        		testCalemDataGridInfo();
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

<p>This page tests CalemButtonInfo class.</p>
<div id=outputDiv></div>

</body>
</html>
