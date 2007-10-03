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
 
 //Check for user customization
 $lang=$_COOKIE['CALEM_LANG'] ? $_COOKIE['CALEM_LANG'] : $_CALEM_conf['client_language'];
 if ($lang) {
 	if (!is_file(_CALEM_DIR_ . 'client/launchpad/resource/CalemMsg_' . $lang . ".js")) {
 		$lang=$_CALEM_conf['client_language'];
 	}
 }
 $loadmode=isset($_REQUEST['loadmode'])?$_REQUEST['loadmode']:$_CALEM_conf['client_js_load_mode'];
 $theme=isset($_REQUEST['theme'])?$_REQUEST['theme']:$_CALEM_conf['client_theme'];
 if (!is_dir(_CALEM_DIR_ . 'client/themes/' . $theme)) {
 	 $theme=$_CALEM_conf['client_theme'];
 }
 //Debug
 $debug=isset($_REQUEST['debug']) ? $_REQUEST['debug'] : ''; 
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title><?php print CalemMsg::getMsg('calemeam_title') ?></title>
	<link rel="shortcut icon" href="<?php print $calemRootUrl ?>/client/themes/favicon.ico" type="image/x-icon" />
    <style type="text/css">
      <!--
        @import url(<?php print $calemRootUrl ?>/client/themes/image/hiRes/dwtimgs.css);
        @import url(<?php print $calemRootUrl ?>/client/themes/login.css);
       -->
    </style>
    
    <script language="JavaScript">

//Set the url
calemRootUrl='<?php print $calemRootUrl ?>';
calemRequestUrl='<?php print $calemRequestUrl ?>';
calemSoapUrl='<?php print $calemSoapUrl ?>';

//Object definition
function CalemLogin() {}

CalemLogin.errorMsgDivEl='errorMsgDivEl';
CalemLogin.errorTextEl='errorTextEl';
CalemLogin.usernameEl='usernameEl';
CalemLogin.passwordEl='passwordEl';
CalemLogin.loginEl='loginEl';

CalemLogin.onload =
function() {
	document.getElementById(CalemLogin.usernameEl).focus();
   //Monitoring key event
   CalemLogin._registerKeyEvents(); 
}
	
CalemLogin._registerKeyEvents =
function() {
	document['onkeypress']=CalemLogin._handleKeyEvents;
}

/**
 * Cancel events propagation or bubbling up
 */
CalemLogin._cancelEvent =
function(event) {
	event.cancelBubble = true;
	if (event.stopPropagation) event.stopPropagation();
} 

/**
 * Events are handled for different browsers.
 */
CalemLogin._handleKeyEvents =
function(event) {
    event = event || window.event; //Either passed in or directly from window
    if (event == null) return true;
    
    var target = event.target ? event.target: event.srcElement; //get the target of the event
    if (!target) return true;    
    
    //Process key presses
    var keyCode = event.keyCode || event.charCode;
    if (keyCode == 13) { // Enter key
      if (target.id==CalemLogin.usernameEl) {//Move to password
         document.getElementById(CalemLogin.passwordEl).focus();
      } else if ( (target.id==CalemLogin.passwordEl || target.id==CalemLogin.loginEl)
                  && document.getElementById(CalemLogin.loginEl).disabled==false) {
         CalemLogin._attemptLogin();
      }
		CalemLogin._cancelEvent(event);
		return false;
    } else if (keyCode == 9) { // Tab
      var handled=false;
      var shiftKey = event.shiftKey;
      if (shiftKey) {
         if (target.id==CalemLogin.usernameEl) {
            handled=true;
            if (document.getElementById(CalemLogin.loginEl).disabled) {
               //Do no do anything - cannot move on to disabled button.
            } else {
               document.getElementById(CalemLogin.loginEl).focus();
            }
         } else if (target.id==CalemLogin.loginEl) {
            document.getElementById(CalemLogin.passwordEl).focus();
            handled=true;
         }
      } else if (target.id==CalemLogin.loginEl) { //Do not tab into the browser window
		   document.getElementById(CalemLogin.usernameEl).focus();
		   handled=true;		   
		} else if (target.id==CalemLogin.passwordEl 
		             && document.getElementById(CalemLogin.loginEl).disabled) {
		   //Cannot move to disabled
		   handled=true;
		}
		if (handled) {
		   CalemLogin._cancelEvent(event);
		   return false;
		}
    }
    //Not handling here
    return true;
}

/**
 * Display error msg
 */
CalemLogin._displayError =
function(msg) {
   var errorTextEl=document.getElementById(CalemLogin.errorTextEl);
   errorTextEl.innerHTML=msg;
   CalemLogin._toggleErrorMsgDiv(true);
} 

