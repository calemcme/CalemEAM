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
            return ['testNewViewInfo', 'validateOneView', 'testCalemViewInfo'];
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
       
        function testCalemViewInfo() {
            testCalemViewInfoA2F();
        	//debug("<b>testCalemViewInfo in 3 sec.</b>");
        	//setTimeout("testCalemViewInfoAll()", 3000);
        }
        
        function testCalemViewInfoA2F() {
        	  debug("<b>testCalemViewInfo start...</b>");
        	  for (var i in CalemViewDef) {
                    var st=i.substr('Calem'.length, 1).toLowerCase();
                    if (st>='a' && st <='f') {
                        validateViewInfo(i);
                    }   
        	  }
        }
        
        //spot-check a view
        function validateOneView() {
        	 debug("<b>validate oneView: assetListView</b>");
        	 validateViewInfo('CalemAssetViewList');
        }
        
        
        function validateViewInfo(id) {
        	 debug("<font style='color:green'>validate view=<b>"+id+"</b></font>");
        	 var vd=CalemViewDef[id];
        	 var vi=CalemJson.setJson(vd);
        	 if (!(vi instanceof CalemViewInfo)) {
        	 		debug("None CalemViewInfo: "+vi);
        	 		return;
        	 }

        	 this.assertTrue(vi.getId() == id);
        	 this.assertTrue(vi.getClassName() == 'CalemViewInfo');
        	 //Figure out the layout info
        	 this.assertTrue(vi.getLayout() !=null);
        	 var layout=vi.getLayout();
        	 var tableLayout=layout.getTableLayout();
        	 if (tableLayout) {
        	 	debug("tableWidth="+ tableLayout.getWidth());
        	 	debug("tableHeight="+tableLayout.getHeight());
        	 }
        	 var colLayout=layout.getColLayout();
        	 this.assertTrue(colLayout.getColCount() > 0);
        	 var rows=layout.getRows();
        	 for (var i=0; i< rows.length; i++) {
        	 	var row=rows[i];
        	 	debug("row "+i+", height="+row.getHeight());
        	 	var cols=row.getCols();
        	 	for (var j=0; j< cols.length; j++) {
        	 		this.assertTrue(typeof(cols[j])=='string');
        	 	}
        	 }
        	 //Verify itemMap
        	 var itemMap=vi.getItemMap();
        	 var tbInfo=itemMap.get("toolbar");
        	 debug("tbInfo="+tbInfo+", typeof layout: "+typeof(tbInfo.getLayout()));
        	 
        	 this.assertTrue(tbInfo.getLayout().length > 0);
        	 this.assertTrue(tbInfo.getList().length > 0);
        	 this.assertTrue(tbInfo.getLayout().length <= tbInfo.getList().length);
        	 
        	 var tl={CalemTableLayoutInfo: {width:'100%'}};
        	 var ob=CalemJson.setJson(tl);
        	 debug("json="+ob.getJson());
        	 debug("height="+ob.getHeight() +", width="+ob.getWidth());
        	 this.assertTrue(ob.getWidth()=='100%' && ob.getHeight()==null);
        	 //Validate json function
        	 vd=CalemViewDef[id];
        	 vi=CalemJson.setJson(vd);
        	 var json=vi.getJson();
        	 debug(id+"="+json);
        	 var temp;
        	 eval("temp="+json);
        	 debug("validated: "+id);
        }
        
        function testNewViewInfo() {
          var info={
	           'lb_caption': {
					CalemLabelInfo: {id: 'budget_title'}
				},
				'hsep' :{
					CalemHSeparatorInfo: 0
				},
				'lb_title': {
					CalemFieldLabelInfo: {field: 'title'}
				},
				'title' : {
					CalemFieldInfo: {field: 'title'}
				}
			 };
			 var lbInfo=CalemJson.setJson(info['lb_caption']);
			 var sepInfo=CalemJson.setJson(info['hsep']);
			 var lbFldInfo=CalemJson.setJson(info['lb_title']);
			 var fldInfo=CalemJson.setJson(info['title']);
			 //Verification
			 debug("Verifying newViewInfo");
			 debug("lbId="+lbInfo.getId());
			 this.assertTrue(lbInfo.getId()=='budget_title');
			 var json=lbInfo.getJson();
			 var temp;
			 eval("temp="+json);
			 debug('labInfo json='+lbInfo.getJson());
			 //Separator
			 debug("sep className="+sepInfo.getCssClassName());
			 this.assertTrue(sepInfo.getCssClassName() == 'horizSep');
			 json=sepInfo.getJson();
			 eval("temp="+json);
			 //FieldLabelInfo
			 this.assertTrue(lbFldInfo.getField()=='title');
			 json=lbFldInfo.getJson();
			 eval("temp="+json);
			 debug("json="+json);
			 //FieldInfo
			 debug("field="+fldInfo.getField());
			 this.assertTrue(fldInfo.getField()=='title');
			 json=fldInfo.getJson();
			 eval("temp="+json);
			 debug("json="+json);
			 //verify constructor 
			 debug("fldInfo constructor="+fldInfo.constructor+", prototype="+fldInfo.prototype);
        	 
        }
		  
		  //Debug output function
		  function debug(st, nodebug) {
               if (!showDebug) return;
           	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        var showDebug=0;
        function startTest() {
                showDebug=1;
        		setUp();
        		testNewViewInfo();
        		validateOneView();
        		testCalemViewInfo();
        		
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
