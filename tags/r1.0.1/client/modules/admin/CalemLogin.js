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
 

//Object definition
function CalemLogin() {}

/**
 * Constants of the login form.
 */
CalemLogin.errorMsgDivEl='errorMsgDivEl';
CalemLogin.errorTextEl='errorTextEl';
CalemLogin.usernameEl='usernameEl';
CalemLogin.passwordEl='passwordEl';
CalemLogin.loginEl='loginEl';

CalemLogin.USERNAME_LENGTH = 20;
CalemLogin.PASSWORD_LENGTH = 20;

/**
 * static method to start the login form.
 */ 
CalemLogin.onload =
function() {
	var cc=CalemContext.getInstance();
	cc.init(); //Initialize context.
	var sid=cc.getSessionId();
	if (sid) {
		DBG.println(AjxDebug.DBG3, "Sid found in the cookie, to remove the session: "+sid);
		CalemSoapClient.logout();
	}
	var userDd=CalemTableDdFactory.create('users');
	CalemLogin.userFldLength=userDd.getTextInputLength('username');
   CalemLogin._showLogin();      
}

CalemLogin._showLogin =
function() {
   var ar=[];
   var i=0;
   ar[i++]="<table width='100%' height='100%' class=loginOuter>";
   ar[i++]="<tr><td><table width=400 height=250 align=center class=LoginInner>";
   ar[i++]=["<tr><td align=center><img src=\"", calemRootUrl, "/client/themes/calemeam.png\"></td></tr>"].join('');
   ar[i++]=["<tr><td align=center><div id=", CalemLogin.errorMsgDivEl, " style='display:none'>"].join('');
   ar[i++]=["<table class=errorTable><tr><td width=10></td><td width=38><img src=\"", 
              calemRootUrl, "/client/themes/image/hiRes/dwt/Critical_32.gif\" width=32 height=32></td>"].join('');
   ar[i++]=["<td id=", CalemLogin.errorTextEl, " class=errorText></td>"].join('');
   ar[i++]="<td width=10></td></table></div></td></tr>";
   ar[i++]="<tr><td><table id=loginTable align=center>";
   ar[i++]=["<tr><td align=right class=fieldLable>", CalemMsg.username, ":</td>"].join('');
   ar[i++]=["<td align=left><input id=", CalemLogin.usernameEl, 
                 " value='' size=", CalemLogin.USERNAME_LENGTH, ' maxlength=', CalemLogin.userFldLength, 
                 " class=editField type=\"text\"></td></tr>"].join('');
   ar[i++]=["<tr><td align=right class=fieldLable>", CalemMsg.password, ":</td>"].join('');
   ar[i++]=["<td><input id=", CalemLogin.passwordEl, " value='' size=", CalemLogin.PASSWORD_LENGTH, 
   				  ' maxlength=', CalemLogin.PASSWORD_LENGTH, " class=editPassword type=\"password\"></td></tr>"].join('');
   ar[i++]="<tr><td>&nbsp;</td><td align=left>";
   ar[i++]=["<input id=", CalemLogin.loginEl, " class=loginButton type=\"button\" value=\"", 
               CalemMsg.login, "\" onclick='CalemLogin._attemptLogin()'>"].join('');
   ar[i++]="</td></tr></table></td></tr>";
   ar[i++]=["<tr><td align=center class=copyRightText>", CalemMsg.copyright, "</td></tr>"].join('');
   ar[i++]="</table></td></tr></table>";
   document.body.innerHTML=ar.join('');
   //set focus on username
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
      CalemLogin._displayError(CalemMsg.login_err);
      return;
   }
   //Hide error and disable login button
   CalemLogin._toggleErrorMsgDiv(false);
   CalemLogin._toggleLogin(true);
   var callback=new AjxCallback(null, CalemLogin.handleResponse, []);
   //Create a soap document here
   var soapDoc=CalemSoapClient.createSoapDoc("Login");
   soapDoc.set("username", username);
   soapDoc.set("password", password);
   var client=new CalemSoapClient(soapDoc, callback);
   client.service(); 
}

/**
 * Login callback 
 */ 
CalemLogin.handleResponse =
function(response) {
   //Must enable login first
   CalemLogin._toggleLogin(false);
   //Set error msg if any.
   if (response.getException()) {
      CalemLogin._displayError(response.getErrorMsg());
   } else {
      var resp=response.getResponse().LoginResponse;
      if (DBG.getDebugLevel() == AjxDebug.DBG3) {
          DBG.println(AjxDebug.DBG3, "Logged in. sessionId="+resp.sessionId+", validityPeriod="+resp.validityPeriod);
      }
      CalemLogin._launchCalem(resp);
   }
} 

/**
 * Launch Calemos 
 */ 
CalemLogin._launchCalem =
function(resp) {
   var rdForm = document.createElement('form');
	document.body.appendChild(rdForm);
	rdForm.innerHTML="<input type='hidden' name='sessionId' value='"+resp.sessionId+"'>"
	              + "<input type='hidden' name='validityPeriod' value='"+resp.validityPeriod+"'>";
	rdForm.action=calemRequestUrl+window.location.search;
	rdForm.method="post";
	rdForm.submit();
} 
   