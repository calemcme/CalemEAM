<?php
   chdir('../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
	
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
            return ['testAssetPartRecord'];
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
         * Test asset part:
         * a) add an inventory record to cache
         * b) add an asset record to cache
         * c) add an asset part record and fetch it.
         */
        function testAssetPartRecord() {
        	  //To delay a while before starting
        	  debug("<b>testAssetPartRecord - verify result </b>");
        	  
        	  var ctxt=CalemContext.getInstance();
           var reg=ctxt.getRegistry();
           //constants
           var assetNo='100-2301';
           var inNo='PUMP-1002';
           var qty=2301;
           //set up asset
           var assetDd=reg.getTableDd('asset');
           addItem(reg, 'asset', {id: '101', asset_no: assetNo});
           addItem(reg, 'inventory', {id: '101', in_no: inNo});
           addItem(reg, 'asset_part', {id: '101', asset_id: '101', in_id: '101', qty: qty});
           //Now let's get asset part and find the record
           var cache=reg.getCache();
           var cachedAssetPart=cache.get('asset_part');
           var recList=cachedAssetPart.getRecordList();
           debug("asset_part cache size: "+recList.getTotal());
           this.assertTrue(recList.getTotal()==1);
           //Now verify the content of the record
           var rec=recList.getRecord(0);
           debug("asset_id="+rec.getField('asset_id').getValue());
           debug("in_id="+rec.getField('in_id').getValue());
           debug("qty="+rec.getField('qty').getValue());
           this.assertTrue(rec.getField('asset_id').getValue()==assetNo);
           this.assertTrue(rec.getField('in_id').getValue()==inNo);
           this.assertTrue(rec.getField('qty').getRawValue() == qty);
        }
        
        //Adding to cache a record list with only one rec.
        function addItem(reg, tblId, rec) {
        	  var tblDd=reg.getTableDd(tblId);
        	  var fldList=tblDd.getFieldListForQuery();
        	  var ar=[];
        	  for (var i=0; i< fldList.length; i++) {
        	  	  if (rec[fldList[i]]) {
        	  	     ar.push(rec[fldList[i]]);
        	  	  } else {
        	  	     ar.push(null);
        	  	  }
        	  }
        	  var arVal=[ar];
        	  var cache=reg.getCache();
	        new CalemLocalCachedItem(cache, tblId, arVal, fldList);
        }
        
        //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>"+div.innerHTML;
        } 
        
        function startTest() {
        		setUp();
        		testAssetPartRecord();
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
