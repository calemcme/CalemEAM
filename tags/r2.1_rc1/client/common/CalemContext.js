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
 * This is shared context storing common information
 * for dynamic classes to use.
 */
 
/**
 * Constructor
 */
function CalemContext() {} 

CalemContext.CC_KEY = '_ccKey';
CalemContext.DATA="_data";
//cookie
CalemContext.CALEM_SID="CALEM_SID";

CalemContext.ORDER_ASC = 0;
CalemContext.ORDER_DESC = 1;

/**
 * Singleton factory for CalemContext object.
 */
CalemContext.getInstance =
function() {
	CalemConf[CalemContext.CC_KEY]= CalemConf[CalemContext.CC_KEY] || new CalemContext();
	return CalemConf[CalemContext.CC_KEY];
}

/**
 * Init CalemContext
 */
CalemContext.prototype.init =
function()  {
	//Check for cookie
	var ck=AjxCookie.getCookie(document, CalemContext.CALEM_SID);
	if (ck) {
		ck=Base64.decode(ck);
		eval("this._userInfo="+ck);
	}
}

CalemContext.prototype.deleteSessionId =
function() {
	//Delete local cookie
	AjxCookie.deleteCookie(document, CalemContext.CALEM_SID);
}

/**
 * Shell
 */
CalemContext.prototype.setShell
=function(shell) {
	this._shell=shell;
}

CalemContext.prototype.getShell =
function() {
	return this._shell;
} 

/**
 * Desktop
 */
CalemContext.prototype.setDesktop
=function(desktop) {
	this._desktop=desktop;
}

CalemContext.prototype.getDesktop =
function() {
	return this._desktop;
}

/**
 * Open form action
 */
CalemContext.prototype.openForm =
function(fmId, data) {
	return this._desktop.openForm(fmId, data);
}

CalemContext.getRelativeParent =
function() {
	if (!this._relativeEl) {
		this._relativeEl=document.getElementById(CalemConf["desktop_moduleToolBar"].posInfo.parentId);
	}
	return this._relativeEl;
}

CalemContext.prototype.setRegistry =
function(reg) {
	this._reg = reg;
}

CalemContext.prototype.getRegistry =
function(reg) {
	return this._reg;
}

/**
 * SessionId
 */
CalemContext.prototype.getSessionId =
function() {
	return (this._userInfo ? this._userInfo.sid : null);
}

CalemContext.prototype.getUserInfo =
function() {
	return this._userInfo;
}

CalemContext.prototype.getUserId =
function() {
	return this._userInfo.uid;
}

CalemContext.prototype.getGroupId =
function() {
	return this._userInfo.gid;
}

CalemContext.prototype.getTeamId =
function() {
	return this._userInfo.team_id;
}

CalemContext.prototype.getUserFullName =
function() {
	return this._userInfo['full_name'];
}

/**
 * Set up workrounds
 */
CalemContext.prototype.setupWorkarounds =
function() {
	this._setupFf();
} 

CalemContext.prototype._setupFf =
function() {
	//Firefox focus lost issue.
	if (CalemConf['desktop_mainView'].ff167801Enabled && AjxEnv.isFirefox && this._shell) {
		this._fldFf167801=new DwtInputField({parent: this._shell, type: DwtInputField.STRING,
		                                     size: 20, posStyle: DwtControl.ABSOLUTE_STYLE});
		//Move it off screen.
		var el=this._fldFf167801.getHtmlElement();
		Dwt.setLocation(el, -200, -200);
	}
}

CalemContext.prototype.doFf167801 =
function() {
	if (this._fldFf167801) this._fldFf167801.focus();
}
