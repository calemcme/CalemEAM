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
            return ['testCalemSelectionEvent'];
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
       
        var evtCounters=new Object();
        function testCalemSelectionEvent() {
        	 debug("<b>testCalemSelectionEvent</b>");
        	 //Creating a data model first
        	 var model=new CalemDataModel('budget_title', null);
        	 //Creating a src
        	 var eventSrc=new EventSrc();
        	 var events=[CalemEvent.NO_SELECTION, CalemEvent.SINGLE_SELECTION, CalemEvent.MULTI_SELECTION];
        	 var mi=model.getModelItem();
        	 mi.publishEvents(events, eventSrc);
        	 var noListener=new AjxListener(null, noSelectionReceiver);
        	 mi.addListener(CalemEvent.NO_SELECTION, noListener);
        	 mi.addListener(CalemEvent.SINGLE_SELECTION, new AjxListener(null, singleSelectionReceiver));
        	 mi.addListener(CalemEvent.MULTI_SELECTION, new AjxListener(null, multiSelectionReceiver));
        	 var evt=new CalemSelectionEvent(true);
        	 evt.setType(CalemEvent.NO_SELECTION);
        	 eventSrc.notifyListeners(CalemEvent.NO_SELECTION, evt);
        	 eventSrc.notifyListeners(CalemEvent.NO_SELECTION, evt);
        	 
        	 evt.setType(CalemEvent.SINGLE_SELECTION);
        	 eventSrc.notifyListeners(CalemEvent.SINGLE_SELECTION, evt);

			 evt.setType(CalemEvent.MULTI_SELECTION);
        	 eventSrc.notifyListeners(CalemEvent.MULTI_SELECTION, evt);
        	 eventSrc.notifyListeners(CalemEvent.MULTI_SELECTION, evt);
        	 eventSrc.notifyListeners(CalemEvent.MULTI_SELECTION, evt);
        	 
        	 for (var i in evtCounters) {
        	 		debug(i+" received count= "+evtCounters[i]);
        	 }
        	 
        	 this.assertTrue(evtCounters[CalemEvent.NO_SELECTION]==2);
        	 this.assertTrue(evtCounters[CalemEvent.SINGLE_SELECTION]==1);
        	 this.assertTrue(evtCounters[CalemEvent.MULTI_SELECTION]==3); 
        }
        
        function EventSrc() {
        	 CalemModel.call(this, true);
        }
        
        EventSrc.prototype=new CalemModel;
        EventSrc.prototype.constructor=EventSrc;
        
        function noSelectionReceiver(evt) {
        	 addCounter(evt);
        }
        
        function singleSelectionReceiver(evt) {
        	 addCounter(evt);
        }
        
        function multiSelectionReceiver(evt) {
        	 addCounter(evt);
        }
        
        function addCounter(evt) {
        		if (evtCounters[evt.getType()]==null) {
        			evtCounters[evt.getType()]=1;
        		} else {
        			evtCounters[evt.getType()]++;
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
        		testCalemSelectionEvent();
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
