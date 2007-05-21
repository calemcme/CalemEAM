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
 * The main controller manages the main client area. 
 */
 
/**
 * Constructor
 */
function CalemMainController(parent) {
	CalemController.call(this, parent);
} 

CalemMainController.prototype = new CalemController;
CalemMainController.prototype.constructor = CalemMainController;

CalemMainController.prototype.toString = 
function() {
	return "CalemMainController";
}

// Initialize the main view
CalemMainController.prototype.init =
function(conf) {
	this._conf= conf? conf: CalemConf["desktop_mainView"];
	this._view = eval(['new ', this._conf['mainView'], '(this._parent)'].join(''));
	this._view.zShow(true);
}

// Layout change
CalemMainController.prototype.onLayoutChange =
function(bz) {
	this._bounds=bz;
	this._view.onLayoutChange(bz);
}

/**
 * Launch default form
 */
CalemMainController.prototype.openDefaultForm =
function(fmId) {
	if (fmId) {
		this.openForm(fmId);
	}
} 

/**
 * Launch a form
 */
CalemMainController.prototype.openForm =
function(mId, data) {
	return this._view.openForm(mId, data);
}

CalemMainController.prototype.getCurrentForm =
function() {
	return this._view.getCurrentForm();
}
	 