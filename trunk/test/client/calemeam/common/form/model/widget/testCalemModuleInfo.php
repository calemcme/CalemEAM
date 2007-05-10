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
            return ['testCalemBudgetModuleInfo', 'testCalemButtonInfo', 'testCalemToolBarInfo']; //, 'testCalemModuleInfo'];
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
        
        function testCalemBudgetModuleInfo() {
        		debug("<b>testCalemBudgetModuleInfo</b>");
        		var mBud=CalemModuleDef["modCalemBudget"];
        		modInfo = CalemJson.setJson(mBud);
        		this.assertTrue(modInfo.getId() == 'modCalemBudget');
        		debug("icon: "+modInfo.getIcon()+", defaultMenu="+modInfo.getDefaultMenu());
        		this.assertTrue(modInfo.getIcon()=='CalemBudget');
        		this.assertTrue(modInfo.getDefaultMenu()=='CalemBudgetTitleFormList');	
        		this.assertTrue(modInfo instanceof CalemModuleInfo);
        		
        		validateModuleInfo("modCalemBudget");
        }
        
        function testCalemModuleInfo() {
        	  debug("<b> testCalemModuleInfo </b>");
        	  for (var i in CalemModuleDef) {
        	  		validateModuleInfo(i);
        	  }
        }
        
        function validateModuleInfo(i) {
        	   debug("<font style='color:green;'>validate module=<b>"+i+"</b></font>");
        		var mBud=CalemModuleDef[i];
        		modInfo = CalemJson.setJson(mBud);
           		this.assertTrue(modInfo.getId() !=null);
        		debug("icon: "+modInfo.getIcon()+", defaultMenu="+modInfo.getDefaultMenu());
        		this.assertTrue(modInfo instanceof CalemModuleInfo);
        		//Verify toolBarInfo
        		var tbInfo=modInfo.getToolBar();
        		this.assertTrue(tbInfo.getClassName() == 'CalemToolBarInfo');
        		var list=tbInfo.getList();
        		var size=0;
        		for (var i=0; i< list.length; i++) {
        			var menu=list[i];
        			if (menu instanceof CalemSeparator) {
        				debug(i+"=separator");
        			} else if (menu instanceof CalemLabelInfo) {
        				debug(i+"=label: "+menu.getId());
        				this.assertTrue(menu.getId()!=null);
        			} else if (menu instanceof CalemMenuInfo) {
        				var menuButton=menu.getMenuButton();
        				var menuList=menu.getMenuList();
        				debug("menuButton="+menuButton.getDef().id+", class="+menuButton._getClassName());
        				if (menuList) {
        					debug("menuList="+menuList.length);
        					size=Math.max(menuList.length, size);
        					this.assertTrue(size>0);
        				}
        			} else if (menu instanceof CalemMenuItemInfo) {
        				debug(i+" menuItem="+menu);
        		   } else {
        		      debug("unknown item: "+menu);
        		      assertTrue(1==2); 
        		   }
        		}
        		//Taking a look at json
        		var json=modInfo.getJson();
        		debug("<b>json=</b>"+json);
        		//Make sure we can convert it to an object
        		var obj;
        		eval("obj="+json);
        		debug("eval is good!, obj="+obj);
        }
        
        function testCalemButtonInfo() {
        	 debug("<b>testCalemButtonInfo</b>");
        	 var bi={ CalemButtonInfo: {
						  id: 'CalemTbNew',
						  customInfo: {
						  	CalemMenuCustomInfo: {
						  	  enabled: false,
						  	  events: [
						  	    {CalemEventInfo: {id: CalemEvent.SINGLE_SELECTION, func: 'enableIt'}},
						  	    {CalemEventInfo: {id: CalemEvent.MULTI_SELECTION, func: 'enableIt'}},
						  	    {CalemEventInfo: {id: CalemEvent.NO_SELECTION, func: 'disableIt'}}
						  	  ]
						  	}
						  }  
					  }		
					};
			 var btnInfo=CalemJson.setJson(bi);	
			 //Let's verify it a bit.
			 this.assertTrue(btnInfo.getId() == 'CalemTbNew');
			 this.assertTrue(btnInfo.getDef()!=null);
			 this.assertTrue(btnInfo.getCustomInfo()!=null);
			 debug("def enabled: "+btnInfo.getDef().enabled+", custom enabled: "+btnInfo.getCustomInfo().getEnabled());
			 this.assertTrue(btnInfo.getDef().enabled==true);
			 this.assertTrue(btnInfo.getCustomInfo().getEnabled()==false);
			 this.assertTrue(btnInfo.getEnabled() == false);
			 	
			 //Test Def a bit:
			 var def=btnInfo.getDef();
			 debug("icon="+def.icon);
			 this.assertTrue(def.icon=="CalemNew");	
			 //Verify customInfo.
			 var ci=btnInfo.getCustomInfo();	
			 //Select
			 debug("customInfo.listenerName="+ci.getListenerName()+", btnInfo listenerName="+btnInfo.getListenerName());
			 this.assertTrue(ci.getListenerName()==null && btnInfo.getListenerName()=='NewListener');
			 //Try events
			 this.assertTrue(ci.getEventList().length==3);
			 
			 //Get json
			 var json=btnInfo.getJson();
			 debug("<b>json=</b>"+json);
			 var jo;
			 eval("jo="+json);
        	
        }
        
        function testCalemToolBarInfo() {
        		var tbInfo={CalemToolBarInfo: {
        			layout: ['CalemLogout', 'CalemHelp'],
					list: [
						{CalemButtonInfo: {id: 'CalemLogout'}},	
						{CalemButtonInfo: {id: 'CalemHelp'}}]
				}};
				var tb=CalemJson.setJson(tbInfo);
				debug("tb type"+tb.getClassName()+", size="+tb.getList().length);
				this.assertTrue(tb.getList().length==2);        		
        }
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        function startTest() {
        		setUp();
        		testCalemBudgetModuleInfo();
        		testCalemButtonInfo();
        		testCalemToolBarInfo();
        		testCalemModuleInfo();
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
