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
 
//Checking basic initialization 
if (!defined('_CALEM_DIR_')) die("Access denied at ".__FILE__);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
	   <title>CalemEAM - Open Source CMMS/EAM</title>
		<link href="themes/<?php echo $this->theme . '/' . $this->theme . '.css'?>" rel="stylesheet" type="text/css" />
		<script language="JavaScript" type="text/javascript" src="include/js/installation.js"></script>
	</head>
	<?php $bkcolor= ($_REQUEST['bkcolor']? $_REQUEST['bkcolor'] : 'body_class'); ?>
	<body class='<?php echo $bkcolor ?>'>
	 
	 <div id='inst_wrapper'>
	 <div id="style_change_div">
		<a id="switchcolorwhite" href="javascript:setBkColor('background_white')" title="White background"></a>
		<a id="switchcolorblue"  href="javascript:setBkColor('background_blue')" title="Lite Blue background"></a>
		<a id="switchcolorgreen" href="javascript:setBkColor('background_green')" title="Green background"></a>
		<a id="switchcolordarkblue" href="javascript:setBkColor('background_darkblue')" title="Dark Blue background"></a>
	 </div>
	 <div id='install_view'>	 
		 <div id='top_panel'>
		   <div id='top_panel_left'>
		     <div id='top_panel_right'>
		     </div>
		   </div>
		 </div>
		 <div id='title_panel'>
			 <?php echo $this->model->getInstallText() . ' ' . $this->model->getProductTitle() ?>
		 </div>
		 <div id='content_area'>
		    <div id='install_step_list'>
		      <?php echo $this->renderSteps() ?>
		    </div>
		    
          <form id='instFormId' action="index.php" method="post" name="instForm">
			    <div id="install_step_area">
			      <div id="install_step_content">
			      	<?php echo $this->renderOneStep() ?>
			      </div>
			    </div>
			 <input type="hidden" name="aid" value="" />
			 <input type="hidden" name="validation" value="" />
			 <input type="hidden" name="bkcolor" value="" />
			<form>
		 </div>
		 <div id='bottom_panel'>
		    <?php echo $this->model->getCopyRightText() ?>
		 </div>
	 </div>
	 </div>
	 </body>
</html>
