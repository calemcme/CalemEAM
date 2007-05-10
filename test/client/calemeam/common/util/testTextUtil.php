<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<?php
   chdir('../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';

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
            return ['testTextUtil', 'testTextUtilNumberParsing', 'testNumberFormatting', 
                    'testDateTimeFormatting', 'testTimeZone', 'testDstConversion',
                    'testParsingLocalDateTime', 'testServerFormat',
                    'testValidation',
                    'testPercent'];
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
        
        //Debug output function
		  function debug(st, nodebug) {
        	   if (nodebug) return;
        		var div=document.getElementById('outputDiv');
        		div.innerHTML = st+"<br>"+div.innerHTML;
        } 
        
        /**
         * Comments: date and time parsing is good
         * Problem is that AM/PM must be entered for date to be valid.
         * We may need to use a formatter to internally parse without AM/PM
         */
        function testTextUtil() {
        	 //Formatters first   	 
        	 //Date read
        	 var fmt=CalemTextUtil.getFormatter(CalemTextUtil.DATE_READ_FORMATTER);
        	 var dt=new Date();
        	 dt.setFullYear(2006);
        	 dt.setMonth(9);
        	 dt.setDate(20);
        	 var st=fmt.format(dt);
        	 debug("dt="+dt+", st="+st);
        	 this.assertTrue(st == "Fri, 10/20/06");

        	 //Date edit
        	 var fmt=CalemTextUtil.getFormatter(CalemTextUtil.DATE_EDIT_FORMATTER);
        	 var dt=new Date();
        	 dt.setFullYear(2006);
        	 dt.setMonth(9);
        	 dt.setDate(20);
        	 var st=fmt.format(dt);
        	 debug("dt="+dt+", st="+st);
        	 this.assertTrue(st == "10/20/06");

        	 //test parsing
        	 dt=fmt.parse('10/20/06');
        	 debug("parsed date ="+dt);
        	 this.assertTrue(dt.getMonth() == 9 && dt.getDate()==20 && dt.getFullYear()==2006);
        	 this.assertTrue(fmt.format(dt) == '10/20/06');

        	 //Make sure we cannot parse this case
        	 dt=fmt.parse('00/22');
        	 debug("parse 00/22 got: "+dt);
        	 this.assertTrue(!dt);
        	 //It's interesting that the format is so important
        	 dt=fmt.parse('10/33/99');
        	 debug("parsing 10/33/99 = "+dt);
        	 this.assertTrue(dt.getMonth()==10 && dt.getDate()==2 && dt.getFullYear()==1999);
        	 this.assertFalse('10/33/99' == fmt.format(dt)); //This is invalid.
        	 
        	 //Time read
        	 debug("<b>Parsing time</b>");
        	 var fmt=CalemTextUtil.getFormatter(CalemTextUtil.TIME_READ_FORMATTER);
        	 var dt=new Date();
        	 dt.setHours(10, 20, 30, 00);
        	 var st=fmt.format(dt);
        	 debug("dt="+dt+", st="+st);
        	 this.assertTrue(st == "10:20 AM");

        	 //Time edit
        	 var fmt=CalemTextUtil.getFormatter(CalemTextUtil.TIME_EDIT_FORMATTER);
        	 var dt=new Date();
        	 dt.setHours(10, 20, 30, 00);
        	 var st=fmt.format(dt);
        	 debug("dt="+dt+", st="+st+", formatter="+fmt.toString());
        	 this.assertTrue(st == "10:20 AM"); 
        	  	
        	 //Test parsing
        	 debug("<b>Test parsing time no am/pm</b>");
        	 var dt=fmt.parse("12:20 ");
        	 debug("parsing 12:20, got: "+dt);
        	 this.assertTrue(dt.getHours()==12 && dt.getMinutes()==20);
        	 
        	 var dt=fmt.parse("4:20 ");
        	 debug("parsing 4:20, got: "+dt);
        	 this.assertTrue(dt.getHours()==16 && dt.getMinutes()==20);
        	 
        	 debug("<b>Test parsing time</b>");
        	 var dt=fmt.parse("12:20 PM");
        	 debug("parsing 12:20 PM, got: "+dt);
        	 this.assertTrue(dt.getHours()==12 && dt.getMinutes()==20);
        	 
        	 var dt=fmt.parse("10:20 PM");
        	 debug("parsing 10:20 PM=" + fmt.parse("10:20 PM"));
        	 this.assertTrue(dt.getHours()==22 && dt.getMinutes()== 20);
        	 
        	 dt=fmt.parse("10:20 AM");
        	 debug("parsing 10:20 AM got: "+dt);
        	 this.assertTrue(fmt.format(dt)=='10:20 AM');
        	 
        	 //negative case
        	 try {
        	 	dt=fmt.parse("25:30 PM");
        	 	this.assertFalse(1==1);
        	 } catch (e) {
        	 	//This is fine.
        	 	debug("Parsing <b>25:30 PM</b> got exception" + e);
        	 }
        	 //no AM/PM
     	 	 dt=fmt.parse("10:20");
     	 	 this.assertTrue(dt==null);
     	 	 debug("parsing <b>10:20</b> got <b>null</b>: "+dt);
        	 
        	 //Try 00:00:00 for time
        	 dt=fmt.parse("10:00 AM");
        	 debug("Parsing <font style='color:red'>10:00 AM </font>got date" + dt);
        	 this.assertTrue(fmt.format(dt)=='10:00 AM');
        	 
        	 dt =new Date();
        	 dt.setHours(0,0,0,0);
        	 debug("<b>00:00:00 </b>format: "+fmt.format(dt));
        	 
        	 //Parsing 00:00 AM
        	 dt=fmt.parse('00:00 AM');
        	 debug("<font style='color:green'>Parsing 00:00 AM</font>, date="+dt);
        	 this.assertTrue(fmt.format(dt) == '0:00 AM');
        	 
        	 
        	 //Use a datetime format to parse
        	 var conf=CalemConf["text_formatter"];
        	 fmt=new AjxDateFormat(conf.date.edit + " " + conf.time.edit);
        	 dt=new Date();
        	 dt.setMonth(9);
        	 dt.setFullYear(1999);
        	 dt.setDate(10);
        	 dt.setHours(17, 20, 30, 00);
        	 st=fmt.format(dt);
        	 debug("datetime formatter: "+st+", format="+fmt.toString());
        	 dt=fmt.parse(st);
        	 debug("Time parsed result="+dt);
			 this.assertTrue(dt.getMonth()==9 && dt.getFullYear()==1999 && dt.getDate()==10 
			                && dt.getHours()==17 && dt.getMinutes()==20);							                		                
        } 
        
        function testTextUtilNumberParsing() {
        		/**
        		 * Integer
        		 */
        		debug("<b> Integer </b>");
        		var st='235,476,890';
        		var i=CalemTextUtil.isIntegerValid(st);
        		debug("st="+st+", parsed int="+i);
        		this.assertTrue(i==235476890);
        		
        		//Minus case
        		var st='-235,476,890';
        		var i=CalemTextUtil.isIntegerValid(st);
        		debug("st="+st+", parsed int="+i);
        		this.assertTrue(i==-235476890);
        		
        		//Minus case 2
        		var st='235,476,890-';
        		var i=CalemTextUtil.isIntegerValid(st);
        		debug("st="+st+", parsed int="+i);
        		this.assertTrue(i==-235476890); //May not support this case.

        		//Minus case 3
        		try {
        			var st='235,-476,890-';
        			var i=CalemTextUtil.isIntegerValid(st);
        			debug("st="+st+", parsed int="+i);
        			this.assertTrue(1!=1); //May not support this case.
        		} catch (ex) {
        			debug("caught exception="+ex);	
        		}
        		
        		//Negative case
        		try {
	        		var st="x23577";
	        		var i=CalemTextUtil.isIntegerValid(st);
	        		debug("st="+st+", i="+i);
	        		this.assertTrue(1!=1);
        		} catch (ex) {
        		}
        		
        		//This is trouble
        		try {
	        		var st="23x577";
	        		var i=CalemTextUtil.isIntegerValid(st);
	        		debug("st="+st+", i="+i);
	        		this.assertTrue(1!=1);
        		} catch (ex) {
        		}
        		
        		/**
        		 * Number
        		 */
        		debug("<b> Number </b>");
        		var st='235,476.235';
        		var i=CalemTextUtil.isNumberValid(st);
        		debug("st="+st+", parsed int="+i);
        		this.assertTrue(i==235476.235);
        		
        		//Minus case
        		var st='-235,476,890.22';
        		var i=CalemTextUtil.isNumberValid(st);
        		debug("st="+st+", parsed int="+i);
        		
        		this.assertTrue(i==-235476890.22);
        		
        		//Minus case 2
        		var st='235,476,890.35-';
        		var i=CalemTextUtil.isNumberValid(st);
        		debug("st="+st+", parsed int="+i);
        		this.assertTrue(i==-235476890.35); //May not support this case.
        		
        		//Minus case 3
        		try {
	        		var st='235,-476,890.35-';
	        		var i=CalemTextUtil.isNumberValid(st);
	        		debug("st="+st+", parsed int="+i);
	        		this.assertTrue(1!=1);
        		} catch (ex) {}
        		
        		//Negative case
        		try {
	        		var st='x235.356';
	        		var i=CalemTextUtil.isNumberValid(st);
	        		debug("st="+st+", parsed int="+i);
	        		this.assertTrue(1!=1);
        		} catch (ex) {}
        		
        		//Tricky case
        		try {
	        		var st='1,23x5.356';
	        		var i=CalemTextUtil.isNumberValid(st);
	        		debug("st="+st+", parsed int="+i);
	        		this.assertTrue(i==null); 
        		} catch (ex) {
        			debug("caught ex="+ex);
        		}
        		
        		/**
        		 * Percent
        		 */
        		debug("<b> Percent </b>");
        		var st='23.35%';
        		var i=CalemTextUtil.isPercentValid(st);
        		debug("st="+st+", parsed percent="+i);
        		this.assertTrue(i==0.2335);
        		
        		debug("<b> Percent </b>");
        		var st='8.526%';
        		var i=CalemTextUtil.isPercentValid(st);
        		debug("st="+st+", parsed percent="+i);
        		this.assertTrue(i==0.08526);
        		
        		//Minus case
        		var st='-235,476,890.22%';
        		var i=CalemTextUtil.isPercentValid(st);
        		debug("st="+st+", parsed percent="+i+", i==-2354768.9022" + (i==-2354768.9022));
        		
        		this.assertTrue(i==-2354768.9022);
        		
        		//Minus case 2
        		try {
	        		var st='235,476,890.35%-';
	        		var i=CalemTextUtil.isPercentValid(st);
	        		debug("st="+st+", parsed int="+i);
	        		this.assertTrue(i==-2354768.9035); //May not support this case.
        		} catch (ex) {
        			debug("caught exception for: '235,476,890.35%-'");	
        		}
        		
        		//Minus case 3
        		try {
	        		var st='235,-476,890.35-%';
	        		var i=CalemTextUtil.isPercentValid(st);
	        		debug("st="+st+", parsed int="+i);
	        		this.assertTrue(1!=1);
        		} catch (ex) {}
        		
        		
        		//Negative case
        		try {
	        		var st='x235.356';
	        		var i=CalemTextUtil.isPercentValid(st);
	        		debug("st="+st+", parsed int="+i);
	        		this.assertTrue(1!=1);
        		} catch (ex) {}
        		
        		//Tricky case
        		try {
	        		var st='1,23x5.356%';
	        		var i=CalemTextUtil.isNumberValid(st);
	        		debug("st="+st+", parsed int="+i);
	        		this.assertTrue(1!=1);
        		} catch (ex) { debug("ex="+ex); }
        		
        		//Tricky case
        		try {
	        		var st='1,23+5.356%';
	        		var i=CalemTextUtil.isNumberValid(st);
	        		debug("st="+st+", parsed int="+i);
	        		this.assertTrue(1!=1);
        		} catch (ex) {}
        		
        		/**
        		 * Currency
        		 */
        		debug("<b> Currency </b>");
        		var st='235,476,890';
        		var i=CalemTextUtil.isCurrencyValid(st);
        		debug("st="+st+", parsed int="+i);
        		this.assertTrue(i==235476890);
        		
        		//Minus case
        		var st='-235,476,890.22';
        		var i=CalemTextUtil.isCurrencyValid(st);
        		debug("st="+st+", parsed int="+i);
        		
        		this.assertTrue(i==-235476890.22);
        		
        		//Minus case 2
        		var st='235,476,890.35-';
        		var i=CalemTextUtil.isCurrencyValid(st);
        		debug("st="+st+", parsed int="+i);
        		this.assertTrue(i==-235476890.35); //May not support this case.
        		
        		//Minus case 3
        		try {
        		var st='235,-476,890.35-';
        		var i=CalemTextUtil.isCurrencyValid(st);
        		debug("st="+st+", parsed int="+i);
        		this.assertTrue(1!=1);
        		} catch (ex) {}
        		
        		//Negative case
        		try {
        		var st="x23577";
        		var i=CalemTextUtil.isCurrencyValid(st);
        		debug("st="+st+", i="+i);
        		this.assertTrue(1!=1);
        		} catch (ex) {debug("ex="+ex);}
        		
        		//This is trouble
        		try {
        		var st="23x577";
        		var i=CalemTextUtil.isCurrencyValid(st);
        		debug("st="+st+", i="+i);
        		this.assertTrue(1!=1);
        		} catch (ex) {}
        		
        		//A little currency handling
        		debug("<b> Currency with symbol </b>");
        		var st="$23577";
        		var i=CalemTextUtil.isCurrencyValid(st);
        		debug("st="+st+", i="+i);
        		this.assertTrue(i==23577);
        		
        		var st="-$23577";
        		var i=CalemTextUtil.isCurrencyValid(st);
        		debug("st="+st+", i="+i);
        		this.assertTrue(i==-23577);
        		
        		var st="-$235,77.89";
        		var i=CalemTextUtil.isCurrencyValid(st);
        		debug("st="+st+", i="+i);
        		this.assertTrue(i==-23577.89);
        		
        }
        
        //Test number formatting
        function testNumberFormatting() {
        	   debug("<b> testNumberFormatting</b>");
        		var fmt=CalemTextUtil.getFormatter(CalemTextUtil.NUMBER_FORMATTER);
        		var n=12345.47;
        		debug("n="+n+", fmt="+fmt.format(n)+", fmt.toString="+fmt.toString());
        		var st=fmt.format(n);
        		this.assertTrue(st=='12,345.47');
        		
        		//Formatting string as number in JS
        		var n="12345.47";
        		var fmt=CalemTextUtil.getFormatter(CalemTextUtil.NUMBER_FORMATTER);
        		debug("n is string: " + n+", formatted="+ fmt.format(n));
        		
        		//View number null
        		debug("Number(null)="+Number(null));
        		debug("Number('12345.78')="+Number('12345.78'));
        		debug("Number('12,345.78')="+Number('12,345.78'));
        		
        		//Decimal formatting:
        		var fmt1=new AjxNumberFormat("#,##0.00");
        		n=-123.4059;
        		n2=123.2;
        		debug(n+" is formatted as: "+fmt1.format(n));
        		debug(n2+" is formatted as: "+fmt1.format(n2));
        		//test currency formatting
        		debug("<b>test currency formatting</b>");
        		var cur1=new AjxNumberFormat("#,##0.00;(#,##0.00)");
        		var cur2=new AjxNumberFormat("#,##0.00");
        		n1=12.456;
        		n2=-12.456;
        		debug("format 1: n1="+n1+", fmt="+cur1.format(n1));
        		debug("format 1: n2="+n2+", fmt="+cur1.format(n2));
        		//format 2
        		debug("format 2: n1="+n1+", fmt="+cur2.format(n1));
        		debug("format 2: n2="+n2+", fmt="+cur2.format(n2));
        		
        }
        
        //Test datetime formatting
        function testDateTimeFormatting() {
        	   debug("<b> testDateTimeFormatting</b>");
        		var fmt=CalemTextUtil.getFormatter(CalemTextUtil.DATETIME_SERVER_FORMATTER);
        		var dt=new Date();
        		dt.setFullYear(2006);
        		dt.setMonth(9);
        		dt.setDate(25);
        		dt.setHours(22, 30, 32);
        		debug("dt = "+dt +", fmt="+fmt.format(dt));
        		var st=fmt.format(dt);
        		this.assertTrue(st=='2006-10-25 22:30:32');
        }
        
        /** Test Dst to local date converstion */
        function testTimeZone() {
        	  debug("<b>test timeZone</b>");
	
        	  var dt="2007-03-20 20:46:00";
        	  var tz=AjxTimezone._guessMachineTimezone();
        	  debug("guessed timezone is: " + tz);
        	  this.assertTrue(tz.indexOf('(GMT-06.00) Central Time (US & Canada)')>=0);        	  
        }
        
        function testDstConversion() {
        	 debug("<b>testDstConversion</b>")
        	 //Try server date conversion without DST
        	 var svrDateStr="2006-11-20 12:30:20";
        	 var dt=CalemTextUtil.parseServerDateTimeToLocal(svrDateStr);
        	 var offset=CalemTextUtil.getLocalTimeOffset(dt);
        	 debug("serverDate="+svrDateStr+", parsed localtime: "+dt+", offset="+offset);
        	 this.assertTrue(dt.getFullYear()==2006 && dt.getMonth()==10 && dt.getDate()==20
        	              && dt.getHours()== (12+offset/60) && dt.getMinutes()==30 && dt.getSeconds()==20);
			 //Try server date conversion with DST	 
			 var svrDateStr="2006-10-20 12:30:20";
        	 var dt=CalemTextUtil.parseServerDateTime(svrDateStr);
        	 var cid=CalemTextUtil.getClientId();
        	 debug("clientId="+cid);
			 var offset=AjxTimezone.getOffset(cid, dt);
        	 debug("serverDateStr="+svrDateStr+"; GMT time: "+dt+", offset="+offset+", cid="+cid);
        	 this.assertTrue(dt.getFullYear()==2006 && dt.getMonth()==9 && dt.getDate()==20
        	              && dt.getHours()==12 && dt.getMinutes()==30 && dt.getSeconds()==20); 
			 //Try a server date
			 svrDateStr="2006-11-20";
			 dt=CalemTextUtil.parseServerDate(svrDateStr);
			 debug("server date: "+dt);
			 this.assertTrue(dt.getFullYear()==2006 && dt.getMonth()==10 && dt.getDate()==20);   
			 
			 //Try a conversion from server dateTime to localDate Time
			 var svrDateStr="2006-10-20 12:30:20";
        	 var dt=CalemTextUtil.parseServerDateTime(svrDateStr);
        	 var dtLocal=CalemTextUtil.gmtDateTimeToLocal(dt);
        	 debug("GMT="+dt+"; Local="+dtLocal);
        	 this.assertTrue(dt.getFullYear()==2006 && dt.getMonth()==9 && dt.getDate()==20
        	              && dt.getHours()==12 && dt.getMinutes()==30 && dt.getSeconds()==20);
			 //Verify DST conversion  
			 offset=CalemTextUtil.getLocalTimeOffset(dt);
			 debug("offset: "+offset+" for dt="+dt);      	              
			 this.assertTrue(dtLocal.getFullYear()==2006 && dtLocal.getMonth()==9 && dtLocal.getDate()==20
        	              && dtLocal.getHours()==(12+offset/60) && dt.getMinutes()==30 && dt.getSeconds()==20); 

			 //Try a conversion from server dateTime to localDate Time
			 debug("<font style='color:purple'>test march server time to local conversion</font>");
			 var svrDateStr="2007-03-20 22:30:20";
        	 var dt=CalemTextUtil.parseServerDateTime(svrDateStr);
        	 var dtLocal=CalemTextUtil.gmtDateTimeToLocal(dt);
        	 debug("GMT="+dt+"; Local="+dtLocal);
        	 this.assertTrue(dt.getFullYear()==2007 && dt.getMonth()==2 && dt.getDate()==20
        	              && dt.getHours()==22 && dt.getMinutes()==30 && dt.getSeconds()==20);
			 //Verify DST conversion  
			 offset=CalemTextUtil.getLocalTimeOffset(dt);
			 debug("offset: "+offset+" for dt="+dt+", offset from js="+dt.getTimezoneOffset());      	              
			 this.assertTrue(dtLocal.getFullYear()==2007 && dtLocal.getMonth()==2 && dtLocal.getDate()==20
        	              && dtLocal.getHours()==17 && dt.getMinutes()==30 && dt.getSeconds()==20);        	                     	                   	                    	              
        }
        
        //Local date time parsing
        function testParsingLocalDateTime() {
        	   debug("<b>testParsingLocalDateTime</b>");
        	   var fmt=CalemTextUtil.getFormatter(CalemTextUtil.DATETIME_SERVER_FORMATTER);
        	   debug("zero pad: "+AjxFormat._zeroPad(3, "H".length));
        	   debug("format="+fmt);
        		var dt=new Date();
        		var dtStr=fmt.format(dt);
        		debug("localDateTimeStr="+dtStr+", dt="+dt);
            var dtLocalTime=CalemTextUtil.parseServerDateTime(dtStr);
            debug("parsedTime="+dtLocalTime +", current="+dt);
            this.assertTrue(dt.getFullYear()==dtLocalTime.getFullYear() &&
                            dt.getMonth() == dtLocalTime.getMonth() &&
                            dt.getDate() == dtLocalTime.getDate() &&
                            dt.getHours() == dtLocalTime.getHours() &&
                            dt.getMinutes() == dtLocalTime.getMinutes() &&
                            dt.getSeconds() == dtLocalTime.getSeconds());

			   var st="1/1/2006";
			   var dt=AjxDateUtil.simpleParseDateStr(st);
			   debug("st="+st+", date="+dt); 
			   
			   var st="1/1/08";
			   var dt=AjxDateUtil.simpleParseDateStr(st);
			   debug("st="+st+", date="+dt); 
			   
			   var s="08";
			   var v=parseInt(s.substring("1/1/08", 4, 6));  
			   debug("s="+s+", parsed result="+v); 
			   
			   //Verify local time parsing
			   var dtGmt=new Date();
			   var dtStr=fmt.format(dtGmt);
			   var dtLocal=CalemTextUtil.parseServerDateTimeToLocal(dtStr);
			   debug("dtGmt="+dtGmt+", dtGmtStr="+dtStr);
			   debug("dtLocal="+dtLocal+", dtLocalStr="+fmt.format(dtLocal));
			   debug("Time offset="+CalemTextUtil.getLocalTimeOffset(dt)); 
			   dtGmt.setMinutes(dtGmt.getMinutes()+CalemTextUtil.getLocalTimeOffset(dtGmt));
			   debug("dtGmt adjusted to local time: "+dtGmt);
			   this.assertTrue(dtGmt.getFullYear()==dtLocal.getFullYear()
			                 && dtGmt.getMonth()==dtLocal.getMonth()
			                 && dtGmt.getDate()==dtLocal.getDate()
			                 && dtGmt.getHours()==dtLocal.getHours()
			                 && dtGmt.getMinutes() == dtLocal.getMinutes()
			                 && dtGmt.getSeconds()== dtLocal.getSeconds());  
			   debug("dtGmt time="+dtGmt.getTime() +", dtLocal time="+dtLocal.getTime());
        }
        
        function testServerFormat() {
        		debug("<b>testServerFormat </b>");
        		var cur2=new AjxNumberFormat("####");
        		var i=234579.23;
        		var st=cur2.format(i);
        		debug(i +" integer server format: "+st);
        		this.assertTrue(st=='234579');
        		var cur2=new AjxNumberFormat("####0.00");
        		st=cur2.format(i);
        		debug(i + " number server format: "+st);
        		this.assertTrue(st=='234579.23');
        		
        		//date time
        		debug("<b>test Datetime server format</b>");
        		var dtStr='2007-10-23 15:30:00';
        		var dtServer=CalemTextUtil.parseServerDateTime(dtStr);
        		this.assertTrue(dtServer.getFullYear()==2007 &&
        		                dtServer.getMonth()==9 &&
        		                dtServer.getDate()==23 &&
        		                dtServer.getHours()==15 &&
        		                dtServer.getMinutes()==30 &&
        		                dtServer.getSeconds()==0);
				var newDtStr=CalemTextUtil.formatServerDateTime(dtServer);
				debug("dtStr="+dtStr+", newDtStr="+newDtStr);
				this.assertTrue(dtStr==newDtStr);
				
				//Time   
        		debug("<b>test Time server format</b>");
        		var dtStr='15:30:00';
        		var dtServer=CalemTextUtil.parseServerTimeGmt(dtStr);
        		this.assertTrue(dtServer.getHours()==15 &&
        		                dtServer.getMinutes()==30 &&
        		                dtServer.getSeconds()==0);
				var newDtStr=CalemTextUtil.formatServerTime(dtServer);
				debug("dtStr="+dtStr+", newDtStr="+newDtStr);
				this.assertTrue(dtStr==newDtStr);     		                
        }
        
        function testValidation() {
        		debug("<b>testValidation</b>");
        		var st='0';
        		var rtn=CalemTextUtil.isNumberValid(st);
        		debug("st ="+st+", number rtn="+rtn);
        		var rtn=CalemTextUtil.isIntegerValid(st);
        		debug("st ="+st+", integer rtn="+rtn);
        		var rtn=CalemTextUtil.isCurrencyValid(st);
        		debug("st ="+st+", currency rtn="+rtn);
        		//Try invalid case
        		var et=null;
        		try {
        			st="20%56";
        			rtn=CalemTextUtil.isNumberValid(st);
        		} catch (ex) {
        			et=ex;
        			debug("st="+st+", number valid exception: "+ex);
        		}
        		assertTrue(et!=null);
        		//
        		st="xy";
        		et=null;
        		try {
        			rtn=CalemTextUtil.isNumberValid(st);
        			debug("validation result: "+rtn);
        		} catch (ex) {
        			et=rtn;
        			debug("st="+st+", number valid exception: "+ex);
        		}
        		assertTrue(et!=null);
        }
        
        function testPercent() {
        		debug("<b>testPercent</b>");
        		var st='0';
        		var rtn=CalemTextUtil.isPercentValid(st);
        		debug("st ="+st+", percent rtn="+rtn);

        		//Try invalid case
        		var et=null;
        		try {
        			st="20%56";
        			rtn=CalemTextUtil.isPercentValid(st);
        			debug("st="+st+", rtn=" +rtn+", no exception");
        		} catch (ex) {
        			et=ex;
        			debug("st="+st+", number valid exception: "+ex);
        		}
        		assertTrue(et!=null);
        		//
        		st="xy";
        		et=null;
        		try {
        			rtn=CalemTextUtil.isPercentValid(st);
        			debug("validation result: "+rtn);
        		} catch (ex) {
        			et=rtn;
        			debug("st="+st+", number valid exception: "+ex);
        		}
        		assertTrue(et!=null);
        		
        		//
        		var fmt=CalemTextUtil.getFormatter(CalemTextUtil.PERCENT_FORMATTER);
        		debug('fmt=' + fmt);
        		var i=23;
        		st=fmt.format(i);
        		debug("i="+i+", percent format=" + st);
        		this.assertTrue(st=='2,300%');
        		
        		//Percent format
        		i=0.0856;
        		st=fmt.format(i);
        		debug("i="+i+", percent format=" + st);
        		this.assertTrue(st=='8.56%');
        		
        		// parse percent
        		st='30%';
        		i=CalemTextUtil.isPercentValid(st);
        		debug("st="+st+", i="+i);
        		this.assertTrue(i==0.3);
        		
        		st=CalemTextUtil.formatServerNumber(i);
        		debug('formatted for server: i='+i+", st="+st);
        		this.assertTrue(st=='0.3');	        		
        }
        
        function startTest() {
        		setUp();
        		testTextUtil();
        		testTextUtilNumberParsing();
        		testNumberFormatting();
        		testDateTimeFormatting();
        		testTimeZone();
        		testDstConversion();
        		testParsingLocalDateTime();
        		testServerFormat();
        		testValidation();
        		testPercent();
        }
        
        //Global vars definition
        var calemSoapUrl='<?php print $calemSoapUrl ?>';
        
        if (location.search.indexOf('localrun')==-1) {
        		AjxCore.addOnloadListener(startTest);
        }
    </script>
</head>

<body>
<h1>CalemTextUtil tests</h1>

<p>This page tests CalemTextUtil class.</p>
<div id=outputDiv></div>

</body>
</html>
