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
		
        //view suite
        function viewSuite(url) {
        		var result = new top.jsUnitTestSuite(); 
        		result.addTestPage(url+"testCalemViewUtil.php?localrun=0");
        		return result;
        }
        //Designer suite
        
        function suite() {
            var newsuite = new top.jsUnitTestSuite();
            var url='<?php print $calemRootUrl ?>/test/client/calemeam/common/form/view/';
            newsuite.addTestSuite(viewSuite(url));
            return newsuite;
        }
    </script>
</head>

<body>
<h1>JsUnit Test Suite</h1>

<p>This page contains a suite of tests for testing JsUnit.</p>
</body>
</html>
