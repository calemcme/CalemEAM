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
<div id='inst_toolbar'>
  <div class='toolbar_button_next'>
     <a onclick="submitForm(instForm, 'license', 'lang');"><?php echo $this->model->getLabel('button_next') ?></a>
  </div>
</div>
<div class='inst_help_area'>
  <table class='inst_help_table'>
   <tr> <td class='inst_help_icon'></td>
		  <td class='inst_help_text'>
	        <?php echo $this->model->getLabel('step_lang_help') ?>
		   </td>
   </tr></table>
</div>
<div class='input_area'>
   <table class='input_table'>
   <tr> <td class='input_label_td'><?php print $this->model->getLabel('input_lang') ?>:</td>
		  <td class='input_field_td' style='padding-top: 3px;'>
	         <select NAME="fi_lang" class='input_field'>
	            <?php
	               $lang=$this->model->getLangSelect();
	               $langList=$this->model->getLangList();
	               foreach ($langList as $id=>$desc) {
	               	$selected = ($id==$lang) ? ' selected ' : '';
	               	print '<option ' . $selected . ' value="' . $id . '">' . $desc . '</option>';	
	               }
				   ?>
				</select>
		   </td>
		   <td class='input_field_help'> <?php echo $this->model->getLabel('input_lang_help') ?> </td>
   </tr></table>
</div>
