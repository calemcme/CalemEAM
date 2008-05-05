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
<div id='inst_toolbar_wait' style='display:none'>
   <table class='inst_toolbar_wait_table'>
	 	<tr><td class='inst_toolbar_wait_icon'></td>
	 	    <td class='inst_toolbar_wait_text'><?php echo $this->model->getLabel('wait_conf_db') ?></td>
	 	</tr></table> 
</div>
<div id='inst_toolbar'>
  <div class='toolbar_button_prev'>
     <a onclick="submitForm(instForm, 'dbschema', '');"><?php echo $this->model->getLabel('button_prev') ?></a>
  </div>
  <div class='toolbar_button_next'>
     <a onclick="submitFormWait(instForm, 'saveconf', 'dbexpress');"><?php echo $this->model->getLabel('button_next') ?></a>
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
	        <?php echo $this->model->getLabel('step_dbexpress_help') ?>
		   </td>
   </tr></table>
</div>  
<div class='input_area'>
   <table class='input_table'>
     <tr><td class='input_label_td'>
           <?php echo $this->model->getLabel('input_dbtype') . ':' ?>
         </td>
         <td class='input_field_td'>
            <select NAME="fi_dbtype" class='input_field'>
               <option selected value=mySql>MySQL</option>
				</select>
		   </td>
		   <td class='input_field_help'>
	         <?php echo $this->model->getLabel('input_dbtype_help') ?>
         </td>
     </tr>
     <?php
     	 $flds=array(
     	     'fi_dbhost'=>array('lb'=>'input_dbhost', 'fn'=>'getDbHost'),
     	     'fi_admin_user'=>array('lb'=>'input_admin_user', 'fn'=>'getAdminUser'),
     	     'fi_admin_password'=>array('lb'=>'input_admin_password', 'fn'=>'getAdminPassword', 'password'=>true),
           'fi_username'=>array('lb'=>'input_calem_user', 'fn'=>'getUsername'),
     	     'fi_password'=>array('lb'=>'input_calem_password', 'fn'=>'getPassword', 'password'=>true),
     	     'fi_dbname'=>array('lb'=>'input_calem_dbname', 'fn'=>'getDbName')
     	     );
     	 $html='';
     	 foreach ($flds as $fi=>$val) {
     	 	$type= $val['password'] ? 'password' : 'text';
     	 	$html .= "<tr><td class='input_label_td'>" . $this->model->getLabel($val['lb']) . ':</td>';
     	 	$html .= "<td class='input_field_td'>" . 
                      "<input type=" . $type . " name='" . $fi . "' size=30 class='input_field' " .
                      " value='" . call_user_func(array($this->model, $val['fn'])) . "'>" .
                      "</td>";
         $html .= "<td class='input_field_help'>" . $this->model->getLabel($val['lb'].'_help') . "</td>";
         $html .= "</tr>";
     	 }
     	 echo $html;
     ?>
     <tr><td class='input_label_td'>
           <?php echo $this->model->getLabel('load_sample') . ':' ?>
         </td>
         <td class='input_field_td'>
            <input type=checkbox name='fi_load_sample' <?php echo ($this->model->getLoadSample() ? 'checked=true' : '') ?>>
		   </td>
		   <td class='input_field_help'>
	         <?php echo $this->model->getLabel('load_sample_help') ?>
         </td>
     </tr>
   </table>
</div>
