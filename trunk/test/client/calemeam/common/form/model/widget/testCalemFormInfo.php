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
            return ['testCalemFormInfo', 'testValidateCalemItemInfo'];
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
       
        function testCalemFormInfo() {
        	var fi={CalemFormInfo: {
					id: 'CalemBudgetTitleListForm',
					title: 'budget_list',
					icon: 'CalemBudget',
					controller: 'CalemBudgetTitleListForm',
					model: 'CalemBudgetTitle', 
					view: {CalemViewRefInfo: {id: 'CalemBudgetTitleListView'}}, //Optionally specifying impl class name
					replaceType: CalemItemDef.REPLACE_BY_ID
        		  }
				};
			var fmInfo=CalemJson.setJson(fi);
			debug("<b>testCalemFormInfo</b>");
			this.assertTrue(fmInfo.getId()=='CalemBudgetTitleListForm'
			               && fmInfo.getTitle() == 'budget_list'
			               && fmInfo.getIcon() == 'CalemBudget'
			               && fmInfo.getController() == 'CalemBudgetTitleListForm'
			               && fmInfo.getModel() == 'CalemBudgetTitle'
			               && fmInfo.getReplaceType()==CalemItemDef.REPLACE_BY_ID);
			var viewRef=fmInfo.getView();
			this.assertTrue(viewRef.getId() == 'CalemBudgetTitleListView' && viewRef.getImpl()==null);			               
			//Next verify json.
			var json=fmInfo.getJson();
			var temp;
			debug("json="+json);
			eval("temp="+json);
			
			info={
				CalemFormErrorInfo: {id: 'field_error'}
			};
			var ei=CalemJson.setJson(info);
			this.assertTrue(ei.getId()!=null);
			json=ei.getJson();
			debug("json="+json);
			eval("temp="+json);
			
			debug("<b>test CalemWoFormMdTab</b>");
			var info=CalemJson.setJson(CalemItemDef['CalemWoFormMdTab']);
			var itemMap=info.getItemMap();
			debug("itemMap="+itemMap.getJson());
        	debug("tab_main: "+info.getItem("tab_main")+", json="+info.getJson());
        	this.assertTrue(info.getItem("tab_main").getLabel() !=null);
        }
        
        function testValidateCalemItemInfo() {
        	  debug("<b> testValidateCalemItemInfo </b>");
        	  for (var i in CalemItemDef) {
        	  		validatItemInfo(i);
        	  }
        }
        
        function validatItemInfo(i) {
        	 var info=CalemItemDef[i];
        	 debug("<font style='color:green;'>validate CalemItemInfo: <b>"+i +", info="+info + "</b></font>");
        	 if (typeof(info)!='object') {
        	 	debug("none-object="+i+", validation aborted.");
        	 	return;
        	 } 
     
			 var fmInfo=CalemJson.setJson(info);
		    //To verify CalemFormInfo, CalemFormMdInfo and CalemFormMdTabInfo
		    if (fmInfo instanceof CalemFormInfo) {
		    	 this.assertTrue(fmInfo.getId()!=null
			               && fmInfo.getTitle() !=null
			               && fmInfo.getIcon() !=null
			               && fmInfo.getReplaceType()!=null);
		    }	else if (fmInfo instanceof CalemFormMdTabInfo) {
		    	 validateCalemFormMdTabInfo(fmInfo);
		    } else {
		    	 if (!fmInfo) {
		    	 		debug("<b>fmInfo is not valid from setJson - to ignore </b>");
		    	 		return;
		    	 } else {
			    	 debug("unknown fmInfo="+fmInfo+", to make it fail!");
			    	 assertTrue(1!=1);
		    	 }
		    }	
		    //Verify json validity
        	  var json=fmInfo.getJson();
        	  debug("<font style='color:green'>json=</font>"+json);
        	  eval('var dt='+json);
        }
		  
		  function validateCalemFormMdTabInfo(fmMdTabInfo) {
		  	  //Verify three portions of data
		  	  debug("verify layout: "+fmMdTabInfo.getId());
        	  var layout=fmMdTabInfo.getLayout();
        	  var tabList=layout.getTabList();
        	  debug("tabList length="+tabList.length);
        	  var tabMap=layout.getTabMap();
        	  debug("tabMap="+tabMap);
        	  for (var i in tabMap) {
        	  		debug(i+" = "+tabMap[i]);
        	  }
        	  this.assertTrue(tabList.length > 0);
        	  this.assertTrue(tabMap!=null);
        	  for (var i=0; i< tabList.length; i++) {
        	     if (CalemViewUtil.isCustomizeTab(tabList[i])) continue;
        	  	  var tabLayoutInfo=layout.getTabItem(tabList[i]);
        	  	  var tabLayout=tabLayoutInfo.getLayout();
        	  	  this.assertTrue(tabLayout instanceof Array);
        	  	  this.assertTrue(tabLayout.length > 0);
        	  	  debug("tabLayout for "+tabList[i]+" ="+tabLayout.length);
        	  }
        	  debug("verifying model of "+fmMdTabInfo.getId());
        	  var model=fmMdTabInfo.getModel();
        	  debug("master="+model.getMaster());
        	  this.assertTrue(model.getMaster()!=null);
        	  var items=model.getItems();
        	  debug("link count="+items.length);
        	  this.assertTrue(items.length> 0);
        	  
        	  debug("verifying itemMap of "+fmMdTabInfo.getId());
        	  var itemMapInfo=fmMdTabInfo.getItemMap();
        	  var itemMap=itemMapInfo._itemMap;
 			  var count=0;
        	  for (var i in itemMap) {
        	  		count++;
        	  		debug(i+"="+itemMap[i]);
        	  		this.assertTrue(itemMap[i]!=null);
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
        		testCalemFormInfo();
        		testValidateCalemItemInfo();
        }
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemFormInfo tests</h1>

<p>This page tests CalemFormInfo class.</p>
<div id=outputDiv></div>

</body>
</html>
