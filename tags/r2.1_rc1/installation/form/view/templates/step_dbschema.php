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
$ep=$this->model->getDbExpress();
?>
<script language="JavaScript">
	 function submitFormDbSchema(fm, validation) {
	 	var exEl=document.getElementById('fi_dbexpress_el');
	 	var aid='dbexpress';
	 	var exp='1';
	 	if (!exEl.checked) {
	 		aid='dbinfo';
	 		exp='';
	 	}
	 	fm.aid.value=aid;
	 	fm.validation.value=validation;
	 	fm.bkcolor.value=document.body.className;
	 	fm.fi_dbexpress_hd.value=exp;
	 	fm.submit(); 	
	 }
</script>

<div id='inst_toolbar'>
  <div class='toolbar_button_prev'>
     <a onclick="submitForm(instForm, 'syscheck', '');"><?php echo $this->model->getLabel('button_prev') ?></a>
  </div>
  <div class='toolbar_button_next'>
     <a onclick="submitFormDbSchema(instForm, 'dbschema');"><?php echo $this->model->getLabel('button_next') ?></a>
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
	        <?php echo $this->model->getLabel('step_dbschema_help') ?>
		   </td>
   </tr></table>
</div> 
<div class='input_area'>
   <table class='input_table'>
     <tr><td class='input_field_td'>
           <input type='radio' name='fi_dbexpress' id='fi_dbexpress_el' <?php echo ($ep ? 'checked=true' : '') ?> >
              <?php echo $this->model->getLabel('db_express') ?>
           </input>
         </td>
         <td class='input_field_help'> <?php echo $this->model->getLabel('db_express_help') ?> </td>
     </tr>
     <tr><td class='input_field_td'>
           <input type='radio' name='fi_dbexpress' id='fi_standard_el' <?php echo ($ep ? '' : 'checked=true') ?> >
           	<?php echo $this->model->getLabel('db_custom') ?>
           </input>
         </td>
         <td class='input_field_help'> <?php echo $this->model->getLabel('db_standard_help') ?> </td>
     </tr>
   </table>
   <input type='hidden' name='fi_dbexpress_hd'></input>
</div>
