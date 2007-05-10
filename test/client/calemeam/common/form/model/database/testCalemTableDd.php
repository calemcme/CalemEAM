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
    <title>CalemTableDd test</title>
    
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=CalemMsg"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Metadata"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Ajax"></script>
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/client/jsPkg.php?loadmode=aggr&js=Calem"></script>
    
    <link rel="stylesheet" type="text/css" href="<?php print $calemRootUrl ?>/test/client/jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/test/client/jsunit/app/jsUnitCore.js"></script>
    
    <script language="JavaScript" type="text/javascript">
        function exposeTestFunctionNames() {
            return ['testCalemTableDd', 'testCalemTableDdRecord', 'testCalemTableDdQueries', 
                    'testCalemCustomDd', 'testLookupMd', 'testFieldListForQuery'];
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
        
        function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }

        function testCalemTableDd() {
        	   debug("<b>testCalemTableDd</b>");
            var ctxt=CalemContext.getInstance();
            var reg=ctxt.getRegistry();
            var woDd=reg.getTableDd('workorder');
            //lookup field.
            var tableDd=woDd.getLookupTableDd('pm_id');
            assert(tableDd.getTableName() == 'pm');
            tableDd=woDd.getLookupTableDd('modified_time');
            assert(!tableDd);
            assertEquals(woDd.getTableName(), 'workorder');
            
				//Join field
				assert(woDd.isJoinField('pm_id'));
				assert(!woDd.isJoinField('modified_time'));
				assert(!woDd.isJoinField('priority_id'));
				
				//dropdown field
				assert(woDd.isDropdownField('priority_id')); //true
				assert(!woDd.isDropdownField('pm_id')); //false
				assert(!woDd.isDropdownField('modified_time')); //false
				
				//Memory cached field
				assert(woDd.isMemoryCachedField('pm_id'));
				assert(!woDd.isMemoryCachedField('priority_id'));
				assert(!woDd.isMemoryCachedField('modified_time')); //false

				//LookupMapping
				lkupMap=woDd.getLookupMapping();
				assert(lkupMap['primary']=='wo_no');
				//LookupInfo test
				lkupInfo=woDd.getJoin('project_id');
				assertTrue(lkupInfo['table']=='project'
							&& lkupInfo['field']=='id'
							&& lkupInfo['lkupField']=='project_no');

				//Field label tests
				debug("test field label");
				var woDocDd=reg.getTableDd('wo_doc');
				debug("woDocDd="+woDocDd);
				debug("woDocDd's doc_id label="+woDocDd.getFieldLabel('doc_id'));
				assertTrue(woDocDd.getFieldLabel("doc_id")==CalemMsg.getMsg('document'));
				var contractorDd=reg.getTableDd('contractor');
				debug("contractorDd="+contractorDd);
				var label=contractorDd.getFieldLabel('contractor');
				debug("contractor label ="+label);
				assertTrue(label=='Contractor');
				//@todo to add later for contractor.
				var userDd=reg.getTableDd('users');
				var label=userDd.getFieldLabel('acl_group_id');
				debug("label for acl_group_id is: "+label);
				assertTrue(label=='Group');
				var label=userDd.getFieldLabel('contractor_id');
				debug("<font style='color:purple'>label for users.contractor_id="+label+"</font>");
				assertTrue(label=='Contractor');
				
				assertTrue(woDd.getFieldLabel('id')=='Id');
				assertTrue(woDd.getFieldLabel('wo_no')==CalemMsg.getMsg('wo_no'));
				assertTrue(woDd.getFieldLabel('priority_id')==CalemMsg.getMsg('wo_priority'));
				debug('label of workorder.pm_id='+woDd.getFieldLabel('pm_id'));
				assertTrue(woDd.getFieldLabel('pm_id')==CalemMsg.getMsg("pm_no"));
				
				debug("test label for asset");
				var assetDd=reg.getTableDd('asset');
				debug("asset vendor id label: "+assetDd.getFieldLabel('vendor_id'));
				this.assertTrue(assetDd.getFieldLabel('vendor_id') == CalemMsg.getMsg('vendor'));
            debug("asset manufacturer id label: "+assetDd.getFieldLabel('manufacturer_id'));
				this.assertTrue(assetDd.getFieldLabel('manufacturer_id') == CalemMsg.getMsg('manufacturer'));
            				
				//Field list's order is important
				var fieldList=woDd.getFields();
				var ar=['id', 'wo_no', 'description', 'asset_id', 'pm_id'];
				var fldAr=new Array();
				var idx=0;
				for (var i in fieldList) {
					fldAr[idx++]=i;
					//debug(idx+" = "+i);
				}
				for (var i=0; i< ar.length; i++) {
				   debug("ar "+i+"="+ar[i]+", fldAr "+i+"="+fldAr[i]);
					assertTrue(ar[i]==fldAr[i]);
				}
				
				//Test Sys field
				assertTrue(woDd.isSysField('id'));
				assertTrue(!woDd.isSysField('wo_no'));
				assertTrue(!woDd.isSysField('pm_id'));
				
				//Id field
				debug("testIdField");
				assertTrue(woDd.getIdFieldName() == 'id');
				
				//ShortName
				debug("testShortName");
				assertTrue(woDd.getShortName('pm_id')=='pm_id');
				assertTrue(woDd.getShortName('wo_no')=='wo_no');
				
				//Join field
				debug("testJoinField");
				assertTrue(woDd.getJoinFieldName('pm_id')=='pm_id__pm_no');
				
				//Field type test
				debug("testFieldType");
				assertTrue(woDd.isDateTimeField('modified_time'));
				assertFalse(woDd.isDateField('modified_time'));
				
				assertTrue(woDd.isSysCurrencyField('total_cost'));
		
				//cache tables test
				debug("testCacheParentTableDds");
				var tbls=woDd.getCachedParentTableDds();
				var foundPm=false;
				debug("<b>workorder parent tables</b>");
				for (var i=0; i< tbls.length; i++) {
					if (tbls[i].getTableName()=='pm') foundPm=true;
					//debug(i+" = "+tbls[i].getTableName());
				}
				this.assertTrue(foundPm);
				var wpDd=reg.getTableDd('wo_priority');
				tbls=wpDd.getCachedParentTableDds();
				this.assertTrue(tbls.length==0); //no users field anymore.
				
				//Test required field
				debug("wo_no is required="+woDd.isRequired('wo_no'));
				this.assertTrue(woDd.isRequired('wo_no')==true);
				this.assertTrue(woDd.isRequired('modified_id')==false);
			
			   //Test normalized types
			   debug("Test normalized types");
			   this.assertTrue(woDd.getNormalizedType('priority_id')=='dropdown_join');
			   this.assertTrue(woDd.getNormalizedType("project_id")=='join');
			   this.assertTrue(woDd.getNormalizedType("total_cost")=='sys_currency');
			   this.assertTrue(woDd.getNormalizedType("wo_no")=='varchar');
			   this.assertTrue(woDd.getNormalizedType("description")=='text');
			   
			   btDd=reg.getTableDd('budget_title');
			   debug("budget_title note type="+btDd.getNormalizedType('note'));
			   this.assertTrue(btDd.getNormalizedType('note')=='varchar');
			   
			   //Test password type
			   var userDd=reg.getTableDd('users');
			   debug("user password type="+userDd.getNormalizedType('password'));
			   assertTrue(userDd.getNormalizedType('password')=='password');
			   //Test display type for password
			   var len=userDd.getTextEditDisplayLength('password');
			   debug("password display length="+userDd.getTextEditDisplayLength('password'));
			   var conf=CalemConf['view_record_size']['edit_varchar_display_max']['password'];
			   assertTrue(conf>0 && conf==userDd.getTextEditDisplayLength('password'));			   
        }
        
        function testCalemTableDdRecord() {
           debug("<b>testCalemTableDdRecord</b>");
           var ctxt=CalemContext.getInstance();
           var reg=ctxt.getRegistry();
           var bd=reg.getTableDd('budget');
        	  var recDefault=bd.getDefaultRecord();
        	  var recList=new CalemRecordList(bd.getTableName());
			  var rec=new CalemRecord(recList, recDefault.fldList, recDefault.recDefault);
			  this.assertTrue(rec.id==null);
			  debug("budgetField="+rec.getField('budget'));
			  this.assertTrue(rec.getField('budget').getValue()==null);
			  this.assertTrue(recDefault.fldList.length > 0);
			  var passed=false;
			  for (var i=0; i< recDefault.fldList.length; i++) {
			  	  if (recDefault.fldList[i]=='budget') passed=true;
			  }
			  this.assertTrue(passed);
        }
        
        /**
         * test queries of TableDd
         */
        function testCalemTableDdQueries() {
        	  debug("<b>testCalemTableQueries</b>");
        	  var ctxt=CalemContext.getInstance();
           var reg=ctxt.getRegistry();
           var bd=reg.getTableDd('budget');
           //GetAllQuery
           var qry=bd.buildGetAllQuery();
           debug(qry.getSql());
           this.assertTrue(qry.getSql().indexOf('budget.*')!==false);
           //GetOneQuery
           qry=bd.buildGetOneQuery();
           debug(qry.getSql());
           this.assertTrue(qry.getSql().indexOf('budget.id')!==false &&
                           qry.getSql().indexOf('?')!==false);
        }
        
        //test custom dd
        function testCalemCustomDd() {
        	  debug("testCalemCustomDd");
        	  var ctxt=CalemContext.getInstance();
           var reg=ctxt.getRegistry();
           var bd=reg.getTableDd('budget');
           bd._addCustomField('testme', {type: 'varchar', length: 50});
           var customFields=bd.getCustomFields();
           for (var i in customFields) {
           	 debug("custom field: " + i);
           }
           
           assertTrue(customFields['testme']!=null);
           debug(customFields['testme']);
           assertTrue(bd.isField('testme')!=null);
           debug(bd.isField('testme'));
           assertTrue(!bd.isField('testme_testme'));
           debug(bd.isField('testme_testme'));
           
           //delete custom fields
           bd._deleteCustomField('testme');
           var customFields=bd.getCustomFields();
           if (customFields) {
           		for (var i in customFields) {
           			debug("custom field: "+i);	
           		}
           }
           assertTrue(!bd.isField('testme'));
        }
        
        function testLookupMd() {
        	  var ctxt=CalemContext.getInstance();
           var reg=ctxt.getRegistry();
           var wopDd=reg.getTableDd('wo_part');
           debug("wopDd="+wopDd.getTableName());
           debug("wo_id: "+wopDd.isLookupMd('wo_id'));
           debug("in_id: "+wopDd.isLookupMd('in_id'));
           assertTrue(wopDd.isLookupMd('wo_id'));
           assertTrue(!wopDd.isLookupMd('in_id'));
        }

		  function testFieldListForQuery() {
		  	  debug("<b>testFieldListForQuery</b>");
        	  var ctxt=CalemContext.getInstance();
           var reg=ctxt.getRegistry();
           var woDd=reg.getTableDd('workorder');
           var arList=woDd.getFieldListForQuery();
           debug("arList="+arList+", length="+arList.length);
           debug("arList length="+arList.length+", fieldList="+woDd.getFieldList().length);
           var arVerified=[];
           for (var i=0; i< arList.length; i++) {
           	 debug(i+" = "+arList[i]);
           	 if (arList[i]=='parent_wo_id__wo_no') arVerified.push(true);
           	 else if (arList[i]=='rework_wo_id__wo_no') arVerified.push(true);
           	 else if (arList[i]=='duplicate_wo_id__wo_no') arVerified.push(true);
           	 else if (arList[i]=='rcm_action_id__action') arVerified.push(true);
           };
           assertTrue(woDd.getFieldList().length == arList.length - arVerified.length);
        }
        
        function startTest() {
        		setUp();
        		testCalemTableDd();
        		testCalemTableDdRecord();
        		testCalemTableDdQueries();
        		testCalemCustomDd();
        		testLookupMd();
        		testFieldListForQuery();
        		/*
        		var o=new Object();
        		var key="Hello"+Math.random();
        		var key2="Hello"+Math.random();
        		o[key]='aa';
        		o[key2]='bb';
        		alert('key='+o[key]+", key2="+o[key2]+", typeof key="+typeof(key)+", key="+key+", key2="+key2);
        		*/
        }
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemTableDd tests</h1>

<p>This page tests CalemTableDd class.</p>

<div id=outputDiv></div>
</body>
</html>
