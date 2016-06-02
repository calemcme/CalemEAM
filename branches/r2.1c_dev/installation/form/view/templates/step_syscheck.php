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
$checkInfo=$this->model->getCheckInfo();
?>
<div id='inst_toolbar'>
  <div class='toolbar_button_prev'>
     <a onclick="submitForm(instForm, 'license', '');"><?php echo $this->model->getLabel('button_prev') ?></a>
  </div>
  <div class='toolbar_button_refresh'>
     <a onclick="submitForm(instForm, 'syscheck', '');"><?php echo $this->model->getLabel('button_refresh') ?></a>
  </div>
  <?php if ($checkInfo['passed']) { ?>
  <div class='toolbar_button_next'>
     <a onclick="submitForm(instForm, 'dbschema', '');"><?php echo $this->model->getLabel('button_next') ?></a>
  </div>
  <?php } ?>
</div>
<div class='inst_help_area'>
  <table class='inst_help_table'>
   <tr> <td class='inst_help_icon'></td>
		  <td class='inst_help_text'>
	        <?php echo $this->model->getLabel('step_syscheck_help') ?>
		   </td>
   </tr></table>
</div>
<div class='input_area'>
   <table class='input_table'>
   <?php 
     $bf=true;
     $header='';
     $tb='';
     foreach ($checkInfo['syscheck'] as $key=>$val) {
     	  if ($bf) {
     	  	  $bf=false;
     	  	  $header="<tr><td class='header_td'>" . $this->model->getLabel('syscheck_item') . "</td>";
     	  	  foreach ($val as $k=>$v) {
     	  	  		$header .= "<td class='header_td'>" . $this->model->getLabel($k) . "</td>";
     	  	  }
     	  	  $header .= "</tr>";
     	  }
   	  $tb .= "<tr><td class='value_td'>" . $this->model->getLabel($key) . "</td>";
   	  foreach ($val as $k=>$v) {
   	      if ($k=='syscheck_passed') {
   	      	$tb .= "<td class=value_td_" . $v . "></td>";	
   	      } else {
   	  			$tb .= "<td class='value_td'>" . $v . "</td>";
   	      }
   	  } 
   	  //Adding help column
   	  $tb .= "<td class='input_field_help'>" . $this->model->getLabel($key . '_help') . "</td>";
   	  $tb .="</tr>";    	
     }
     echo $header . $tb;
   ?>
   </table>
</div>
