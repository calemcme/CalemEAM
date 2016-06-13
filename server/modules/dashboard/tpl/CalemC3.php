<?php
/*
 * The contents of this file are subject to the CalemEAM Public License Version
 * 1.0 ("License"); You may not use this file except in compliance with the
 * License. You may obtain a copy of the License at http://www.calemeam.com/license
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.  See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is: CalemEAM Open Source
 *
 * The Initial Developer of the Original Code is CalemEAM Inc.
 * Portions created by CalemEAM are Copyright (C) 2007 CalemEAM Inc.;
 * All Rights Reserved.

 * Contributor(s):
 */

/**
 * This is the login form lite.
 */

 //Checking basic initialization
 if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

 require _CALEM_DIR_ . 'client/launchpad/CalemJsHost.php';
 require_once _CALEM_DIR_ . 'server/include/util/CalemMsg.php';
 $json = json_encode($data, JSON_PRETTY_PRINT);
?>

<!DOCTYPE html>
<html>
<script type="text/javascript" src="<?php print $calemRootUrl ?>/public/js/lib/d3/d3.min.js"></script>
  <script type="text/javascript" src="<?php print $calemRootUrl ?>/public/js/lib/c3/c3.min.js"></script>
  <link href="<?php print $calemRootUrl ?>/public/js/lib/c3/c3.calem.css" rel="stylesheet" type="text/css">
  <link href="<?php print $calemRootUrl ?>/public/js/lib/c3/c3.min.css" rel="stylesheet" type="text/css">

<body style="margin: 0px;">

<div id="graph" style="width: <?php print $ww ?>px; height: <?php print $hh ?>px;"></div>
</body>

<script>

var graph = c3.generate(<?php print $json ?>); // no quotes; not a string object

</script>
</html>
