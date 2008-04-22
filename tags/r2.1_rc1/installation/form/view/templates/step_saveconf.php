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
$aid=($this->model->getDbExpress() ? 'dbexpress' : 'dbsetup');
?>		
<div id='inst_toolbar_wait' style='display:none'>
   <table class='inst_toolbar_wait_table'>
	 	<tr><td class='inst_toolbar_wait_icon'></td>
	 	    <td class='inst_toolbar_wait_text'><?php echo $this->model->getLabel('wait_conf_db') ?></td>
	 	</tr></table> 
</div>		
<div id='inst_toolbar'>
  <div class='toolbar_button_prev'>
     <a onclick="submitForm(instForm, '<?php echo $aid ?>','');"><?php echo $this->model->getLabel('button_prev') ?></a>
  </div>
  <div class='toolbar_button_next'>
     <a onclick="submitForm(instForm, 'done', 'saveconf');"><?php echo $this->model->getLabel('button_next') ?></a>
  </div>
</div>
<?php if ($this->model->getErrorMsg()) { ?>
  <div id='input_error'>
	  <table class='input_error_table'>
	     <tr><td id='input_error_icon'></td>
	         <td class='input_error_msg'><?php echo $this->model->getErrorMsg() ?></td>
	     </tr>	  
	  </table>
  </div>
<?php } ?> 
<div class='inst_help_area'>
  <table class='inst_help_table'>
   <tr> <td class='inst_help_icon'></td>
		  <td class='inst_help_text'>
	        <?php echo $this->model->getLabel('step_saveconf_help') ?>
		   </td>
   </tr></table>
</div>
