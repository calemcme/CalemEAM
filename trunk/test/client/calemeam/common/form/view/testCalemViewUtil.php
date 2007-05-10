<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<?php
   chdir('../../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
	
	//Prepare custom info - CALEM_OOB, CUSTOM_SYSTEM, group and user - only in pkg format
   $custPath=_CALEM_DIR_ . 'custom/';
   $gid = 'admin_on_install';
	$uid = 'calem';
	$loadmode='aggr';
?>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>CalemDb test</title>
    
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=CalemMsg"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Metadata"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Ajax"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Calem"></script>
<?php
    //Include custom views - must log in to do this.
	 // require _CALEM_DIR_ . 'client/launchpad/CalemJsCustomResource.php';
?>	
    <link rel="stylesheet" type="text/css" href="<?php print $calemRootUrl ?>/test/client/jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/test/client/jsunit/app/jsUnitCore.js"></script>
    
    <script language="JavaScript" type="text/javascript">
        function exposeTestFunctionNames() {
            return ['testCalemCustomViewInfo'];
        }
        
        function setUp() {
        	   CalemDebug.initDebug(location);
        		var cc=CalemContext.getInstance();
   			//Init registry
   			var regMgr=CalemConf.registry_manager;
   			reg=eval(["new ", regMgr.impl, "()"].join(""));
   			cc.setRegistry(reg);
   			reg.initForTest(regMgr.names)
   			        	
        }

        function testCalemCustomViewInfo() {
        	  //Init groups
        	  var acl_groups={data: [['CALEM_SYSTEM', 'My system', '', 'test it', '', '','','']], parentMap: {CALEM_SYSTEM: ['CALEM_OOB'],
        	            admin_on_install: ['CALEM_SYSTEM', 'CALEM_OOB']}};
        	  CalemData['acl_group']=acl_groups;
        	  var cache=reg.getCache();
        	  var cachedGroups=new CalemCachedGroups(cache);
        	  cache.put(cachedGroups);
			  debug("<b>testCalemCustomViewInfo</b>");
			  //Use a local copy for unit test.	
			  CalemViewCustomDef['CalemUserViewEdit_CALEM_OOB']= {CalemViewCustomInfo: {id: 'CalemUserViewEdit', acl: {CalemViewAclInfo: {tbAcl: {CalemTbDelete: 1}, viewAcl: {flb_id: 1,id: 1,flb_modified_time: 1,modified_time: 1,flb_modified_id: 1,modified_id: 1,flb_created_time: 1,created_time: 1,flb_created_id: 1,created_id: 1}}}, layout: {CalemViewLayoutInfo: {tbLayout: ['CalemTbSave', 'CalemTbCancel', 'sep', 'CalemTbCustomize'], viewLayout: [{CalemTrInfo: {height: -2, cols: ['lb_caption', 'CalemColDesign', 'CalemColDesign', 'CalemColDesign']}}, {CalemTrInfo: {height: -2, cols: ['toolbar']}}, {CalemTrInfo: {height: -2, cols: ['err']}}, {CalemTrInfo: {height: -2, cols: ['flb_username', 'username', 'flb_full_name', 'full_name']}}, {CalemTrInfo: {height: -2, cols: ['flb_password', 'password', 'CalemColDesign', 'CalemColDesign']}}, {CalemTrInfo: {height: -2, cols: ['flb_status_id', 'status_id', 'flb_note', 'note']}}, {CalemTrInfo: {height: -2, cols: ['flb_user_type_id', 'user_type_id', 'flb_emp_no', 'emp_no']}}, {CalemTrInfo: {height: -2, cols: ['CalemColDesign', 'CalemColDesign', 'flb_contractor_id', 'contractor_id']}}, {CalemTrInfo: {height: -2, cols: ['lb_access_rights', 'CalemColDesign', 'CalemColDesign', 'CalemColDesign']}}, {CalemTrInfo: {height: -2, cols: ['flb_login_allowed', 'login_allowed', 'flb_admin_type_id', 'admin_type_id']}}, {CalemTrInfo: {height: -2, cols: ['flb_acl_group_id', 'acl_group_id', 'CalemColDesign', 'CalemColDesign']}}, {CalemTrInfo: {height: -2, cols: ['lb_job', 'CalemColDesign', 'CalemColDesign', 'CalemColDesign']}}, {CalemTrInfo: {height: -2, cols: ['flb_job_title', 'job_title', 'flb_supervisor_id', 'supervisor_id']}}, {CalemTrInfo: {height: -2, cols: ['flb_craft_id', 'craft_id', 'flb_job_role_id', 'job_role_id']}}, {CalemTrInfo: {height: -2, cols: ['flb_team_id', 'team_id', 'flb_dept_id', 'dept_id']}}, {CalemTrInfo: {height: -2, cols: ['lb_communication', 'CalemColDesign', 'CalemColDesign', 'CalemColDesign']}}, {CalemTrInfo: {height: -2, cols: ['flb_phone_work', 'phone_work', 'flb_phone_mobile', 'phone_mobile']}}, {CalemTrInfo: {height: -2, cols: ['flb_email_work', 'email_work', 'flb_email_other', 'email_other']}}, {CalemTrInfo: {height: -2, cols: ['flb_phone_home', 'phone_home', 'flb_fax', 'fax']}}, {CalemTrInfo: {height: -2, cols: ['flb_im1_type_id', 'im1_type_id', 'flb_im1_id', 'im1_id']}}, {CalemTrInfo: {height: -2, cols: ['flb_im2_type_id', 'im2_type_id', 'flb_im2_id', 'im2_id']}}, {CalemTrInfo: {height: -2, cols: ['lb_address', 'CalemColDesign', 'CalemColDesign', 'CalemColDesign']}}, {CalemTrInfo: {height: -2, cols: ['flb_company', 'company', 'CalemColDesign', 'CalemColDesign']}}, {CalemTrInfo: {height: -2, cols: ['flb_street1', 'street1', 'flb_city', 'city']}}, {CalemTrInfo: {height: -2, cols: ['flb_street2', 'street2', 'flb_state', 'state']}}, {CalemTrInfo: {height: -2, cols: ['flb_zip', 'zip', 'flb_country', 'country']}}, {CalemTrInfo: {height: -2, cols: ['lb_purchase', 'CalemColDesign', 'CalemColDesign', 'CalemColDesign']}}, {CalemTrInfo: {height: -2, cols: ['flb_req_approval_id', 'req_approval_id', 'flb_po_approval_id', 'po_approval_id']}}]}}}};
			 	  
			  var viewInfo=CalemCustomViewManager.getInstance()._getCustomInfo('CalemUserViewEdit', 'calem');
			  debug("CalemUserViewEdit for calem="+viewInfo);
			  assertTrue(viewInfo!=null);
			  var viewInfo=CalemCustomViewManager.getInstance()._getCustomInfo('CalemUserViewEdit','calem', 'CALEM_OOB');
			  debug("CalemUserViewEdit for CALEM_OOB="+viewInfo);
			  assertTrue(viewInfo!=null);
			  
			  debug("<b> case 1 - get customInfo for display</b>"); 
			  var customInfo=CalemCustomViewManager.getInstance()._getCustomInfo('CalemUserViewEdit', 'calem', 'admin_on_install', false, false, false);
			  assertTrue(customInfo.getLayout()!=null); 
			  
			  debug("<b> case 2 - get customInfo for design</b>"); 
			  var customInfo=CalemCustomViewManager.getInstance()._getCustomInfo('CalemUserViewEdit', 'calem', 'admin_on_install', true, false, true);
			  assertTrue(customInfo.getLayout()!=null);
			  
			  debug("<b> case 3 - get my customInfo</b>"); 
			  var customInfo=CalemCustomViewManager.getInstance()._getCustomInfo('CalemUserViewEdit', 'calem', 'admin_on_install', false, false, true);
			  assertTrue(customInfo.getLayout()!=null);  
			  
			  debug("<b> case 4 - get parent customInfo</b>"); 
			  var customInfo=CalemCustomViewManager.getInstance()._getCustomInfo('CalemUserViewEdit', 'calem', 'admin_on_install', true, true, true);
			  assertTrue(customInfo.getLayout()!=null);                   
        }
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        function startTest() {
        		setUp();
        		testCalemCustomViewInfo();
        }
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        var reg;
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
