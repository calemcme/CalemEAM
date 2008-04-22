<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!--
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
--> 
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">    
    <title><?php print $reportTitle ?></title>
    <link rel="stylesheet" type="text/css" href="<?php print $calemImgCss ?>">
    <link rel="stylesheet" type="text/css" href="<?php print $dwtImgCss ?>">
    <link rel="stylesheet" type="text/css" href="<?php print $calemReportCss ?>">    
</head>

<body>

<div class=CalemReportMainDiv>

<div class=CalemReportHeaderDiv>
<table class=CalemReportHeaderTable>
 <tr>
   <td class=CalemReportIcon><IMG class=CalemReportIconImg SRC='<?php print $calemReportIcon ?>' onclick="javascript:window.open('http://www.calemeam.com', 'CalemEAM - Open Source EAM/CMMS')"></td>
   <td class=CalemReportTitle>
       <?php if ($customReportIcon) { ?>
       	  <IMG class=CalemReportIconImg SRC='<?php print $customReportIcon ?>'>
       	  <br>
       <?php } ?>
       <?php print $reportTitle ?>
   </td> 
   <td class=CalemReportCommand>
   	   <IMG class=CalemReportPrintIconImg SRC='<?php print $calemReportPrintIcon ?>' onclick='javascript:window.print()'>
   </td>
 </tr>
</table>
</div>
