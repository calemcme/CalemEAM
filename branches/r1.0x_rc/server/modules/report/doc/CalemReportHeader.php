<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

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
   <td class=CalemReportIcon><IMG class=CalemReportIconImg SRC='<?php print $calemReportIcon ?>' onclick="javascript:window.open('http://www.calemeam.com', 'Calem')"></td>
   <td class=CalemReportTitle><?php print $reportTitle ?></td> 
   <td class=CalemReportCommand>
   	   <IMG class=CalemReportPrintIconImg SRC='<?php print $calemReportPrintIcon ?>' onclick='javascript:window.print()'>
   </td>
 </tr>
</table>
</div>