/**
 * Toggle error div
 */
CalemLogin._toggleErrorMsgDiv =
function(show) {
   var errorMsgDivEl=document.getElementById(CalemLogin.errorMsgDivEl);
   if (show) {
      errorMsgDivEl.style.display="block";
   } else {
      errorMsgDivEl.style.display="none";
   }
} 

/**
 * Toggle loginEl
 */
CalemLogin._toggleLogin =
function(disable) {
   var loginEl=document.getElementById(CalemLogin.loginEl);
   loginEl.disabled=disable;
} 

/**
 * Login via soap API
 */
CalemLogin._attemptLogin = 
function() {
   //Check validity of both values
   var username=document.getElementById(CalemLogin.usernameEl).value;
   var password=document.getElementById(CalemLogin.passwordEl).value;
   if (username==null||password==null||username.length==0||password.length==0) {
      CalemLogin._displayError("<?php print CalemMsg::getMsg('login_err') ?>");
      return;
   }
   document.loginForm.submit();
}    

</script>
	
</head>
<body onload="CalemLogin.onload()">
 <div id='login_div'>
  <table width='100%' height='100%' class=loginOuter>
    <tr><td>
       <table width=550 height=320 cellpadding=0 cellspacing=0 border=0 align=center class=LoginInner>
          <tr><td align=center><img src="<?php print $calemRootUrl ?>/client/themes/calemeam.png"></td></tr>
          <tr><td align=center><div id='errorMsgDivEl' 
               style="<?php ($loginErrorText) ? print 'display:block' : print 'display:none' ?>" >
            <table class=errorTable>
              <tr><td width=10></td>
                  <td width=38><img src="<?php print $calemRootUrl ?>/client/themes/image/hiRes/dwt/Critical_32.gif" width=32 height=32></td>
                  <td id='errorTextEl' class=errorText><?php print $loginErrorText ?></td>
                  <td width=10></td>
              </tr>
            </table>
            </div>
            </td>
            </tr> 
            <!--  
			   <tr><td>
			       <div class='calem-login-info'>
			       	To login as an admin, use User name/Password: <div style='color: blue; padding-left: 40px'>admin/admin_password</div>
			       	To login as a user, use User name/Password: <div style='color:blue; padding-left: 40px'>ken.wilson@myeam.com/wilson</div>
			       </div>    
			   </td></tr>
			   -->
			   <tr><td>
			       <table id=loginTable cellpadding=0 cellspacing=0 border=0 align=center>
			         <form name="loginForm" action="<?php print $calemRootUrl ?>/index.php" method="post">
			   		<tr><td align=right class=loginFieldLable nowrap><?php print CalemMsg::getMsg('username') ?>:</td>
			   	       <td align=left nowrap><input id='usernameEl' name='username' 
			   	                                value='<?php print $login_username ?>'
			   	                                size=30 class=editField type="text"></td></tr>
			   		<tr><td align=right class=loginFieldLable><?php print CalemMsg::getMsg('password') ?>:</td>
			             <td style='padding-top: 3px;'><input id='passwordEl' name='password' 
			                         value='<?php print $login_password ?>'
			                         size=30 class=editPassword type="password"></td></tr>
						<tr><td align=right class=loginFieldLable><?php print CalemMsg::getMsg('language') ?>:</td>
			             <td style='padding-top: 3px;'>
			                  <select NAME="lang" class=editLang>
			                     <?php
			                        $langSelect=$_CALEM_conf['client_lang_select'];
			                        foreach ($langSelect as $desc=>$val) {
			                        	$id=$val['id'];
			                        	$selected = ($id==$lang) ? ' selected ' : '';
			                        	print '<option ' . $selected . ' value="' . $id . '">' . $desc . '</option>';	
			                        }
									   ?>
									</select>
			             </td></tr>
			             <input type='hidden' name='loadmode' value='<?php print $loadmode?>' />
			             <input type='hidden' name='theme' value='<?php print $theme ?>' />
			             <input type='hidden' name='debug' value='<?php print $debug ?>' />			                         
			         <tr><td>&nbsp;</td>
			             <td align=left style='padding-top: 5px;'>
			                <input name='calemAction' value='LoginAction' type='hidden'>
			                <input id='loginEl' class=loginButton type="button" 
			                 value="<?php print CalemMsg::getMsg('login') ?>" onclick='CalemLogin._attemptLogin()' ></td>
			         </tr> 
			         </form>
			       </table>
			     </td></tr>
			     <tr><td align=center class=copyRightText nowrap><?php print CalemMsg::getMsg('copyright') ?></td></tr>
			    </table>
	  </td></tr>
	</table> 
 </div>     
</body>
</html>
