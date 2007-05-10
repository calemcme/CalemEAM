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
            return ['testCalemScheduleInfo', 'testCalemScheduleInWeekly'];
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
       
        function testCalemScheduleInfo() {
        	// --- weekly
        	debug("<b>testCalemScheduleInfo - weekly</b>");
        	var wkly=new CalemScheduleWeekly();
        	debug("json="+wkly.getJsonPhp());
        	assertTrue(wkly.getDow()==null);
        	
        	eval("var obj="+wkly.getJsonPhp());
        	var ds=CalemJson.setJson(obj);
        	debug("deserialized: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==wkly.getJsonPhp());
        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="weekly";
        	schedule._weekly=wkly;
        	
        	eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule for null weekly: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for null schedule: "+text);
        	assertTrue(text==null);
        	
        	wkly=new CalemScheduleWeekly(['dow_short_mon', 'dow_short_thu']);
        	var json=wkly.getJsonPhp();
        	debug("json="+json);
        	assertTrue(json.indexOf("\"CalemScheduleWeekly\"")!=-1);
        	assertTrue(wkly.getDow().length == 2);
        	
        	eval("obj="+wkly.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==wkly.getJsonPhp());
        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="weekly";
        	schedule._weekly=wkly;
        	
        	eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule for weekly: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for weekly schedule: "+text);
        	assertTrue(text.length > 0 && text.indexOf('Every week')> -1);
        	
        	// -- weeks
        	debug("<b>testCalemScheduleInfo - weeks</b>");
        	var weeks=new CalemScheduleWeeks();
        	debug("json="+weeks.getJsonPhp());
        	assertTrue(weeks.getFreq()==null && weeks.getDow()==null);
        	
        	eval("obj="+weeks.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized weeks: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==weeks.getJsonPhp());
        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="weeks";
        	schedule._weeks=weeks;
        	
        	eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule for null weeks: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for null weeks: "+text);
        	assertTrue(text==null);
        	
        	weeks=new CalemScheduleWeeks(3, 'dow_short_mon');
        	debug("json="+weeks.getJsonPhp());
        	assertTrue(weeks.getFreq()==3 && weeks.getDow()=='dow_short_mon');
        	
        	eval("obj="+weeks.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized weeks 2: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==weeks.getJsonPhp());
        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="weeks";
        	schedule._weeks=weeks;
        	
        	eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule for weeks: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for weeks: "+text);
        	assertTrue(text.length > 0 && text.indexOf('Every')>-1 && text.indexOf('weeks')>-1);
        	
        	//Months
        	debug("<b>testCalemScheduleInfo - months</b>");
        	var months=new CalemScheduleMonths();
        	debug("json="+months.getJsonPhp());
        	assertTrue(months.getFreq()==null && months.getDow()==null);
        	
        	eval("obj="+months.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized months: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==months.getJsonPhp());
        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="months";
        	schedule._months=months;
        	
        	eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule for null months: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for null months: "+text);
        	assertTrue(text==null);
        	
        	months=new CalemScheduleMonths(2, 'schedule_w1', 'dow_short_tue');
        	debug("json="+months.getJsonPhp());
        	assertTrue(months.getFreq()==2 && months.getWeekNo() == 'schedule_w1' && months.getDow()=='dow_short_tue');
        	eval("var j="+months.getJsonPhp());
        	debug("got months obj="+j);
        	
        	eval("obj="+months.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized months 2: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==months.getJsonPhp());
        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="months";
        	schedule._months=months;
        	
        	eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule for months: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for months: "+text);
        	assertTrue(text.length > 0 && text.indexOf('Every') > -1 && text.indexOf('months')>-1);
        	
        	//  --- Dates
        	debug("<b>testCalemScheduleInfo - dates</b>");
        	var dates=new CalemScheduleDates();
        	debug("json="+dates.getJsonPhp());
        	assertTrue(dates.getStartLocal()==null && dates.getEndLocal()==null);
        	
        	eval("obj="+dates.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized dates: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==dates.getJsonPhp());
        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="months";
        	schedule._months=months;
        	schedule._dates=dates;
        	
        	eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule for null dates for months: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for null dates: "+text);
        	assertTrue(text.indexOf('from')==-1 && text.indexOf('until')==-1);
        	
        	dates=new CalemScheduleDates('2007/02/19');
        	debug("json="+dates.getJsonPhp());
        	debug("start="+dates.getStartLocal()+", end="+dates.getEndLocal());
        	var dt=dates.getStartLocal();
        	debug("dtStartLocal="+dates.getStartLocal());
        	assertTrue(dt.getFullYear()==2007 && dt.getMonth()==1 && dt.getDate()==19);        	
        	assertTrue(dates.getEndLocal()==null);
        	
        	eval("obj="+dates.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized dates 2: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==dates.getJsonPhp());
        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="months";
        	schedule._months=months;
        	schedule._dates=dates;
        	
        	eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule for dates for months: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for dates: "+text);
        	assertTrue(text.indexOf("from")>-1);
        	
        	//Try the object itself
        	debug("<b>testCalemScheduleInfo - all included </b>");
        	var schedule=new CalemScheduleInfo();
        	debug("schedule json="+schedule.getJsonPhp());
        	assertTrue(schedule.getSelection()=='months');
        	eval("var i="+schedule.getJsonPhp());
        	
        	eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for null schedInfo: "+text);
        	assertTrue(text==null || text=='');
        	
        	
        	schedule=new CalemScheduleInfo('weeks', wkly, weeks, months, dates);
        	debug("schedule="+schedule.getJsonPhp());
        
         eval("obj="+schedule.getJsonPhp());
        	ds=CalemJson.setJson(obj);
        	debug("deserialized schedule 2: "+ds.getJsonPhp());
        	assertTrue(ds.getJsonPhp()==schedule.getJsonPhp());      
        	
        	//Try text
        	var text=schedule.getText();
        	debug("text for all with dates: "+text);
        	assertTrue(text.length > 0 && text.indexOf('Every') > -1 && text.indexOf('weeks')>-1
        	          && text.indexOf('from')>-1); 	

        }
        
        function testCalemScheduleInWeekly() {
        	// --- weekly
        	debug("<b>testCalemScheduleInWeekly - weekly</b>");
        	var wkly=new CalemScheduleWeekly();        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="weekly";
        	schedule._weekly=wkly;
        	debug("inWeekly false: dow_short_mon: " + schedule.inWeekly('dow_short_mon'));
        	assertFalse(schedule.inWeekly('dow_short_mon'));
        	
        	wkly=new CalemScheduleWeekly(['dow_short_mon', 'dow_short_thu']);        	
        	var schedule=new CalemScheduleInfo();
        	schedule._selection="weekly";
        	schedule._weekly=wkly;
        	
        	debug("inWeekly true: dow_short_mon: " + schedule.inWeekly('dow_short_mon'));
        	assertTrue(schedule.inWeekly('dow_short_mon'));
        	debug("inWeekly false: dow_short_fri: " + schedule.inWeekly('dow_short_fri'));
        	assertFalse(schedule.inWeekly('dow_short_fri'));
        	
        }
		  
		  //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>" + div.innerHTML;
        }        
        
        function startTest() {
        		setUp();
        		testCalemScheduleInfo();
        		testCalemScheduleInWeekly();        		
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
