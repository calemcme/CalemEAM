<?php
   chdir('../../../../../../..');
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
    <title>CalemDb test</title>
    
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=CalemMsg"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Metadata"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Ajax"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Calem"></script>
    
    <link rel="stylesheet" type="text/css" href="<?php print $calemRootUrl ?>/test/client/jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/test/client/jsunit/app/jsUnitCore.js"></script>
    
    <script language="JavaScript" type="text/javascript">
        function exposeTestFunctionNames() {
            return ['testUserGroupView'];
        }
        
        var userGroupView={CalemViewCustomInfo: {id: 'CalemWoViewList', acl: {CalemViewAclInfo: {tbAcl: {CalemTbDataRefresh: 1,CalemTbPrintCustomize: 1,CalemTbCustomize: 1}, viewAcl: {}}}, layout: {CalemViewLayoutInfo: {tbLayout: ['CalemTbNew', 'CalemTbOpen', 'CalemTbDelete', 'sep', 'CalemTbPrint', 'sep2', 'CalemTbSearch', 'CalemTbSearchClear', 'sep3'], viewLayout: [{CalemTrInfo: {height: -2, cols: ['lb_caption']}}, {CalemTrInfo: {height: -2, cols: ['toolbar']}}, {CalemTrInfo: {height: -2, cols: ['grid']}}], gridLayout: {CalemListInfo: {noMaximize: true, colList: [{CalemCol: {id: 'wo_no', width: 143}}, {CalemCol: {id: 'asset_id', width: 162}}, {CalemCol: {id: 'status_id', width: 100}}, {CalemCol: {id: 'description', width: 318}}]}}}}}};
        var grpId='10001'; 
        var viewId='CalemWoViewList';
        var oobGv={CalemViewCustomInfo: {id: 'CalemWoViewList', acl: {CalemViewAclInfo: {tbAcl: {}, viewAcl: {}}}, layout: {CalemViewLayoutInfo: {tbLayout: ['CalemTbNew', 'CalemTbOpen', 'CalemTbDelete', 'CalemTbDataRefresh', 'sep', 'CalemTbPrint', 'CalemTbPrintCustomize', 'sep2', 'CalemTbSearch', 'CalemTbSearchClear', 'sep3', 'CalemTbCustomize'], viewLayout: [{CalemTrInfo: {height: -2, cols: ['lb_caption']}}, {CalemTrInfo: {height: -2, cols: ['toolbar']}}, {CalemTrInfo: {height: -2, cols: ['grid']}}], gridLayout: {CalemListInfo: {noMaximize: true, colList: [{CalemCol: {id: 'wo_no', width: 143}}, {CalemCol: {id: 'asset_id', width: 162}}, {CalemCol: {id: 'status_id', width: 100}}, {CalemCol: {id: 'description', width: 318}}, {CalemCol: {id: 'sched_start_time', width: 160}}]}}}}}};
        
        var reg;
        function setUp() {
        	   CalemDebug.initDebug(location);
        		var cc=CalemContext.getInstance();
				cc.init(); //Initialize context.
   			//Init registry
   			var regMgr=CalemConf.registry_manager;
   			reg=eval(["new ", regMgr.impl, "()"].join(""));
   			reg.initForTest(regMgr.names)
   			cc.setRegistry(reg);        	
        } 
        
        function initCustomInfo() {
        	   var ui="{sid: '10002345', gid: '10001', uid: 'test_uid', uname: 'test', full_name: 'test Test', admin_type_id: '', locale: '', team_id: ''}";
			   AjxCookie.setCookie(document, 'CALEM_SID', Base64.encode(ui));
			   CalemContext.getInstance().init(); //Initialize context.
				
        	   //Verify user info is correct
        	   var ui=CalemContext.getInstance().getUserInfo();
        	   debug("uid="+ui.uid+", gid="+ui.gid);
        	   this.assertTrue(ui.uid=='test_uid');
        	   this.assertTrue(ui.gid=='10001');
						   
				var acl_groups={data: [['CUSTOM_SYSTEM', 'My system', '', 'test it', '', '','','']], 
					               parentMap: {CUSTOM_SYSTEM: ['CALEM_OOB'],
			        	            10001: ['CUSTOM_SYSTEM', 'CALEM_OOB']}};
			   CalemData['acl_group']=acl_groups;
			   var cachedGroups=new CalemCachedGroups(reg.getCache());
			   
			   //Verify parent groups are set up properly.
			   var cachedGroups=CalemContext.getInstance().getRegistry().getCache().get('acl_group');
				var parents=cachedGroups.findParents(grpId);
				this.assertTrue(parents.length==2);
				this.assertTrue(parents[0]=='CUSTOM_SYSTEM' && parents[1]=='CALEM_OOB');
			} 
        
        function testUserGroupView() {
        	 debug("<b>testUserGroupView</b>");
        	 initCustomInfo();
        	 
        	 //Test has users group set already.
        	 var vm=CalemCustomViewManager.getInstance();
        	 var gt=new CalemDesignTargetInfo(CalemDesignTargetInfo.GROUP, grpId, grpId);
        	 var ci=CalemJson.setJson(userGroupView);
        	 vm.addCustomInfo(ci, gt);
        	 //Let's ensure that the info is set properly
        	 var ci=CalemViewCustomDef[viewId+'_'+grpId];
        	 debug("customInfo="+ci);
        	 var vci=CalemJson.setJson(ci);
        	 this.assertTrue(vci.getId()==viewId);
        	 
        	 //Add oob
        	 var oobGt=new CalemDesignTargetInfo(CalemDesignTargetInfo.GROUP, 'CALEM_OOB', 'CALEM_OOB');
        	 var ci=CalemJson.setJson(oobGv);
        	 vm.addCustomInfo(ci, oobGt);
        	 
        	 var ci=CalemViewCustomDef[viewId+'_'+'CALEM_OOB'];
        	 debug("oob="+ci);
        	 var vci=CalemJson.setJson(ci);
        	 this.assertTrue(vci.getId()==viewId);
 			
 			 //First get oob to verify it's right
 			 var oobCi=vm.getFullCustomInfo(viewId, oobGt);
 			 //debug('oobCi='+ oobCi.getJson());
 			 var acl=oobCi.getAcl();
 			 var tbAcl=acl.getTbAcl()._acl;
 			 var sum=0;
 			 for (var i in tbAcl) {
 			 	sum++;
 			 }
 			 this.assertTrue(sum==0);
 			 var vAcl=acl.getViewAcl()._acl;
 			 sum=0;
 			 for (var i in vAcl) sum++;
 			 this.assertTrue(sum==0);
 			 
 			 //Now get the result and find out what's going on
        	 var gci=vm.getFullCustomInfo(viewId, gt);
        	 debug('gci='+ gci.getJson());
        	 var acl=gci.getAcl();
 			 var tbAcl=acl.getTbAcl()._acl;
 			 var sum=0;
 			 for (var i in tbAcl) {
 			 	sum++;
 			 }
 			 this.assertTrue(sum==3);
 			 var vAcl=acl.getViewAcl()._acl;
 			 sum=0;
 			 for (var i in vAcl) sum++;
 			 this.assertTrue(sum==0);
        }
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        function startTest() {
        		setUp();
        		testUserGroupView();
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
