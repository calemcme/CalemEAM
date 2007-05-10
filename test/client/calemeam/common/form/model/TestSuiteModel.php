<?php
   chdir('../../../../../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Model Test Suite</title>
    <link rel="stylesheet" type="text/css" href="<?php print $calemRootUrl ?>/test/client/jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="<?php print $calemRootUrl ?>/test/client/jsunit/app/jsUnitCore.js"></script>
    <script language="JavaScript" type="text/javascript">
		
        //DB Query test suite
        function querySuite(url) {
        		var result = new top.jsUnitTestSuite(); 
        		result.addTestPage(url+"database/query/testCalemDbQuery.php?localrun=0");
        		result.addTestPage(url+"database/query/testCalemDbExpr.php?localrun=0");
        		result.addTestPage(url+"database/query/testCalemCacheQuery.php?localrun=0");
        		result.addTestPage(url+"database/query/testCalemTableQueryJoinCustom.php?localrun=0");
        		return result;
        }
        
        //DB test suite
        function databaseSuite(url) {
        		var result = new top.jsUnitTestSuite();
            result.addTestPage(url+"database/testCalemTableDd.php?localrun=0");
            result.addTestPage(url+"database/testCalemTableDdView.php?localrun=0");
            result.addTestPage(url+"database/testCalemDb.php?localrun=0");
            result.addTestPage(url+"database/testCalemCachedItem.php?localrun=0");
            result.addTestPage(url+"database/testCalemCache.php?localrun=0");
            return result;
        }
        
        //DM test suite
        function dataModelSuite(url) {
        		var result = new top.jsUnitTestSuite();
        		result.addTestPage(url+"datamodel/testCalemRecord.php?localrun=0");
            result.addTestPage(url+"datamodel/testCalemRecordList.php?localrun=0");
            result.addTestPage(url+"datamodel/testCalemQueryAndClone.php?localrun=0");
            result.addTestPage(url+"datamodel/testCalemDataModel.php?localrun=0");
            return result;
        }
        
        //widget suite
        function widgetSuite(url) {
        		var result = new top.jsUnitTestSuite();
        		result.addTestPage(url+"widget/testCalemModuleInfo.php?localrun=0");
        		result.addTestPage(url+"widget/testCalemDataGridInfo.php?localrun=0");
        		result.addTestPage(url+"widget/testCalemFormInfo.php?localrun=0");
        		result.addTestPage(url+"widget/testCalemEmbedInfo.php?localrun=0");
        		result.addTestPage(url+"widget/testCalemSearchInfo.php?localrun=0");
        		result.addTestPage(url+"widget/testCalemModuleCustomInfo.php?localrun=0");
        		result.addTestPage(url+"widget/testCalemScheduleInfo.php?localrun=0");
        		//View split into many segments
        		result.addTestPage(url+"widget/testCalemViewInfoA2F.php?localrun=0");
        		result.addTestPage(url+"widget/testCalemViewInfoG2M.php?localrun=0");
        		result.addTestPage(url+"widget/testCalemViewInfoN2P.php?localrun=0");
        		result.addTestPage(url+"widget/testCalemViewInfoQ2Z.php?localrun=0");
        		//Test custom view Info
        		result.addTestPage(url+"widget/testCalemViewCustomInfo.php?localrun=0");
            return result;
        }
        
        //event suite
        function eventSuite(url) {
        		var result = new top.jsUnitTestSuite();
        		result.addTestPage(url+"event/testCalemSelectionEvent.php?localrun=0");
            return result;
        }
        
        //errorInfo suite
        function errorInfoSuite(url) {
        		var result = new top.jsUnitTestSuite();
        		result.addTestPage(url+"errorinfo/testCalemErrorInfo.php?localrun=0");
            return result;
        }
        
        function suite() {
            var newsuite = new top.jsUnitTestSuite();
            var url='<?php print $calemRootUrl ?>/test/client/calemeam/common/form/model/';
            newsuite.addTestSuite(querySuite(url));
            newsuite.addTestSuite(databaseSuite(url));
            newsuite.addTestSuite(dataModelSuite(url));
            newsuite.addTestSuite(widgetSuite(url));
            newsuite.addTestSuite(eventSuite(url));
            newsuite.addTestSuite(errorInfoSuite(url));
            return newsuite;
        }
    </script>
</head>

<body>
<h1>JsUnit Test Suite</h1>

<p>This page contains a suite of tests for testing JsUnit.</p>
</body>
</html>
