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
 * This is the base controller for a UI control.
 */
function CalemUiController(parent, id, tableDd, widgetInfo, controller) {
	if (arguments.length == 0) return; 
	CalemModel.call(this, true);
	this._parent=parent;
	this._id=id;
	this._tableDd=tableDd;
	this._widgetInfo=widgetInfo;
	this._controller=controller;
	this._modelItem=controller.getModelItem();
	//Now let's create UI control here.
	this._createUiControl();
	//Publish events to data model
	this._publishEvents();
}

CalemUiController.prototype=new CalemModel;
CalemUiController.prototype.constructor=CalemUiController;

CalemUiController.prototype.toString = 
function() {
	return "CalemUiController";
}

/**
 * function must be overwritten...
 */
CalemUiController.prototype._createUiControl =
function() {
} 

CalemUiController.prototype._publishEvents =
function() {
}

/** 
 * Layout changes
 */
CalemUiController.prototype.onLayoutChange =
function(bz) {
	this._onLayoutChange(bz);
	this._bz=bz;
}

//Default doing nothing
CalemUiController.prototype._onLayoutChange =
function(bz) {
} 

/**
 * show data
 */
CalemUiController.prototype.showData =
function() {
	this._showData(); //Each control must have its own way to present the data.
}

