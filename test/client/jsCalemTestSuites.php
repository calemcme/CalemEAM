<?php
   chdir('../..');
	define('_CALEM_DIR_', getcwd() . '/');
	require _CALEM_DIR_ . 'server/conf/calem.php';
	require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
	
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Calem Test Suite</title>
        
    <link rel="stylesheet" type="text/css" href="jsunit/css/jsUnitStyle.css">
    <script language="JavaScript" type="text/javascript" src="jsunit/app/jsUnitCore.js"></script>
    
    <script language="JavaScript" type="text/javascript">
		  //Common util suite
		  function commonUtilSuite() {
            var result = new top.jsUnitTestSuite();
            result.addTestPage("<?php print $calemRootUrl ?>/test/client/calemeam/common/util/TestSuiteUtil.php");
            return result;
        }
        
        //Form suite
        function commonFormSuite() {
            var result = new top.jsUnitTestSuite();
            result.addTestPage("<?php print $calemRootUrl ?>/test/client/calemeam/common/form/model/TestSuiteModel.php");
            result.addTestPage("<?php print $calemRootUrl ?>/test/client/calemeam/common/form/widget/TestSuiteWidget.php");
            result.addTestPage("<?php print $calemRootUrl ?>/test/client/calemeam/common/desktop/TestSuiteDesktop.php");
            result.addTestPage("<?php print $calemRootUrl ?>/test/client/calemeam/common/form/view/TestSuiteView.php");
            return result;
        }
        
        //Module suite
        function moduleSuite() {
            var result = new top.jsUnitTestSuite();
            result.addTestPage("<?php print $calemRootUrl ?>/test/client/calemeam/modules/TestSuiteModules.php");
            return result;
        }

        function suite() {
            var newsuite = new top.jsUnitTestSuite();
            newsuite.addTestSuite(commonUtilSuite());
            newsuite.addTestSuite(commonFormSuite());
            newsuite.addTestSuite(moduleSuite());
            return newsuite;
        }
    </script>
</head>

<body>
<h1>Calem Test Suite</h1>

<p>This page contains a suite of tests for Calem.</p>
</body>
</html>
