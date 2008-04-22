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
 * This toolbar includes a logo and the following functions:
 * - logout
 * - help 
 */
 
/**
 * Constructor
 */
function CalemExitToolBarController(parent, logoutListener, conf) {
	CalemController.call(this, parent);
	this._logoutListener=logoutListener;
	this._helpListener=new AjxListener(this, this.onHelp);
	this._conf= conf? conf: CalemConf["desktop_exitToolBar"];
	this._createToolBar();
} 

CalemExitToolBarController.prototype = new CalemController;
CalemExitToolBarController.prototype.constructor = CalemExitToolBarController;

CalemExitToolBarController.prototype.toString = 
function() {
	return "CalemExitToolBarController";
}

/**
 * Creating logo bar with the buttons: Logout, Help
 * @todo - add My Calemos (for modifying preferences and customization of apps)
 */
CalemExitToolBarController.prototype._createToolBar =
function() {
	this._tb=new CalemToolBar(this._parent, this._conf.posInfo, this._conf.tbInfo);
	var tbDef=CalemJson.setJson(this._conf.tbDef);
	if (CalemConf['desktop_mainView']['prodInfoConf']['disp']=='tooltip') {
		CalemMenuDef['CalemHelp']['tooltip'] = calemProdInfo;
	}
	this._tb.createToolBar(tbDef, this._listenerFactory);
	this._tb.zShow(true);
}

/**
 * Listener factory methods.
 */

CalemExitToolBarController.prototype.getLogoutListener =
function() {
	return this._logoutListener;
}

CalemExitToolBarController.prototype.getHelpListener =
function() {
	return this._helpListener;
}

/**
 * Listener function
 */
CalemExitToolBarController.prototype.onHelp =
function(ev) {
	window.open(this._conf.extraInfo.helpUrl);
} 
	 
