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
function CalemModuleController(parent, mod) {
	CalemController.call(this, parent);
	this._mod=mod;
	this._conf=CalemConf['desktop_moduleToolBar'];
	this._initCustomInfo();
	this._createModBar();
} 

CalemModuleController.prototype = new CalemController;
CalemModuleController.prototype.constructor = CalemModuleController;

CalemModuleController.prototype.toString = 
function() {
	return "CalemModuleController";
}

CalemModuleController.prototype.getModule =
function() {
	return this._mod;
}

CalemModuleController.prototype._initCustomInfo =
function() {
	var cm=CalemCustomModuleManager.getInstance();
	this._customInfo=cm.getFullCustomInfo(this._mod.getId());
}

/**
 * Creating module bar with mod info.
 * @todo - add My Calemos (for modifying preferences and customization of apps)
 */
CalemModuleController.prototype._createModBar =
function() {
	this._tb=new CalemToolBarModule(this._parent, this._conf.posInfo, this._conf.tbInfo);
	this._tb.createToolBar(this._mod, this._listenerFactory, this, this._customInfo);
	this._defaultMenu=this._tb.getDefaultMenu();
	this._tb.zShow(true);
}

CalemModuleController.prototype.getDefaultMenu =
function() {
	return this._defaultMenu;
}

/**
 * Listener factory methods.
 */

CalemModuleController.prototype.getLogoutListener =
function() {
	return this._logoutListener;
}

CalemModuleController.prototype.getHelpListener =
function() {
	return this._helpListener;
}

/**
 * Listener function
 */
CalemModuleController.prototype.onHelp =
function(ev) {
	window.open(this._conf.helpUrl);
} 
	 